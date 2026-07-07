# How to ship this design to GitHub with Claude Code on the web

This folder is a **design handoff bundle**. Follow these steps to turn it into a
pull request on `nickeisan19/ironvoice`.

## What's in this bundle
- `README.md` — the full design spec (tokens, per-screen breakdown, the 4 new
  behaviors, storage keys). **The written source of truth.**
- `index.dc.html` — the working prototype. Every exact value lives here as inline
  styles; the logic (`class Component`, search `renderVals`) has the real parsing,
  PR detection, timers, and new behaviors. **The code source of truth.**
- `index.standalone.html` — a **flat, self-contained** version of the prototype.
  Opens in any browser with no dependencies. This is the **visual reference** to
  render and diff against. (Do not ship this file as-is unless you chose Route B
  below — it embeds a rendering runtime.)
- `screenshots/` — one PNG per screen, for visual comparison.

---

## Step 1 — Put this bundle into the GitHub repo
Claude Code on the web can only see files that are **in the repo**. It cannot reach
into the design tool. So the bundle must land in GitHub first.

Pick one:
- **Git (recommended):**
  ```bash
  git clone https://github.com/nickeisan19/ironvoice.git
  cd ironvoice
  git checkout -b design-update
  mkdir -p design_handoff
  # copy the downloaded folder's contents into design_handoff/
  git add design_handoff
  git commit -m "Add IronVoice redesign handoff bundle"
  git push -u origin design-update
  ```
- **GitHub web upload:** open the repo → `Add file` → `Upload files` → drag this
  folder in → commit to a new branch.

## Step 2 — Open the repo in Claude Code on the web
- Go to Claude Code on the web and connect / select `nickeisan19/ironvoice`.
- Choose the branch you pushed the bundle to (`design-update`).
- It checks the repo out into a cloud sandbox.

## Step 3 — Give it the task
Paste a prompt like this (choose Route A or B):

### Route A — Recreate in the existing codebase (cleaner PR)
> Read `design_handoff/README.md`, `design_handoff/index.dc.html`, and the
> screenshots. These specify an updated IronVoice design. Implement it in this
> repo's existing code — `index.html`, `app.js`, `style.css` — reusing the tokens
> and patterns already there. Port the EXACT values (colors, radii, spacing,
> easing, copy) and the EXACT logic from `index.dc.html` — do not reinterpret or
> "improve" them. Where a repo convention conflicts with a design value, keep the
> design value. When done, open `design_handoff/index.standalone.html` in a
> browser, render your build beside each screenshot in `design_handoff/screenshots/`,
> and iterate until they match. Then open a pull request.

### Route B — Ship the standalone build (near-zero deviation)
> Replace the app's front-end with `design_handoff/index.standalone.html`,
> integrating it into the repo's serving setup and wiring its logic to the real
> storage/sync layer. Keep the design byte-for-byte. Open a pull request.

## Step 4 — Review the pull request
Claude Code works on a branch in its sandbox and opens a **PR** back to GitHub.
Open the PR, read the diff, request changes in the same session if needed, then
merge.

---

## What "100% match, no deviations" realistically means
- **Route A** = a rebuild. Expect ~95%+ with the verification loop above; the last
  few % come from you reviewing the PR against the screenshots. A written spec can
  never fully guarantee zero drift.
- **Route B** = the design *is* the artifact, so parity is essentially exact.
- **One unavoidable limit either way:** the brand uses the system font stack
  (SF Pro on Apple, Segoe UI / system-ui elsewhere), so text renders slightly
  differently across devices. That's baked into the brand, not a bug.
