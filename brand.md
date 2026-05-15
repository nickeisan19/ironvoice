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
the voice FAB, and every primary workout CTA into one coherent visual identity.
Blue (`#2196F3`) is the secondary action color — sharing, navigation, external
links, confirm sheets.

---

## Color Tokens

### Dark Mode (Obsidian)

| Token             | Value       | Role                                          |
|-------------------|-------------|-----------------------------------------------|
| `--bg`            | `#121212`   | Page background                               |
| `--surface-1`     | `#1a1a1a`   | Lowest card surface                           |
| `--surface-2`     | `#1e1e1e`   | Standard card / modal background              |
| `--surface-3`     | `#242424`   | Grouped list row / inset surface              |
| `--surface-4`     | `#2c2c2c`   | Elevated surface / input background           |
| `--label`         | `#e0e0e0`   | Primary text (not pure white — OLED comfort)  |
| `--label-secondary` | `rgba(224,224,224,0.62)` | Secondary text                   |
| `--label-tertiary`  | `rgba(224,224,224,0.32)` | Captions, placeholders           |

### Light Mode (Gym Stone)

| Token             | Value       | Role                                          |
|-------------------|-------------|-----------------------------------------------|
| `--bg`            | `#faf7f2`   | Page background — warm cream (not cool gray)  |
| `--surface-1`     | `#ffffff`   | Card surface                                  |
| `--surface-2`     | `#ffffff`   | Modal background                              |
| `--surface-3`     | `#faf7f2`   | Inset row background                          |
| `--surface-4`     | `#e8e2d8`   | Dividers / input background                   |
| `--label`         | `#212121`   | Primary text                                  |
| `--label-secondary` | `rgba(33,33,33,0.65)` | Secondary text                      |
| `--label-tertiary`  | `rgba(33,33,33,0.35)` | Captions, placeholders               |

---

## Brand Palette

| Name              | Hex         | CSS var        | Purpose                                        |
|-------------------|-------------|----------------|------------------------------------------------|
| Iron Gold         | `#FFC107`   | `--gold`       | Brand primary — mic, PRs, primary CTAs         |
| Gold Gradient     | `#FFC107→#FF8F00` | `--gold-grad` / `--pr-grad` | Mic FAB, Start Workout, PR tags  |
| Action Blue       | `#2196F3`   | `--blue`       | Share, confirm, navigation links               |
| Blue Gradient     | `#2196F3→#1565C0` | `--blue-grad` | Blue primary buttons in sheets                |
| Iron Orange       | `#FF9800`   | `--orange`     | Warmup tags, high-load indicators             |
| Iron Green        | `#00E676`   | `--green`      | Ready status, positive progress                |
| Iron Red          | `#FF5252`   | `--red`        | End Workout, destructive actions, overreach    |
| Iron Purple       | `#9C27B0`   | `--purple`     | (arms muscle color anchor)                    |

---

## Muscle Group Palette

Keep these consistent across Focus bars, muscle dots, and drill-down views.
Do not desaturate — they need to read against both `#121212` and `#f8f9fa`.

| Muscle    | Hex         | CSS var          |
|-----------|-------------|------------------|
| Chest     | `#F44336`   | `--m-chest`      |
| Back      | `#03A9F4`   | `--m-back`       |
| Legs      | `#4CAF50`   | `--m-legs`       |
| Shoulders | `#FF9800`   | `--m-shoulders`  |
| Arms      | `#9C27B0`   | `--m-arms`       |
| Core      | `#00BCD4`   | `--m-core`       |

---

## Component Rules

### Mic FAB (`#mic-btn`)
- **Idle:** `--gold-grad` background, dark icon (`color: #1a1300`), gold glow shadow
- **Listening:** red-to-orange gradient (`#ff5252 → #ff9800`) + breathing animation
- The mic is the app's headline feature — it must be instantly recognizable as gold

### Screen Headings
- `h1`, `.screen-header h2`, and `.modal h2` use `--heading-color` token:
  - Dark mode: `var(--gold)` (`#ffc107`) — headings glow gold on obsidian
  - Light mode: `var(--label)` (`#212121`) — headings are dark on cream
- Never hardcode gold onto headings directly — always go through `--heading-color`
  so light mode automatically overrides to dark text

### Active Tab Bar
- `.tab-btn.active` → `--gold` (was `--blue`)
- `.tab-workout:not(.session-active)` → `--gold` (Workout tab idle accent)
- Week-strip selected day (`.week-day.active`) → `--gold` fill, dark text `#1a1300` (matches brand)
- Today's unselected date number (`.week-day.today .week-day-num`) → `--gold`

### Session Card (Active Workout)
- Background: `linear-gradient(135deg, rgba(255,193,7,0.18), rgba(255,143,0,0.10))` — warm gold tint
- Border: `rgba(255,193,7,0.30)` — gold hairline
- "IN PROGRESS" label (`.session-card-label`) → `--gold`
- "SET", "VOLUME", "REST" labels (`.session-card-label-blue`) → `--gold`
- Rest timer "REST" label (`.timer-label`) → `--gold`
- Timer complete state stays `--green` (celebratory "Go" moment)
- Time values and set/volume counts stay `--label`

### Primary Workout CTAs
All "start/add lifting" actions use gold:
- `.workout-start-cta` — Start Workout button on Workout screen
- `.session-set-add` — "+ Add set" trailing row
- `.add-btn` — inline Add button in manual entry
- `.qa-step` — stepper buttons in quick-add and manual entry
- `.hpa-icon` — play circle on Home primary action pill

Text on gold backgrounds: always `color: #1a1300` (dark amber-black).  
Active/pressed state: `#e6ad00` (one stop darker on the gold scale).

### Secondary / Utility Actions
- `.primary-btn` — Share, Sync, Confirm sheets → Action Blue (`#2196F3`)
- Navigation tab active state → `--gold`
- Destructive: `.primary-btn.danger` → `--red`

### Header Icon Buttons (`.icon-btn`)
Home, help (?), target, sync — these are navigation affordances, not brand CTAs.
- Color: `--label` (white `#e0e0e0` in dark, dark `#212121` in light)
- Background: `rgba(120,120,128,0.20)` — neutral pill, consistent both modes
- Do NOT use blue here — icon-only nav buttons read as chrome, not actions

### Cards & Elevation
- Borders over shadows: `1px solid var(--hairline)` on card faces
- No heavy drop shadows — mechanical feel
- Modal/sheet backdrop: `blur(20px) saturate(180%)` + `var(--modal-dim)`

### PR Card (share canvas)
- Gold gradient background (`#FFC107 → #FF8F00`)
- Dark text (`#1a1300`) for headline weight and tag
- `IRONVOICE · NEW PR` badge at top-left corner

---

## Typography

- **Font stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif`
- **Root size:** `17px` (bumped from browser default for gym-floor legibility)
- **Metric values:** `font-variant-numeric: tabular-nums` to prevent layout shift
- **Bold weights** for primary data (volume, set count, PRs)
- No custom web fonts (CSP + offline-first constraint)

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use `--gold-grad` for the mic and workout CTAs | Put white text on a `#FFC107` gold button (fails contrast) |
| Use `--blue` / `.primary-btn` for Share, Sync | Use blue for "Add set" or Start Workout (those are gold) |
| Dark text (`#1a1300`) on all gold surfaces | Mix orange and gold as if they're interchangeable |
| Keep muscle colors at their specified hex values | Desaturate muscle colors to "match" the gold theme |
| Use `--red` for End Workout and destructive confirms | Use red as a general "important" color |
| Keep `--green` (`#00E676`) for Ready / success states | Use the old iOS green (`#30d158`) — it's replaced |
| Use `--heading-color` for h1, h2 (gold dark / label light) | Hardcode gold onto headings — light mode won't override |

---

## Version history

| Version | Change |
|---------|--------|
| v9.38   | Full Iron Velocity implementation: dark bg `#121212`, light bg `#faf7f2` (warm cream), `--heading-color` token (gold dark / label light), h1 + screen h2 + modal h2 → gold in dark, active tab bar → gold, week-strip selected day → gold, sheet Done → gold, mic FAB → gold-grad, session card → gold tint + all labels gold, REST timer label → gold, workout CTAs → gold, icon-btn → `--label`. |
