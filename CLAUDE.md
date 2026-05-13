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

1. Profile-screen footer renders `IronVoice Pro · v9.21 · 2026-05-13` from
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
   `IN PROGRESS / 0:38` as a third row (label `REST` in blue,
   followed by the time in 1.8rem matching the elapsed time). The SVG
   progress ring was removed in v9.11; only the time + label remain.
   The `.timer-pill.complete` state still flips both label and time
   to green when the countdown hits zero (the celebratory "Go" state).
   Voice "rest 90" without an active session is a non-goal: rest UI
   is workout-scoped now.
2. **SET / VOLUME labels above values, in blue.** Stats column
   (`.session-card-stats`) flipped from
   number-on-top/`<small>`-label-below to label-on-top with values in
   1.4rem below. Labels use `.session-card-label-blue` (`var(--blue)`),
   mirroring the REST label color. `IN PROGRESS` stays green to signal
   "session is alive"; the blue labels are the metrics. All three top
   labels (`IN PROGRESS / SET / VOLUME`) sit on the same baseline.
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

**History week-strip shows a per-day volume bar (not a dot).** Bar height
is proportional to that day's volume relative to the week max; bar color
is the dominant muscle worked. The class is `.week-day-bar` and replaces
the old `.week-day-dot`. Computed in `renderHistoryScreen()`.

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
  - **Per-session** — each session header in `renderHistoryDayDetail`
    has an inline sub-row. **v9.21** leads with volume:
    `12.4k lb vol · 1h 12m total · 47m work · 25m rest`. Set count is
    already on the meta line above ("24 sets") so the sub-row doesn't
    duplicate it. The `~estimated` badge stays where applicable.
  - **Per-day** — `#history-day-rollup` (above session headers) shows
    the day's totals when ≥1 real session contributed. Hidden on
    untagged-only days. v9.21: 5 cells (Volume / Sets / Total /
    Workout / Rest).
  - **Per-week** — `#history-week-rollup` (above the volume strip)
    sums sessions whose `startedAt` falls in the visible week. Hidden
    on empty weeks. Powered by `renderRollupTotals(elId, sessions, ...)`
    and the shared `rollupCellsHtml()` markup helper. v9.21: same 5
    cells as the day rollup.
- **Visual:** five-cell grid `.history-rollup` (`repeat(5, 1fr)`,
  `gap: 8px`) with small uppercase labels above bold values. v9.21
  shrunk the value font to 1rem and label to 0.68rem to fit five
  cells on iPhone-SE-width without wrapping. The Rest cell renders
  blue (`.history-rollup-cell-rest`) — mirrors the green session
  card's REST label color so "rest" reads consistently across
  screens. Don't color other cells blue; the asymmetry makes the rest
  number scannable.

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

2. **± stepper buttons flank the quick-add inputs.** Weight row:
   `[−5] [−2.5] [225] [+2.5] [+5]`; reps row: `[−] [5] [+]`. Each
   button carries `data-action="bumpQuickAdd"`, `data-target` (`w` or
   `r`), and `data-step` (signed decimal). One handler
   (`bumpQuickAdd(el)`) parses both, applies the delta, floors at 0,
   rounds to one decimal so float artifacts (`225 + 2.5 − 2.5 ≠ 225`
   through repeated taps) never leak. Fires `haptic(8)`. Crucially
   the handler does NOT call `.focus()` on the input — so tapping a
   stepper from the gym floor with chalky hands doesn't pop the iOS
   keyboard. The keyboard-free path is the whole point of the
   secondary fix.

   Styled via `.qa-input-stepper` (flex row inside the `.row-input`)
   and `.qa-step` / `.qa-step-fine` (38×38 / 42×38 px tap targets,
   the fine variant slightly muted so the ±5 reads as the primary
   action). The `.row-input-stepper` modifier shrinks the row label
   to 72px so the whole layout fits iPhone-SE-width.

Don't restore the bare `<input>` markup without the steppers — the
gym-floor keyboard-free path depends on them. Don't add `tabindex="-1"`
to the stepper buttons; they should be reachable via keyboard for
accessibility. Don't widen the steppers to all the other number inputs
(`#manual-w`, `#plate-target`, etc.) — those are out-of-flow surfaces
where typing is the right interaction; the auto-select fix is the
appropriate scope there.

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
