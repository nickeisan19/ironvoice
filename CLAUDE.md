# IronVoice Pro — Project Context

This file gives Claude the context to be productive on this project without
re-asking what's already been decided. Read top to bottom before suggesting
changes, especially if a request feels like it might revisit a settled
question.

---

## What this is

A voice-controlled weightlifting tracker built as a PWA. Single user (Nick),
shared with a small circle of testers. Logs sets via the Web Speech API, tracks
PRs, manages workout sessions, syncs to a Cloudflare backend.

**Core value prop:** hands-free logging at the gym. The mic is the headline
feature; everything else is in service of that.

---

## What this is NOT

- Not a multi-user product with accounts, signups, or password resets
- Not a social/sharing app — no feeds, no followers, no leaderboards
- Not a gym management or class booking system
- Not a HealthKit or Apple Watch app (yet — see "future work")
- Not on the App Store; distribution is via a public Cloudflare Pages URL

---

## Current architecture (post-migration)

```
┌──────────────┐    HTTPS POST    ┌──────────────────────┐    R2 ops    ┌──────┐
│  IronVoice   │ ───────────────► │  Cloudflare Worker   │ ───────────► │  R2  │
│  PWA         │ ◄─────────────── │  (worker.js)         │ ◄─────────── │      │
│  (frontend)  │   JSON response  │                      │   JSON blobs │      │
└──────────────┘                  └──────────────────────┘              └──────┘
       ▲
       │ HTML/JS/CSS served from
       │
┌──────────────────────┐
│ Cloudflare Pages     │
│ (auto-deploys from   │
│  GitHub on push)     │
└──────────────────────┘
       ▲
       │ Source of truth
       │
┌──────────────────────┐
│  GitHub repo         │
│  (private)           │
└──────────────────────┘
```

**URLs:**
- Frontend: `https://ironvoice.pages.dev`
- Backend: `https://ironvoice-api.nickeisan19.workers.dev`
- Repo: `github.com/nickeisan19/ironvoice` (private)

**Hosting cost:** $0/month (free tiers, never close to limits).

---

## Files in the repo

### Frontend (deployed to Cloudflare Pages)

- `index.html` — single-page shell, three screens (home/PRs/history) + overlays
- `app.js` — ~3300 lines, all logic. No build step, no bundler.
- `style.css` — ~1600 lines, hand-written, no preprocessor
- `sw.js` — service worker (cache + background sync)
- `version.js` — single source of truth for `APP_VERSION` / `APP_BUILD_DATE`.
  Loaded by both `index.html` and `sw.js` (via `importScripts`). See
  "Versioning" section below.
- `manifest.json` — PWA manifest
- `icon-*.png`, `splash-*.png`, `favicon.png` — PWA assets
- `IronVoiceWatchStarter.swift` — unfinished Watch scaffold, not active

### Backend (deployed to Cloudflare Workers)

- `worker.js` — single Worker file, replaces the old `backup.php`
- `wrangler.toml` — deploy config (binds R2 bucket, sets CORS origin)
- `package.json` — only Node dep is `wrangler`

### Tooling

- `.gitignore` — keeps secrets, `node_modules`, build artifacts out of git
- `node_modules/` — Wrangler deps, ignored

### Deleted (do not resurrect)

- `backup.php` — old PHP backend, replaced by `worker.js`
- `.htaccess` — old Apache config, irrelevant on Cloudflare

---

## Versioning

The version string is the contract. It tells testers (and future-you, looking
at a screenshot from someone's phone) exactly which build is running.

**Single source of truth: `version.js`.** Two constants:

```js
self.APP_VERSION    = '7.1';        // MAJOR.MINOR
self.APP_BUILD_DATE = '2026-05-05'; // local YYYY-MM-DD
```

**Format is `MAJOR.MINOR`** — two components, no patch. Bumping rules:

- **MAJOR** (7 → 8): significant feature, visible UX overhaul, or a change
  that requires telling testers something. Tied to a meaningful release.
- **MINOR** (.0 → .1, .1 → .2): every push to `main` that ships any
  user-visible change. Bug fixes, copy tweaks, CSS adjustments, small
  features. **If you push, bump MINOR.** That's the contract — without
  this discipline the version is just decoration.

**The bump propagates automatically:**

1. Profile-screen footer renders `IronVoice Pro · v7.1 · 2026-05-05` from
   `renderVersionFooter()` in `app.js`.
2. `sw.js` derives `CACHE_VERSION = ironvoice-v${APP_VERSION}` via
   `importScripts('./version.js')` — so the cache is invalidated on every
   bump and devices pick up the new shell on next visit.

**Workflow when shipping a change:**

1. Make code edits.
2. Bump `APP_VERSION` in `version.js` (MAJOR or MINOR per the rules above).
3. Update `APP_BUILD_DATE` to today.
4. Commit, push to `main`. Cloudflare Pages auto-deploys.
5. Confirm the new version string shows in Profile after pull-to-refresh.

**Forgetting to bump is the failure mode to watch for.** Symptom: deploy
goes out, devices keep serving old shell from cache, and "it didn't work"
reports come in. The footer not changing on a tester's phone is the tell.

### Instructions for Claude (version bumping)

Bumping `version.js` is **your** job, not Nick's — but only at the right
moment. Follow these rules:

**Bump MINOR + update `APP_BUILD_DATE` automatically when:**
- Nick says he's about to commit/push/ship/deploy ("let's commit this",
  "push this up", "ship it", "ready to deploy", "PR this", etc.)
- You're being asked to commit on his behalf (he says "commit and push")
- The current session has produced any user-visible change to the frontend
  (anything in `app.js`, `index.html`, `style.css`, `sw.js`, `manifest.json`,
  or any of the icon/splash assets)

Do this as part of the same edit batch, before the commit. Use today's
date in `APP_BUILD_DATE` (YYYY-MM-DD, local). The current date is in
the system context.

**Do NOT bump when:**
- You're mid-iteration and Nick hasn't signaled shipping intent. The unit
  is the push, not the edit. Bumping per-edit means the version becomes a
  keystroke counter and the v-string loses meaning.
- The only changes are to `CLAUDE.md`, code comments, or other non-shipping
  files. No user-visible delta = no bump.
- The only changes are to `worker.js` / `wrangler.toml`. Those deploy
  separately to Cloudflare Workers and don't affect the frontend cache.
  (If a backend change pairs with a frontend change, bump for the
  frontend half.)
- Nick is doing exploratory work, asking questions, or having you research
  something.

**MAJOR bumps (7 → 8) are Nick's call only.** Don't decide a change is
"big enough" to warrant a major bump — wait for him to say "bump to v8" or
equivalent. When he does, set MINOR back to 0 (e.g., `8.0`).

**If you're uncertain whether to bump,** ask in one sentence: "Bump to
v7.x as part of this commit?" Don't bump silently when the situation is
ambiguous, and don't skip the bump silently when shipping is clearly
happening.

---

## Settled decisions — do not re-litigate

These have been discussed in past sessions and have a definitive answer.
If a request would change one of these, push back and ask explicitly.

**Single-user / shared-token auth model.** Yes it's crude. No it's not getting
replaced with OAuth, magic links, Google SSO, or per-user accounts. The
overhead doesn't pay for itself in a personal app shared with a handful of
people. Token rotation is the answer to "what if it leaks."

**No build step.** No webpack, no TypeScript, no JSX, no SCSS, no bundler.
Files are written, files are deployed. This is intentional — it eliminates
an entire category of "the build broke" problems and keeps the system
inspectable. If a feature seems to require a build step, the answer is
usually "find another way."

**No external CDN dependencies for the PWA.** All assets are first-party.
This was done intentionally for CSP strictness and for offline-first behavior.
Don't suggest adding a font from Google Fonts, an icon library from a CDN, etc.

**Voice recognition uses Web Speech API.** Not a third-party service, not
Whisper, not anything that requires a server-side audio pipeline. The whole
point is "open mic, get text, parse intent, log." Browser-native is fast and
works offline-ish.

**No analytics, no telemetry, no error reporting service.** This is a personal
app; no Sentry, no Mixpanel, no anything that phones home. Console logging
is the debugger.

**Storage strategy is settled:** IndexedDB on the client (multiple stores —
workouts, prs, templates, customExercises, sessions, syncQueue), R2 on the
server (one JSON blob per hashed-email key, plus tiered snapshots). Don't
suggest moving to SQLite, Cloudflare D1, or anything else without a clearly
articulated reason.

**Tab bar layout is 4 columns:** PRs, History, Workout, Profile. Mic floats
raised at dead center between History and Workout. Home is in the header
icon strip (top right), not the tab bar. This was iterated to.

---

## Conventions Nick follows

**Concise, targeted responses.** No throat-clearing, no excessive disclaimers,
no "great question!" Get to the answer. Push back when wrong; don't agree
to be agreeable.

**Direct correction is welcome.** If a previous decision was wrong, say so
and explain. Don't paper over it.

**Production-grade code only.** No "TODO: handle this later" comments shipped.
No `console.log` left in production. Edge cases get handled or explicitly
deferred with reasoning.

**Honest scope estimates.** When asked "how long would X take" — give a real
answer including the parts that aren't obvious upfront. Don't sandbag, don't
optimistically lowball.

**Comments explain the why, not the what.** "Increment counter" is noise.
"Counter must reset on session end so the next session starts at 0" is
useful context.

**Match existing style.** Don't introduce new patterns when an existing one
works. The codebase has its own dialect — preserve it.

---

## Things that have bitten — read these before similar work

**File Station hides dotfiles by default.** When uploading anything starting
with `.` to a QNAP, this matters. Mostly historical now since Cloudflare
deployments don't go through File Station, but the lesson generalizes:
verify the file actually arrived where you think it did.

**Web Speech API behavior varies by browser.** Chrome desktop is the most
sensitive — picks up ambient noise as garbage final results. Mitigations
already in place: prompt-once-per-session, TTS-suspend-recognizer, continuous
mode with restart-on-end. Don't undo these without understanding why
they exist.

**Service worker cache invalidation is asymmetric.** On every deploy, bump
`APP_VERSION` in `version.js` so existing devices see the new shell. The
service worker's `CACHE_VERSION` derives from this automatically. Without
the bump, devices keep serving the old version forever from cache. See the
"Versioning" section above for the full convention.

**Bearer token in localStorage means token leaks via any XSS.** Mitigation
is strict CSP (which is in place — `script-src 'self'`, no `'unsafe-inline'`).
Don't add inline `onclick` handlers or `<script>` blocks; everything goes
through `data-action` and `initActionDispatcher`.

**The dispatcher is allowlist-based.** New `data-action="foo"` requires `foo`
to be added to the `ACTIONS` map in `initActionDispatcher`. Otherwise the
button silently does nothing. Annoying, but secure-by-default.

**Hashed email = data bucket.** Same email → same data on the server,
across devices. Different email → separate bucket. Salt change invalidates
all existing buckets (would force re-import). Keep the salt stable.

**`getenv() ?: 'fallback'` lets env vars override hardcoded values.** If a
secret seems to "not be working," check whether an env var is set with a
different value and silently winning over the literal in source.

---

## Voice command grammar

The parser handles these via `parseIntent()` in `app.js`. Order matters —
specific patterns first so generic ones don't swallow them.

- **Logging**: `<exercise> <weight> for <reps>` — e.g., "bench 225 for 5",
  "squat two twenty-five for three"
- **Number normalization**: spoken numbers become digits. "two twenty-five"
  → 225, "four oh five" → 405, "one fifteen" → 115
- **Workout sessions**: "start workout", "begin workout", "end workout",
  "stop workout", "finish workout"
- **Rest timer**: "rest 90", "rest two minutes", "rest" (uses default)
- **Plate breakdown**: "plates for 225", "breakdown 315"
- **PR query**: "what's my bench PR", "what's my squat max"
- **Weekly volume**: "weekly volume", "this week's volume"
- **Last set**: "what was my last bench"
- **Undo**: "undo", "delete that", "remove last"

When adding a command, also add it to the help sheet (`#help-overlay` in
`index.html`) so it's discoverable.

---

## Data model

**Workout entry** (`workouts` store, keyPath `id`):
```js
{
  id: 1735847234567,        // Date.now() at log time
  exercise: "bench press",  // lowercase canonical name
  weight: 225,              // number, lbs
  reps: 5,                  // number
  oneRM: 252.5,             // computed via Epley formula
  date: "2025-01-15",       // ISO date string, local timezone
  modifiedAt: 1735847234567, // for sync conflict resolution
  sessionId: 1735847000000, // optional, if logged during a session
  deleted: false,           // tombstone flag
}
```

**Session** (`sessions` store, keyPath `id`):
```js
{
  id: 1735847000000,
  startedAt: 1735847000000,
  endedAt: 1735850600000,
  durationMs: 3600000,
  estimated: false,         // true for backfilled historical sessions
  modifiedAt: 1735850600000,
}
```

**PR** (`prs` store, keyPath `exercise`):
```js
{
  exercise: "bench press",
  maxWeight: 245,
  max1RM: 275.6,
  achievedAt: 1735847234567,
}
```

**Custom exercise** (`customExercises` store, keyPath `name`):
```js
{
  name: "sandbag carry",    // lowercase, used as both display + key
  muscle: "core",
  synonyms: [],
  modifiedAt: 1735847000000,
  deleted: false,
}
```

**Template** (`templates` store, keyPath `id`):
```js
{
  id: 1735847000000,
  name: "Push Day A",
  exercises: [{ exercise, targetWeight, targetReps, targetSets }, ...],
  modifiedAt: 1735847000000,
  deleted: false,
}
```

---

## Sync protocol

Client POSTs to the Worker URL with one of three actions:

**`ping`** — connection test, returns `{ ok: true, serverTime }`.

**`backup`** with `mode: "full" | "delta"` — sends data. Server merges
records by id (newer modifiedAt wins, tombstone wins on tie), GCs old
tombstones (>90 days), recomputes PRs as authoritative, writes to R2,
returns `{ ok, mode, syncedAt, totalCount, received, prs }`.

**`restore`** — server returns the full state for this user's email. Returns
404 if no backup exists (typo detection — surfaced in UI as "fix the email
in Profile and try again").

All requests require `Authorization: Bearer <token>`. CORS is restricted to
the Pages origin.

---

## Things still on the roadmap

In rough priority order:

1. **Capacitor wrap for App Store distribution** — would require integrating
   `SFSpeechRecognizer` for voice (Web Speech doesn't work in WKWebView).
2. **Apple Watch companion** — voice logging from the watch is the killer
   feature for gym use. Requires Capacitor or full Swift native rewrite.
3. **HealthKit write integration** — only viable from a native app, not PWA.

---

## Things explicitly NOT on the roadmap

These have been considered and declined. Don't propose them again unless
the situation has materially changed.

- **JSON import from old NAS data** — old data was scrapped, users started
  clean on the Cloudflare backend. Don't propose adding an import path.
- **OAuth / Google SSO** — overkill for the user model
- **React/Vue/Svelte rewrite** — adds build complexity for no user-visible benefit
- **Server-side rendering** — pointless for a single-page PWA
- **GraphQL** — the data model is trivial; REST-ish JSON is fine
- **WebSocket-based real-time sync** — the app doesn't need real-time;
  manual sync + background sync API covers it

---

## When suggesting changes, also consider

- **Will it require a CSP relaxation?** If yes, justify it explicitly.
- **Will it require a new IndexedDB store?** If yes, that means a DB version
  bump and a migration path for existing users.
- **Will it require a new env var or secret?** If yes, document it in
  `wrangler.toml` and the deployment notes.
- **Does it work offline?** The PWA expectation is that the app is fully
  functional without network. New features should respect this.
- **Will it confuse a tester?** Anything user-facing should make sense to
  someone who's never heard of an "API token" or a "service worker."
