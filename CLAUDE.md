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
self.APP_VERSION    = '9.21';       // MAJOR.MINOR
self.APP_BUILD_DATE = '2026-05-13'; // local YYYY-MM-DD
```

**Format is `MAJOR.MINOR`** — two components, no patch. Bumping rules:

- **MAJOR** (7 → 8): significant feature, visible UX overhaul, or a change
  that requires telling testers something. Tied to a meaningful release.
- **MINOR** (.0 → .1, .1 → .2): every push to `main` that ships any
  user-visible change. Bug fixes, copy tweaks, CSS adjustments, small
  features. **If you push, bump MINOR.** That's the contract — without
  this discipline the version is just decoration.

**The bump propagates automatically:**

1. Profile-screen footer renders `IronVoice Pro · v9.23 · 2026-05-14` from
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

**Add a `WHATS_NEW` entry alongside the bump when the change is a
user-visible visual or UX change** — anything a tester would notice on
the screen (layout reflows, new affordances, redesigned sheets / cards
/ tabs, copy that changes how a feature is presented). Add it in the
same edit batch, before the commit: a new key under the `WHATS_NEW`
map in `app.js` keyed by the version you're shipping (`'9.35': { items:
[...] }`), with 2-5 short user-readable bullets. The sheet at
`maybeShowWhatsNew()` ([app.js](app.js)) fires once on the next launch
after the bump lands. Missing the entry isn't an error — the v9.10
snackbar (`acknowledgeVersionLanding`) is the silent fallback channel
— but for a release the user explicitly redesigned or restyled, the
sheet is the contract.

**Do NOT add a `WHATS_NEW` entry for bug-fix-only releases.** A hotfix
that restores broken behavior (the v9.34 `weekIsoSet` ReferenceError
is the canonical example) gets the snackbar and stays out of the
sheet. The sheet's value comes from it firing on releases that
*changed something the user can see*; popping it on a 2-line fix
trains testers to dismiss it without reading. The mutual-exclusion at
`acknowledgeVersionLanding` ([app.js](app.js)) already handles the
split — if there's no `WHATS_NEW[current]` entry, the snackbar fires
instead.

---

## Brand palette — Iron Velocity (v9.38)

The full spec lives in `brand.md`. Key rules Claude must follow:

- **Gold (`#FFC107`, `--gold`) is the primary brand signal** — mic FAB, Start
  Workout, Add Set, stepper buttons, active tab bar, week-strip selected day,
  sheet Done buttons, and all session-card labels (IN PROGRESS / SET / VOLUME /
  REST). Text on gold: always `#1a1300`. Active/pressed: `#e6ad00`.
- **`--heading-color` token** — dark mode: `var(--gold)`; light mode:
  `var(--label)`. Applied to `h1`, `.screen-header h2`, and `.modal h2`.
  Never hardcode gold on headings; the token handles mode switching.
- **Blue (`#2196F3`, `--blue`) is secondary** — Share, Sync, Confirm sheets
  (`.primary-btn`), the History rollup Rest cell (scannability anchor). Not
  used for workout CTAs or headings.
- **`--label` for icon-btn** — home, help, target, sync icons are navigation
  chrome. Color: `var(--label)` (white dark / dark light). Not blue.
- **Dark bg `#121212`, light bg `#faf7f2`** (warm cream, not cool gray).
- **Session card**: warm gold tint background
  (`rgba(255,193,7,0.18) → rgba(255,143,0,0.10)`), all labels gold.
- **History rollup Rest cell stays blue** — deliberate contrast anchor;
  the session-card REST label is gold but the rollup's blue is its own rule.

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
- **End workout lives inside the active session card (v9.2, restyled
  v9.11).** A solid-red rectangular button matching the `.add-btn`
  shape (was a faded-red pill before v9.11), gated by `confirmSheet()`
  (v9.8) that surfaces session stats. Voice ("end workout") still
  bypasses the confirm for hands-busy use. The button sits in
  `.session-card-right` with `justify-content: space-between`, so it
  aligns with the bottom of the meta column — when the rest timer is
  active and the meta column grows, End drops to the same baseline as
  the REST/0:58 line instead of pushing the green card taller. The old
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

**Sessions auto-start silently on the first set (v9.11).** Sessions are
invisible plumbing, not a feature to opt into. `saveAndSyncUI()` checks
`activeSession` at the top of its `try` block; if absent, it calls
`startWorkoutSession({ silent: true })` and re-tags `entry.sessionId`
before the workouts row is written. The `silent` flag suppresses the
`[15, 40, 15]` triple-pulse haptic so the set's own log haptic isn't
doubled — the user sees the green session card appear without ceremony,
no prompt, no toast, no spoken confirmation. The old
`maybePromptStartOnFirstSet` function and its `setTimeout` call site
are deleted; the throttle helpers (`isPromptThrottled`,
`throttlePrompts`, `PROMPT_THROTTLE_KEY`) stay because the launch-time
prompt (`maybePromptStartOnLaunch`, fires after >12h inactivity) still
uses them. Don't reintroduce the per-set "Start a workout?" prompt;
the explicit Start button on the Workout screen and the Home primary
action remain the manual paths. Voice "start workout" routes through
`toggleWorkoutSession` → `startWorkoutSession()` *without* `silent`,
because explicit user action gets the confirmation pulse.

**Session-card layout (v9.11).** All session-running surfaces sit in
the green `.session-card`. Three structural rules:

1. **Rest timer is in-card, not a bottom-fixed pill.** `#rest-timer`
   lives inside `.session-card-meta`, stacked under
   `IN PROGRESS / 0:38` as a third row (label `REST` in gold,
   followed by the time in 1.8rem matching the elapsed time). The SVG
   progress ring was removed in v9.11; only the time + label remain.
   The `.timer-pill.complete` state still flips both label and time
   to green when the countdown hits zero (the celebratory "Go" state).
   Voice "rest 90" without an active session is a non-goal: rest UI
   is workout-scoped now.
2. **SET / VOLUME labels above values, in gold (v9.38).** Stats column
   (`.session-card-stats`) flipped from
   number-on-top/`<small>`-label-below to label-on-top with values in
   1.4rem below. Labels use `.session-card-label-blue` (class name
   kept for stability; `color: var(--gold)` since v9.38). `IN PROGRESS`
   stays green to signal "session is alive"; gold labels are the
   metrics. All three top labels (`IN PROGRESS / SET / VOLUME`) sit
   on the same baseline.
3. **End workout aligns with the rest-timer line.** `.session-card-row`
   uses `align-items: stretch` so the right column (`.session-card-right`)
   matches the meta column's height. The right column is a flex
   column with `justify-content: space-between`, so SET/VOLUME stay
   at the top while End workout drops to the bottom. When rest is
   active and meta grows, End tracks the bottom of meta — keeps the
   card height roughly invariant whether or not rest is showing.

Don't move the rest timer back to a fixed pill; don't put the End
button below the row; don't restore the `<small>` stat labels. The
v9.11 layout was iterated to over multiple turns — it's the answer.

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
4. "Plan" section header + two prescriptive cards (v9.20): Focus and
   Recommended next.

The primary action pill (`.home-primary-action`, id `#home-primary-action`)
says "Start workout" idle / "Resume workout · Nm" with a green pulsing
icon when a session is active. **v9.11**: tapping the idle state both
*starts* a session and navigates to the Workout screen in one tap (was
navigate-only). **v9.21**: the bottom-tray Workout tab button now shares
the same handler — tapping it from any screen starts a session (idle)
or just navigates (active). Wired via `data-action="enterWorkout"` (was
`startWorkoutFromHome` before the rename — function is unchanged in
shape, just honestly named now that two surfaces use it). `enterWorkout`
calls `showScreen('workout')` then `startWorkoutSession()` if none is
active. The Resume case (active session) just navigates — calling
`startWorkoutSession` twice is a no-op anyway, but the conditional
keeps intent explicit. Don't restore `data-screen-target="workout"` on
the tab button; the rename was deliberate so the tab matches the home
pill's "one tap, you're lifting" promise.

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

**Plan section is two prescriptive cards (v9.20).** Replaces the v9.4
Trends section (Strength Trajectory + Training Rhythm + Balance vs Your
Norm) and the auto-deload Insights card. The old cards presented
analytics without a verb — numbers without a "do this next." The
replacement is a coach: surface what's been under-trained and recommend
a concrete workout that fits the user's typical session length.

1. **Focus (14d)** — `renderFocus()`. Six muscle rows (chest / back /
   legs / shoulders / arms / core) showing **set count** over the
   trailing 14 days, sorted descending. Bar width is proportional to
   the leading muscle's count, colored by `muscleColor[m]`. Headline
   logic in priority order: zero-set muscles → "Chest and Legs
   untouched in the last 14 days"; muscles under 50% of the leading
   muscle → "Legs and Core trailing — balance those next"; otherwise
   "Balanced across muscle groups." Card tap routes to History via
   `data-screen-target="history"`. Set count (not volume) is the
   right unit here — answers "did you train it" rather than "how
   hard," which is the question the recommender needs. **v9.21**:
   the header meta reads `Sets · 14d` (was bare `14d`) so the per-row
   numbers are unambiguously set counts, not volume / reps / workouts.
2. **Recommended next** — `renderRecommendedNext()` driven by
   `generateRecommendedWorkout()`. **Rewritten v9.21** from a simple
   "bottom-2 muscles by 14d coverage" picker into a multi-signal coach.

   **Adaptive lookback window** via `computeLookbackDays()`: 7 days at
   ≤14d tenure, 14d at ≤28d, 21d at ≤56d, else 28d. New users warm up
   gradually; established users get a long enough window that one quiet
   week doesn't reset their pattern. All three signals below consume
   the same window.

   **Three signals score the target muscles** (higher = more reason to
   train it):
   - *Recency deficit* (`1 − coverage[m] / maxCoverage`) — the original
     trailing-muscle logic, generalized.
   - *Declining trend* via `computeMuscleTrend(lookback)` — splits the
     window in half, compares recent volume to older volume per muscle.
     Slipping muscles get a positive boost.
   - *Weekday lock* via `computeWeekdayMuscleProfile(dow, lookback)` —
     if today's weekday has ≥3 historical sessions AND one muscle is
     ≥40% of those sessions' sets, that muscle becomes the day's
     first target slot (a near-fixed pick reflecting routines like
     "Mon = legs"). Other signals fill the second slot.

   **Sets-per-exercise come from the user's history** via
   `medianSetsForExercise(name, lookback)` (median sets-per-session for
   that exercise in the window, capped 2..6) — replaces the prior
   hard-coded 2..4 floor/cap. If you typically squat 5 sets, the rec
   says 5.

   **Total-time budget**: `computeMedianSessionMinutes` /
   `computeMedianSecPerSet` switched from `workoutMs` to `totalMs` —
   wall-clock minutes including rest. The "≈ N min" headline reads
   real session length, not time-under-the-bar. Trim/expand to ±25%
   of budget: drop sets from the highest-set exercise (or drop a
   trailing exercise if all already at the 2-set floor); expand by
   pulling one more familiar exercise from a target's pool.

   **Progressive overload nudge**: every 3rd *recommendation-launched*
   workout, add +1 set to the most familiar exercise in the picks.
   Counter is `ironRecBumpCount` in `localStorage`, incremented in
   `endWorkoutSession()` only when the queue was still set at end time
   (so manual workouts don't count). Bump is capped at 6 sets per
   exercise. Self-reinforcing via the median: if the user follows the
   bump, next median creeps up and the new baseline sticks.

   **Re-evaluation on workout end**: `endWorkoutSession()` now calls
   `renderFocus()` and `renderRecommendedNext()` after the normal-end
   fan-out (the empty-discard branch skips both — no new data). The
   user lands back on Home with the next recommendation already
   computed.

   Headline still reads `Targets legs, core.`; meta still reads
   `≈ NN min`. CTA (`data-action="startRecommendedWorkout"`) starts a
   session and stashes the picks in the Workout screen's
   suggested-queue. Don't reintroduce the global 2..4 set cap; don't
   switch the median back to `workoutMs` (the wall-clock basis is what
   makes the duration headline usable for planning).
3. **Suggested-queue on the Workout screen** — `renderSuggestedQueue()`.
   Horizontal chip strip (`#suggested-queue`) above the manual-entry
   inputs, one chip per recommended exercise showing `name · done/target`.
   Tap → opens the existing quick-add overlay prefilled with that
   exercise via `data-action="openQuickAdd"` + `data-exercise=…` (same
   path the per-group "+ Add set" pill uses, so logging flows through
   `buildEntry` → `saveAndSyncUI` exactly as voice and manual entry do).
   Chip progress recomputes from `activeSession`'s sets on every render,
   so logging / editing / deleting all stay correct. Completed chips fade
   (`.suggested-chip.done`, opacity 0.5) but stay tappable for an extra
   set. Queue lives in `localStorage` under `ironSuggestedQueue` —
   **ephemeral session state, not synced**. Cleared in
   `endWorkoutSession` on both paths (real end + empty-discard) via
   `clearSuggestedQueue()`.

The empty-state contract: when the user has zero logged workouts, both
Plan cards AND the "Plan" section header hide themselves (the welcome
hint at the bottom of Home covers the zero-data case, and stacking
three empty-state messages would just feel noisy). With ≥1 workout but
fewer than 5 sets total, `generateRecommendedWorkout()` returns null
and Recommended falls back to "Log a few sets and I'll recommend your
next workout." Focus shows its data regardless once there's ≥1 set.

Don't resurrect the deleted code. The dead names: `renderStrengthTrajectory`,
`renderTrainingRhythm`, `renderBalance`, `renderInsights`, `fourWeekBuckets`,
`initChartFilters`, `chartMode`, and the `ironChartMode` localStorage key.
Their CSS (`.chart-card`, `.strength-row`, `.sr-spark`, `.rhythm-chart`,
`.rhythm-col`, `.balance-list`, `.balance-row`, `.br-baseline`, `.br-fill`,
`.insight-card`, `.chart-filters`, `.filter-chip`, `.trend-headline`, etc.)
is also gone. Both `renderFocus` and `renderRecommendedNext` wire into the
standard fan-out points (`renderAll`, `saveAndSyncUI`, `deleteEntry`,
`undoLastDelete`, `updateEntry`). `renderSuggestedQueue` wires into
`refreshSessionCard` plus the post-write paths so the chip counts stay
honest.

Don't add stats analytics back onto Home. If the user wants to inspect
a long-running trend, that belongs on a per-exercise sheet or on
History, not on the launchpad. The Plan cards are *prescriptive* by
design — that's the whole point of the v9.20 redesign.

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

**PR records track max-weight and max-1RM independently (v9.9).** Each
record in the `prs` store carries six numeric fields plus a `prType`
flag:

```js
{
  exercise,
  maxWeight, maxWeightReps,                  // heaviest weight ever lifted
  max1RM, max1RMWeight, max1RMReps,          // best estimated 1RM + its source set
  achievedAt,
  prType,                                    // 'weight' | '1rm'
}
```

`saveAndSyncUI` ([app.js](app.js)) computes `isWeightPR` and `is1RMPR`
independently against the previous record's all-time bests, and only
updates the field whose flag fired (so a 1RM-only PR doesn't silently
clobber the stored max-weight set). Combo PRs — both flags fire on the
same set — store `prType: 'weight'`; weight on the bar wins on the
headline because it's the more visceral milestone.

`recomputePR` ([app.js](app.js)) and the Worker's `recomputePRs`
([worker.js](worker.js)) rebuild deterministically from the workout
log: pick the heaviest-weight set and the best-1RM set independently
(they may be the same set or different), then assign `prType` to
whichever set has the more recent `id` (ties go to weight). This keeps
the stored variant honest even after deletes, edits, or a fresh
restore from the server.

**PR card has two variants (v9.9, headline rule refined v9.20).**
`drawPRCanvas` ([app.js](app.js)) branches on `pr.prType`:

- `'weight'` → headline is the rounded `maxWeight` with tag
  `LB · NEW MAX WEIGHT`
- `'1rm'` → headline is the rounded `max1RMWeight` (the bar weight on
  the PR-earning set, not the calculated 1RM) with tag
  `LB · NEW REP PR`

Both variants share the same secondary line: `for N reps · est. M lb 1RM`.
The structures are parallel — only the headline number and the tag line
differ — so the two cards read as paired milestones rather than two
different layouts.

**Why the headline is always a bar weight, never a calculated 1RM:**
the card is shared. A number the user actually lifted is a milestone
they can point to. An Epley estimate is supporting context, not the
milestone. Don't put `max1RM` back on the headline; if you ever feel
tempted because the rep-PR card's number "looks small," remember the
secondary line already shows the 1RM and the tag already names the
PR type.

Records that pre-date the `prType` field (legacy data, never re-PR'd
since v9.9) default to the `'1rm'` path, and the headline falls back
to `pr.maxWeight` when `max1RMWeight` is absent — so legacy cards
still render a real bar weight, never `NaN`. The prior literal-`reps`
bug (`${pr.maxWeight} × reps for the record`, which rendered the
word "reps" instead of a number) was fixed in the v9.9 rewrite; the
v9.20 change kept that fix and only touched the headline + tag + the
1RM-variant secondary.

**PR card has the IronVoice mark at top-left (v9.9).** A 120×120 draw
of `icon-512.png` sits at (96, 120) on the 1080×1920 canvas, with the
`IRONVOICE · NEW PR` tag baseline-aligned beside it (left-aligned, not
centered). Image is lazy-loaded once into a module-level cache
(`_ivLogoImg` + `getLogoImage()`) so re-renders don't re-decode. If
the icon fails to load (offline edge case), the draw silently skips
and the rest of the card still renders. Don't move the mark to a
centered watermark or a side-stripe lockup — the corner-mark
direction was an explicit design call when this card was redesigned.

**PR sheets are share-only (v9.9).** Both the celebration sheet
(`#pr-celebrate-overlay`) and the share sheet (`#share-overlay`) now
expose a single `Share…` primary button — no `Save image` companion.
On iOS the native share sheet already offers Save to Photos as a
destination when a `File` is passed via `navigator.share`, so the
explicit save button was redundant. On platforms without Web Share
file support (older Safari, desktop Firefox), the consolidated
`shareOrDownloadCanvas` helper falls back to `triggerDownload`,
preserving the save path silently. The old `downloadCelebrate` /
`downloadShare` functions and their `ACTIONS` entries were deleted —
don't re-introduce a dedicated save button.

**PRs screen is a vertical alphabetical row list (v9.25).** The
3-column grid of square tiles sorted heaviest-first was retired. Once
the PR list got long enough to scroll, weight-order stopped matching
how the user looks things up ("where's bench?"); the eye had to scan a
wrapping grid by name. Now each PR is a full-width row, sorted
alphabetically A→Z by exercise name.

Row anatomy, left → right ([app.js](app.js) `renderPRsScreen` + [style.css](style.css)
`.pr-row*`):
- `.pr-row-dot` — 12px muscle-color circle. Replaces the prior
  44×44 initials disc. At row scale the initials read as noise; the
  color band alone carries the muscle cue.
- `.pr-row-name` — title-cased exercise name, 1rem, single line with
  ellipsis. Sized to read at arm's length.
- `.pr-row-value` — right-aligned PR figure. `Max weight` tab shows
  `NNN lb` (with `.pr-row-unit` styling the `lb` smaller and tertiary);
  `Weight × reps` tab shows `W × R`. Same `computePRTiles()` data,
  same fields the prior tiles read — the tabs still surface
  `maxWeight` / `repsAtMax` independently of `prType`.
- `.pr-row-chev` — small chevron-right SVG affordance signaling the
  row body is tappable.
- `.pr-row-share` — separate `<button>` sibling on the far right, 56px
  wide × ≥44px tall (Apple HIG per v9.22), divided from the row body
  by a hairline. Stroke-style share icon (box-with-up-arrow), `--label` color.

Two explicit affordances, two `data-action` entries through the strict-CSP
dispatcher — no `event.stopPropagation` plumbing needed because the
share button is a sibling of `.pr-row-main`, not nested inside it:
- `openExerciseFromPR` — tapping the row body opens the existing
  per-exercise sheet (`#ex-overlay`, 1RM trend + recent sets). This is
  exactly the same destination tapping a tile opened pre-v9.25; the
  tap target is just bigger and clearly affordanced now.
- `sharePRFromRow` — tapping the share icon goes **straight to**
  `#share-overlay` without first opening the exercise sheet. Seeds
  `currentExerciseSheet = { exercise: name, sets: [] }` so the
  existing `nativeShare` / `closeShare` / `drawPRCanvas` handlers
  keep working unchanged — they only read `.exercise` off that
  state object. The empty `sets` array is fine; the share path
  doesn't read it.

The legacy `sharePR()` function and the "Share PR card" row-action
inside `#ex-overlay` are kept — that path still works for users who
opened the sheet first to look at the trend chart. The new share
shortcut is purely additive.

CSS hooks worth not breaking: `.pr-grid` keeps the same id (`#pr-grid`)
and class, but its rules flipped from `grid-template-columns:
repeat(3,1fr)` to `display: flex; flex-direction: column`. The old
`.pr-tile*` family and the `@media (min-width: 600px)` 4-column
override are deleted — don't restore them. If you ever want a denser
tablet layout, do it by capping `.pr-grid` `max-width` and centering,
not by going back to a grid.

**History week-strip is a clean 7-day calendar row (v9.33).** Each
day cell is a card (`.week-day` → `var(--surface-2)` background +
hairline border + 12px radius) showing the day name (MON/TUE/…) and
date number. Day-name labels render at `var(--label)` weight 700 —
black + bold in light mode, white + bold in dark mode — so the row
reads at full strength rather than the prior faint tertiary text.
Selected day fills gold (`var(--gold)`) with dark text `#1a1300`. Today
(unselected) gets a gold date number. **The per-day volume bar that
existed from v9.0 → v9.32 was removed in v9.33.** The bar's
information density didn't justify its visual weight — a tiny
muscle-colored chunk at the bottom of each cell was easy to ignore,
and the "empty day" placeholder (a 2px grey line) read as visual
noise. The week-rollup card above the strip carries the same week-
level volume signal in a clearer form. Don't reintroduce
`.week-day-bar`, the `dayStats`/`byMuscle`/`maxVol` bookkeeping in
`renderHistoryScreen`, or the `.week-day.active .week-day-bar`
overrides — all four were deleted together.

**History day detail uses the active-workout pill layout (v9.2).** The
day-detail view mirrors how an in-progress session looks: each exercise
group renders as muscle dot + exercise name + a horizontal row of
weight × reps pills. PR sets get an inline gold pill tag. Tapping an
exercise group header opens the exercise sheet. The old swipe-to-delete
row list and `attachSwipe` helper are gone — don't resurrect them.

**History rollups — Volume / Sets / Total / Workout / Rest (v9.11,
expanded v9.21).** The History tab surfaces five rollup cells at three
granularities. None of this required a new IndexedDB store; the only
schema change is one field on entries (v9.11). The v9.21 expansion
added Volume + Sets cells to the grid, because the prior three-cell
layout answered "how long" but not "how much" — volume was being
computed for the week-strip bar heights and never surfaced as a number.

- **Schema:** `buildEntry()` stamps `restDurationMs: restDuration * 1000`
  on every new entry — captures *what the rest setting was at log time*,
  so later preference changes don't corrupt historical rollups. Free-form
  JSON in IndexedDB; no migration. Worker pass-through; [worker.js](worker.js)
  unchanged.
- **`computeSessionTimes(session, sets)`** ([app.js](app.js)) returns
  `{ totalMs, restMs, workoutMs }`. Per-set rest is
  `min(scheduled, gap-to-next-set or session end)` — the user's
  observation that real rest gets cut short when you log the next set
  drove this. Entries lacking `restDurationMs` (pre-v9.11, or backfilled
  estimated sessions) fall back to the current `restDuration` setting
  silently. Workout = Total − Rest, which folds plate changes / walking
  / overrun rest into "workout" — that tradeoff is documented; real
  time-under-tension would need per-set durations the model doesn't
  carry.
- **`formatDurationCompact(ms)`** renders `"1h 12m"` / `"47m"` / `"—"`
  for summary chips. Distinct from `formatElapsed()` (h:mm:ss for live
  clocks); both coexist — don't merge.
- **Three render hooks:**
  - **Per-session** — each `.session-header-row` in
    `renderHistoryDayDetail` is **a card matching the day/week rollup
    visuals (v9.33)**: a head row (checkmark icon + start time +
    optional warmup chip / `~estimated` flag) above a nested
    `.history-rollup` with the same 5-cell grid. Reuses
    `rollupCellsHtml()` directly so the per-session and per-
    day/per-week views stay in lockstep. The v9.21 inline sub-row
    (`12.4k lb vol · 1h 12m total · …`) is gone — it ran tight on
    iPhone-SE width and visually didn't match the card above it.
    The untagged-only "X sets · no session timer" branch keeps its
    inline layout via the `.session-header-row--untagged` modifier
    so it doesn't blow up into an empty card.
  - **Per-day** — `#history-day-rollup` (above session headers) shows
    the day's totals when ≥1 real session contributed. Hidden on
    untagged-only days. v9.21: 5 cells (Volume / Sets / Total /
    Workout / Rest).
  - **Per-week** — `#history-week-rollup` (above the week-strip) sums
    sessions whose `startedAt` falls in the visible week. Hidden on
    empty weeks. Powered by `renderRollupTotals(elId, sessions, ...)`
    and the shared `rollupCellsHtml()` markup helper. v9.21: same 5
    cells as the day rollup.
- **Visual (v9.33 — 2-row split):** `.history-rollup` is now a
  6-column grid that lays out as two semantic rows:
  - **Row 1 ("how much did I do"):** Volume + Sets, each spanning 3
    columns, values rendered at 1.4rem.
  - **Row 2 ("how long did it take"):** Total + Workout + Rest, each
    spanning 2 columns, values at 1.05rem, with a hairline divider
    above (`border-top` on `:nth-child(3..5)`) separating the two
    semantic groups.

  Replaces the v9.21 `repeat(5, 1fr)` flat row, which crammed each
  cell into ~53px on iPhone SE and required shrinking the value font
  to 1rem to avoid wrapping. The 2-row split gives every cell room
  to breathe AND lets the headline stats (Volume/Sets) get larger
  type, which is the right hierarchy — "how much" is the answer
  people care about most. The Rest cell still renders blue
  (`.history-rollup-cell-rest`) — deliberate contrast anchor so the
  rest figure scans instantly; session-card REST is now gold, but the
  rollup's blue is its own design decision. Don't color other cells
  blue; the asymmetry is what makes the rest number scannable.

  Don't go back to the flat 5-up row layout. Don't fold Sets into
  the meta line above the card — having it in the grid means there's
  a single canonical answer to "how many sets" instead of two surfaces
  that can drift.

Volume uses `formatVol(volume)` (shared with the home Week card —
`24.7k lb` / `847 lb` short forms). Set count is the bare integer
count of non-deleted entries in scope. The session sub-row's volume
filters entries to `sessionId === session.id`; the day rollup sums
across that day's real sessions (untagged-only days fall through to
the existing "no session timer" header without a rollup row); the
week rollup sums across `weekSessions` (untagged sets are excluded
from time *and* volume, matching the prior scope).

Don't reintroduce the bare-minute `dur` in session headers (Total chip
covers it). Don't compute rest as `sets × restDuration` — that ignores
the cap, which is the whole point. Untagged sets contribute zero to
rollups; their existing "no session timer" header stays unchanged.
Don't go back to a 3-cell grid; volume + sets are load-bearing for
"how much did I do this week" at a glance.

**Set pill = tap to edit/delete via action sheet (v9.6).** Tapping any
set pill (active workout OR history day-detail) opens
`#set-action-overlay` — a small bottom sheet showing the set summary
(muscle dot, exercise, "Set N of M · time", weight × reps in big type,
est 1RM, PR badge if applicable) plus an Edit and a red Delete button.
This is the **single canonical edit/delete path** across both surfaces.

- **Pills are `<button data-action="openSetAction" data-id="${id}">`**
  in both `renderSessionSets()` and `renderDayDetail()`. The dispatcher
  routes the click; no per-pill JS wiring needed.
- **Edit** reuses `#quick-add-overlay` in edit mode: `_quickAddEditId` is
  set, the title flips to "Edit set", inputs prefill with the entry's
  current values (not the previous set), Save routes to `updateEntry()`
  instead of `buildEntry()`+`saveAndSyncUI()`. The id is preserved so
  chronological order/timestamp don't change.
- **Delete** calls the existing `deleteEntry(id)`, which already handles
  tombstone + PR recompute + 5s Undo snackbar.
- **`updateEntry(id, w, r)`** at app.js mirrors `deleteEntry`'s render
  fan-out (history, strength/rhythm/balance, strain, insights, latest
  stats, session card) and calls `recomputePR(exercise)` because an edit
  can move the PR up OR down. Snackbar is "Updated …" with no Undo —
  edits are reversible by editing again.
- **The v9.2 long-press handler (`attachPillLongPress`) is deleted** —
  invisible to sighted users, undocumented in the help sheet, replaced
  by the discoverable tap-to-sheet path. Don't bring it back; don't add
  a per-pill `×` glyph; don't add swipe (already prohibited above).
  Voice "undo" remains as the hands-free path.

**Mobile tap targets meet Apple HIG 44×44 (v9.22).** An audit flagged
that the most-tapped controls during a workout — set pills, quick-add
± steppers, the Start-workout play icon, sheet Cancel/Done — were
under the 44×44 pt minimum. Targets were raised without changing the
overall visual language:

- `.session-set-pill` / `.session-set-add` / `.history-pill` (same
  base class across active workout AND history day-detail): padding
  `5px 10px` → `12px 14px`, `min-height: 44px`, border-radius
  8→10px. Active session pill rows are noticeably taller now;
  accepted tradeoff because pills are the canonical edit/delete
  surface.
- `.qa-step` / `.qa-step-fine` (the quick-add ± buttons documented
  in the v9.21 section above): 38×38 / 42×38 → 44×44, stepper gap
  4→6px. *(v9.23 follow-up: stacked the buttons below the input
  because 44px-wide buttons stopped fitting on iPhone-SE alongside
  the input — see the v9.21 section for the current layout.)*
- `.hpa-icon` (Start-workout play icon on the hero pill): standalone
  38→44, hero-row override 34→44, inner svg 16/18→18/20.
- `.sheet-close` (Cancel/Done on sheet headers): the visible button
  is unchanged but the tap area is now ≥44px via the same
  `position: relative` + `::before { inset: -10px -6px }` trick
  `.icon-btn` already uses. Don't visually grow it — the inset
  ring is the answer.

Plus small label legibility fixes on Home: the "Today" / "This week"
mini-card labels (`.card.card-mini h3` 0.62→0.78rem and `.tc-sub`
0.7→0.78rem), `.hpa-sub` (0.72/0.75→0.8rem in both hero-row and
standalone), `.hero-row .hero-load-sub` (0.75→0.8rem), and
`.week-card-delta` (0.66→0.8rem) — all moved to a ~13px floor at
the 17px root.

Bonus: `.row-select select` (Profile voice picker) bumped 0.92rem
→ 1rem so opening it no longer crosses the iOS 16px auto-zoom
threshold.

Tab-bar labels (`0.65rem`/11px) and history rollup labels
(`0.68rem`) were intentionally left alone — bumping the former
pushes the tabbar taller and ripples into safe-area math; the
latter has to fit a 5-cell grid on iPhone SE. Out of scope for
this pass; revisit only if a real complaint surfaces.

**Quick-add inputs feel like number fields (v9.21).** The quick-add
sheet pre-fills weight and reps from the previous set so the common
"same lift again" case is one-tap save. The friction *was*: when the
user wanted a *different* weight or rep count, a single tap dropped a
caret into the middle of the prefilled `225` and they had to long-press
to select before retyping. Two coordinated changes fixed this:

1. **Auto-select prefilled value on focus.** `selectInputContents(el)`
   helper near the `$()` shorthand wraps `el.select()` +
   `el.setSelectionRange(0, length)` in try/catch (iOS Safari's
   `type="number"` ignores `.select()` silently; setSelectionRange
   covers the gap). Wired two ways: explicit calls inside the
   `setTimeout(..., 350)` focus blocks in `openQuickAdd`,
   `openEditSet`, and `openPlate`; AND a delegated handler via the
   existing `FOCUS_ACTIONS` map (`selectAll: selectInputContents`)
   so any input marked `data-on-focus="selectAll"` inherits the
   behavior on user tap. Inputs marked: `#quick-add-w`,
   `#quick-add-r`, `#manual-w`, `#manual-r`, `#plate-target`,
   `#plate-bar`. A single tap now highlights the whole value so
   typing replaces it.

2. **± stepper buttons sit below the quick-add inputs (v9.23
   layout).** Weight row top: `Weight (lb)  [ 225 ]`; weight row
   buttons: `[−5] [−2.5] [+2.5] [+5]` stretched edge-to-edge.
   Reps row top: `Reps  [ 5 ]`; reps row buttons: `[−] [+]`.
   Each button carries `data-action="bumpQuickAdd"`,
   `data-target` (`w` or `r`), and `data-step` (signed decimal).
   One handler (`bumpQuickAdd(el)`) parses both, applies the
   delta, floors at 0, rounds to one decimal so float artifacts
   (`225 + 2.5 − 2.5 ≠ 225` through repeated taps) never leak.
   Fires `haptic(8)`. Crucially the handler does NOT call
   `.focus()` on the input — so tapping a stepper from the gym
   floor with chalky hands doesn't pop the iOS keyboard. The
   keyboard-free path is the whole point of the secondary fix.

   **Layout history:** v9.21 placed the buttons flanking the
   input on a single line; v9.22 bumped them to 44×44 (Apple
   HIG); v9.23 then stacked them below the input on their own
   row because at 44×44 the four weight buttons + input no
   longer fit iPhone-SE width — the `+5` was clipping off the
   right edge. Don't restore the flanking layout; the
   width-constrained iPhone-SE case is the binding constraint.

   Styled via `.row-input-stepper` as a 2×2 CSS grid
   (`72px / 1fr` columns) — span (label) and `.qa-input-stepper`
   (input chip) share row 1; `.qa-stepper-row` spans both
   columns on row 2 with `display: flex; gap: 8px` and each
   `.qa-step` set to `flex: 1` so buttons divide the row evenly.
   Buttons are Iron Gold (`var(--gold)` background, `#1a1300` text,
   `:active` → `#e6ad00` + `scale(0.96)`) so they read as
   first-class actions rather than muted secondary chips. The
   `.qa-step-fine` modifier on the ±2.5 buttons shrinks type a
   touch (1rem → 0.88rem) without changing the tap footprint —
   subtle visual cue that ±5 is the primary nudge, ±2.5 is the
   fine-tune.

Don't restore the bare `<input>` markup without the steppers — the
gym-floor keyboard-free path depends on them. Don't add `tabindex="-1"`
to the stepper buttons; they should be reachable via keyboard for
accessibility. Don't widen the steppers to out-of-flow number inputs
like `#plate-target` — those are utility surfaces where typing is the
right interaction; the auto-select fix is the appropriate scope there.
(`#manual-w` / `#manual-r` *did* gain the stepper layout in v9.24
because manual entry sits in the same in-flow logging path as
quick-add — see the v9.24 entry below.)

**Set pills carry a PREV hint per row (v9.26).** Each weight × reps pill
on the active workout screen AND in History day-detail renders a small
muted second line: `prev 220×5`. The data is the same-index set from the
most recent prior session for this exercise — answers "did I beat last
week" without the user having to open an exercise sheet.

Helper: [app.js](app.js) `getPrevExerciseSets(exercise, excludingSessionId)`
buckets all prior non-deleted sets of an exercise by `sessionId` (or by
`untagged-{date}` for pre-session data), picks the bucket with the latest
set id, and returns its sets in chronological order. The pill renderer
walks `prevSets[index]` and falls back to `prevSets[prevSets.length-1]`
when the current session has more sets than the prior one — so the prev
hint is *always* useful when prior data exists.

[app.js](app.js) `renderSetPill(s, prev, opts)` is the shared markup
helper used by both `renderSessionSets` (active session) and the history
day-detail loop. Pill structure flipped to a two-row flex column:
`.pill-main` (W tag + weight × reps + PR tag) on top, `.pill-prev` muted
hint below. `.session-set-pill` `flex-direction: column` ensures both
surfaces inherit the same layout. Don't drop the column flex — the prev
line depends on it.

`renderSessionSets` is now async because it preloads `getPrevExerciseSets`
once per unique exercise before building the HTML. `refreshSessionCard`
awaits it. The fan-out paths (`saveAndSyncUI`, `deleteEntry`,
`updateEntry`) all already await `refreshSessionCard`, so prev hints stay
fresh after every write.

Don't render prev as a *third* line — the muted-tiny-text is the right
weight for "supporting context, not headline." Don't show prev when the
active session is the only one — `prevSets` returns `[]` and the line is
omitted, which is correct.

**Warmup flag (v9.26).** Sets carry a `warmup: boolean` field on the
entry record. Warmups are journaled (visible as pills with an orange `W`
tag) but excluded from every volume rollup, every PR comparison, every
coverage/trend signal. A 95-lb warmup never overwrites a 225-lb PR; a
3-warmup-only day never paints a misleading bar on the history strip.

**Schema:** `buildEntry(exercise, weight, reps, { warmup = false })`
([app.js](app.js)) — absent on pre-v9.26 entries; falsy default means
existing data behaves exactly as before. `updateEntry` accepts an
optional `{ warmup }` and recomputes PR when it changes.

**The split:** `getActiveWorkSets()` ([app.js](app.js) near
`getActiveWorkouts`) filters out warmups AND deleted; `getActiveWorkouts`
keeps warmups for journal-display purposes. Every "how hard did I train"
surface reads `getActiveWorkSets` (volume rollups, today/week cards,
strain, focus, recommender's coverage/trend/median-sets, weekly-volume
voice query, PR shelf, recompute paths client + worker). Every "what did
I do" surface reads `getActiveWorkouts` (session pill list, history
day-detail pills, per-exercise recent-sets list, exercise sheet's set
table). When in doubt: if the number is a tally that answers a "how
much" question, it's work-only.

**Voice grammar:** `parseIntent` ([app.js](app.js)) catches
`^warm(?:\s*-?\s*)?up\b\s+...` *before* the generic log pattern so the
keyword isn't swallowed. "Warmup bench 135 for 8" / "warm up squat 95
for 10" parse identically to a normal log but stamp `warmup: true`.
`executeIntent` says "Warmup logged" so the readback is unambiguous.

**Manual paths:** Quick-add overlay carries a Warmup toggle row
(`.row-toggle`, iOS-style switch, orange when on) that sets
`_quickAddWarmup` for the save. Set-action sheet has a "Mark as warmup /
Unmark warmup" button that calls `toggleWarmupFromSetAction`. Manual
entry (workout-screen first-set search) deliberately does NOT carry a
warmup toggle — first sets of an exercise are rarely warmups in practice
(history prefill comes from work data) and adding the toggle clutters
the surface for no realistic gain. Users who need it can save then tap
the pill.

**PR exclusion:** `saveAndSyncUI` gates `isWeightPR`/`is1RMPR` on
`!entry.warmup`, so warmups never trigger the celebration sheet.
`recomputePR` ([app.js](app.js)) and the Worker's `recomputePRs`
([worker.js](worker.js)) both `continue` on `w.warmup`. `computePRTiles`
also filters warmups so the PRs screen never lists a warmup as a record.

**Visual:** `.warmup-tag` is a 14px-tall orange chip with `W` in white;
`.session-set-pill.is-warmup` paints the pill body with a faded
background + amber border so warmup pills read at a glance without
needing to find the W. The set-action head shows a larger W tag next to
the exercise name when the entry is a warmup. Don't replace the orange
border with red or yellow — orange is the established warning color
(`--orange` is also the "high strain" hue), and using a different colour
would split the visual language.

**Per-exercise collapse (v9.26).** Each `.session-set-group` header on
the active workout screen carries a chevron button on the left. Tapping
toggles membership in `_collapsedExercises` (a module-level `Set` keyed
by exercise canonical name) and re-renders via `refreshSessionCard`.
Collapsed groups hide their `.session-set-pills` row but keep the
header + set-count chip visible, so the user still sees "4 sets in
there" at a glance.

State is **in-memory only** — cleared in `endWorkoutSession` on both
the normal-end and empty-discard branches. The next session's
exercises are almost always new, so persistence would add a footgun
without a real use case (a stale collapsed flag on a re-used exercise
name across sessions).

**Workout-screen only by design.** History `.history-group-header`
already routes taps to `openExercise(name)` (the per-exercise sheet).
Adding collapse there would split that gesture's meaning. The v9.26 ⋮
overflow button has the same workout-only scope for the same reason.

Don't add localStorage persistence; don't add collapse to history;
don't bubble the ⋮ button's tap to the collapse handler — the
dispatcher resolves to the closest `[data-action]`, so the ⋮ already
intercepts its own taps without further plumbing.

**Per-exercise overflow menu ⋮ (v9.26).** Each `.session-set-group` on
the active workout screen has a small `.session-set-more` (⋮) button in
its header. Tap opens `#exercise-menu-overlay` ([index.html](index.html))
with three actions targeting every set of that exercise in the active
session:

1. **Swap exercise…** opens `#swap-exercise-overlay` — a sheet with a
   search input + scrollable result list (`.swap-result-row` cells,
   muscle-tagged). Tap a result → `applyExerciseSwap(target)` renames
   every set of the source exercise to the target, re-Epley-calcs
   `oneRM`, bumps `modifiedAt`, and recomputes PRs for *both* the source
   and the target exercises (the target may now have a new PR; the
   source may lose its current one). Snackbar confirms.
2. **Mark all as warmup / Unmark all** — majority-state decision.
   `warmupAllFromMenu` reads the warmup count for the targeted sets;
   if most are work sets, mark all as warmup; if most are warmup,
   unmark all. The label on the row reflects the action that will be
   taken (`updateWarmupAllLabel(name)` runs on menu open). Avoids the
   "two presses to undo a mis-mark" trap.
3. **Delete all sets** — `deleteExerciseFromMenu` confirms via
   `confirmSheet({ danger: true })`, then tombstones every targeted
   set. No 5s Undo (the action already owns its own confirm prompt).

**History overflow is intentionally absent.** The ⋮ button is
workout-screen-only. History day-detail is review-mode, and
swap/delete-all don't fit "I'm looking at last Tuesday." Don't add a
history overflow without a concrete user request — the per-pill action
sheet already covers per-set edits in history.

Don't reach into untagged sets via swap. The handlers gate on
`w.sessionId === activeSession.id` so untagged historical data is never
the target. Same for delete-all — bulk-deleting untagged sets from a
menu opened mid-workout would be a footgun.

**What's New popup on first-launch after upgrade (v9.32).** A bottom
sheet (`#whats-new-overlay`) fires once per version bump on the
first app launch after the new version lands. Content is sourced
from a module-level `WHATS_NEW` map keyed by version string; future
versions add their own entry without touching the rendering code.
Style matches the existing quick-add and set-action sheets
(`.overlay > .modal.sheet`, slides up from the bottom on iOS PWA).

Mechanism: `maybeShowWhatsNew()` runs from `initDB`'s success
handler (`setTimeout(..., 600)` so it feels like a follow-up to the
app appearing, not an intercept). Reads `ironLastSeenWhatsNew` from
localStorage. First install is silent — no prior key means a fresh
user who already has everything. Subsequent boots compare the
persisted version to `APP_VERSION`; if they differ AND
`WHATS_NEW[current]` exists, the sheet shows. Any dismiss path
(primary button, Done button, overlay backdrop tap) writes the
current version to the key so the sheet doesn't re-fire on the
same install.

Mutual exclusion with `acknowledgeVersionLanding` (v9.10): when
`WHATS_NEW[current]` exists for the upgrade, the snackbar is
suppressed inside `acknowledgeVersionLanding`. The sheet covers
the same "you got the update" message at higher fidelity; competing
surfaces would feel noisy. For versions without a `WHATS_NEW` entry
(bug fixes, polish), the snackbar still fires and the sheet stays
silent.

Don't pop the sheet for *every* version — only versions where
`WHATS_NEW[version]` is explicitly defined. Don't accumulate bullets
across skipped versions in this first cut; if a user skips v9.32
and we ship v9.33, they see only the v9.33 content. Revisit if
version-skipping becomes a real pattern.

The v9.32 popup deliberately covers the v9.26 → v9.31 work in one
read, since v9.31 was already shipped before this mechanism existed
and the changelog bullets are the testers' first concentrated view
of everything that landed across that span.

**Search dropdown ranked by usage frequency (v9.31).** The exercise
search dropdown (`filterExercises` in [app.js](app.js)) sorts matches
by total non-deleted set count DESC so the user's go-to lifts bubble
to the top. Alphabetical is the tiebreaker — exercises with zero
history (or matching counts) stay deterministic.

Implementation: `_exerciseFrequency` is a module-level Map (exercise
name → set count) with a `_exerciseFrequencyDirty` flag.
`getExerciseFrequency()` lazily rebuilds the map from a single
`getActiveWorkouts()` pass when dirty, then caches until the next
write. Dirty marks are placed at every path that adds, removes,
restores, or renames a set: `saveAndSyncUI`, `deleteEntry`,
`undoLastDelete`, `applyExerciseSwap`, `deleteExerciseFromMenu`,
`restoreFromNAS`. Warmup toggles don't mark dirty — toggling a flag
doesn't change which exercises are touched.

`filterExercises` became async to await `getExerciseFrequency()`.
`showExercises()` calls it without awaiting; the dropdown class
flips to `active` synchronously and content populates a beat later
— fine for the user-visible flow.

The "This workout" section (active session + empty input) still
renders at the top of the dropdown before the frequency-sorted list.
That contextual priority outranks all-time frequency: an exercise
you're touching THIS session is a stronger "next-up" signal than
"you usually do this."

Warmups count toward frequency. Frequency answers "how often you
touch this exercise," not "how hard." A user with 50 warmup sets
of bench does use bench a lot. Don't filter to work sets only here
— the count would diverge from getActiveWorkouts' definition of
"all touches" and the cache invariants get fiddly.

Don't try to weight recent sets more than older ones without a real
complaint. All-time frequency is stable and predictable; a
recency-weighted version reshuffles the top of the list every time
you change up your routine, which gets disorienting.

**Manual-entry progressive disclosure (v9.30).** The
`.manual-entry` section on the Workout screen idles as just the
search input (~80px); the detail block (prev hint, weight/reps
stepper rows, full-width Add button) is wrapped in
`.manual-entry-detail` and hidden by default. `selectExercise()`
([app.js](app.js)) adds `is-expanded` to `#manual-entry` when an
exercise is chosen from the dropdown — only then does the detail
slide into view. `handleManualEntry()` removes the class after a
successful save (cleared search + cleared inputs + collapse).
`filterExercises()` also removes the class if the user backspaces
the search to empty without picking, so the section doesn't get
stuck open.

The whole section drops from ~312px to ~80px when idle — about
230px of vertical real estate reclaimed on iPhone SE, which the
v9.29 row-form pills (taller per-set than v9.28 chips) had been
squeezing. Voice ("bench 225 for 5") and the per-group "+ Add set"
pill never expanded the section in the first place, so neither
flow regresses.

No animation — the detail snaps in/out for instant feedback. A
slide-in tween was considered and rejected; it fights the
gym-floor pace where the user wants the inputs ready the moment
they tap an exercise.

Don't reintroduce the always-open layout without a real complaint;
the always-visible steppers were taking half the iPhone SE
viewport for a control the user only touches after picking an
exercise. The `_quickAddEditId` / quick-add overlay path is
unaffected — that surface has its own steppers inside the sheet.

**Row-form pill layout (v9.29).** Each set on the active workout
screen AND in History day-detail renders as a single full-width row
with three column-aligned cells: SET # (or `W`) | PREV (last-time
weight × reps, or em-dash) | weight × reps (right-aligned, the
"headline" cell). A tiny uppercase column-header row (`.session-set-cols`)
sits above each group's pills to label the columns.

Replaces the v9.26 stacked-flex pill chip (weight × reps with `prev
W×R` underneath as muted-tiny-text). Driven by the observation that
the competitor's table-format set list looked materially cleaner —
but without committing to a full table rewrite (which would need a
"completed/incomplete" concept, inline cell editing, and a
plan-then-tick model that IronVoice doesn't have).

What the row form delivers:
- Visible set numbers (`W` / `1` / `2` / `3`…) — answers "which work
  set is this?" without opening the action sheet.
- PREV in a dedicated column, not a muted footer line — readable
  from arm's length, aligned across the whole group.
- Consistent row heights make the group scannable.

What it deliberately does NOT take from the competitor:
- No "completed" green ✓ column — every logged set is by definition
  done. We don't track planned-but-incomplete sets.
- No inline cell editing — the v9.6 single-canonical-edit-path rule
  stands. The whole row is the tap target; the set-action sheet
  remains the only edit surface.
- No empty planned rows below the logged ones.

Set numbering counts only work sets — warmups display `W` and don't
consume a number. So a group with `W, work, W, work, work` renders
as `W, 1, W, 2, 3`. The `workIdx` counter in both `renderSessionSets`
and `renderHistoryDayDetail` walks `orderedSets` chronologically and
increments only when `!s.warmup`. Caller passes the resulting label
to `renderSetPill` via `opts.setLabel`.

The `+ Add set` trailing button is now a full-width row inside the
same vertical stack (was right-margin-auto-aligned in the flex-wrap
chip layout). `.session-set-add` overrides the pill's grid layout
back to a centered flex row. Trade-off accepted: more vertical
scroll per group (4 sets ≈ 4 × ~44px instead of 2 × ~55px), which
the v9.26 collapse chevron carries when groups grow past 4-5 sets.

Don't reintroduce the v9.26 `.pill-main` / `.pill-prev` stacked
layout. Don't add a green ✓ completion column. Don't experiment with
inline cell editing for LBS/REPS — both would re-fragment the edit
gesture documented under v9.6.

**Rotation-aware set-group ordering (v9.28).** On the active workout
screen, `renderSessionSets` orders exercise groups by their most
recent set's timestamp ASC: the exercise the user has been "waiting
longest" to return to is on top; the just-logged exercise drops to
the bottom. Matches a circuit/superset rotation — logging biceps
leaves triceps (the next-up) at the top of the list, not biceps.

Brand-new exercises follow the same rule. A freshly-added exercise's
only set is the newest in the session, so it naturally lands at the
bottom. The prior exercises (older last-sets) stay on top — which is
what the user wants because the prior exercise is the next-up in the
cycle, not the one they just added.

**v9.27 retraction:** v9.27 shipped a hybrid algorithm with a
"pinned new exercises on top" tier. After live testing the user
corrected the behavior — when the second exercise is entered, the
*first* should remain on top, not the second. The v9.27 pinned tier
broke that expectation and was reverted in v9.28. Don't reintroduce
the pinned tier without an explicit request; the simple
`sort((a, b) => a.lastId - b.lastId)` is the contract.

History day-detail does NOT use this sort. Review-mode wants
chronological "as-performed" order, not next-up suggestion. Same
scope rule as the v9.26 ⋮ button and collapse state — those are
workout-screen-only too.

Don't try to detect "blocks" (upper body vs lower body) and segment
the sort. The system can't reliably distinguish a block transition
from a one-off cross-muscle set; the user's "block" mental model is
their own. When the user starts a fresh circuit, the new exercises
will initially be at the bottom (their first sets are the newest);
as the user logs more sets of them, they cycle into normal rotation
behavior with the rest.

**Manual entry prefills from history and uses the quick-add stepper
layout (v9.24).** Two paired changes to the workout-screen manual-entry
section, both driven by the same goal: cut typing on the gym floor.

1. **First-set-of-the-workout prefill.** When the user picks an
   exercise from the search box, `selectExercise(name)` in
   [app.js](app.js) now queries the workouts store for the most recent
   non-deleted set of that exercise (any session, ever) and seeds
   `#manual-w` / `#manual-r` with that weight × reps. A hint
   `#manual-prev` between the search and the inputs reads `Last set:
   95 × 8` — bold, 1rem, `var(--label)` so it stays theme-correct
   (black in light mode, white in dark). Cleared on save inside
   `handleManualEntry` and re-written on the next `selectExercise`
   call. If the exercise has never been logged the hint reads
   `First time logging this exercise.` and the inputs stay empty.
   Active template targets still win: when `activeTemplate` has a
   `targetWeight`/`targetReps` for the picked exercise, the template
   prefills and the history lookup short-circuits — the template is
   the user's explicit plan for this session and overrides historical
   data. The earlier disclaimer suffix `— last performed, may not be
   your max` was removed (also from `openQuickAdd`'s prior-workout
   message); the bare `Last set: …` reads cleaner.

2. **Same stepper layout as quick-add.** The compact horizontal
   `<div class="input-row">` (two number inputs + 80px Add button to
   the right) was retired. Manual entry now uses the same
   `.grouped-list` + `.row-input-stepper` markup as the quick-add
   overlay — Weight (lb) with four gold stepper buttons
   (`−5 / −2.5 / +2.5 / +5`) stacked below the input, Reps with two
   (`− / +`), and a full-width gold Add button (`.manual-add-btn`)
   below the rows. Same gold CTA visuals, same gym-floor
   keyboard-free interaction. `bumpQuickAdd` was generalized to honor
   `data-input` (full element ID, e.g. `"manual-w"`) when present;
   the quick-add overlay's existing `data-target="w"`/`"r"` shorthand
   still works for backward compatibility. One handler now drives
   steppers on both surfaces — don't duplicate the rounding /
   floor-at-0 / no-focus-after-tap logic into a `bumpManual` sibling.

`openQuickAdd` also gained source-aware messaging: when the prefill
comes from a previous workout rather than the active session, the
footer reads `No sets logged in this workout yet. Pre-filled from
your last performance.` (was the same ambiguous "Previous set" string
in both cases). The active-session case still reads the original
`Same exercise, new weight × reps. Pre-filled from the previous set.`

Don't reintroduce the horizontal `.input-row` layout for manual entry
— width-constrained iPhone-SE was the binding constraint that drove
v9.23 to stack steppers in quick-add, and the same applies here.
Don't shorten `Last set: 95 × 8` to a chip / tooltip — the bold
1rem text is deliberately scannable from arm's length with the phone
on the bench, matching the `#voice-response` overlay's design intent.
The `.input-row` and inline-`.add-btn` CSS rules are orphaned but
left in place pending a separate cleanup pass.

**Root font-size is 17px, not the browser default 16 (v9.2).** All
rem-based text scales up ~6%. Smallest body-text floor moves from
~12.5px to ~13.3px. The tabbar and icons are pixel-fixed and unaffected.
Keep this in mind when sizing new text elements: prefer rem so the
scale stays consistent.

**iOS status-bar mask (v9.2, extended for overlays in v9.11).**
`body::before` paints a solid bar of height `env(safe-area-inset-top)`
so page content doesn't bleed behind the iPhone status bar (time,
cellular, battery). Z-indexed above the sticky header, below overlays.
No-op on devices without a notch (safe-area-inset-top resolves to 0).
Don't add another top spacer or sticky-header margin to "fix" the
status bar — this is the fix.

**v9.11 enforcement for sheets:** `.modal` `max-height` is now
`calc(100vh - env(safe-area-inset-top) - 16px)` (was a fixed `92vh`).
On Dynamic Island phones the safe-area is ~47px, so the modal top
sits at minimum ~63px below the viewport top — and with the modal's
own 28px top padding, the sheet-header's Done button is ≥91px from
the very top, comfortably clear of the time/battery zone. On
non-iOS / desktop where safe-area is 0, the cap behaves like the
old `~92vh`. The previous fixed `92vh` could place a tall sheet's top
edge under the status bar on small iPhones — the fix is the
safe-area-anchored cap, not nudging individual overlays.

**PWA update flow has three paths (v9.3, refined v9.10):**
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

**v9.10 — three small refinements to the update story.** None of the
above paths change in shape; what changes is what the user sees and
when detection fires.

1. **Updating veil during the swap.** Both the cold-start path
   ([app.js](app.js) `initServiceWorker`) and `applyUpdate()` add
   `app-updating` to `<body>` immediately before posting `SKIP_WAITING`.
   `.app-updating::after` ([style.css](style.css)) is a full-viewport
   solid-`var(--bg)` overlay at z-index 99999 that hides every paint
   between the message post and the `controllerchange` reload. Without
   it, the page paints the stale shell once before the reload paints
   the new shell — that double-paint is what reads as a "flash." Don't
   animate the veil; it should be instant. Don't skip applying it from
   `applyUpdate()`, the auto-apply-on-Home and banner-tap paths need
   the same masking.
2. **Post-update snackbar (`acknowledgeVersionLanding()` in
   [app.js](app.js)).** Persists `ironLastSeenVersion` in
   `localStorage`. After `showScreen('home')` on boot, compares with
   `self.APP_VERSION`: if different (and a previous value existed),
   shows the standard snackbar `"Updated to v9.X"` for 3.5s, then
   writes the new value. First install is silent — there's no prior
   version to celebrate. This is the *retrospective* signal that the
   invisible swap worked; the user sees the fresh shell and gets a
   confirming nudge.
3. **Detection on visibility resume.** `onVisibilityChange()` in
   [app.js](app.js) now fires `reg.update()` on the `'visible'`
   branch (cheap conditional GET to `sw.js`; 304 short-circuit if
   already current). The 30-min `setInterval` poll stays — visibility
   resume covers the case where the PWA has been backgrounded for
   hours and the user comes back. This is the highest-leverage
   reliability win: most users open → use → background → resume,
   and that resume is now an update-check moment.

Don't replace the snackbar with a modal/banner — that's exactly the
intrusive-prompt direction v9.3 walked away from. Don't tighten the
30-min poll to compensate for visibility-resume; doubling polling is
wasteful and the resume hook already covers the gap.

**No native browser dialogs anywhere (v9.8).** Every confirm / alert /
prompt in the app routes through `confirmSheet({...})` or
`infoSheet({...})` — Promise-returning helpers that drive a single
custom overlay (`#confirm-sheet-overlay`) styled like the rest of the
sheet family (quick-add, set-action). Both helpers resolve to true or
false; `confirmSheet` is two-button (confirm + cancel, with optional
`danger: true` for the red destructive variant), `infoSheet` is
one-button (acknowledgement). Buttons dispatch via
`data-action="confirmSheetYes"` / `confirmSheetNo`. Earlier in the
project's life there was a deliberate "plain confirm() — works on every
platform, no extra UI" choice for boot prompts; that's been fully
reversed. Don't bring back native `confirm()`/`alert()`/`prompt()`
even for quick prototypes — the visual mismatch was the trigger for
this rewrite, and a single fast-path exception will leak the system
dialog back into a release.

**Screen Wake Lock is held only during an active workout session
(v9.12).** `acquireScreenWakeLock()` / `releaseScreenWakeLock()` in
[app.js](app.js) bracket the existing `activeSession` lifecycle:
acquired alongside `startSessionTicker()` in `startWorkoutSession()`
and on every resume branch in `resumeOrPromptSession()`; released
alongside `stopSessionTicker()` in `endWorkoutSession()` (both real
end and the empty-discard short-circuit). The browser auto-releases
on `visibilitychange → hidden`, so `onVisibilityChange()` re-acquires
on the `'visible'` branch when `activeSession` is still set —
otherwise re-foregrounding mid-session would leave the screen
dimmable until the next manual session transition. Helpers are
idempotent and feature-detected via `'wakeLock' in navigator`; on
unsupported browsers (iOS <16.4) they early-return silently and the
session lifecycle is unaffected. Scope is **session-only by design** —
mic-listening outside a session (PR queries, plate breakdowns) does
not acquire the lock because those are seconds-long. **Don't add a
Profile toggle for this** without a concrete user complaint: the
"keep screen on while actively lifting" behavior is the obvious
correct default, a toggle adds a Profile row + localStorage key + a
help-string for a behavior with no realistic objection, and the
manual lock button still works if someone wants to lock the phone
mid-workout. **Don't widen the scope** to "always on while the app
is open" — battery cost without a reason. The centralized helpers
make a future toggle a one-line change if the situation actually
warrants it.

**Workout-screen clock (v9.13).** A live `H:MM AM/PM` clock sits at
the right edge of the Workout screen header (`#workout-clock` in
[index.html](index.html), `.workout-clock` rule in [style.css](style.css)
mirrors the h2 typography exactly so they read as a paired title
row). Format is locale-aware via `toLocaleTimeString([], { hour:
'numeric', minute: '2-digit' })` — produces `6:42 PM` in en-US, no
zero-padding on the hour by design (matches iOS lock-screen
convention, which is the role this clock fills when the user wants
the time mid-workout without hunting for the iOS status bar).
`tabular-nums` keeps digit width fixed so the clock doesn't jiggle
as minutes change. `startWorkoutClockTick()` aligns the first
interval to the next minute boundary so updates land at HH:MM:00
instead of drifting. Re-rendered on `showScreen('workout')` and on
visibility resume so it isn't stale after iOS suspends the page.
**Workout screen only, by design** — don't add a clock to other
screens (the iOS status bar already shows the time globally; the
Workout-screen clock is for the "phone face down on the bench"
moment when the system clock is obscured). **Don't add seconds.**
The minute-boundary tick is deliberate — per-second updates churn
the layout for no value, and the elapsed timer in the session card
already covers the sub-minute case.

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

**Every voice response also surfaces visually (v9.17 → v9.19).**
`speak()` ([app.js](app.js)) calls `showVoiceResponse(text)` for every
utterance — set readbacks, query answers, error prompts, the hint
message, all of it. The motivation is iOS-specific: the hardware
ringer switch silences `speechSynthesis` entirely on iPhone, so a
muted phone (the common case at a gym) made voice queries appear to
fail. Logged sets had visual proof in the set list; pure queries
(`lastSet`, PR query, weekly volume, plates) had no visual output and
were invisible when muted. **v9.17** introduced this as a snackbar
mirror; **v9.19** upgraded to a prominent top-of-screen card
(`#voice-response`, `.voice-response` in [style.css](style.css)) with
1.55rem text and a 10s hold, designed to be readable from arm's-length
with the phone resting on the bench. Tap to dismiss early via
`data-action="hideVoiceResponse"`. Snackbar is reserved for non-voice
status messages now (Undo, sync, snackbar-action callbacks). TTS stays
as the primary channel when audible; the overlay is the always-on
visual mirror. Don't strip the overlay off non-query intents to
"reduce noise" — the muted-phone case needs them on logs too,
otherwise the readback distinction (which visually feels redundant
when TTS works) becomes invisible failure when TTS doesn't.

**iOS TTS warmup pattern (v9.18).** On iOS, `speechSynthesis` only
produces audio when called inside a recent user-gesture context. By
the time `recognition.onresult` fires (after STT processing), the
gesture window has closed and the downstream `speak()` runs silently.
Workaround in `toggleListening()` ([app.js](app.js)): queue a
zero-volume utterance inside the tap handler itself; this marks the
synthesis engine as user-initiated and unlocks later `speak()` calls
for the session. Plus a defensive `speechSynthesis.resume()` before
every `speak()` to unblock the queue if it's drifted into a paused
state. Both are no-ops on Chrome/Android/desktop. Don't remove either
without a real fix for the iOS audio-gesture binding.

**iOS skips the v9.0 mic-level meter (v9.16).** `startMicLevelMeter()`
([app.js](app.js)) opens a parallel `getUserMedia` stream to drive the
5-bar EQ on the FAB. On Chrome / Android / desktop this works fine
alongside `SpeechRecognition`. On iOS it doesn't: iOS has exclusive
audio session ownership at the system level, and `getUserMedia` +
`SpeechRecognition` can coexist on the *first* attempt but the
hardware-level release lags past `stopMicLevelMeter()`'s
`MediaStreamTrack.stop()` calls — the next tap fails to get the mic
back, the recognizer wedges, and the FAB shows frozen bars. Symptom is
"first set logs via voice, second set silently does nothing, app close
doesn't recover." Module-level `IS_IOS` constant
([app.js](app.js) near `VOICE_SESSION_MS`) gates the meter to a no-op
on iOS. `initSpeech()` adds `body.ios` so [style.css](style.css) can
keep the mic icon visible (with the breathing animation) instead of
showing static EQ bars. **Don't try to re-enable the meter on iOS
without first solving the audio-session-release timing** — the visual
cost (static bars vs animated bars) is much smaller than the
functional cost (voice not working on the second rep).

**Don't gate iOS as voice-unsupported based on assumed WebKit STT
limitations (v9.14 was reverted in v9.15).** I shipped v9.14 confident
that iPhone PWA `webkitSpeechRecognition` doesn't function, citing the
roadmap line "Web Speech doesn't work in WKWebView." The user confirmed
the big mic FAB *was* working on iPhone PWA prior — voice was logging
sets. The bug they reported ("5 bars appear, nothing happens, FAB
reverts") was a regression, not a platform limit. v9.14 papered over a
working feature; v9.15 reverted it. The original regression is still
unresolved as of this writing — the next attempt should NOT be another
gate. It should be a real diagnosis: Safari Web Inspector connected to
the iPhone, capture which of `recognition.onstart` / `onresult` /
`onerror` / `onend` fire (and what `e.error` is, if `onerror` fires).
Candidate root causes to rule out: mic permission state, getUserMedia
conflict with the parallel mic-level meter, the continuous-mode
restart loop hitting an iOS rate limit, network/dictation-backend
failure. The CLAUDE.md roadmap note about WKWebView predates iOS 14.5's
Web Speech support and is not authoritative for current iOS behavior.

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
- **Warmup**: `warmup <exercise> <weight> for <reps>` — "warmup bench 135
  for 8". Same parse as a regular log but the entry is flagged `warmup:
  true` and excluded from volume rollups + PRs (v9.26).
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
  restDurationMs: 90000,    // v9.11 — scheduled rest captured at log time
                            //         (drives History rollups). Absent on
                            //         pre-v9.11 entries; falls back to the
                            //         current restDuration setting.
  warmup: false,            // v9.26 — true for warmup sets. Excluded from
                            //         every volume rollup, every PR, every
                            //         coverage/trend signal. Pills show
                            //         orange "W" tag. Falsy default; absent
                            //         on pre-v9.26 entries.
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

**PR** (`prs` store, keyPath `exercise`) — v9.9 shape:
```js
{
  exercise: "bench press",
  maxWeight: 245, maxWeightReps: 3,            // heaviest weight ever lifted
  max1RM: 275.6, max1RMWeight: 235, max1RMReps: 5,  // best estimated 1RM + its source set
  achievedAt: 1735847234567,
  prType: "weight",                             // "weight" | "1rm" — drives the share card
}
```
`maxWeight` and `max1RM` track *independently* (a 1RM-only PR doesn't
clobber the stored max-weight set). Combo PRs that fire both flags on
the same set store `prType: "weight"` because weight on the bar wins
the headline. Both `recomputePR()` (client) and `recomputePRs()`
(Worker) rebuild this deterministically from the workout log.

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
