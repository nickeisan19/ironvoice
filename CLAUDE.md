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

**All four tabs are screens, not actions or sheets.** As of v9.0:

- **Workout** is a real screen (not the old start/end button). The screen
  shows a Start CTA + recent templates + last-workout summary when idle,
  and the active session card + quick-add + set list when a session is
  running. Voice commands ("start workout") still call
  `toggleWorkoutSession()` directly — the screen's CTA wires to the same
  function. Don't conflate navigation with action again.
- **End workout lives inside the active session card (v9.2)** as a compact
  red pill, gated by a `confirm()` that surfaces session stats. Voice
  ("end workout") still bypasses the confirm for hands-busy use. The old
  `#workout-active-actions` footer container has been removed — don't
  reintroduce a screen-level End button.
- **Per-exercise "+ Add set" pill (v9.2).** Each exercise group on the
  Workout screen has an "+ Add set" pill at its right edge that opens a
  quick-add sheet pre-filled with the previous set's weight × reps. Save
  flows through `buildEntry` → `saveAndSyncUI`, the same path as voice
  and manual entry — don't fork the write path.
- **Profile** is a real screen (not the old `settings-overlay` sheet). Same
  grouped-list content; field saves now happen on tab-switch via
  `saveProfileFromScreen()`. The legacy `openSettings`/`closeSettings`
  function names are kept as one-line shims that route to `showScreen('profile')`
  — don't delete them, internal callers still use the names.
- **Manual quick-add lives on Workout, not Home.** The `#ex-search`,
  `#manual-w`, `#manual-r`, `#ex-dropdown` IDs are now inside
  `<section data-screen="workout">`. Home is a pure dashboard.

**Hero Load is the home page's primary signal.** A full-width card at the
top of Home (`.hero-load`, id `#strain-card`) shows the readiness state in
2.4rem type with a left-edge color band. The state classes (`.recovery`,
`.steady`, `.high`, `.over`) are still applied by `renderStrain()` — the
hero card overlays its own visuals on top of the same class hooks the
old mini card used.

**Home is a launchpad, not a brochure (v9.1, refined v9.2).** Home layout
top to bottom:

1. `.hero-row` — Hero Load and the primary action pill sit **side-by-side**
   (50/50 split) at the very top of Home. The "Today" section header was
   moved *below* this pair so it labels just the daily summary tiles, not
   the hero row. Internal sizes were tuned for half-width fit: the Load
   value drops to 1.75rem and the action pill's chevron is hidden.
2. "Today" section header.
3. A 2-up tile row: `#today-card` and `#week-card`. These replaced the old
   Current + Latest PR cards (and their `#last-lift` / `#pr-display` IDs),
   which showed point-in-time data that went stale across visits.
4. "Trends" section header + three insight-led cards (v9.4): Strength
   Trajectory, Training Rhythm, Balance vs Your Norm.

The primary action pill (`.home-primary-action`, id `#home-primary-action`)
says "Start workout" idle / "Resume workout · Nm" with a green pulsing
icon when a session is active. Both states navigate to the Workout screen
via `data-screen-target="workout"`.

`#today-card` is **state-aware** via `renderTodayCard()`:
  - active session → "In progress · Nm · K sets / vol"
  - sets logged today → "Today · K sets · vol" + top set
  - else → "Last workout · Nd ago · tap to start"
Tap routes via `goToday()`: active → Workout, else → History. The PR-flash
animation now lands on `#today-card` (the tile that just received the new
PR), not on a separate PR card.

`#week-card` is the rolling 7-day summary (`renderWeekCard()`): tonnage,
set count, distinct workout days, plus a `+/-N% vs prior` delta line in
`.week-card-delta`. Distinct dates is used as the workout-count proxy
(rare twice-in-one-day cases miscount; acceptable for a summary tile).
Tap → History.

**Trends section is three insight-led cards (v9.4).** Each leads with a
one-line headline takeaway and uses a small visual as supporting evidence.
Replaces the old 14d Volume bar chart + absolute Muscle distribution,
which were demoted in v9.1/v9.2 and removed entirely in v9.4 because
they didn't answer questions the Today/Week tiles already covered.

1. **Strength Trajectory (4w)** — `renderStrengthTrajectory()`. Top 3
   most-frequent exercises over the last 4 weeks, each row showing
   weekly best estimated 1RM as an inline SVG sparkline (`.sr-spark`).
   Headline format: "Bench +5 · Squat — · Deadlift +15". Tap a row to
   open the exercise sheet.
2. **Training Rhythm (4w)** — `renderTrainingRhythm()`. Four weekly
   bars (rolling 7-day buckets) with a workout-day count badge under
   each; current week highlighted in gold. Headline shows
   workouts/week average with a delta vs the prior 4-week window.
   The Volume/Sets toggle (`initChartFilters()`) is preserved and
   drives this card.
3. **Balance vs Your Norm (7d vs 30d)** — `renderBalance()`. Per-muscle
   horizontal bars with a baseline marker at the user's 30-day rolling
   weekly average (`.br-baseline`). Bars above the marker mean trained
   more than usual; below means trailing. Headline calls out the most
   under-trained muscle when deviation > 25%, otherwise reports
   "Balanced — within 25% of your norm".

Implementation notes: the old `renderChart()` and
`renderMuscleDistribution()` are gone; don't resurrect them. New helper
`fourWeekBuckets()` powers Strength + Rhythm. All three render functions
are wired into `renderAll`, `saveAndSyncUI`, `deleteEntry`,
`undoLastDelete`. Sparklines are inline SVG — no charting library, no
build step.

**Header subtitle is live (v9.1).** `#header-subtitle` mirrors the same
state machine as the Today card via `renderHeaderSubtitle()`:
"In session · Nm" / "Trained today" / "Last: yesterday" / "Last: Nd ago"
/ "Ready to lift" (zero data). Re-rendered on log, on session start/end,
on `showScreen('home')`, and on minute-boundary ticks inside the session
ticker (`startSessionTicker` rate-limits home re-renders to once per
minute even though the session-card timer keeps ticking per-second).

**Last name is editable from Profile (v9.1).** Both signup welcome and the
Profile screen capture `first` and `last`. `saveProfileFromScreen` writes
both to `userProfile`. The display name (`#user-display`) still uses
first only — "Hi, Nick" — by design.

**Mic FAB has a live audio-level equalizer while listening.** Five vertical
bars driven by `--mic-level-1..5` CSS vars, written by
`startMicLevelMeter()` from a parallel `getUserMedia` + `AnalyserNode`
stream. Recognition is unaffected if the meter fails. Don't remove this
without replacing it — a static mic feels broken in 2026.

**A new PR auto-presents the celebration sheet.** `presentPRCelebration()`
is called from `updateUI()` when `isNewPR === true`. Same canvas logic as
the share-PR flow, repurposed as the moment-of-celebration. The old
share-overlay still exists for explicit sharing from the exercise sheet.

**History week-strip shows a per-day volume bar (not a dot).** Bar height
is proportional to that day's volume relative to the week max; bar color
is the dominant muscle worked. The class is `.week-day-bar` and replaces
the old `.week-day-dot`. Computed in `renderHistoryScreen()`.

**History day detail uses the active-workout pill layout (v9.2).** The
day-detail view mirrors how an in-progress session looks: each exercise
group renders as muscle dot + exercise name + a horizontal row of
weight × reps pills. PR sets get an inline gold pill tag. Long-press a
pill to delete (existing 5s Undo snackbar applies). Tapping an exercise
group header opens the exercise sheet. The old swipe-to-delete row list
and `attachSwipe` helper are gone — don't resurrect them.

**Root font-size is 17px, not the browser default 16 (v9.2).** All
rem-based text scales up ~6%. Smallest body-text floor moves from
~12.5px to ~13.3px. The tabbar and icons are pixel-fixed and unaffected.
Keep this in mind when sizing new text elements: prefer rem so the
scale stays consistent.

**iOS status-bar mask (v9.2).** `body::before` paints a solid bar of
height `env(safe-area-inset-top)` so page content doesn't bleed behind
the iPhone status bar (time, cellular, battery). Z-indexed above the
sticky header, below overlays. No-op on devices without a notch
(safe-area-inset-top resolves to 0). Don't add another top spacer or
sticky-header margin to "fix" the status bar — this is the fix.

**PWA update flow has three paths (v9.3):**
- **Cold start with already-waiting SW** — if a service worker is in the
  `waiting` state at app launch, the page posts `SKIP_WAITING`
  immediately. Reopening the app always lands on the latest shell with
  no visible prompt.
- **New SW finishes installing while user is on Home and idle (v9.3)** —
  auto-apply path. `updatefound` → `installed` checks `!activeSession &&
  currentScreen === 'home'`; if true, calls `applyUpdate()` directly
  instead of showing the banner. This collapses the most common
  "first launch post-release" case into a one-second invisible reload.
- **New SW finishes installing while user is mid-session or on a non-Home
  screen** — surfaces the full-width blue banner pinned to the top of
  the screen. The whole banner is the tap target (v9.3): `data-action`
  is on the wrapper `<div role="button" tabindex="0">`, the inner
  "Update now" pill is decorative `aria-hidden`. Tapping anywhere on
  the banner triggers `applyUpdate`.

Don't replace the banner with a toast or tuck the prompt next to the
FAB — that conflict was the reason for the v9.2 change. Don't shrink
the tap target back to just the inner pill — making the whole banner
tappable was the v9.3 fix for "I missed the small button."

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

**iOS standalone PWA: `position: fixed` + `backdrop-filter` jitters during
momentum scroll on tall pages.** Symptom: tab bar (and mic FAB) briefly
track upward scroll before snapping back to bottom — looks like the bar
is "floating and scrolling with content." Discovered post-v9.4 when the
Trends redesign made Home tall enough to trigger meaningful momentum
scrolling. Root cause: WebKit's default paint pipeline composites
`position: fixed` elements on the same layer as scrolling content when
they don't have their own GPU layer; `backdrop-filter` makes the
mis-paint visible. Fix is to force a separate compositor layer:
`transform: translate3d(0, 0, 0)` + `will-change: transform` on
`.tab-bar`, and `translate3d(-50%, 0, 0)` (not plain `translateX`) on
`#mic-btn` and its `mic-breath` keyframes. Don't drop these — the
2D-only `translateX` form does NOT promote to its own layer on iOS, so
reverting to it brings the bug back. Same applies to any future fixed
overlay that uses `backdrop-filter`.

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
