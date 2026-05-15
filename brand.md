# IronVoice Brand — "Iron Velocity"

The source of truth for visual design decisions. Update this alongside
any significant CSS or design change so future builds stay consistent.

---

## Identity

**Brand name:** IronVoice Pro  
**Tagline positioning:** Industrial · High-Performance · Data-Driven  
**Core metaphor:** A precision instrument in a gym — gold like a trophy, dark
like iron, smart like a coach.

The gold (`#FFC107`) is the primary brand signal. It connects the "IV" logo,
the voice FAB, and every primary CTA — workout actions AND sheet actions —
into one coherent visual identity. Blue (`#2196F3`) is reserved exclusively
for semantic training-load state (`steady`) and the SW update banner. It is
not used for interactive elements.

---

## Color Tokens

### Dark Mode (Obsidian)

| Token               | Value       | Role                                        |
|---------------------|-------------|---------------------------------------------|
| `--bg`              | `#121212`   | Page background                             |
| `--surface-1`       | `#1a1a1a`   | Lowest card surface                         |
| `--surface-2`       | `#1e1e1e`   | Standard card / modal background            |
| `--surface-3`       | `#242424`   | Grouped list row / inset surface            |
| `--surface-4`       | `#2c2c2c`   | Elevated surface / input background         |
| `--label`           | `#ffffff`   | Primary text — pure white in dark mode      |
| `--label-secondary` | `rgba(255,255,255,0.62)` | Secondary text               |
| `--label-tertiary`  | `rgba(255,255,255,0.32)` | Captions, placeholders       |
| `--label-quaternary`| `rgba(255,255,255,0.18)` | Hairline text                |
| `--hairline`        | `rgba(255,255,255,0.07)` | Subtle dividers              |
| `--hairline-strong` | `rgba(255,255,255,0.12)` | Card borders, modal tops     |

### Light Mode (Gym Stone)

| Token               | Value       | Role                                        |
|---------------------|-------------|---------------------------------------------|
| `--bg`              | `#faf7f2`   | Warm cream background (not cool gray)       |
| `--surface-1`       | `#ffffff`   | Card surface                                |
| `--surface-2`       | `#ffffff`   | Modal background                            |
| `--surface-3`       | `#faf7f2`   | Inset row background                        |
| `--surface-4`       | `#e8e2d8`   | Dividers / input background                 |
| `--label`           | `#000000`   | Primary text — pure black in light mode     |
| `--label-secondary` | `rgba(0,0,0,0.65)` | Secondary text                       |
| `--label-tertiary`  | `rgba(0,0,0,0.35)` | Captions, placeholders               |
| `--label-quaternary`| `rgba(0,0,0,0.18)` | Hairline text                        |
| `--hairline`        | `rgba(0,0,0,0.12)` | Subtle dividers                      |
| `--hairline-strong` | `rgba(0,0,0,0.22)` | Card borders, modal tops             |

---

## Brand Palette

| Name          | Hex               | CSS var              | Purpose                                            |
|---------------|-------------------|----------------------|----------------------------------------------------|
| Iron Gold     | `#FFC107`         | `--gold`             | Brand primary — ALL primary CTAs and active states |
| Gold Gradient | `#FFC107→#FF8F00` | `--gold-grad` / `--pr-grad` | Mic FAB, PR canvas background             |
| Action Blue   | `#2196F3`         | `--blue`             | Semantic only: steady training-load + SW update banner |
| Blue Gradient | `#2196F3→#1565C0` | `--blue-grad`        | (Reserved — not actively used for buttons)         |
| Iron Orange   | `#FF9800`         | `--orange`           | Warmup tags, high-load indicators                  |
| Iron Green    | `#00E676`         | `--green`            | Ready status, positive progress, timer complete    |
| Iron Red      | `#FF5252`         | `--red`              | End Workout, destructive actions, overreach        |
| Iron Purple   | `#9C27B0`         | `--purple`           | Arms muscle color anchor                           |

---

## Muscle Group Palette

Keep these consistent across Focus bars, muscle dots, and drill-down views.
Do not desaturate — they need to read against both `#121212` and `#faf7f2`.

| Muscle    | Hex       | CSS var         |
|-----------|-----------|-----------------|
| Chest     | `#F44336` | `--m-chest`     |
| Back      | `#03A9F4` | `--m-back`      |
| Legs      | `#4CAF50` | `--m-legs`      |
| Shoulders | `#FF9800` | `--m-shoulders` |
| Arms      | `#9C27B0` | `--m-arms`      |
| Core      | `#00BCD4` | `--m-core`      |

---

## Component Rules

### Mic FAB (`#mic-btn`)
- **Idle:** `--gold-grad` background, dark icon (`color: #1a1300`), gold glow shadow
- **Listening:** red-to-orange gradient (`#ff5252 → #ff9800`) + breathing animation
- The mic is the app's headline feature — instantly recognizable as gold

### Screen Headings
- `h1`, `.screen-header h2`, and `.modal h2` use `--heading-color` token:
  - Dark mode: `var(--gold)` — headings glow gold on obsidian
  - Light mode: `var(--label)` — headings are black on cream
- Never hardcode gold onto headings — always use `--heading-color`

### Active Tab Bar
- `.tab-btn.active` → `--gold`
- `.tab-workout:not(.session-active)` → `--gold` (idle Workout tab accent)
- Week-strip selected day (`.week-day.active`) → `--gold` fill, dark text `#1a1300`
- Today's unselected date number → `--gold`

### Session Card (Active Workout)
- Background: `linear-gradient(135deg, rgba(255,193,7,0.18), rgba(255,143,0,0.10))`
- Border: `rgba(255,193,7,0.30)`
- All labels (IN PROGRESS / SET / VOLUME / REST) → `--gold`
- Timer complete state → `--green` (celebratory "Go")
- Time values and set/volume counts → `--label`

### Primary CTAs — Gold Across All Surfaces
ALL action buttons use gold (`--gold` bg, `#1a1300` text, `#e6ad00` active):
- `.workout-start-cta` — Start Workout on Workout screen
- `.rec-cta` — Start Recommended Workout on Home
- `.session-set-add` — "+ Add set" trailing row
- `.add-btn` — inline Add in manual entry
- `.qa-step` — stepper buttons in quick-add and manual entry
- `.primary-btn` — Edit set, Share…, all sheet CTA buttons (was blue; now gold)
- `.hpa-icon` — play circle on Home primary action pill

Text on gold: always `#1a1300`. Active/pressed: `#e6ad00`.

### Row Actions and Link Text — Gold
- `.row-action` — Profile row actions (Sync, Restore, Test), "Share PR card" in exercise sheet → `--gold`
- `.section-add` — "+ Add exercise" links → `--gold`
- `.snackbar-action` — UNDO button → `--gold`
- `.row-tappable` / `.row-link` — any tappable text row → `--gold`

### Segmented Tab Controls
- `.segmented button` (inactive) → `--label-secondary`
- `.segmented button.active` (generic) → `--surface-4` background, `--label` text
- `.segmented-tabs button.active` (PR screen Max Weight / Weight×Reps) → `--gold` bg, `#1a1300` text

### History Session Header
- `.session-header-icon` (checkmark circle) → `--gold` background, `#1a1300` checkmark (was blue)

### History Rollup Cells
- Volume, Sets, Total, Workout cells → `--label` (adapts to mode)
- Rest cell → `--label` (was deliberately blue; now consistent with other cells)

### PR Row Share Button (`.pr-row-share`)
- Icon color → `--label` (black in light mode, white in dark mode)
- Secondary affordance — label color, not a primary gold CTA

### Header Icon Buttons (`.icon-btn`)
Home, help, plate calculator, sync/download icons in the header strip.
- **Dark mode:** gold background (`--gold`), dark icon (`#1a1300`)
- **Light mode:** black background (`#000000`), gold icon (`--gold`)
- Active/pressed: `#e6ad00` dark / `#1a1a1a` light
- Controlled via `--icon-btn-bg`, `--icon-btn-color`, `--icon-btn-bg-active` tokens

### Voice Listening Status (`#status.listening`)
- Dot and text → `--gold` (mic-brand color signals "I'm listening")

### Focus Rings (Accessibility)
- All `input:focus`, `:focus-visible` outlines → `var(--gold)`

### Cards & Elevation
- Borders over shadows: `1px solid var(--hairline)` on card faces
- No heavy drop shadows — mechanical feel
- Modal/sheet backdrop: `blur(20px) saturate(180%)` + `var(--modal-dim)`

### PR Card (share canvas)
- Gold gradient background (`#FFC107 → #FF8F00`)
- Dark text (`#1a1300`) for headline weight and tag
- `IRONVOICE · NEW PR` badge at top-left corner

### Update Banner
- Background → `--blue` (the only blue surface in the UI — SW update notification)
- "Update now" button text → `--gold` (gold on white pill inside blue banner)

---

## Typography

- **Font stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif`
- **Root size:** `17px` (bumped for gym-floor legibility)
- **Metric values:** `font-variant-numeric: tabular-nums`
- **Bold weights** for primary data (volume, set count, PRs)
- No custom web fonts (CSP + offline-first constraint)

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use `--gold` / `--gold-grad` for ALL primary CTAs | Use blue for any interactive button or link |
| Use `--blue` only for the steady training-load state and update banner | Use blue for Share, Sync, or Confirm — those are now gold |
| Dark text (`#1a1300`) on all gold surfaces | Put white text on `#FFC107` gold (fails contrast) |
| `--label` for icon-only nav buttons (`.icon-btn`) | Use blue for icon nav chrome |
| `--label` for the PR row share icon (secondary affordance) | Use gold for every icon — secondary affordances stay label-colored |
| Keep muscle colors at their specified hex values | Desaturate muscle colors to "match" the gold theme |
| Use `--red` for End Workout and destructive confirms | Use red as a general "important" color |
| Keep `--green` for Ready / success / timer-complete | Use the old iOS green (`#30d158`) |
| Use `--heading-color` for h1, h2 | Hardcode gold onto headings — light mode won't override |
| Pure white (`#ffffff`) labels in dark mode | Use `#e0e0e0` warm grey labels in dark mode |
| Pure black (`#000000`) labels in light mode | Use `#212121` grey labels in light mode |

---

## Version history

| Version | Change |
|---------|--------|
| v9.38   | Full Iron Velocity implementation: dark bg `#121212`, light bg `#faf7f2` (warm cream), `--heading-color` token, gold headings dark mode, active tab → gold, week-strip → gold, sheet Done → gold, mic FAB → gold-grad, session card → gold tint + all labels gold. |
| v9.39   | Tab bar pin fix: moved `overflow-x: hidden` from `html` to `body` only. Setting overflow on `<html>` makes it the scroll container and breaks `position: fixed`. |
| v9.40   | Gold takes over all interactive elements. `--label` → pure white dark / pure black light. Light hairlines → pure `rgba(0,0,0,...)` base. `.primary-btn`, `.rec-cta`, `.row-action`, `.section-add`, `.snackbar-action` all → gold. Session header checkmark circle → gold. History Rest cell → `--label`. PR segmented tabs active → gold. Voice listening dot → gold. All focus rings → gold. Blue retained only for steady training-load state and SW update banner background. |
