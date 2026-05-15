// ============================================================================
// IronVoice Pro — version manifest (single source of truth)
//
// Loaded by index.html via <script src="version.js"> AND by sw.js via
// importScripts('./version.js'). Both contexts read APP_VERSION from `self`.
//
// Bumping rules:
//   • MAJOR (7 → 8)   — significant feature, breaking data change, or visible
//                        UX overhaul. Coordinate with testers.
//   • MINOR (.0 → .1) — every push to main that ships a user-visible change
//                        (bug fix, copy tweak, CSS adjustment, small feature).
//                        If you push, bump this. That's the contract.
//
// Bumping APP_VERSION here propagates automatically to:
//   1. The Profile-screen footer ("IronVoice Pro · v7.1 · 2026-05-05")
//   2. CACHE_VERSION in sw.js, which forces every device to re-download the
//      app shell on next visit. Forget to bump = users keep stale cache.
//
// APP_BUILD_DATE is the date this version was finalized (YYYY-MM-DD, local).
// Update it together with APP_VERSION.
// ============================================================================

self.APP_VERSION = '9.47';
self.APP_BUILD_DATE = '2026-05-15';
