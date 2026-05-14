// ============================================================================
// IronVoice — Cloudflare Worker backend
//
// JavaScript port of backup.php. Same actions, same payload format, same
// auth model — your existing app.js works against this with only the
// fetch URL changed (relative 'backup.php' becomes the absolute Worker URL).
//
// Architecture differences from the PHP version:
//   - Storage is Cloudflare R2 instead of the filesystem. Each user's data
//     lives at the key '<hashed-email>/history.json' in the bucket.
//   - Snapshots live at '<hashed-email>/snapshots/history-YYYYMMDD-HHMMSS.json'.
//   - HTTPS is enforced by Cloudflare automatically; no explicit check needed.
//   - CORS is required because the Pages frontend lives on a different origin
//     than the Worker. Single allowed origin, single allowed method.
//
// Bindings expected (configure in wrangler.toml + dashboard):
//   IRONVOICE_TOKEN  — secret bearer token (set via `wrangler secret put`)
//   IRONVOICE_SALT   — secret hashing salt (set via `wrangler secret put`)
//   ALLOWED_ORIGIN   — env var, e.g. "https://ironvoice.pages.dev"
//   BUCKET           — R2 bucket binding
//
// Optional env vars (sensible defaults if unset):
//   TOMBSTONE_DAYS   — days before deleted entries are GC'd (default 90)
// ============================================================================

const MAX_BYTES = 4 * 1024 * 1024;     // 4 MB request body cap
const SNAPSHOT_DIR = 'snapshots';      // subkey segment for snapshot copies
// Minimum gap between snapshot writes for a given user. Background sync
// fires on every change and from multiple devices; without coalescing,
// near-identical snapshots accumulate in R2 and most are pruned within
// hours. Full-mode backups always snapshot regardless.
const SNAPSHOT_MIN_INTERVAL_MS = 15 * 60 * 1000;

export default {
    async fetch(request, env, ctx) {
        // ---- CORS preflight ---------------------------------------------------
        // The Pages frontend will issue an OPTIONS preflight before any POST
        // because the Authorization header makes the request "non-simple".
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(env),
            });
        }

        // ---- Method gate ------------------------------------------------------
        if (request.method !== 'POST') {
            return jsonResponse({ error: 'Method not allowed' }, 405, env);
        }

        // ---- Body size guard --------------------------------------------------
        const lengthHeader = request.headers.get('content-length');
        if (lengthHeader && parseInt(lengthHeader, 10) > MAX_BYTES) {
            return jsonResponse({ error: 'Payload too large' }, 413, env);
        }

        // ---- Auth -------------------------------------------------------------
        const auth = request.headers.get('authorization') || '';
        const m = /^Bearer\s+(.+)$/.exec(auth);
        if (!m || !timingSafeEqual(env.IRONVOICE_TOKEN || '', m[1])) {
            return jsonResponse({ error: 'Unauthorized' }, 401, env);
        }

        // ---- Parse body -------------------------------------------------------
        let body;
        try {
            const rawText = await request.text();
            if (rawText.length > MAX_BYTES) {
                return jsonResponse({ error: 'Payload too large' }, 413, env);
            }
            body = JSON.parse(rawText);
        } catch (err) {
            return jsonResponse({ error: 'Invalid JSON' }, 400, env);
        }
        if (!body || typeof body !== 'object') {
            return jsonResponse({ error: 'Invalid JSON' }, 400, env);
        }

        const action = body.action || 'backup';
        if (!['ping', 'backup', 'restore'].includes(action)) {
            return jsonResponse({ error: 'Invalid action' }, 400, env);
        }

        // ---- Ping (no user, no storage) ---------------------------------------
        if (action === 'ping') {
            return jsonResponse(
                { ok: true, serverTime: Math.floor(Date.now() / 1000) },
                200, env
            );
        }

        // ---- Validate user email ---------------------------------------------
        const email = body.user?.email;
        if (typeof email !== 'string' || !isValidEmail(email)) {
            return jsonResponse({ error: 'Invalid email' }, 400, env);
        }

        const slug = await hashEmailToSlug(email, env.IRONVOICE_SALT || '');
        const stateKey = `${slug}/history.json`;

        // ====================================================================
        // RESTORE — 404 if no backup exists, otherwise return full state
        // ====================================================================
        if (action === 'restore') {
            const obj = await env.BUCKET.get(stateKey);
            if (obj === null) {
                return jsonResponse({ error: 'No backup found for this email' }, 404, env);
            }
            const state = JSON.parse(await obj.text());
            return jsonResponse({
                data:             state.data             ?? [],
                prs:              state.prs              ?? [],
                templates:        state.templates        ?? [],
                customExercises:  state.customExercises  ?? [],
                sessions:         state.sessions         ?? [],
                syncedAt:         state.syncedAt         ?? 0,
            }, 200, env);
        }

        // ====================================================================
        // BACKUP — full or delta
        // ====================================================================
        if (!Array.isArray(body.data)) {
            return jsonResponse({ error: 'Missing data array' }, 400, env);
        }
        if (body.data.length > 100000) {
            return jsonResponse({ error: 'Too many entries' }, 413, env);
        }

        const mode      = body.mode === 'delta' ? 'delta' : 'full';
        const incoming  = body.data;
        const inTpls    = body.templates       || [];
        const inCustoms = body.customExercises || [];
        const inSessions = body.sessions       || [];

        // ----------------------------------------------------------------
        // Read-merge-write loop with R2 conditional puts.
        //
        // Two devices syncing simultaneously can both read the same state,
        // merge their own delta, then race to write — last writer clobbers
        // the other's records. The fix is `onlyIf: { etagMatches }`: if
        // someone else wrote between our read and our write, R2 returns
        // null and we re-read + re-merge against the fresh state.
        //
        // The merge is idempotent (modifiedAt-based, deletion-wins-on-tie),
        // so re-merging the same incoming against fresher state always
        // produces the right result.
        // ----------------------------------------------------------------
        const tombstoneDays = parseInt(env.TOMBSTONE_DAYS || '90', 10);
        const MAX_ATTEMPTS  = 3;
        let state, stateJSON, shouldSnapshot;

        let attempt = 0;
        while (true) {
            attempt++;
            const existing = await env.BUCKET.get(stateKey);
            if (existing) {
                state = JSON.parse(await existing.text());
            } else {
                state = { data: [], prs: [], templates: [], customExercises: [], sessions: [], syncedAt: 0 };
            }
            // Defensive defaults in case stored state is partial.
            state.data            = state.data            ?? [];
            state.templates       = state.templates       ?? [];
            state.customExercises = state.customExercises ?? [];
            state.sessions        = state.sessions        ?? [];

            if (mode === 'delta') {
                state.data            = mergeRecords(state.data,            incoming,    'id');
                state.templates       = mergeRecords(state.templates,       inTpls,      'id');
                state.customExercises = mergeRecords(state.customExercises, inCustoms,   'name');
                state.sessions        = mergeRecords(state.sessions,        inSessions,  'id');
            } else {
                state.data            = incoming;
                state.templates       = inTpls;
                state.customExercises = inCustoms;
                state.sessions        = inSessions;
            }

            // Garbage-collect tombstones older than threshold.
            state.data            = gcTombstones(state.data,            tombstoneDays);
            state.templates       = gcTombstones(state.templates,       tombstoneDays);
            state.customExercises = gcTombstones(state.customExercises, tombstoneDays);
            state.sessions        = gcTombstones(state.sessions,        tombstoneDays);

            // Server-authoritative PR recompute.
            state.prs       = recomputePRs(state.data);
            state.syncedAt  = Date.now();

            // Decide whether to snapshot before serializing state, so the
            // updated lastSnapshotAt is included in the persisted blob.
            const sinceLastSnap = Date.now() - (Number(state.lastSnapshotAt) || 0);
            shouldSnapshot = mode === 'full' || sinceLastSnap >= SNAPSHOT_MIN_INTERVAL_MS;
            if (shouldSnapshot) state.lastSnapshotAt = Date.now();

            stateJSON = JSON.stringify(state);

            // Conditional put: succeeds only if the object's etag still
            // matches what we read. R2 returns null on precondition failure.
            const putOpts = {
                httpMetadata: { contentType: 'application/json' },
            };
            if (existing) {
                putOpts.onlyIf = { etagMatches: existing.etag };
            }
            const putResult = await env.BUCKET.put(stateKey, stateJSON, putOpts);

            if (putResult !== null) break;  // success
            if (attempt >= MAX_ATTEMPTS) {
                return jsonResponse(
                    { error: 'Concurrent update; please retry' },
                    503, env
                );
            }
            // Otherwise loop and re-read + re-merge against fresh state.
        }

        // Snapshot is rate-limited (see SNAPSHOT_MIN_INTERVAL_MS). Pruning
        // moved to a scheduled cron handler so it doesn't run on the hot
        // path; see the `scheduled` export below.
        if (shouldSnapshot) {
            await writeSnapshot(env.BUCKET, slug, stateJSON);
        }

        return jsonResponse({
            ok: true,
            mode,
            syncedAt: state.syncedAt,
            totalCount: state.data.length,
            received: incoming.length,
            prs: state.prs,
        }, 200, env);
    },

    // ------------------------------------------------------------------
    // Scheduled (Cron Trigger) entry point
    //
    // Enumerates every user slug in the bucket and prunes their snapshots
    // per the tiered retention policy. Configured via [triggers].crons in
    // wrangler.toml — runs once a day rather than on every backup.
    //
    // Enumeration uses delimiter='/' so we get back top-level "directories"
    // (one per hashed-email slug) without listing every snapshot key.
    // ------------------------------------------------------------------
    async scheduled(event, env, ctx) {
        ctx.waitUntil(pruneAllUsers(env.BUCKET));
    },
};

// Walk the bucket's top-level prefixes and prune snapshots per user.
// Failures for one user are logged and skipped so a single bad slug can't
// block the rest of the run.
async function pruneAllUsers(bucket) {
    let cursor;
    do {
        const page = await bucket.list({ prefix: '', delimiter: '/', limit: 1000, cursor });
        const prefixes = page.delimitedPrefixes || [];
        for (const userPrefix of prefixes) {
            // userPrefix looks like "<slug>/"
            const slug = userPrefix.replace(/\/$/, '');
            if (!slug) continue;
            try {
                await pruneSnapshots(bucket, slug);
            } catch (err) {
                console.error(`prune failed for ${slug}:`, err);
            }
        }
        cursor = page.truncated ? page.cursor : null;
    } while (cursor);
}

// ============================================================================
// Helpers
// ============================================================================

function corsHeaders(env) {
    const origin = env.ALLOWED_ORIGIN || '*';
    return {
        'Access-Control-Allow-Origin':  origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age':       '86400',
    };
}

function jsonResponse(payload, status, env) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
            ...corsHeaders(env),
        },
    });
}

// Constant-time string compare. PHP's hash_equals equivalent — protects against
// timing attacks on the bearer token.
function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

function isValidEmail(s) {
    // Same rough validation level as PHP's filter_var FILTER_VALIDATE_EMAIL —
    // not RFC-perfect, but rejects obvious garbage. Good enough as a guard
    // against typos and accidents; doesn't replace real auth.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Hash an email + salt to a directory-safe slug, matching the PHP version's
// behavior so that data could theoretically be migrated later if needed.
async function hashEmailToSlug(email, salt) {
    const data = new TextEncoder().encode(salt + email.trim().toLowerCase());
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Recompute PRs from the authoritative non-deleted workout set.
// One record per exercise tracks two independent winners — the heaviest
// weight ever lifted and the best estimated 1RM (which may be a different
// set with more reps at lower weight). prType identifies which milestone
// is more recent so the share card leads with the latest moment.
export function recomputePRs(workouts) {
    const byEx = {};   // ex → { bestByW, bestBy1RM }
    for (const w of workouts) {
        if (w.deleted) continue;
        if (w.warmup) continue;   // v9.26 — warmups never count toward PRs
        const ex = w.exercise;
        if (typeof ex !== 'string') continue;
        const weight = Number(w.weight) || 0;
        const oneRM  = Number(w.oneRM)  || 0;
        if (oneRM <= 0) continue;
        const slot = byEx[ex] || (byEx[ex] = { bestByW: w, bestBy1RM: w });
        if (weight > (Number(slot.bestByW.weight) || 0)) slot.bestByW   = w;
        if (oneRM  > (Number(slot.bestBy1RM.oneRM) || 0)) slot.bestBy1RM = w;
    }
    return Object.entries(byEx).map(([ex, { bestByW, bestBy1RM }]) => {
        const prType = (Number(bestByW.id) || 0) >= (Number(bestBy1RM.id) || 0)
            ? 'weight' : '1rm';
        return {
            exercise:       ex,
            maxWeight:      Number(bestByW.weight)   || 0,
            maxWeightReps:  Number(bestByW.reps)     || 0,
            max1RM:         Number(bestBy1RM.oneRM)  || 0,
            max1RMWeight:   Number(bestBy1RM.weight) || 0,
            max1RMReps:     Number(bestBy1RM.reps)   || 0,
            achievedAt:     Math.max(Number(bestByW.id) || 0, Number(bestBy1RM.id) || 0),
            prType,
        };
    });
}

// Drop tombstoned rows whose modifiedAt is older than the cutoff.
export function gcTombstones(rows, days) {
    if (!days || days <= 0) return rows;
    const cutoff = Date.now() - days * 86400 * 1000;
    return rows.filter(r => {
        if (!r.deleted) return true;
        const modAt = Number(r.modifiedAt ?? r.id ?? 0);
        return modAt >= cutoff;
    });
}

// Merge two arrays of records by `key`. Newer modifiedAt wins; on ties,
// a deletion wins over a non-deletion (so concurrent edits and deletes
// resolve to the safer "deleted" outcome).
export function mergeRecords(existing, incoming, key) {
    const byKey = new Map();
    for (const r of existing) {
        if (r && r[key] !== undefined) byKey.set(r[key], r);
    }
    for (const r of incoming) {
        if (!r || r[key] === undefined) continue;
        const cur = byKey.get(r[key]);
        if (!cur) { byKey.set(r[key], r); continue; }
        const rMod = Number(r.modifiedAt) || 0;
        const cMod = Number(cur.modifiedAt) || 0;
        if (rMod > cMod) byKey.set(r[key], r);
        else if (rMod === cMod && r.deleted) byKey.set(r[key], r);
    }
    return [...byKey.values()];
}

// Snapshot key uses ISO-ish stamp matching the PHP version's filename pattern.
function snapshotKey(slug, when = new Date()) {
    const pad = n => String(n).padStart(2, '0');
    const stamp =
        when.getUTCFullYear() +
        pad(when.getUTCMonth() + 1) +
        pad(when.getUTCDate()) +
        '-' +
        pad(when.getUTCHours()) +
        pad(when.getUTCMinutes()) +
        pad(when.getUTCSeconds());
    return `${slug}/${SNAPSHOT_DIR}/history-${stamp}.json`;
}

async function writeSnapshot(bucket, slug, jsonBody) {
    await bucket.put(snapshotKey(slug), jsonBody, {
        httpMetadata: { contentType: 'application/json' },
    });
}

// Tiered retention: latest within each bucket — daily for 7d, weekly for
// 4w, monthly for 12mo. Anything older than 12 months is dropped.
async function pruneSnapshots(bucket, slug) {
    const prefix = `${slug}/${SNAPSHOT_DIR}/`;
    // Page through all snapshot keys. Without this, a user with >1000
    // snapshots would silently leave the oldest ones unprunable forever.
    const objs = [];
    let cursor;
    do {
        const page = await bucket.list({ prefix, limit: 1000, cursor });
        if (page.objects) objs.push(...page.objects);
        cursor = page.truncated ? page.cursor : null;
    } while (cursor);
    if (objs.length <= 7) return;   // small histories untouched

    const now = new Date();
    const byDay = new Map(), byWeek = new Map(), byMonth = new Map();

    for (const o of objs) {
        const m = /history-(\d{8})-(\d{6})\.json$/.exec(o.key);
        if (!m) continue;
        const ts = parseStamp(m[1], m[2]);
        if (!ts) continue;
        const ageDays = (now - ts) / 86400000;

        let bucketMap, k;
        if (ageDays < 7)        { bucketMap = byDay;   k = isoDate(ts); }
        else if (ageDays < 30)  { bucketMap = byWeek;  k = isoYearWeek(ts); }
        else if (ageDays < 365) { bucketMap = byMonth; k = isoYearMonth(ts); }
        else continue; // older than a year — never kept

        const prior = bucketMap.get(k);
        if (!prior || o.key > prior) bucketMap.set(k, o.key);
    }

    const keep = new Set([
        ...byDay.values(),
        ...byWeek.values(),
        ...byMonth.values(),
    ]);

    // Delete everything that's not in keep. R2 supports batch delete.
    const toDelete = objs.map(o => o.key).filter(k => !keep.has(k));
    if (toDelete.length === 0) return;
    // R2 delete accepts an array of keys.
    await bucket.delete(toDelete);
}

function parseStamp(ymd, hms) {
    const y  = parseInt(ymd.slice(0, 4), 10);
    const mo = parseInt(ymd.slice(4, 6), 10) - 1;
    const d  = parseInt(ymd.slice(6, 8), 10);
    const h  = parseInt(hms.slice(0, 2), 10);
    const mi = parseInt(hms.slice(2, 4), 10);
    const s  = parseInt(hms.slice(4, 6), 10);
    const t = Date.UTC(y, mo, d, h, mi, s);
    return Number.isFinite(t) ? new Date(t) : null;
}

function isoDate(d) {
    const pad = n => String(n).padStart(2, '0');
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
}

function isoYearMonth(d) {
    const pad = n => String(n).padStart(2, '0');
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1);
}

// ISO 8601 week number — close enough to PHP date('o-W') for bucketing purposes.
function isoYearWeek(d) {
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const dayNum = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((t - yearStart) / 86400000) + 1) / 7);
    return t.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}
