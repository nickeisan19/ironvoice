# Handoff: IronVoice — Full App Redesign

## Overview
This package is the design spec for the **complete IronVoice Pro** mobile
experience — every screen, sheet, and the four most recent behavior additions.
The goal is for your app to **match this design end-to-end**.

IronVoice is a voice-first, offline-capable iOS-style PWA for tracking gym
workouts: you talk to it ("bench two twenty-five for five") and it logs the set,
tracks volume, flags PRs, runs rest timers, and turns your data into a next
action.

## About the Design Files — read this first
- **`index.dc.html` is the source of truth.** It is a complete, working prototype
  of the whole app. Every measurement, color, font size, and piece of copy is in
  that file as **inline styles** — so the file itself is the exact spec. When a
  value below says "see prototype," open the file and read the inline `style="…"`
  on that element; it is authoritative and more precise than prose.
- It is a **design reference**, not drop-in production code. It runs in a
  component runtime your repo does not use. **Recreate it in your existing
  vanilla-JS app** (`app.js`, `index.html`, `style.css`), following your current
  patterns (your screen/sheet system, your `localStorage` usage, the tokens
  already in `style.css`). Do **not** paste the prototype in.
- The prototype's logic lives in a `class Component` near the bottom of the file
  (search `renderVals`). Read it for exact state shape, parsing, PR detection,
  timers, and the four new behaviors.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions.
Recreate pixel-faithfully using your existing CSS tokens and components.

## How to drive this with Claude Code
Suggested order (each is independently testable):
1. Read `index.dc.html` end-to-end and this README.
2. Align the **global system** first (tokens, type scale, tab bar, mic FAB, sheet
   shell, gold-wash background) so every screen inherits it.
3. Then recreate screens in this order, testing each before moving on:
   **Home → Active Workout → History → Personal Records → Profile**, then the
   **sheets**, then the **four new behaviors** at the end of this doc.
4. For each screen, open the matching `screenshots/*.png` and the corresponding
   section of `index.dc.html`, and match exactly.

---

## Global design system ("Iron Velocity")
*(Most of this already exists in your `style.css`; reuse those tokens.)*

**Color**
- Gold / primary `--gold` = **`#FFC107`** (gradient `#FFC107 → #FF8F00`); pressed
  `#E6AD00`. Used for **all** primary CTAs, active tab, mic FAB, active week-strip
  days, headings (dark mode), focus accents.
- Ink on gold `--acc-ink` = **`#1A1300`** — text/icons on any gold surface (never white).
- Blue `#2196F3` is **semantic only** (steady training-load state, SW update banner).
  Never a button/link/Share/Sync.
- Status: green = ready/success/timer-done; orange = warmup/high load; red =
  End Workout/destructive; purple = arms.
- Muscle palette (fixed, never desaturated): chest red `#f44336`, back light-blue
  `#03a9f4`, legs green `#4caf50`, shoulders orange `#ff9800`, arms purple
  `#9c27b0`, core cyan `#00bcd4`.
- Themes: dark "Obsidian" `#121212` (default, layered greys, white labels) and
  light "Gym Stone" warm cream `#faf7f2` (white cards, black labels).

**Type** — system stack only: `-apple-system, BlinkMacSystemFont, "SF Pro Display",
"SF Pro Text", "Segoe UI", system-ui, sans-serif`. Root **17px**. Hero numbers &
screen titles weight **800**, tracking `-0.035em`; section headers 700; body
400–500. Eyebrows ~0.66rem/600/UPPERCASE/`0.08em`. `font-variant-numeric:
tabular-nums` on every changing value (weights, counts, timers).

**Space / shape / elevation** — 8px between cards, 14px card padding, 20px screen
gutters, 24px sheet padding. Touch targets ≥44px. Radii: 10 (segmented) · 14
(inputs/buttons/lists) · 20 (cards) · 28 (sheet tops) · 100 (pills). **Borders
over shadows** — flat surfaces with 0.5px hairlines; shadow+glow only on floating
chrome (mic FAB gold glow, search dropdown, snackbar). Frosted blur
(`blur(20px) saturate(180%)`) on scrolled header, tab bar, sheets, snackbar.

**Motion** — `--spring cubic-bezier(.32,.72,0,1)` for sheet slide-ups/springy
presses; `--ease cubic-bezier(.4,0,.2,1)` for everything else. Press = shrink
(buttons 0.96, mic FAB 0.92). Listening mic "breathes"; attention dots pulse.

**Background** — flat obsidian/cream, **no photography/illustration**; one faint
gold radial wash from the top of every screen
(`radial-gradient(... rgba(255,193,7,.06) ...)`).

**Icons** — custom inline line-art SVGs, **2.2 stroke, round caps/joins, 24×24
viewBox, currentColor, fill none**. Signature glyph = dumbbell
(`M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12`). No icon font, no emoji-as-icon. App
mark = gold "IV" over a dumbbell on an obsidian rounded square.

**Voice / copy** — terse encouraging coach; second person; sentence case for
body/titles/buttons; UPPERCASE eyebrows; CTAs are verbs ("Start workout", "Add
set", "End workout"). Numbers spoken naturally in voice copy, shown precisely
("225 × 3", "12,640 lb"). Units always explicit. Destructive actions get a
5-second Undo. Essentially no emoji (one 🏆 only on a genuine PR celebration).

**Persistent chrome (all tab screens)**
- **Tab bar** — frosted, `height:88px`, bottom-anchored; 4 items Home · History ·
  Records · Profile (dumbbell/clock/trophy/person icons), active item gold; a
  raised circular **mic FAB** (58px, gold gradient, gold glow, `margin-top:-14px`)
  centered between them.
- **Status bar** — mock iOS bar (time, 5G, battery) at top.

---

## Screen 1 — Home (launchpad)  · `screenshots/02-home.png`
A *launchpad, not a dashboard*: turns data into the next action.
- **Header**: centered gold "IRONVOICE" wordmark with dumbbell glyph.
- **Load card** (bordered, radius 20): a gold **progress ring** (e.g. "78%") +
  "WEEKLY LOAD" eyebrow, big tabular volume ("18,420 lb"), green delta
  ("▲ 8% vs last week").
- **Stat trio**: STREAK / TODAY / LAST as three bordered cells (value 800 weight).
- **Primary CTA**: full-width gold **"Start workout"** (height 54, radius 14,
  play-triangle icon). Opens the Start sheet.
- **"Suggested for today"** card: title (e.g. "Pull day"), est. time, one-line
  rationale, muscle tags (colored dots), and a gold-outline **"Start {name}"**
  button.
- **Command bar** (pinned near bottom above tab bar): a chevron prompt + input
  "say or type — bench 225 for 5" + a gold mic button. Submitting parses and logs.
- If a workout is in progress, a **"Workout in progress"** resume strip appears at
  the top instead of normal flow.

## Screen 2 — Active Workout  · `screenshots/06-active-workout.png`
- **Header row**: a minimize chevron (back to tabs), "IN PROGRESS" eyebrow +
  workout name (800), and a red-outline **"End"** button.
- **Live totals**: ELAPSED (mm:ss, ticking) / VOLUME / SETS as three bordered cells.
- **Exercise cards** (one per movement): colored muscle dot + name + "{n} sets" +
  a gold **+** to add a set. Logged sets render as **pills** ("225 × 5"); PR pills
  are gold with the ink color; warmup pills are dashed/transparent. Empty exercise
  shows "+ Log first set — tap here or use the bar below".
- Adding a set opens the **Manual entry** sheet (weight/reps steppers, prefilled
  to last set; "Mark as warmup"). Logging recomputes PRs live.
- The command/mic bar stays available to log by voice.

## Screen 3 — History  · `screenshots/03-history.png`
- **Header**: "History" title + a circular close (back to Home).
- **Week nav**: ‹ "This week" › (prev/next week; next disabled at current week).
- **7-day strip**: Mon–Sun cells; trained days show the **dumbbell glyph**; the
  selected day is gold-filled, today gets a gold ring.
- **Week rollup**: 6 bordered cells — Workouts, Time (e.g. "3h 4m"), Upper vol,
  Sets, PRs, Lower vol (tabular).
- **Day detail** (when a day is selected): workout name + meta ("9:05 AM · 38 min ·
  4 sets"); **Muscle focus** horizontal bars (colored, proportional, with volume);
  **exercise groups** (tap to edit) showing set pills.
- Tapping an exercise opens the **History edit** sheet (steppers per set, add/remove
  set, **Delete exercise**, Save).

## Screen 4 — Personal Records  · `screenshots/04-records.png`
- **Header**: "Personal Records" + close.
- **Segmented toggle**: "Max weight" / "Weight × reps" (gold active).
- **Search** input + **Filter** button (muscle filter; active state highlighted;
  active chips row with "Clear all").
- **Records list**: rows = muscle dot + exercise name + big tabular value + "× reps"
  + a **share** icon. Sorted by the active metric. Tapping a row opens the **PR
  detail** sheet (a scrollable **bar chart** of progression + a "Share" action that
  generates a branded PR card image).

## Screen 5 — Profile  · `screenshots/05-profile.png`
- **Header**: "Profile" + close. Avatar (gold circle w/ initial) + name + email.
- **Tab pills**: Account · Preferences · Training · Data · Community (gold active).
- **Account**: grouped list — First name, Last name, Email (editable); **Sync**
  group — Access key field, "Test connection", "Restore from cloud" (+ note).
- **Preferences**: Theme segmented (Dark/Light/Auto); Rest-timer default segmented
  (60s/90s/2m/3m/Off).
- **Training**: Workout Templates list (+ New opens the **Template builder**:
  name + add/remove exercises + Save).
- **Data**: Export JSON, Export CSV (Apple Health), Wipe all data; app version.
- **Community**: add a community exercise (name + muscle), list of added ones (edit).
- **Voice** group: Test voice, voice-mode segmented (Off/On), Spoken-voice picker,
  Speech-speed slider.

*(Sync, Test connection, Restore, Sign out are cosmetic in the prototype because it
has no backend; wire them to your real sync layer if present.)*

## Sheets (bottom sheets unless noted)
All share the shell: full-screen dim backdrop (`--modal-dim`, `blur(2px)`,
tap-to-dismiss), panel `background:var(--surface-2)`, `border-top:1px solid
var(--hairline-strong)`, `border-radius:28px 28px 0 0`, `padding:12px 22px 30px`,
grabber handle, slide-up `0.4s cubic-bezier(.32,.72,0,1)`.
- **Start workout** — "Empty workout" card + template list.
- **Exercise picker** — search + categorized catalog (76% tall).
- **Manual entry** — weight/reps steppers, warmup toggle, Add/Save.
- **Template builder** — name + exercise list + add.
- **Voice command** — listening UI (breathing mic, live transcript, Cancel/Log).
- **Voice picker** — list of system voices.
- **Share card** — full-screen branded PR card preview + Save/Share.
- **Community edit** — edit a community exercise.
- **History edit** — per-set steppers, add/remove set, Delete exercise, Save.
- **Workout reminder** — the new feature (see below).

---

# The four most-recent behavior additions
*(Implement these after the screens are matched.)*

## A. Workout reminder sheet  · `screenshots/01-reminder-sheet.png`
On app open, if you haven't trained today and it's past the time of day you usually
train, a bottom sheet asks if you want to start a workout.

**Trigger** (evaluate ~500ms after open). Show only when ALL are true: a workout
history exists; you have **not** trained today; **≥24h** since last workout; the
current time-of-day is **≥ your usual training time**; no workout in progress; not
already dismissed this session.

```js
function maybeWorkoutPrompt(times /* past workout timestamps */) {
  if (promptDismissedThisSession || workoutInProgress || !times.length) return;
  const now = new Date(), last = new Date(Math.max(...times));
  if (last.toDateString() === now.toDateString()) return;            // trained today
  if ((now - last) / 3600000 < 24) return;                           // < 1 day
  const mins = times.map(t => { const d = new Date(t); return d.getHours()*60 + d.getMinutes(); });
  const usual = Math.round(mins.reduce((a,b)=>a+b,0) / mins.length); // learned "usual time"
  if (now.getHours()*60 + now.getMinutes() < usual) return;          // not past usual time
  const days = Math.floor((now - last) / 86400000);
  showReminder({ usualLabel: fmtTime(usual), sinceLabel: days <= 1 ? 'yesterday' : days + ' days ago' });
}
```
"Usual time" = average time-of-day of the last ~16 workouts (median is fine too).
On end-of-workout, append `Date.now()` to the persisted list under **`iv_activity`**
(`{times:[…]}`, cap 16). For production cadence ("daily until you train"), also
persist `lastPromptDate` and skip if it equals today (the prototype only suppresses
per session, for demo).

**Sheet UI** (shown top-anchored in the screenshot purely for capture; it slides up
from the **bottom** in the app): gold dumbbell tile (48px), eyebrow "READY TO LIFT?"
(gold), title "Time for today's session" (20/800), body "Your last workout was
{since} — you usually train around {usual}. Want to start now?", gold **"Start
workout"** (54px, play icon) → dismiss + open Start sheet, and a neutral **"Not
now"** (50px, `--surface-3`, hairline border) → dismiss. Exact styles in prototype.

## B. Auto-named workouts
When ending a workout, if the name is empty or the empty-workout default
("Open workout"), derive it from muscles trained (working sets only):
```js
const LOWER = { legs:1, quads:1, hamstrings:1, glutes:1, calves:1 };
// hasLower && hasUpper → "Full Body"; only lower → "Lower Body"; else → "Upper Body"
// (chest/back/shoulders/arms/core count as upper)
```
Use the derived name for both the History list entry and the stored session.

## C. Persisted account + settings  (key **`iv_prefs`**)
Persist & rehydrate `firstName, lastName, email, accessKey, voiceName, voiceRate,
theme, restDefault, voiceWorkoutMode`. Read on open; write the whole object whenever
any changes. try/catch all storage. Decide whether Sign out / Wipe data should clear it.

## D. Delete an emptied exercise (History edit sheet)
Add a red-outline **"Delete exercise"** action below Save. Delete removes the
exercise from the day (and removes the day if it becomes empty). On Save, also drop
any exercise reduced to zero sets. Toasts: "Exercise deleted" / "Exercise removed" /
"Exercise updated".

---

## Storage keys
- `iv_prefs` — account + settings (B/C).
- `iv_activity` — `{ times:number[] }` (≤16) of workout timestamps, for the reminder (A).
- Plus `lastPromptDate` in production (A).

## Assets
No new images. Reuse the existing inline dumbbell SVG (`ACTIVITY_DUMBBELL_SVG`) and
the IV app icon already in your repo.

## Files
- `index.dc.html` — the full prototype and **source of truth** (open in a browser;
  the reminder is seeded to appear on load).
- `screenshots/` — 01 reminder · 02 home · 03 history · 04 records · 05 profile ·
  06 active-workout.
