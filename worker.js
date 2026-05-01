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

        // Load current state (or skeleton if first sync)
        let state;
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
        const tombstoneDays = parseInt(env.TOMBSTONE_DAYS || '90', 10);
        state.data            = gcTombstones(state.data,            tombstoneDays);
        state.templates       = gcTombstones(state.templates,       tombstoneDays);
        state.customExercises = gcTombstones(state.customExercises, tombstoneDays);
        state.sessions        = gcTombstones(state.sessions,        tombstoneDays);

        // Server-authoritative PR recompute.
        state.prs       = recomputePRs(state.data);
        state.syncedAt  = Date.now();

        // Write state
        const stateJSON = JSON.stringify(state);
        await env.BUCKET.put(stateKey, stateJSON, {
            httpMetadata: { contentType: 'application/json' },
        });

        // Snapshot copy + tiered prune. Both run on the request thread because
        // they're cheap — single PUT and a list+delete loop. If either grows
        // expensive later, wrap in ctx.waitUntil() to defer.
        await writeSnapshot(env.BUCKET, slug, stateJSON);
        await pruneSnapshots(env.BUCKET, slug);

        return jsonResponse({
            ok: true,
            mode,
            syncedAt: state.syncedAt,
            totalCount: state.data.length,
            received: incoming.length,
            prs: state.prs,
        }, 200, env);
    },
};

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
// One PR per exercise; max 1RM wins; ties broken by the higher actual weight.
function recomputePRs(workouts) {
    const best = {};
    for (const w of workouts) {
        if (w.deleted) continue;
        const ex = w.exercise;
        if (typeof ex !== 'string') continue;
        const oneRM = Number(w.oneRM) || 0;
        if (oneRM <= 0) continue;
        if (!best[ex] || oneRM > best[ex].max1RM) {
            best[ex] = {
                exercise:   ex,
                maxWeight:  Number(w.weight) || 0,
                max1RM:     oneRM,
                achievedAt: Number(w.id) || 0,
            };
        }
    }
    return Object.values(best);
}

// Drop tombstoned rows whose modifiedAt is older than the cutoff.
function gcTombstones(rows, days) {
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
function mergeRecords(existing, incoming, key) {
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
    const list = await bucket.list({ prefix, limit: 1000 });
    const objs = list.objects || [];
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
