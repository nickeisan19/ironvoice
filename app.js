// ============================================================================
// IronVoice Pro — app.js  (Enhancements 1-17, except #13 Apple Watch)
// ============================================================================

// ----- Library with muscle groups -----
// Names preserved for backward compat with existing journals/templates.
// "dip" stays in arms (default behavior); "tricep dip" / "chest dip" both fold in via synonyms.
// Synonyms favored: gym-floor names (BSS, RDL, OHP), brand-agnostic equipment ("machine X").
const exerciseLibrary = [
    // CHEST
    { name: "bench press",            muscle: "chest", synonyms: ["bench", "barbell bench", "flat bench", "flat barbell bench", "bp"] },
    { name: "incline press",          muscle: "chest", synonyms: ["incline bench", "incline bench press", "incline barbell"] },
    { name: "decline bench press",    muscle: "chest", synonyms: ["decline bench", "decline press"] },
    { name: "dumbbell bench press",   muscle: "chest", synonyms: ["db bench", "dumbbell press", "flat dumbbell press"] },
    { name: "incline dumbbell press", muscle: "chest", synonyms: ["incline db press", "incline dumbbell bench"] },
    { name: "decline dumbbell press", muscle: "chest", synonyms: ["decline db press"] },
    { name: "machine chest press",    muscle: "chest", synonyms: ["chest press machine", "hammer chest press"] },
    { name: "chest fly",              muscle: "chest", synonyms: ["dumbbell fly", "db fly", "flys", "pec fly", "flat fly"] },
    { name: "incline fly",            muscle: "chest", synonyms: ["incline dumbbell fly", "incline db fly"] },
    { name: "cable crossover",        muscle: "chest", synonyms: ["cable fly", "crossover", "cable cross"] },
    { name: "pec deck",               muscle: "chest", synonyms: ["pec dec", "machine fly", "butterfly"] },
    { name: "push up",                muscle: "chest", synonyms: ["push ups", "pushup", "press up"] },
    { name: "floor press",            muscle: "chest", synonyms: ["floor bench"] },
    { name: "landmine press",         muscle: "chest", synonyms: ["landmine"] },
    { name: "smith machine bench",    muscle: "chest", synonyms: ["smith bench"] },

    // BACK
    { name: "deadlift",               muscle: "back", synonyms: ["deads", "deadlifts", "conventional deadlift", "dl"] },
    { name: "sumo deadlift",          muscle: "back", synonyms: ["sumo dl", "sumo"] },
    { name: "romanian deadlift",      muscle: "back", synonyms: ["rdl", "rdls", "romanian dl"] },
    { name: "stiff leg deadlift",     muscle: "back", synonyms: ["sldl", "stiff legged deadlift", "straight leg deadlift"] },
    { name: "trap bar deadlift",      muscle: "back", synonyms: ["hex bar deadlift", "trap bar", "hex bar"] },
    { name: "rack pull",              muscle: "back", synonyms: ["rack pulls", "block pull"] },
    { name: "good morning",           muscle: "back", synonyms: ["good mornings"] },
    { name: "pull up",                muscle: "back", synonyms: ["pull ups", "pullups", "pullup"] },
    { name: "chin up",                muscle: "back", synonyms: ["chin ups", "chinups", "chinup"] },
    { name: "lat pulldown",           muscle: "back", synonyms: ["lat pull", "pulldowns", "pulldown", "wide pulldown"] },
    { name: "close grip pulldown",    muscle: "back", synonyms: ["close grip lat pulldown", "narrow pulldown"] },
    { name: "bent over row",          muscle: "back", synonyms: ["barbell row", "bb row", "bent row"] },
    { name: "pendlay row",            muscle: "back", synonyms: ["pendlay"] },
    { name: "t bar row",              muscle: "back", synonyms: ["t-bar row", "tbar row", "t bar"] },
    { name: "seated cable row",       muscle: "back", synonyms: ["cable row", "seated row", "low row"] },
    { name: "one arm dumbbell row",   muscle: "back", synonyms: ["one arm row", "single arm row", "single arm dumbbell row", "dumbbell row", "db row"] },
    { name: "chest supported row",    muscle: "back", synonyms: ["chest-supported row", "incline row"] },
    { name: "meadows row",            muscle: "back", synonyms: [] },
    { name: "inverted row",           muscle: "back", synonyms: ["bodyweight row", "ring row"] },
    { name: "face pull",              muscle: "back", synonyms: ["face pulls", "rope face pull"] },
    { name: "shrug",                  muscle: "back", synonyms: ["shrugs", "barbell shrug", "dumbbell shrug", "trap shrug"] },
    { name: "back extension",         muscle: "back", synonyms: ["hyperextension", "hyper", "45 degree extension"] },
    { name: "power clean",            muscle: "back", synonyms: ["clean", "power cleans"] },
    { name: "snatch",                 muscle: "back", synonyms: ["power snatch", "snatches"] },

    // LEGS
    { name: "back squat",             muscle: "legs", synonyms: ["squat", "squats", "barbell squat", "high bar squat", "low bar squat"] },
    { name: "front squat",            muscle: "legs", synonyms: ["front squats"] },
    { name: "goblet squat",           muscle: "legs", synonyms: ["goblet"] },
    { name: "box squat",              muscle: "legs", synonyms: ["box squats"] },
    { name: "hack squat",             muscle: "legs", synonyms: ["machine hack squat"] },
    { name: "smith machine squat",    muscle: "legs", synonyms: ["smith squat"] },
    { name: "sumo squat",             muscle: "legs", synonyms: ["sumo squats"] },
    { name: "bulgarian split squat",  muscle: "legs", synonyms: ["bss", "bulgarians", "split squat", "rear foot elevated split squat", "rfess"] },
    { name: "leg press",              muscle: "legs", synonyms: ["legpress", "45 leg press"] },
    { name: "leg extension",          muscle: "legs", synonyms: ["quad extension", "leg ext"] },
    { name: "leg curl",               muscle: "legs", synonyms: ["hamstring curl", "lying leg curl", "seated leg curl"] },
    { name: "lunges",                 muscle: "legs", synonyms: ["lunge", "walking lunge", "reverse lunge", "stationary lunge"] },
    { name: "step up",                muscle: "legs", synonyms: ["step ups", "stepup"] },
    { name: "hip thrust",             muscle: "legs", synonyms: ["hip thrusts", "barbell hip thrust"] },
    { name: "glute bridge",           muscle: "legs", synonyms: ["bridge", "glute bridges"] },
    { name: "calf raise",             muscle: "legs", synonyms: ["calves", "standing calf raise", "seated calf raise", "calf"] },
    { name: "nordic curl",            muscle: "legs", synonyms: ["nordic", "nordic ham curl", "natural glute ham raise"] },
    { name: "glute kickback",         muscle: "legs", synonyms: ["cable kickback", "donkey kick"] },
    { name: "hip abduction",          muscle: "legs", synonyms: ["abductor", "abductor machine", "hip abductor"] },
    { name: "hip adduction",          muscle: "legs", synonyms: ["adductor", "adductor machine", "hip adductor"] },
    { name: "single leg rdl",         muscle: "legs", synonyms: ["single leg deadlift", "single leg romanian deadlift"] },
    { name: "thruster",               muscle: "legs", synonyms: ["thrusters"] },

    // SHOULDERS
    { name: "overhead press",         muscle: "shoulders", synonyms: ["ohp", "military press", "shoulder press", "standing press", "barbell overhead press"] },
    { name: "seated overhead press",  muscle: "shoulders", synonyms: ["seated press", "seated military"] },
    { name: "dumbbell shoulder press",muscle: "shoulders", synonyms: ["db shoulder press", "seated dumbbell press", "db press"] },
    { name: "arnold press",           muscle: "shoulders", synonyms: ["arnolds"] },
    { name: "machine shoulder press", muscle: "shoulders", synonyms: ["machine press", "smith shoulder press"] },
    { name: "lateral raise",          muscle: "shoulders", synonyms: ["side raise", "side raises", "laterals", "lateral raises", "db lateral"] },
    { name: "cable lateral raise",    muscle: "shoulders", synonyms: ["cable lateral", "cable side raise"] },
    { name: "front raise",            muscle: "shoulders", synonyms: ["front raises", "front delt raise"] },
    { name: "rear delt fly",          muscle: "shoulders", synonyms: ["reverse fly", "rear fly", "rear delt", "bent over fly", "rear delt machine"] },
    { name: "upright row",            muscle: "shoulders", synonyms: ["upright rows"] },
    { name: "push press",             muscle: "shoulders", synonyms: ["push presses"] },

    // ARMS
    { name: "dip",                    muscle: "arms", synonyms: ["dips", "tricep dips", "tricep dip", "chest dip", "parallel bar dip", "bench dip"] },
    { name: "bicep curl",             muscle: "arms", synonyms: ["barbell curl", "bb curl", "curl", "curls", "biceps curl"] },
    { name: "dumbbell curl",          muscle: "arms", synonyms: ["db curl", "dumbbell biceps curl"] },
    { name: "hammer curl",            muscle: "arms", synonyms: ["hammer curls", "hammers"] },
    { name: "preacher curl",          muscle: "arms", synonyms: ["preacher", "preachers"] },
    { name: "concentration curl",     muscle: "arms", synonyms: ["concentration"] },
    { name: "cable curl",             muscle: "arms", synonyms: ["rope curl", "cable bicep curl"] },
    { name: "incline dumbbell curl",  muscle: "arms", synonyms: ["incline curl", "incline db curl"] },
    { name: "spider curl",            muscle: "arms", synonyms: ["spider"] },
    { name: "ez bar curl",            muscle: "arms", synonyms: ["ez curl"] },
    { name: "reverse curl",           muscle: "arms", synonyms: ["reverse grip curl"] },
    { name: "zottman curl",           muscle: "arms", synonyms: ["zottman"] },
    { name: "tricep pushdown",        muscle: "arms", synonyms: ["pushdown", "rope pushdown", "cable pushdown", "tricep pressdown"] },
    { name: "skull crusher",          muscle: "arms", synonyms: ["skullcrusher", "lying tricep extension", "lying triceps extension", "french press"] },
    { name: "tricep extension",       muscle: "arms", synonyms: ["overhead tricep extension", "overhead extension", "triceps extension"] },
    { name: "close grip bench press", muscle: "arms", synonyms: ["close grip bench", "cgbp"] },
    { name: "tricep kickback",        muscle: "arms", synonyms: ["tricep kickbacks", "dumbbell kickback"] },
    { name: "jm press",               muscle: "arms", synonyms: ["jm"] },
    { name: "wrist curl",             muscle: "arms", synonyms: ["forearm curl", "wrist curls"] },

    // CORE
    { name: "plank",                  muscle: "core", synonyms: ["planks", "front plank"] },
    { name: "side plank",             muscle: "core", synonyms: ["side planks"] },
    { name: "crunch",                 muscle: "core", synonyms: ["crunches", "ab crunch"] },
    { name: "sit up",                 muscle: "core", synonyms: ["sit ups", "situp", "situps"] },
    { name: "decline sit up",         muscle: "core", synonyms: ["decline situp"] },
    { name: "russian twist",          muscle: "core", synonyms: ["russian twists"] },
    { name: "hanging leg raise",      muscle: "core", synonyms: ["leg raise", "hanging knee raise", "knee raise", "leg raises"] },
    { name: "cable crunch",           muscle: "core", synonyms: ["rope crunch", "kneeling cable crunch"] },
    { name: "ab wheel rollout",       muscle: "core", synonyms: ["ab wheel", "rollout", "ab roller"] },
    { name: "mountain climber",       muscle: "core", synonyms: ["mountain climbers"] },
    { name: "bicycle crunch",         muscle: "core", synonyms: ["bicycle crunches", "bicycles"] },
    { name: "v up",                   muscle: "core", synonyms: ["v ups", "v-up", "vup"] },
    { name: "wood chop",              muscle: "core", synonyms: ["woodchopper", "cable woodchop", "chop"] },
    { name: "pallof press",           muscle: "core", synonyms: ["pallof"] },
    { name: "dead bug",               muscle: "core", synonyms: ["deadbug"] },
    { name: "bird dog",               muscle: "core", synonyms: ["birddog"] },
    { name: "hollow hold",            muscle: "core", synonyms: ["hollow body"] },
    { name: "dragon flag",            muscle: "core", synonyms: ["dragon flags"] },
    { name: "l sit",                  muscle: "core", synonyms: ["l-sit"] },
];

const muscleColor = {
    chest: 'var(--m-chest)',
    back: 'var(--m-back)',
    legs: 'var(--m-legs)',
    shoulders: 'var(--m-shoulders)',
    arms: 'var(--m-arms)',
    core: 'var(--m-core)',
};

const MUSCLES = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

const muscleOf = name => exerciseLibrary.find(e => e.name === name)?.muscle ?? 'arms';

// Sort longest-first so "incline press" wins over "incline".
// Mutated (not reassigned) by rebuildMatchOrder() when custom exercises load.
const matchOrder = [];
function rebuildMatchOrder() {
    const next = exerciseLibrary
        .flatMap(ex => [{ name: ex.name, term: ex.name }, ...ex.synonyms.map(s => ({ name: ex.name, term: s }))])
        .sort((a, b) => b.term.length - a.term.length);
    matchOrder.length = 0;
    matchOrder.push(...next);
}
rebuildMatchOrder();

const DB_NAME = "IronVoiceDB";
const DB_VERSION = 6;

// ----- state -----
let db;
let selectedExercise = "";
let userProfile = JSON.parse(localStorage.getItem('ironUser') || 'null');
let recognition = null;
let isListening = false;

// ---------------------------------------------------------------------------
// Backend endpoint
//
// The frontend lives on Cloudflare Pages, the backend is a separate Worker.
// Cross-origin fetches require the absolute URL. To migrate to a different
// backend (custom domain, second region, etc.), change this single constant.
//
// CSP must include this origin in connect-src — see index.html.
// ---------------------------------------------------------------------------
const API_URL = 'https://ironvoice-api.nickeisan19.workers.dev';

let activeTemplate = null;
let editingTemplate = null;
let restDuration = parseInt(localStorage.getItem('ironRest') || '90', 10);
let restTimerHandle = null;
let restCompleteTimeout = null;
let theme = localStorage.getItem('ironTheme') || 'dark';
let workoutMode = localStorage.getItem('ironWorkoutMode') === 'on';
let serverSyncedAt = parseInt(localStorage.getItem('ironServerSyncedAt') || '0', 10);
let editingCustomExercise = null;
let voiceURI = localStorage.getItem('ironVoiceURI') || '';
// v6: workout sessions
let activeSession = null;        // current in-progress session, or null
let _sessionTickerTimer = null;  // setInterval handle for live time updates

// Screen Wake Lock — held only while a workout session is active so the
// phone doesn't dim/lock between sets when set down on a bench. Browser
// auto-releases on tab hide; the visibilitychange handler re-acquires
// on return. iOS Safari ≥16.4, Chrome/Edge ≥84. Older browsers no-op.
let _screenWakeLock = null;
async function acquireScreenWakeLock() {
    if (!('wakeLock' in navigator)) return;
    if (_screenWakeLock) return;
    try {
        _screenWakeLock = await navigator.wakeLock.request('screen');
        _screenWakeLock.addEventListener('release', () => { _screenWakeLock = null; });
    } catch (_) {
        _screenWakeLock = null;
    }
}
async function releaseScreenWakeLock() {
    if (!_screenWakeLock) return;
    const lock = _screenWakeLock;
    _screenWakeLock = null;
    try { await lock.release(); } catch (_) {}
}

// Workout-screen clock — H:MM AM/PM, scoped visually to the Workout
// screen via #workout-clock (every other screen hides the section).
// Aligns to the next minute boundary so updates land at HH:MM:00.
function updateWorkoutClock() {
    const el = document.getElementById('workout-clock');
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
function startWorkoutClockTick() {
    updateWorkoutClock();
    const msToNextMinute = 60000 - (Date.now() % 60000);
    setTimeout(() => {
        updateWorkoutClock();
        setInterval(updateWorkoutClock, 60000);
    }, msToNextMinute);
}
// v6: PR screen tab
let prTab = 'weight';            // 'weight' | 'weight-reps'
// v6: history screen state
let historyWeekOffset = 0;       // 0 = current week, -1 = last week, etc.
let historySelectedDate = null;  // ISO date string of currently selected day
let voiceRate = parseFloat(localStorage.getItem('ironVoiceRate') || '1.05');
let lastSyncMeta = JSON.parse(localStorage.getItem('ironSyncMeta') || 'null');
let pendingSWUpdate = null;
let lastSyncFailed = false;
let currentExerciseSheet = null; // data for the currently open exercise modal
// v8: auto-sync — track whether local data has changed since last successful sync
let hasUnsyncedChanges = localStorage.getItem('ironHasUnsynced') === '1';

// ----- helpers -----
const $ = id => document.getElementById(id);

// v9.21 — Select the entire contents of a freshly focused number input so
// the prefilled value is replaced (not appended to) when the user types.
// iOS Safari's <input type="number"> sometimes ignores .select() silently;
// setSelectionRange covers that gap. Both calls are try-wrapped so a quirk
// in either path can't break the focus flow.
function selectInputContents(el) {
    if (!el || el.value === '' || el.value == null) return;
    try { el.select(); } catch {}
    try { el.setSelectionRange(0, String(el.value).length); } catch {}
}

const titleCase = s => s.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const isoForOffset = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
// Whole-day delta between two YYYY-MM-DD strings. Positive when b is later
// than a. Used for "last workout: Nd ago"-style copy. Local-time anchored.
const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
const formatDate = iso => {
    if (iso === todayISO()) return "Today";
    if (iso === isoForOffset(1)) return "Yesterday";
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};
const haptic = (pattern = 10) => { try { navigator.vibrate?.(pattern); } catch {} };
const setStatus = (text, cls = '') => { const el = $('status'); el.textContent = text; el.className = cls; };

// ----- Modal sheet a11y -----
// One observer per .overlay handles three things every sheet needs:
//   1. aria-hidden mirrors the .active class so SR navigation skips the
//      sheet when it's not on screen.
//   2. Focus is captured when the sheet opens and restored to the previously
//      focused element on close — without this, keyboard users land back at
//      the top of the page each time.
//   3. Tab is trapped inside the sheet, and Escape triggers the sheet's
//      first close/cancel/dismiss button (matching by data-action prefix).
//      Profile sheet has no close action, so Escape is a no-op there —
//      intentional, since the welcome flow is required.
function setupOverlayA11y() {
    const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    document.querySelectorAll('.overlay').forEach(overlay => {
        const dialog = overlay.querySelector('[role="dialog"]');
        if (!dialog) return;
        // Make the dialog itself programmatically focusable so we can
        // park focus on it without opening the soft keyboard.
        if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');

        let savedFocus = null;

        const findCloseAction = () => dialog.querySelector(
            '[data-action^="close"], [data-action^="cancel"], [data-action="dismissInstallHint"]'
        );

        const onKey = (e) => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') {
                const closeBtn = findCloseAction();
                if (closeBtn) { e.preventDefault(); closeBtn.click(); }
                return;
            }
            if (e.key !== 'Tab') return;
            const visible = Array.from(dialog.querySelectorAll(FOCUSABLES))
                .filter(el => el.offsetParent !== null);
            if (!visible.length) return;
            const first = visible[0];
            const last = visible[visible.length - 1];
            if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        const observer = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.attributeName !== 'class') continue;
                const isActive = overlay.classList.contains('active');
                if (isActive) {
                    overlay.setAttribute('aria-hidden', 'false');
                    savedFocus = document.activeElement;
                    document.addEventListener('keydown', onKey);
                    // Park focus on the dialog itself (tabindex=-1). Other
                    // handlers may immediately steal focus to an input —
                    // that's fine and intended for flows like the welcome
                    // sheet which should land in the first-name field.
                    setTimeout(() => {
                        if (!overlay.contains(document.activeElement)) {
                            try { dialog.focus({ preventScroll: true }); } catch (_) {}
                        }
                    }, 0);
                } else {
                    overlay.setAttribute('aria-hidden', 'true');
                    document.removeEventListener('keydown', onKey);
                    if (savedFocus && document.body.contains(savedFocus) && typeof savedFocus.focus === 'function') {
                        try { savedFocus.focus({ preventScroll: true }); } catch (_) {}
                    }
                    savedFocus = null;
                }
            }
        });
        observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    });
}

// ----- Tablist helper -----
// Mirrors `.active` class and `aria-selected` (when role=tab is present)
// across every direct-child <button> of a segmented container. Called by
// every segmented click handler and the various openSettings sync paths.
// `match` receives the button element; truthy means "this is the active tab".
function setSegmentedActive(container, match) {
    if (!container) return;
    container.querySelectorAll('button').forEach(b => {
        const on = !!match(b);
        b.classList.toggle('active', on);
        if (b.getAttribute('role') === 'tab') b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
}
const getToken = () => localStorage.getItem('ironToken') || '';
const epley = (w, r) => w * (1 + r / 30);
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

// ============================================================================
// Boot
// ============================================================================

window.addEventListener('load', () => {
    applyTheme(theme);  // before anything paints
    renderVersionFooter();
    // Wire overlay a11y BEFORE we open any sheet, so first-run users land
    // inside a properly trapped welcome dialog.
    setupOverlayA11y();
    if (!userProfile?.first) {
        $('profile-overlay').classList.add('active');
    } else {
        $('user-display').textContent = `Hi, ${userProfile.first}`;
    }
    initDB();
    initSpeech();
    initScroll();
    initOutsideClick();
    initServiceWorker();
    initSegmented();
    initOnlineHandler();
    initSWMessages();
    initJournalDelegation();
    initVoicePicker();
    initActionDispatcher();
    maybeShowInstallHint();
    handleShortcutAction();
    showScreen('home');   // mark Home tab active on first load
    startWorkoutClockTick();
    acknowledgeVersionLanding();
    // v8: auto-sync triggers
    document.addEventListener('visibilitychange', onVisibilityChange);
    // Boot-time catch-up: if the page was killed before a previous sync
    // completed, the unsynced flag is still set in localStorage. Fire one
    // best-effort sync now. Delay 1.5s so initial render is smooth.
    setTimeout(() => autoSync('boot-catchup'), 1500);
});

function applyTheme(next) {
    theme = next;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ironTheme', theme);
    updateThemeColor();
}

// Pulled from version.js (loaded as a separate script before app.js).
// If version.js ever fails to load we still want the footer to render
// gracefully rather than show "undefined".
function renderVersionFooter() {
    const el = document.getElementById('app-version-footer');
    if (!el) return;
    const v = self.APP_VERSION;
    const d = self.APP_BUILD_DATE;
    el.textContent = (v && d) ? `IronVoice Pro · v${v} · ${d}`
                   : v       ? `IronVoice Pro · v${v}`
                             : 'IronVoice Pro';
}

function updateThemeColor() {
    const isLight = theme === 'light' ||
        (theme === 'auto' && window.matchMedia?.('(prefers-color-scheme: light)').matches);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isLight ? '#f2f2f7' : '#000000';
}

// Track system theme changes so the meta tag stays in sync while in auto mode.
window.matchMedia?.('(prefers-color-scheme: light)').addEventListener?.('change', () => {
    if (theme === 'auto') updateThemeColor();
});

function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('sw.js').then(reg => {
        // v9.2 — Cold-start auto-apply. If a previous tab detected an update
        // but the user closed the app before tapping Reload, the new worker
        // is still sitting in `waiting` when we open today. Apply it
        // immediately on launch so reopening the app is "always the latest
        // version" without requiring a visible prompt. The controllerchange
        // handler in initSWMessages() then reloads the page seamlessly.
        // Guard on .controller so the very first install (no prior version)
        // doesn't trigger a redundant reload.
        if (reg.waiting && navigator.serviceWorker.controller) {
            // v9.10 — drop the veil before the swap so the controllerchange
            // reload doesn't sandwich a paint of the stale shell between the
            // boot render and the fresh shell render.
            document.body.classList.add('app-updating');
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            return;
        }

        // New SW finished installing while the app is open. We split into
        // two paths so the common "user just opened the app for the first
        // time post-release" case is invisible:
        //
        //   • Safe to auto-apply  → user has no active workout session and
        //                            is sitting on Home. Apply immediately;
        //                            the controllerchange handler in
        //                            initSWMessages() reloads the page.
        //   • Not safe            → user is mid-session OR on a screen
        //                            where a reload would lose context
        //                            (Workout, History detail, etc.).
        //                            Surface the banner and let them
        //                            choose when to reload.
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state !== 'installed') return;
                if (!navigator.serviceWorker.controller) return;
                pendingSWUpdate = newWorker;
                if (!activeSession && currentScreen === 'home') {
                    applyUpdate();
                } else {
                    $('update-toast').classList.add('active');
                }
            });
        });
        // Periodic update check (every 30 min while open)
        setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
    }).catch(err => console.warn('SW register failed', err));
}

function initSWMessages() {
    if (!('serviceWorker' in navigator)) return;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!reloading) { reloading = true; location.reload(); }
    });
    navigator.serviceWorker.addEventListener('message', e => {
        if (e.data?.type === 'SYNC_REPLAYED') {
            setStatus('Synced (queued)', 'synced');
            lastSyncFailed = false;
            renderSyncMeta();
            setTimeout(() => setStatus('Ready'), 2500);
        }
    });
}

function applyUpdate() {
    if (!pendingSWUpdate) return;
    // v9.10 — same veil treatment as the cold-start path. Hides the shell
    // for the ~50–300ms between SKIP_WAITING and the controllerchange
    // reload so users don't see a stale paint on the way out.
    document.body.classList.add('app-updating');
    pendingSWUpdate.postMessage({ type: 'SKIP_WAITING' });
    $('update-toast').classList.remove('active');
}

// v9.10 — Most updates land via the auto-apply / cold-start swap, which is
// invisible by design. Without a post-reload signal a tester can't tell
// whether the swap happened — the only proof is the Profile footer, which
// nobody looks at. Compare the persisted last-seen version with the
// running APP_VERSION on boot; if they differ, surface a one-shot snackbar
// so the version bump is acknowledged. First install (no prior key) is
// silent — there's nothing meaningful to celebrate yet.
function acknowledgeVersionLanding() {
    try {
        const KEY = 'ironLastSeenVersion';
        const current = self.APP_VERSION;
        if (!current) return;
        const previous = localStorage.getItem(KEY);
        if (previous && previous !== current) {
            // v9.32 — suppress the snackbar when a What's New sheet is
            // queued for this version. The sheet covers the same "you got
            // the update" message at higher fidelity; competing surfaces
            // would feel noisy.
            if (!WHATS_NEW[current]) {
                showSnackbar(`Updated to v${current}`, { duration: 3500 });
            }
        }
        localStorage.setItem(KEY, current);
    } catch (_) { /* localStorage unavailable — skip */ }
}

// v9.32 — What's New popup. Fires once per version bump on the first app
// launch after the new version lands. Content is sourced from the
// WHATS_NEW map below, keyed by version string; future versions add their
// own entry without touching this rendering code. First install is silent
// (the user already has everything); same-version boots are silent (the
// user has already acknowledged); a version without an entry quietly
// updates the key and lets the v9.10 snackbar carry the signal instead.
const WHATS_NEW = {
    '9.32': {
        items: [
            'PREV column under every set — see last time at a glance.',
            'Warmup support — say "warmup bench 135 for 8" or toggle in the set sheet. Excluded from PRs and volume.',
            'Per-exercise menu (⋮) — swap exercise, mark all as warmup, or delete all sets.',
            'Tap to collapse exercise groups when the list gets long.',
            'Rotation-aware order — the next-up exercise stays on top, the just-logged one drops to the bottom.',
            'Row-form pill layout — SET / PREV / LBS × REPS columns.',
            'Search ranks your most-used exercises first; manual entry only expands when you pick one.',
        ],
    },
    '9.35': {
        items: [
            'History rollups got room to breathe — Volume + Sets lead at a larger size, with Total / Workout / Rest below.',
            'Cleaner week strip — bolder day names, the per-day volume bar is gone.',
            'Per-session card matches the day & week rollup layout.',
        ],
    },
};

function maybeShowWhatsNew() {
    try {
        const KEY = 'ironLastSeenWhatsNew';
        const current = self.APP_VERSION;
        const previous = localStorage.getItem(KEY);
        const content = WHATS_NEW[current];
        // First install — silent. Just write the key so we don't pop the
        // sheet later for a new user who already has everything.
        if (!previous) { localStorage.setItem(KEY, current); return; }
        if (previous === current) return;
        // No content defined for this version — quietly update the key so
        // the v9.10 snackbar (which is the fallback channel) is what
        // carries the upgrade signal for bug-fix releases.
        if (!content) { localStorage.setItem(KEY, current); return; }
        const list = $('whats-new-list');
        if (list) {
            list.innerHTML = content.items.map(t =>
                `<li>${escapeHtml(t)}</li>`
            ).join('');
        }
        $('whats-new-overlay')?.classList.add('active');
    } catch (_) { /* localStorage unavailable — skip */ }
}

function closeWhatsNew() {
    $('whats-new-overlay')?.classList.remove('active');
    try { localStorage.setItem('ironLastSeenWhatsNew', self.APP_VERSION); } catch (_) {}
}

function initOnlineHandler() {
    window.addEventListener('online', () => {
        if (lastSyncFailed) syncToNAS();
    });
}

function initScroll() {
    const header = $('app-header');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 8);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function initOutsideClick() {
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-container')) {
            $('ex-dropdown').classList.remove('active');
            $('ex-search')?.setAttribute('aria-expanded', 'false');
        }
    });
}

function initSegmented() {
    $('rest-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn) return;
        setSegmentedActive($('rest-segment'), b => b === btn);
        restDuration = parseInt(btn.dataset.val, 10);
        localStorage.setItem('ironRest', String(restDuration));
        haptic(8);
    });

    $('theme-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn) return;
        setSegmentedActive($('theme-segment'), b => b === btn);
        applyTheme(btn.dataset.val);
        haptic(8);
    });

    // Item 10: Workout mode (continuous voice)
    $('workout-mode-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn) return;
        setSegmentedActive($('workout-mode-segment'), b => b === btn);
        setWorkoutMode(btn.dataset.val === 'on');
        haptic(8);
    });

    // Item 13: Custom-exercise muscle picker
    $('custom-muscle-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn || !editingCustomExercise) return;
        setSegmentedActive($('custom-muscle-segment'), b => b === btn);
        editingCustomExercise.muscle = btn.dataset.val;
        haptic(8);
    });
}

// ============================================================================
// IndexedDB — v4 with templates, syncQueue, and forward-compat fields
// ============================================================================

function initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = e => {
        const upgradeDb = e.target.result;
        if (!upgradeDb.objectStoreNames.contains("workouts")) upgradeDb.createObjectStore("workouts", { keyPath: "id" });
        if (!upgradeDb.objectStoreNames.contains("prs")) upgradeDb.createObjectStore("prs", { keyPath: "exercise" });
        if (!upgradeDb.objectStoreNames.contains("templates")) upgradeDb.createObjectStore("templates", { keyPath: "id" });
        if (!upgradeDb.objectStoreNames.contains("syncQueue")) upgradeDb.createObjectStore("syncQueue", { keyPath: "id" });
        // Item 13: custom exercises (keyed by lowercase name)
        if (!upgradeDb.objectStoreNames.contains("customExercises")) upgradeDb.createObjectStore("customExercises", { keyPath: "name" });
        // v6: workout sessions
        if (!upgradeDb.objectStoreNames.contains("sessions")) upgradeDb.createObjectStore("sessions", { keyPath: "id" });
    };
    request.onerror = () => setStatus('DB error', 'error');
    request.onsuccess = async e => {
        db = e.target.result;
        await migrateData();
        await loadCustomExercisesIntoLibrary();   // item 13
        await garbageCollectTombstones();         // item 8
        await backfillHistoricalSessions();       // v6: estimate sessions from old timestamps
        await resumeOrPromptSession();            // v6: auto-resume / forgotten-session prompt
        // Item 2: ask for persistent storage so iOS Safari doesn't evict
        // history after 7 days of inactivity. Granted silently when
        // engagement signals are met; failure is fine.
        if (navigator.storage?.persist) {
            navigator.storage.persist().catch(() => {});
        }
        renderAll();
        // First-run voice tip — needs the store available.
        maybeShowVoiceTip();
        // v9.32 — What's New sheet for upgrades that have content defined.
        // Delayed so the home screen renders first and the sheet feels
        // like a follow-up to the app appearing, not an intercept on
        // launch. Sits ahead of the start-prompt so a returning user
        // sees the changelog before being asked about a new session.
        setTimeout(() => maybeShowWhatsNew(), 600);
        // v8: launch prompt — ask if the user wants to start a workout.
        // Delayed so the home screen renders first and the prompt feels
        // like a follow-up question, not an intercept on app launch.
        setTimeout(() => maybePromptStartOnLaunch(), 800);
    };
}

async function migrateData() {
    // Normalize template schema: exercises: [name] → [{name, ...}]
    const templates = await performDB('templates', 'getAll');
    for (const t of templates) {
        let dirty = false;
        if (Array.isArray(t.exercises) && t.exercises.length && typeof t.exercises[0] === 'string') {
            t.exercises = t.exercises.map(name => ({ name }));
            dirty = true;
        }
        if (dirty) await performDB('templates', 'put', t);
    }
    // Backfill modifiedAt on workouts (multi-device conflict scaffold)
    const workouts = await performDB('workouts', 'getAll');
    for (const w of workouts) {
        if (w.modifiedAt == null) {
            w.modifiedAt = w.id;
            await performDB('workouts', 'put', w);
        }
    }
}

function performDB(store, action, data = null) {
    return new Promise((resolve, reject) => {
        if (!db) return reject(new Error('DB not ready'));
        const mode = (action === 'get' || action === 'getAll' || action === 'searchLast') ? 'readonly' : 'readwrite';
        const tx = db.transaction([store], mode);
        const s = tx.objectStore(store);

        if (action === 'searchLast') {
            const req = s.openCursor(null, 'prev');
            req.onerror = () => reject(req.error);
            req.onsuccess = ev => {
                const cursor = ev.target.result;
                if (cursor) {
                    if (cursor.value.deleted) { cursor.continue(); return; }
                    if (!data || cursor.value.exercise === data) resolve(cursor.value);
                    else cursor.continue();
                } else resolve(null);
            };
            return;
        }

        const req = action === 'get' ? s.get(data)
                  : action === 'getAll' ? s.getAll()
                  : action === 'delete' ? s.delete(data)
                  : action === 'clear' ? s.clear()
                  : s.put(data);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
    });
}

const getActiveWorkouts = async () => (await performDB('workouts', 'getAll')).filter(w => !w.deleted);

// v9.31 — exercise-frequency cache for the search dropdown. Maps exercise
// canonical name → total non-deleted sets ever logged (warmups included —
// frequency measures "how often you touch this exercise," not "how hard").
// Used by filterExercises as the primary sort key so the user's go-to
// lifts bubble to the top of the list. Dirty flag avoids per-keystroke
// getAll calls; any write path that adds/removes/renames sets bumps the
// flag, and the next filterExercises rebuild picks up the new counts.
let _exerciseFrequency = new Map();
let _exerciseFrequencyDirty = true;

function markFrequencyDirty() { _exerciseFrequencyDirty = true; }

async function getExerciseFrequency() {
    if (_exerciseFrequencyDirty) {
        const all = await getActiveWorkouts();
        const m = new Map();
        for (const w of all) m.set(w.exercise, (m.get(w.exercise) || 0) + 1);
        _exerciseFrequency = m;
        _exerciseFrequencyDirty = false;
    }
    return _exerciseFrequency;
}
// Work sets only — warmups are excluded from every volume rollup, every PR
// computation, every coverage/trend signal. The split is intentional: pill
// rendering, set lists, and the "Set N of M" meta still see all sets (the
// user wants to see warmups in the journal), but every number that answers
// "how hard did I train?" reads work-only. See v9.26 for the schema field.
const getActiveWorkSets = async () => (await performDB('workouts', 'getAll')).filter(w => !w.deleted && !w.warmup);
const getActiveTemplates = async () => (await performDB('templates', 'getAll')).filter(t => !t.deleted);
const getActiveCustoms = async () => (await performDB('customExercises', 'getAll')).filter(c => !c.deleted);

// Item 13: merge custom exercises into the in-memory library, then rebuild
// the matchOrder so voice + search pick them up.
async function loadCustomExercisesIntoLibrary() {
    const customs = await getActiveCustoms();
    for (const c of customs) {
        const existing = exerciseLibrary.find(ex => ex.name === c.name);
        if (!existing) {
            exerciseLibrary.push({
                name: c.name,
                muscle: c.muscle || 'arms',
                synonyms: Array.isArray(c.synonyms) ? c.synonyms : [],
                custom: true,
            });
        } else if (existing.custom) {
            // keep muscle assignment in sync if user edited
            existing.muscle = c.muscle || existing.muscle;
        }
    }
    rebuildMatchOrder();
}

// Item 8: drop tombstones older than 90 days. Runs on boot and before every sync.
const TOMBSTONE_TTL_MS = 90 * 86400 * 1000;
async function garbageCollectTombstones() {
    const cutoff = Date.now() - TOMBSTONE_TTL_MS;
    let removed = 0;
    for (const store of ['workouts', 'templates', 'customExercises']) {
        const all = await performDB(store, 'getAll');
        for (const row of all) {
            if (!row.deleted) continue;
            const modAt = row.modifiedAt ?? row.id ?? 0;
            // For custom exercises (keyPath: name) the id field is the name.
            const key = row[store === 'customExercises' ? 'name' : 'id'];
            if (typeof modAt === 'number' && modAt < cutoff) {
                await performDB(store, 'delete', key);
                removed++;
            }
        }
    }
    return removed;
}

// ============================================================================
// Exercise search + template filter
// ============================================================================

function showExercises() {
    filterExercises();
    $('ex-dropdown').classList.add('active');
    $('ex-search')?.setAttribute('aria-expanded', 'true');
}

async function filterExercises() {
    const input = $('ex-search').value.toLowerCase();
    const dropdown = $('ex-dropdown');
    dropdown.innerHTML = "";

    // v9.30 — if the user clears the search input without ever picking
    // (or backspaces what was selected), collapse the detail block so we
    // don't leave the steppers visible with no exercise context. Without
    // this, after a save+clear-by-keyboard the section could re-inflate.
    if (!input) {
        selectedExercise = '';
        $('manual-entry')?.classList.remove('is-expanded');
    }

    // v8: when a workout is active, inject a "This workout" section at the
    // top with the exercises already logged in this session (most recent
    // first). Helps logging consecutive sets of the same lift without
    // re-typing. Only shows when search is empty so it doesn't interfere
    // with normal search behavior.
    if (activeSession && !input) {
        await renderSessionSearchSection(dropdown);
    }

    let pool = exerciseLibrary;
    if (activeTemplate) {
        const names = activeTemplate.exercises.map(e => e.name);
        pool = pool.filter(ex => names.includes(ex.name));
    }
    // v9.31 — sort by usage frequency DESC so the user's go-to lifts
    // bubble to the top of the list. Alphabetical is the tiebreaker so
    // exercises with zero history (or matching counts) stay deterministic.
    const freq = await getExerciseFrequency();
    const matches = pool.filter(ex =>
        !input || ex.name.includes(input) || ex.synonyms.some(s => s.includes(input))
    ).sort((a, b) => {
        const fa = freq.get(a.name) || 0;
        const fb = freq.get(b.name) || 0;
        if (fa !== fb) return fb - fa;
        return a.name.localeCompare(b.name);
    });

    if (!matches.length && dropdown.children.length === 0) {
        const div = document.createElement('div');
        div.style.color = 'var(--label-tertiary)';
        div.textContent = activeTemplate ? `No matches in "${activeTemplate.name}"` : 'No matches';
        dropdown.appendChild(div);
        return;
    }

    if (matches.length) {
        // If we already added a session header above, render an "All
        // exercises" divider before the full library so the two groups
        // are visually distinct.
        if (dropdown.children.length > 0) {
            const divider = document.createElement('div');
            divider.className = 'search-section-header';
            divider.textContent = 'All exercises';
            dropdown.appendChild(divider);
        }
        matches.forEach(ex => {
            const div = document.createElement('div');
            div.innerHTML = `<span class="muscle-tag" style="background:${muscleColor[ex.muscle]}"></span>${titleCase(ex.name)}`;
            div.onclick = () => selectExercise(ex.name);
            dropdown.appendChild(div);
        });
    }
}

// v8: render the "This workout" section at the top of the search dropdown.
// Walks sets in the active session, dedupes exercises preserving most-recent
// order, and renders one row per unique exercise.
async function renderSessionSearchSection(dropdown) {
    if (!activeSession) return;
    const setsInSession = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === activeSession.id && !w.deleted)
        .sort((a, b) => b.id - a.id);   // most recent first
    if (!setsInSession.length) return;

    // Dedupe by exercise name, preserving the order (most recent first)
    const seen = new Set();
    const exercisesInSession = [];
    for (const set of setsInSession) {
        if (seen.has(set.exercise)) continue;
        seen.add(set.exercise);
        exercisesInSession.push(set.exercise);
    }

    const header = document.createElement('div');
    header.className = 'search-section-header';
    header.textContent = 'This workout';
    dropdown.appendChild(header);

    for (const exName of exercisesInSession) {
        const lib = exerciseLibrary.find(ex => ex.name === exName);
        const muscle = lib?.muscle || 'core';
        const div = document.createElement('div');
        div.innerHTML = `<span class="muscle-tag" style="background:${muscleColor[muscle]}"></span>${titleCase(exName)}`;
        div.onclick = () => selectExercise(exName);
        dropdown.appendChild(div);
    }
}

async function selectExercise(name) {
    selectedExercise = name;
    $('ex-search').value = titleCase(name);
    $('ex-dropdown').classList.remove('active');
    $('ex-search')?.setAttribute('aria-expanded', 'false');

    // v9.30 — reveal the manual-entry detail (prev hint, steppers, Add)
    // once an exercise is chosen. Idle state shows only the search input.
    $('manual-entry')?.classList.add('is-expanded');

    const hint = $('manual-prev');
    if (hint) hint.textContent = '';

    // Active template targets are the user's explicit plan for this session
    // and win over history. If neither field is template-set, fall through
    // to the history prefill below.
    let templatePrefilled = false;
    if (activeTemplate) {
        const target = activeTemplate.exercises.find(e => e.name === name);
        if (target?.targetWeight) { $('manual-w').value = target.targetWeight; templatePrefilled = true; }
        if (target?.targetReps) { $('manual-r').value = target.targetReps; templatePrefilled = true; }
    }

    // First-time-in-this-workout prefill: pull the most recent non-deleted
    // set of this exercise (any session, ever) and seed Lbs/Reps so the
    // user has a sane starting point with zero typing. The hint is
    // explicit that it's the last set performed — not necessarily a max —
    // so the user doesn't read the prefill as a target.
    if (!templatePrefilled) {
        try {
            const prev = (await performDB('workouts', 'getAll'))
                .filter(w => !w.deleted && w.exercise === name)
                .sort((a, b) => b.id - a.id)[0] || null;
            if (prev) {
                $('manual-w').value = String(prev.weight);
                $('manual-r').value = String(prev.reps);
                if (hint) hint.textContent = `Last set: ${prev.weight} × ${prev.reps}`;
            } else if (hint) {
                hint.textContent = 'First time logging this exercise.';
            }
        } catch { /* DB error — skip the prefill, the user can still type */ }
    }

    $('manual-w').focus();
    haptic(8);
}

// ============================================================================
// Manual entry
// ============================================================================

async function handleManualEntry() {
    const w = parseFloat($('manual-w').value);
    const r = parseInt($('manual-r').value);
    if (!selectedExercise || isNaN(w) || isNaN(r) || w <= 0 || r <= 0) { haptic([20, 50, 20]); return; }
    const entry = buildEntry(selectedExercise, w, r);
    await saveAndSyncUI(entry);
    $('manual-w').value = '';
    $('manual-r').value = '';
    $('ex-search').value = '';
    const hint = $('manual-prev');
    if (hint) hint.textContent = '';
    selectedExercise = "";
    // v9.30 — collapse the detail block back to idle now that the set has
    // been saved. Reverse of selectExercise(). Voice and the per-group
    // "+ Add set" pill never expanded the section, so no-op for those.
    $('manual-entry')?.classList.remove('is-expanded');
    document.activeElement?.blur();
    haptic(15);
}

function buildEntry(exercise, weight, reps, { warmup = false } = {}) {
    const id = Date.now();
    return {
        id,
        exercise, weight, reps,
        oneRM: epley(weight, reps),
        date: todayISO(),
        modifiedAt: id,
        // v6: tag this set with the active session if any. Untagged sets
        // are fine (they pre-date sessions or were logged outside one).
        sessionId: activeSession?.id ?? null,
        // Scheduled rest after this set, captured at log time so later
        // preference changes don't corrupt rollups for older sets. 0 means
        // rest was Off. Used by the History rollups (Total / Workout / Rest)
        // to clamp each set's rest by min(scheduled, gap-to-next-set).
        restDurationMs: restDuration * 1000,
        // v9.26 — warmup flag. Warmups are journaled (visible as pills) but
        // excluded from every volume rollup, every PR comparison, every
        // coverage/trend signal. Absent on pre-v9.26 entries; falsy default
        // means existing data behaves exactly as before.
        warmup: !!warmup,
    };
}

async function saveAndSyncUI(entry) {
    try {
        // Auto-start a session if there isn't one — sessions are invisible
        // plumbing, not a feature to opt into. buildEntry resolved
        // sessionId synchronously before this call, so re-tag the entry
        // with the new session id once it exists. Silent so the set's own
        // haptic isn't doubled by the session-start pulse.
        if (!activeSession) {
            await startWorkoutSession({ silent: true });
            entry.sessionId = activeSession?.id ?? null;
        }
        await performDB('workouts', 'put', entry);
        markFrequencyDirty();
        const oldPR = await performDB('prs', 'get', entry.exercise);
        // Track max weight and max 1RM independently. The PR card branches
        // on prType to decide whether to lead with the weight ("first time
        // at 235") or the 1RM ("rep work pushed your estimated max"). When
        // both move in the same set, weight wins on the headline.
        // v9.26 — warmups can never be PRs. They're light prep work, not
        // peak lifts; counting them would mean a 95-lb warmup overwrites
        // a real 225 record the moment the user toggles the flag.
        const isWeightPR = !entry.warmup && (!oldPR || entry.weight > (oldPR.maxWeight ?? 0));
        const is1RMPR    = !entry.warmup && (!oldPR || entry.oneRM  > (oldPR.max1RM    ?? 0));
        const isNewPR    = isWeightPR || is1RMPR;
        if (isNewPR) {
            const prevMaxWeight     = oldPR?.maxWeight     ?? 0;
            const prevMaxWeightReps = oldPR?.maxWeightReps ?? 0;
            const prevMax1RM        = oldPR?.max1RM        ?? 0;
            const prevMax1RMWeight  = oldPR?.max1RMWeight  ?? 0;
            const prevMax1RMReps    = oldPR?.max1RMReps    ?? 0;
            await performDB('prs', 'put', {
                exercise:       entry.exercise,
                maxWeight:      isWeightPR ? entry.weight : prevMaxWeight,
                maxWeightReps:  isWeightPR ? entry.reps   : prevMaxWeightReps,
                max1RM:         is1RMPR    ? entry.oneRM  : prevMax1RM,
                max1RMWeight:   is1RMPR    ? entry.weight : prevMax1RMWeight,
                max1RMReps:     is1RMPR    ? entry.reps   : prevMax1RMReps,
                achievedAt:     entry.id,
                prType:         isWeightPR ? 'weight' : '1rm',
            });
        }
        markUnsynced();   // v8: flag for auto-sync triggers (background, end-of-workout)
        await updateUI(entry, isNewPR);
        await renderHistory();
        await renderFocus();
        await renderRecommendedNext();
        await renderStrain();
        await renderTemplateProgress();
        // v6: keep the live session card in sync if a session is active.
        await refreshSessionCard();
        // v9.18: refresh the suggested-queue chips so completed exercises
        // tick over from incomplete to done as the user logs sets.
        await renderSuggestedQueue();
        if (restDuration > 0) startRestTimer(restDuration);
    } catch (err) {
        console.error('Save failed:', err);
        setStatus('Save failed', 'error');
    }
}

// ============================================================================
// Speech (expanded vocabulary)
//
// Architecture:
//   normalizeSpokenNumbers(text)  — turn "two twenty-five" into "225"
//   parseIntent(text)             — pure parser, returns intent or null
//   executeIntent(intent)         — performs the side effects
//
// onresult walks each alternative until one parses, then dispatches once.
// Continuous "workout" mode keeps the recognizer open between sets.
// ============================================================================

// Item 6: spoken-number normalizer.
// Web Speech in Chrome routinely returns "two twenty five" instead of "225"
// for gym numbers. We pre-process spoken text into digits before regex
// extraction, ordered most-specific to least-specific so longer phrases win.
const NUM_WORDS = {
    zero: 0, oh: 0, o: 0,
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
    sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const N_ONES = 'one|two|three|four|five|six|seven|eight|nine';
const N_TEENS = 'ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen';
const N_TENS = 'twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety';

function normalizeSpokenNumbers(text) {
    let s = ' ' + text.toLowerCase().replace(/[^a-z0-9\s\-]/g, ' ') + ' ';

    // Pass 1: standard English with explicit "hundred"
    //   "two hundred [and] twenty-five" → "225"
    s = s.replace(new RegExp(`\\b(${N_ONES})\\s+hundred\\s+(?:and\\s+)?(${N_TENS})[\\s\\-]+(${N_ONES})\\b`, 'g'),
        (_, h, t, o) => String(NUM_WORDS[h] * 100 + NUM_WORDS[t] + NUM_WORDS[o]));
    s = s.replace(new RegExp(`\\b(${N_ONES})\\s+hundred\\s+(?:and\\s+)?(${N_TEENS})\\b`, 'g'),
        (_, h, te) => String(NUM_WORDS[h] * 100 + NUM_WORDS[te]));
    s = s.replace(new RegExp(`\\b(${N_ONES})\\s+hundred\\s+(?:and\\s+)?(${N_TENS})\\b`, 'g'),
        (_, h, t) => String(NUM_WORDS[h] * 100 + NUM_WORDS[t]));
    s = s.replace(new RegExp(`\\b(${N_ONES})\\s+hundred\\s+(?:and\\s+)?(${N_ONES})\\b`, 'g'),
        (_, h, o) => String(NUM_WORDS[h] * 100 + NUM_WORDS[o]));
    s = s.replace(new RegExp(`\\b(${N_ONES})\\s+hundred\\b`, 'g'),
        (_, h) => String(NUM_WORDS[h] * 100));

    // Pass 2: gym shorthand without "hundred"
    //   "two twenty five" → 225, "one thirty five" → 135
    s = s.replace(new RegExp(`\\b(${N_ONES})[\\s\\-]+(${N_TENS})[\\s\\-]+(${N_ONES})\\b`, 'g'),
        (_, h, t, o) => String(NUM_WORDS[h] * 100 + NUM_WORDS[t] + NUM_WORDS[o]));

    // Pass 3: "X TEEN" → 1XX (e.g. "one fifteen" → 115)
    s = s.replace(new RegExp(`\\b(${N_ONES})[\\s\\-]+(${N_TEENS})\\b`, 'g'),
        (_, h, te) => String(NUM_WORDS[h] * 100 + NUM_WORDS[te]));

    // Pass 4: "X TENS" → XY0 (e.g. "two twenty" → 220)
    s = s.replace(new RegExp(`\\b(${N_ONES})[\\s\\-]+(${N_TENS})\\b`, 'g'),
        (_, h, t) => String(NUM_WORDS[h] * 100 + NUM_WORDS[t]));

    // Pass 5: "X oh Y" → X0Y (e.g. "four oh five" → 405)
    s = s.replace(new RegExp(`\\b(${N_ONES})[\\s\\-]+(?:oh|o|zero)[\\s\\-]+(${N_ONES})\\b`, 'g'),
        (_, h, o) => String(NUM_WORDS[h] * 100 + NUM_WORDS[o]));

    // Pass 6: "TENS ONES" → XY (e.g. "twenty-five" → 25)
    s = s.replace(new RegExp(`\\b(${N_TENS})[\\s\\-]+(${N_ONES})\\b`, 'g'),
        (_, t, o) => String(NUM_WORDS[t] + NUM_WORDS[o]));

    // Pass 7: standalone number words
    s = s.replace(/\b(zero|oh|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/g,
        w => String(NUM_WORDS[w]));

    return s.replace(/\s+/g, ' ').trim();
}

// How long the mic stays open after a single tap before auto-stopping.
// During this window we silently survive `no-speech` errors so the user can
// pause to grab plates / set up / think before speaking. Workout mode
// ignores this — it stays open until manually toggled off.
const VOICE_SESSION_MS = 30000;
let _sessionTimer = null;

// iOS has exclusive audio session ownership: SpeechRecognition and a
// parallel getUserMedia stream (the v9.0 mic-level meter) can't coexist
// after the first session — iOS holds the mic at the system level past
// the JS-level release, so the second meter open fails and wedges the
// recognizer too. We detect iOS here and skip the meter in
// startMicLevelMeter(); style.css uses `body.ios` to keep the mic icon
// visible instead of the static-bar fallback. The breathing animation
// on `#mic-btn.listening` still signals "I'm listening." See v9.16.
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Limit the spoken "Try saying..." hint to once per session. Without this,
// desktop laptop mics pick up typing/fan/ambient noise as garbage final
// results, the prompt fires, and the prompt's own TTS audio gets re-heard
// by the mic — creating a runaway feedback loop.
let _promptedInSession = false;

// Flag set by speak() before it aborts the recognizer for TTS playback. The
// onend handler reads this and skips its restart logic — the speak()
// utterance's onend callback owns the restart instead. This is the cleanest
// way to coordinate two systems that both want to control the recognizer.
let _suspendForTTS = false;

// Centralized stop. Sets isListening=false BEFORE abort() so the resulting
// onend event won't try to restart. Optionally updates status in the same
// breath so callers don't need a follow-up setStatus().
function endSession(statusText = 'Ready') {
    if (_sessionTimer) { clearTimeout(_sessionTimer); _sessionTimer = null; }
    isListening = false;
    _promptedInSession = false;
    _suspendForTTS = false;
    try { recognition?.abort(); } catch (_) {}
    const mic = $('mic-btn');
    mic.classList.remove('listening');
    mic.setAttribute('aria-pressed', 'false');
    stopMicLevelMeter();        // v9.0: tear down the audio analyser
    setStatus(statusText);
}

// ============================================================================
// v9.0 — Mic audio-level meter
//
// Web Speech API doesn't expose audio levels, so we run a parallel
// getUserMedia stream into an AnalyserNode while the recognizer is
// listening. Five frequency-band averages drive --mic-level-N CSS vars on
// the FAB, which scale the heights of the EQ bars in real time. This is
// purely cosmetic — recognition works regardless — but it transforms the
// perceived responsiveness from "static circle" to "yes, I'm hearing you".
//
// Mic permission is already granted to the recognizer, so getUserMedia
// resolves without re-prompting in browsers that share the permission
// (Chrome / Edge). On browsers that don't, we silently skip the meter.
// ============================================================================

let _micAudioCtx = null;
let _micAnalyser = null;
let _micStream = null;
let _micAnimFrame = null;

async function startMicLevelMeter() {
    // iOS: skip entirely. The parallel getUserMedia stream conflicts with
    // SpeechRecognition's audio session and breaks voice on the second
    // recognition attempt (mic stays held at the system level past JS
    // release). The mic icon stays visible via the `body.ios` CSS override
    // and the breathing animation provides the listening feedback. See
    // the IS_IOS comment block above for the full reasoning.
    if (IS_IOS) return;
    // Skip if Audio APIs aren't available (Safari sometimes restricts).
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (_micAudioCtx) return;   // already running
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
            video: false,
        });
        _micStream = stream;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        _micAudioCtx = new Ctx();
        const source = _micAudioCtx.createMediaStreamSource(stream);
        _micAnalyser = _micAudioCtx.createAnalyser();
        _micAnalyser.fftSize = 64;       // small bin count, fast updates
        _micAnalyser.smoothingTimeConstant = 0.6;
        source.connect(_micAnalyser);
        const data = new Uint8Array(_micAnalyser.frequencyBinCount);

        const mic = $('mic-btn');
        // Map 32 frequency bins into 5 perceptual bands. Each tick averages
        // its band, normalizes to [0,1], and writes the CSS var that the
        // EQ bars react to. requestAnimationFrame keeps it cheap.
        const tick = () => {
            if (!isListening || !_micAnalyser) return;
            _micAnalyser.getByteFrequencyData(data);
            const bins = data.length;
            const bandSize = Math.floor(bins / 5);
            for (let band = 0; band < 5; band++) {
                let sum = 0;
                for (let i = 0; i < bandSize; i++) {
                    sum += data[band * bandSize + i];
                }
                const avg = sum / bandSize / 255;       // 0..1
                // Boost low signals so quiet speech still moves the bars.
                const boosted = Math.min(1, Math.pow(avg, 0.6) * 1.2);
                mic.style.setProperty(`--mic-level-${band + 1}`, boosted.toFixed(3));
            }
            _micAnimFrame = requestAnimationFrame(tick);
        };
        tick();
    } catch (err) {
        // Mic denied or AudioContext blocked — silently no-op. The user
        // still has the existing breathing animation as feedback.
        console.warn('Mic level meter unavailable:', err?.name || err);
    }
}

function stopMicLevelMeter() {
    if (_micAnimFrame) { cancelAnimationFrame(_micAnimFrame); _micAnimFrame = null; }
    if (_micStream) {
        try { _micStream.getTracks().forEach(t => t.stop()); } catch (_) {}
        _micStream = null;
    }
    if (_micAudioCtx) {
        try { _micAudioCtx.close(); } catch (_) {}
        _micAudioCtx = null;
    }
    _micAnalyser = null;
    // Reset the bars so they collapse smoothly when the mic closes.
    const mic = $('mic-btn');
    if (mic) {
        for (let i = 1; i <= 5; i++) mic.style.setProperty(`--mic-level-${i}`, '0');
    }
}

function initSpeech() {
    // Tag the body so CSS can branch on iOS without per-rule UA sniffing.
    // Drives the .ios overrides that keep the mic icon visible when
    // listening (the EQ bars are hidden on iOS — see startMicLevelMeter).
    if (IS_IOS) document.body.classList.add('ios');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        // iOS Safari is the main offender — WebKit ships SpeechSynthesis
        // (TTS) but not SpeechRecognition (STT). Without this branch the
        // mic looks broken: tap, nothing happens. Dim the FAB, swap its
        // tap behavior to a clear status message, and (on iOS) show a
        // one-time banner explaining the limitation. Manual entry still
        // works — the rest of the app is fine.
        const mic = $('mic-btn');
        mic.style.opacity = '0.4';
        mic.setAttribute('aria-disabled', 'true');
        mic.removeAttribute('aria-pressed');
        // Replace the data-action so the dispatcher doesn't try to start
        // a recognizer that doesn't exist.
        mic.dataset.action = 'voiceUnsupportedHint';
        maybeShowVoiceUnsupportedBanner();
        return;
    }
    try {
        recognition = new SR();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;          // item 11
        // Always continuous. Both single-tap and workout mode let the
        // browser keep the mic alive natively — far more reliable than
        // restart()-on-every-result. Single-tap is bounded by the session
        // timer; workout mode is bounded only by manual toggle.
        recognition.continuous = true;

        recognition.onresult = e => {
            (async () => {
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    if (!e.results[i].isFinal) continue;
                    const alts = e.results[i];
                    let intent = null;
                    for (let alt = 0; alt < alts.length && !intent; alt++) {
                        intent = parseIntent(alts[alt].transcript.toLowerCase());
                    }
                    if (intent) {
                        await executeIntent(intent);
                    } else if (!_promptedInSession) {
                        // First parse failure: speak the hint. After this,
                        // any further garbage from ambient noise / mic
                        // pickup of TTS / etc. is silently ignored. The
                        // visual "Listening" status is the only ongoing
                        // signal that the mic is open.
                        _promptedInSession = true;
                        speak("Try saying the exercise, weight, and reps.");
                    }
                }
            })();
        };

        recognition.onerror = e => {
            // Mic permission denied is terminal.
            if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
                endSession('Mic blocked');
                setStatus('Mic blocked', 'error');
                return;
            }
            // `no-speech` and `aborted` during a live session are normal —
            // user pausing, or speak() aborting us for TTS. Don't bail.
            if ((e.error === 'no-speech' || e.error === 'aborted') && isListening) return;

            // Anything else: clean stop with the error reason.
            endSession();
            setStatus(`Voice error: ${e.error}`, 'error');
        };

        recognition.onend = () => {
            // If the user (or executeIntent) ended the session, we're done.
            if (!isListening) return;
            // If speak() aborted us for TTS, IT will restart us when the
            // utterance finishes — don't compete with it here.
            if (_suspendForTTS) return;

            // Browser dropped the recognizer despite continuous=true (Chrome
            // desktop occasionally does this). Retry until isListening goes
            // false — the session timer is the only authoritative end.
            const tryRestart = () => {
                if (!isListening || _suspendForTTS) return;
                try {
                    recognition.start();
                } catch (_) {
                    // start() throws if the previous session hasn't fully
                    // settled. Retry — don't end the session.
                    setTimeout(tryRestart, 250);
                }
            };
            tryRestart();
        };
    } catch (err) { console.error('Speech init failed', err); }
}

function setWorkoutMode(on) {
    workoutMode = !!on;
    localStorage.setItem('ironWorkoutMode', workoutMode ? 'on' : 'off');
    // continuous stays true regardless of mode
}

function toggleListening() {
    if (!recognition) return;
    if (isListening) {
        const wasWorkout = workoutMode;
        endSession(wasWorkout ? 'Workout mode off' : 'Ready');
        haptic(15);
        return;
    }
    // Cancel any leftover TTS so the mic starts on a clean audio frame.
    try { window.speechSynthesis?.cancel(); } catch (_) {}
    // v9.18: iOS only lets speechSynthesis produce audio if it's been
    // primed inside a recent user-gesture context. By the time
    // recognition.onresult fires (after STT processes audio), the gesture
    // window has closed and speak() runs silently. A zero-volume utterance
    // queued during this tap handler "unlocks" the synthesis engine for
    // the session. Inaudible on every platform; no-op on platforms that
    // already allow background TTS.
    try {
        if ('speechSynthesis' in window) {
            const warmup = new SpeechSynthesisUtterance(' ');
            warmup.volume = 0;
            window.speechSynthesis.speak(warmup);
        }
    } catch (_) {}
    try {
        recognition.continuous = true;
        recognition.start();
        isListening = true;
        _promptedInSession = false;
        _suspendForTTS = false;
        const mic = $('mic-btn');
        mic.classList.add('listening');
        mic.setAttribute('aria-pressed', 'true');
        setStatus(workoutMode ? 'Workout mode on' : 'Listening', 'listening');
        haptic(20);
        // v9.0: kick off the live audio meter so the mic FAB shows reactive
        // EQ bars while listening. Best-effort — recognition is unaffected
        // by failure here.
        startMicLevelMeter();
        // Single-tap mode: bound the session. Workout mode is unbounded.
        if (_sessionTimer) clearTimeout(_sessionTimer);
        if (!workoutMode) {
            _sessionTimer = setTimeout(() => endSession('Ready'), VOICE_SESSION_MS);
        }
    } catch (err) {
        console.error('start() failed', err);
        endSession();
    }
}

const startListening = toggleListening;

// ---- Pure intent parser. Returns { type, ...params } or null. ----
function parseIntent(rawText) {
    const text = normalizeSpokenNumbers(rawText.trim());

    // v6: Start / End workout. Match any reasonable phrasing.
    if (/^(?:start|begin)\s+(?:my\s+)?(?:workout|session|gym|training)$/.test(text)
        || text === 'start workout' || text === 'begin workout') {
        return { type: 'startWorkout' };
    }
    if (/^(?:end|stop|finish|done with)\s+(?:my\s+)?(?:workout|session|gym|training)$/.test(text)
        || text === 'end workout' || text === 'stop workout' || text === 'finish workout') {
        return { type: 'endWorkout' };
    }

    // Rest timer
    const restMatch = text.match(/^(?:start )?rest(?:\s+(\d+))?(?:\s*(?:seconds?|second|s|minutes?|min|m))?$/);
    if (restMatch) {
        let secs = restMatch[1] ? parseInt(restMatch[1], 10) : (restDuration || 90);
        if (text.includes('minute') || /\bmin\b/.test(text)) secs *= 60;
        return { type: 'rest', secs };
    }

    // Plate breakdown
    const plateMatch = text.match(/(?:plate(?:s)?|breakdown).*?(\d+(?:\.\d+)?)/);
    if (plateMatch) return { type: 'plates', target: parseFloat(plateMatch[1]) };

    // Undo
    if (/^(undo|delete (?:that|last)|remove (?:that|last))$/.test(text)) {
        return { type: 'undo' };
    }

    // PR query: "what's my bench PR"
    const prQuery = text.match(/(?:what(?:'s| is) my|my)\s+(.+?)\s+(?:pr|max|record|one rep max|one r m)/);
    if (prQuery) {
        const exMatch = matchOrder.find(m => prQuery[1].includes(m.term));
        if (exMatch) return { type: 'prQuery', exercise: exMatch.name };
    }

    // Weekly volume
    if (/(weekly|week's|this week)\s+(volume|tonnage|total)/.test(text)
        || /how much (?:did|have) i lift(?:ed)?/.test(text)) {
        return { type: 'weeklyVolume' };
    }

    // Last set query
    if (text.includes("what was my") || text.includes("last set")) {
        const exMatch = matchOrder.find(m => text.includes(m.term));
        return { type: 'lastSet', exercise: exMatch?.name ?? null };
    }

    // v9.26 — Warmup log: "warmup bench 135 for 8" or "warm up squat 95 for 10".
    // Parses identically to a normal log but stamps the entry as a warmup so
    // it bypasses every PR/volume tally. Detection runs before the generic
    // log path so the warmup keyword isn't swallowed.
    const warmupMatch = text.match(/^warm(?:\s*-?\s*)?up\b\s*(.*)$/);
    if (warmupMatch) {
        const rest = warmupMatch[1] || '';
        const exMatch = matchOrder.find(m => rest.includes(m.term));
        const nums = rest.match(/\d+(?:\.\d+)?/g);
        if (exMatch && nums && nums.length >= 2) {
            const weight = parseFloat(nums[0]);
            const reps = parseInt(nums[1], 10);
            if (weight > 0 && reps > 0) {
                return { type: 'log', exercise: exMatch.name, weight, reps, warmup: true };
            }
        }
    }

    // Logging: exercise + 2 numbers
    const exMatch = matchOrder.find(m => text.includes(m.term));
    const nums = text.match(/\d+(?:\.\d+)?/g);
    if (exMatch && nums && nums.length >= 2) {
        const weight = parseFloat(nums[0]);
        const reps = parseInt(nums[1], 10);
        if (weight > 0 && reps > 0) {
            return { type: 'log', exercise: exMatch.name, weight, reps };
        }
    }

    return null;
}

// ---- Side-effecting dispatcher. ----
async function executeIntent(intent) {
    switch (intent.type) {
        case 'startWorkout':
            if (activeSession) {
                speak("Workout already in progress.");
            } else {
                await startWorkoutSession();
                speak("Workout started.");
            }
            break;
        case 'endWorkout':
            if (!activeSession) {
                speak("No workout in progress.");
            } else {
                const session = await endWorkoutSession({ silent: true });
                if (session) {
                    const mins = Math.round(session.durationMs / 60000);
                    speak(`Workout ended. ${mins} minutes.`);
                } else {
                    speak("Workout ended.");
                }
            }
            break;
        case 'rest':
            startRestTimer(intent.secs);
            speak(`Resting ${intent.secs} seconds.`);
            break;
        case 'plates': {
            const breakdown = computePlates(intent.target, 45);
            if (breakdown.error) speak("Below the bar weight.");
            else speak(`${intent.target} pounds: ${breakdown.spoken}.`);
            break;
        }
        case 'undo': {
            const last = await performDB('workouts', 'searchLast', null);
            if (last) {
                await deleteEntry(last.id, /*silent=*/true);
                speak(`Removed ${last.exercise}.`);
            } else speak("Nothing to undo.");
            break;
        }
        case 'prQuery': {
            const pr = await performDB('prs', 'get', intent.exercise);
            if (pr) speak(`Your ${intent.exercise} PR is ${Math.round(pr.max1RM)} pounds, hit at ${pr.maxWeight} for relevant reps.`);
            else speak(`No ${intent.exercise} record yet.`);
            break;
        }
        case 'weeklyVolume': {
            // v9.26 — work sets only; warmups don't count toward tonnage.
            const w = await getActiveWorkSets();
            const cutoff = isoForOffset(7);
            const total = w.filter(e => e.date >= cutoff).reduce((s, e) => s + e.weight * e.reps, 0);
            speak(total > 0 ? `${Math.round(total).toLocaleString()} pounds over the last seven days.` : "No volume in the last week.");
            break;
        }
        case 'lastSet': {
            const result = await performDB('workouts', 'searchLast', intent.exercise);
            if (result) speak(`Last ${result.exercise}: ${result.weight} pounds for ${result.reps}.`);
            else speak("No data found.");
            break;
        }
        case 'log': {
            const entry = buildEntry(intent.exercise, intent.weight, intent.reps, { warmup: !!intent.warmup });
            await saveAndSyncUI(entry);
            speak(entry.warmup
                ? `Warmup logged. ${entry.weight} for ${entry.reps}.`
                : `Logged ${entry.weight} for ${entry.reps}.`);
            break;
        }
    }
    // Single-tap mode: a successful command means the user got what they
    // came for — close the session. Workout mode keeps listening for the
    // next set until the user toggles it off.
    if (!workoutMode && isListening) endSession('Ready');
}

function speak(text) {
    // v9.17/v9.19: every spoken response also surfaces visually so voice
    // works on muted phones (the common case at a gym). On iOS the
    // hardware ringer switch silences speechSynthesis entirely, which
    // made queries like "what was my last bench" appear to fail — the
    // answer was being spoken into the void. v9.19 upgraded the visual
    // from a small bottom snackbar to a prominent top-of-screen card
    // that stays for 10s, readable from arm's-length when the phone is
    // on the bench.
    showVoiceResponse(text);

    if (!('speechSynthesis' in window)) return;

    // If the recognizer is live, mute it for the duration of TTS. Without
    // this, the mic picks up our own voice prompt, which Chrome transcribes
    // as another garbage final result, which would trigger another speak()
    // call, creating a feedback loop. The flag is set BEFORE abort() so
    // recognition.onend reads it and skips its own restart logic.
    const wasListening = isListening && !!recognition;
    if (wasListening) {
        _suspendForTTS = true;
        try { recognition.abort(); } catch (_) {}
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = voiceRate;
    if (voiceURI) {
        // getVoices() can be empty on Chrome until voiceschanged fires; we
        // fall through to the system default in that case rather than block.
        const v = (window.speechSynthesis.getVoices() || []).find(x => x.voiceURI === voiceURI);
        if (v) u.voice = v;
    }

    const resume = () => {
        _suspendForTTS = false;
        // Only restart if the session is still alive. If endSession was
        // called while TTS was playing (e.g. successful log in single-tap
        // mode), isListening is false and we leave the mic off.
        if (!isListening || !recognition) return;
        try {
            recognition.start();
        } catch (_) {
            // Recognizer might still be in transition from abort(). Try once more.
            setTimeout(() => {
                if (!isListening) return;
                try { recognition.start(); } catch (_) {}
            }, 150);
        }
    };
    u.onend = resume;
    u.onerror = resume;

    // v9.18: iOS speechSynthesis can drift into a paused state across
    // sessions where queued utterances never start. resume() is a no-op
    // when not paused and unblocks the queue when it is.
    try { window.speechSynthesis.resume(); } catch (_) {}
    window.speechSynthesis.speak(u);
}

// ============================================================================
// Voice picker
//
// On Chrome, getVoices() returns [] until the 'voiceschanged' event fires
// (often ~200ms after page load). We listen and re-render. iOS Safari
// usually has voices ready synchronously but sometimes doesn't fire the event,
// so we also poll once via populateVoicePicker() at init and again whenever
// settings opens. Persisted by voiceURI (stable string), with a graceful
// fallback to system default if the saved voice isn't available later.
// ============================================================================

function populateVoicePicker() {
    const select = $('voice-picker');
    if (!select) return;
    const voices = window.speechSynthesis?.getVoices() ?? [];

    if (!voices.length) {
        select.innerHTML = `<option value="">System default (loading…)</option>`;
        return;
    }

    // Group by lang code; English variants float to the top.
    const groups = {};
    for (const v of voices) {
        const lang = v.lang || 'unknown';
        (groups[lang] ||= []).push(v);
    }
    const langs = Object.keys(groups).sort((a, b) => {
        const aEn = a.startsWith('en'), bEn = b.startsWith('en');
        if (aEn && !bEn) return -1;
        if (!aEn && bEn) return 1;
        return a.localeCompare(b);
    });

    let html = `<option value="">System default</option>`;
    for (const lang of langs) {
        const escLang = escapeHtml(lang);
        html += `<optgroup label="${escLang}">`;
        groups[lang]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(v => {
                const flags = [];
                if (v.localService) flags.push('local');
                if (v.default) flags.push('default');
                const flagSuffix = flags.length ? ` (${flags.join(', ')})` : '';
                html += `<option value="${escapeHtml(v.voiceURI)}">${escapeHtml(v.name)}${escapeHtml(flagSuffix)}</option>`;
            });
        html += `</optgroup>`;
    }
    select.innerHTML = html;
    // Restore selection (or fall through to "" / System default if missing).
    select.value = voiceURI;
    if (select.value !== voiceURI) {
        // Stored voice no longer present — clear it so future syncs don't keep referencing.
        voiceURI = '';
        localStorage.removeItem('ironVoiceURI');
    }
}

function setVoice(uri) {
    voiceURI = uri || '';
    if (voiceURI) localStorage.setItem('ironVoiceURI', voiceURI);
    else localStorage.removeItem('ironVoiceURI');
}

function setVoiceRate(rate) {
    const r = parseFloat(rate);
    if (!Number.isFinite(r)) return;
    voiceRate = Math.min(2, Math.max(0.5, r));
    localStorage.setItem('ironVoiceRate', String(voiceRate));
    const lbl = $('voice-rate-label');
    if (lbl) lbl.textContent = `${voiceRate.toFixed(2)}×`;
    // Screen readers should hear "1.05 times speed" instead of
    // "1.05 of 0.5 to 2" — aria-valuetext overrides the numeric default.
    const slider = $('voice-rate');
    if (slider) slider.setAttribute('aria-valuetext', `${voiceRate.toFixed(2)} times speed`);
}

function testVoice() {
    speak("Logged two twenty-five for five.");
    haptic(8);
}

function initVoicePicker() {
    if (!('speechSynthesis' in window)) return;

    // Voices may not be ready yet; populate now and re-populate on the event.
    populateVoicePicker();
    speechSynthesis.addEventListener?.('voiceschanged', populateVoicePicker);

    $('voice-picker')?.addEventListener('change', e => {
        setVoice(e.target.value);
        haptic(6);
    });
    $('voice-rate')?.addEventListener('input', e => setVoiceRate(e.target.value));
}

// ============================================================================
// UI render coordinator
// ============================================================================

async function renderAll() {
    await renderHistory();
    await renderFocus();
    await renderRecommendedNext();
    await renderStrain();
    await refreshLatestStats();
    // v9.1: Home card row replaced. New trio drives the at-a-glance "Today"
    // section; the old refreshLatestPRCard is gone (PR tile lived in the
    // wrong room — PRs already have their own tab).
    await renderTodayCard();
    await renderWeekCard();
    await renderHomePrimaryAction();
    await renderHeaderSubtitle();
    await refreshSessionCard();    // v6
    await renderTemplateChips();
    await renderTemplateProgress();
    await renderLastWorkoutCard(); // v9.0: workout-screen idle summary
    await renderHomeEmptyState();  // v9.0: first-launch hint on home
    renderSyncMeta();
    updateWorkoutTabUI();          // v6: tab button reflects active state
}

async function refreshLatestStats() {
    try {
        const last = await performDB('workouts', 'searchLast', null);
        if (last) await updateUI(last, false);
    } catch (err) { console.error(err); }
}

const getCurrentPR = async exercise => (await performDB('prs', 'get', exercise)) ?? null;

async function updateUI(entry, isNewPR) {
    // v9.1: Home no longer has a "Current" tile pinned to the absolute last
    // lift — that tile went stale across visits. The Today / This-week / live
    // header subtitle replace it with state-aware summaries.
    await renderTodayCard();
    await renderWeekCard();
    await renderHomePrimaryAction();
    await renderHeaderSubtitle();

    if (isNewPR) {
        // v9.1: PR flash now lands on the Today card — that's the tile
        // showing the set the user just logged. Old #pr-card was removed.
        const card = $('today-card');
        if (card) {
            card.classList.remove('pr-flash');
            void card.offsetWidth;
            card.classList.add('pr-flash');
        }
        setStatus('New PR!', 'synced');
        speak("New personal record!");
        haptic([30, 50, 30, 50, 60]);
        // v9.0: PRs deserve a moment. Auto-present the celebration sheet
        // with the same canvas the share flow already produces. Defer
        // briefly so the snackbar/PR-flash on the card register first.
        setTimeout(() => presentPRCelebration(entry), 600);
    }
}

// v9.1: Format a tonnage value compactly for tile display. Threshold of 1k
// keeps small workouts readable as full numbers while heavy weeks compress.
function formatVol(v) {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k lb`;
    return `${Math.round(v)} lb`;
}

// v9.1: Today card. Three states drive both the label and the value:
//   active session → "In progress · Nm · K sets" (drives header subtitle too)
//   sets logged today → "Today · K sets · vol" with top set
//   else → "Last workout · Nd ago" pointing at Workout to start
// The empty-data case (no sets ever) leaves the card at "—" since the
// home-empty hint takes over visually anyway.
async function renderTodayCard() {
    const labelEl = $('today-card-label');
    const valueEl = $('today-card-value');
    if (!labelEl || !valueEl) return;

    // v9.26 — set/volume tallies on Home are work-only. Warmups still show
    // as pills on the workout screen, just not in summary numbers.
    const all = await getActiveWorkSets();

    if (activeSession) {
        const setsInSession = all.filter(w => w.sessionId === activeSession.id);
        const vol = setsInSession.reduce((s, w) => s + w.weight * w.reps, 0);
        const m = Math.max(0, Math.floor((Date.now() - activeSession.startedAt) / 60000));
        labelEl.textContent = 'In progress';
        valueEl.innerHTML = `
            <div class="tc-primary">${m}m · ${setsInSession.length} ${setsInSession.length === 1 ? 'set' : 'sets'}</div>
            <div class="tc-sub">${escapeHtml(formatVol(vol))}</div>
        `;
        return;
    }

    const todayStr = todayISO();
    const todaySets = all.filter(w => w.date === todayStr);
    if (todaySets.length) {
        const vol = todaySets.reduce((s, w) => s + w.weight * w.reps, 0);
        const top = todaySets.slice().sort((a, b) => b.weight - a.weight)[0];
        labelEl.textContent = 'Today';
        valueEl.innerHTML = `
            <div class="tc-primary">${todaySets.length} ${todaySets.length === 1 ? 'set' : 'sets'} · ${escapeHtml(formatVol(vol))}</div>
            <div class="tc-sub">top: ${escapeHtml(titleCase(top.exercise))} ${escapeHtml(String(top.weight))}×${escapeHtml(String(top.reps))}</div>
        `;
        return;
    }

    if (all.length) {
        const lastDate = all.map(w => w.date).sort().pop();
        const days = dayDiff(lastDate, todayStr);
        labelEl.textContent = 'Last workout';
        const ago = days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days}d ago`;
        valueEl.innerHTML = `
            <div class="tc-primary">${escapeHtml(ago)}</div>
            <div class="tc-sub">tap to start</div>
        `;
        return;
    }

    labelEl.textContent = 'Today';
    valueEl.textContent = '—';
}

// v9.1: This-week card. Replaces the old "Latest PR" tile, which never
// changed between weeks and felt static. Distinct workout days (rather than
// session count) is used so untagged historical sets still show up; rare
// twice-in-one-day cases are an acceptable miscount for a summary tile.
async function renderWeekCard() {
    const valueEl = $('week-card-value');
    const deltaEl = $('week-card-delta');
    if (!valueEl) return;

    // v9.26 — week tonnage / set count exclude warmups.
    const all = await getActiveWorkSets();
    const cutoff7 = isoForOffset(6);    // last 7 days inclusive
    const cutoff14 = isoForOffset(13);  // 7 days before that

    const last7 = all.filter(w => w.date >= cutoff7);
    const prev7 = all.filter(w => w.date >= cutoff14 && w.date < cutoff7);

    if (!last7.length) {
        valueEl.innerHTML = `<div class="tc-primary">—</div>`;
        if (deltaEl) deltaEl.textContent = '';
        return;
    }

    const vol7 = last7.reduce((s, w) => s + w.weight * w.reps, 0);
    const sets7 = last7.length;
    const days7 = new Set(last7.map(w => w.date)).size;

    valueEl.innerHTML = `
        <div class="tc-primary">${escapeHtml(formatVol(vol7))}</div>
        <div class="tc-sub">${sets7} ${sets7 === 1 ? 'set' : 'sets'} · ${days7} ${days7 === 1 ? 'day' : 'days'}</div>
    `;

    if (deltaEl) {
        const volPrev = prev7.reduce((s, w) => s + w.weight * w.reps, 0);
        if (volPrev > 0) {
            const pct = Math.round(((vol7 - volPrev) / volPrev) * 100);
            const sign = pct >= 0 ? '+' : '';
            const cls = pct >= 0 ? 'delta-up' : 'delta-down';
            deltaEl.innerHTML = `<span class="${cls}">${sign}${pct}%</span> vs prior`;
        } else {
            deltaEl.textContent = '';
        }
    }
}

// v9.1: Primary action pill. Two states: idle ("Start workout") and active
// ("Resume workout · Nm"). Both navigate to the Workout screen — the user
// can then start a session, pick a template, or see the active card.
async function renderHomePrimaryAction() {
    const titleEl = $('hpa-title');
    const subEl = $('hpa-sub');
    const iconEl = $('hpa-icon');
    if (!titleEl) return;

    if (activeSession) {
        const m = Math.max(0, Math.floor((Date.now() - activeSession.startedAt) / 60000));
        titleEl.textContent = 'Resume workout';
        if (subEl) subEl.textContent = `In progress · ${m}m`;
        if (iconEl) iconEl.classList.add('hpa-icon-active');
    } else {
        titleEl.textContent = 'Start workout';
        if (subEl) subEl.textContent = 'Track time, sets, and volume';
        if (iconEl) iconEl.classList.remove('hpa-icon-active');
    }
}

// v9.1: Header subtitle is no longer the static "Ready to lift" — it now
// mirrors the same training-state machine as the Today card so the page
// has a sense of liveness even before the user scrolls. States:
//   active session → "In session · Nm"
//   trained today → "Trained today"
//   trained recently → "Last: yesterday" / "Last: Nd ago"
//   no data → "Ready to lift"
async function renderHeaderSubtitle() {
    const el = $('header-subtitle');
    if (!el) return;
    if (activeSession) {
        const m = Math.max(0, Math.floor((Date.now() - activeSession.startedAt) / 60000));
        el.textContent = `In session · ${m}m`;
        return;
    }
    let all;
    try { all = await getActiveWorkouts(); } catch { return; }
    const todayStr = todayISO();
    if (all.some(w => w.date === todayStr)) { el.textContent = 'Trained today'; return; }
    if (!all.length) { el.textContent = 'Ready to lift'; return; }
    const lastDate = all.map(w => w.date).sort().pop();
    const days = dayDiff(lastDate, todayStr);
    if (days <= 0) el.textContent = 'Trained today';
    else if (days === 1) el.textContent = 'Last: yesterday';
    else el.textContent = `Last: ${days}d ago`;
}

// v9.1: Today card tap target. Active session → Workout screen so the user
// sees the in-progress card and quick-add. Otherwise → History so they can
// review prior sessions or scroll back to find their last workout.
function goToday() {
    showScreen(activeSession ? 'workout' : 'history');
}

async function renderHistory() {
    // v6: the journal moved out of home into the History screen.
    // Refresh that screen if it's currently visible; otherwise no-op
    // (the next showScreen('history') will lazy-render with fresh data).
    if (currentScreen === 'history') {
        await renderHistoryScreen();
    }
    // Also keep PRs screen in sync if visible (logging a set may have
    // changed a max-weight tile).
    if (currentScreen === 'prs') {
        await renderPRsScreen();
    }
}

// v6: kept as a stub for compatibility with the boot sequence. The real
// delegation is now initJournalDelegationFor(container), called per-screen
// when each container renders. The History screen calls it on its own
// #history-day-groups; the home journal no longer exists.
function initJournalDelegation() { /* no-op — see initJournalDelegationFor */ }

// ============================================================================
// Help sheet, snackbar, install hint, voice tip
// ============================================================================

function openHelp() {
    $('help-overlay').classList.add('active');
    haptic(8);
}
function closeHelp() {
    $('help-overlay').classList.remove('active');
    haptic(8);
}

// Snackbar with optional action button + auto-dismiss.
// Returns a control object so callers can dismiss programmatically.
let _snackbarTimer = null;
let _snackbarOnAction = null;
function showSnackbar(text, { actionLabel = '', onAction = null, duration = 5000 } = {}) {
    const bar = $('snackbar');
    const txt = $('snackbar-text');
    const btn = $('snackbar-action');
    if (!bar) return;
    txt.textContent = text;
    if (actionLabel && typeof onAction === 'function') {
        btn.textContent = actionLabel;
        btn.style.display = '';
        _snackbarOnAction = onAction;
    } else {
        btn.style.display = 'none';
        _snackbarOnAction = null;
    }
    bar.classList.add('active');
    if (_snackbarTimer) clearTimeout(_snackbarTimer);
    if (duration > 0) {
        _snackbarTimer = setTimeout(hideSnackbar, duration);
    }
}
function hideSnackbar() {
    $('snackbar')?.classList.remove('active');
    _snackbarOnAction = null;
    if (_snackbarTimer) { clearTimeout(_snackbarTimer); _snackbarTimer = null; }
}

// v9.19 — Voice-response overlay. Prominent top-of-screen card that
// mirrors every TTS utterance for a configurable hold time. Sized larger
// than a snackbar because it's the *primary* feedback when the phone is
// silenced (iOS's hardware ringer mutes speechSynthesis), and the user
// is typically mid-set when the response appears. Tap to dismiss early.
let _voiceResponseTimer = null;
function showVoiceResponse(text, { duration = 10000 } = {}) {
    const wrap = $('voice-response');
    const txt = $('voice-response-text');
    if (!wrap || !txt) return;
    txt.textContent = text;
    wrap.classList.add('active');
    if (_voiceResponseTimer) clearTimeout(_voiceResponseTimer);
    if (duration > 0) {
        _voiceResponseTimer = setTimeout(hideVoiceResponse, duration);
    }
}
function hideVoiceResponse() {
    $('voice-response')?.classList.remove('active');
    if (_voiceResponseTimer) { clearTimeout(_voiceResponseTimer); _voiceResponseTimer = null; }
}

// v9.8 — Custom confirm/info sheet. Replaces native confirm()/alert() so
// the IronVoice sheet aesthetic is consistent across destructive prompts
// (End workout, Wipe, Sign out, Delete template, etc.) and boot-time
// questions (forgotten session, Start a workout?). Returns a Promise that
// resolves to true (confirmed) or false (cancelled / dismissed).
//
// Single-instance: if a second sheet is requested while one is already
// open, the existing one resolves as cancelled before the new one opens.
let _confirmSheetResolve = null;

function confirmSheet({
    title = '',
    body = '',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
} = {}) {
    return new Promise(resolve => {
        if (_confirmSheetResolve) { _confirmSheetResolve(false); _confirmSheetResolve = null; }
        _confirmSheetResolve = resolve;
        $('confirm-sheet-title').textContent = title;
        const bodyEl = $('confirm-sheet-body');
        if (bodyEl) {
            bodyEl.textContent = body;
            bodyEl.style.display = body ? '' : 'none';
        }
        const confirmBtn = $('confirm-sheet-confirm');
        const cancelBtn = $('confirm-sheet-cancel');
        confirmBtn.textContent = confirmLabel;
        cancelBtn.textContent = cancelLabel;
        confirmBtn.classList.toggle('danger', !!danger);
        cancelBtn.style.display = '';
        $('confirm-sheet-overlay').classList.add('active');
    });
}

// Single-button info sheet (replaces alert()). Resolves to true on dismiss.
function infoSheet({ title = '', body = '', dismissLabel = 'OK' } = {}) {
    return new Promise(resolve => {
        if (_confirmSheetResolve) { _confirmSheetResolve(false); _confirmSheetResolve = null; }
        _confirmSheetResolve = resolve;
        $('confirm-sheet-title').textContent = title;
        const bodyEl = $('confirm-sheet-body');
        if (bodyEl) {
            bodyEl.textContent = body;
            bodyEl.style.display = body ? '' : 'none';
        }
        const confirmBtn = $('confirm-sheet-confirm');
        const cancelBtn = $('confirm-sheet-cancel');
        confirmBtn.textContent = dismissLabel;
        confirmBtn.classList.remove('danger');
        cancelBtn.style.display = 'none';
        $('confirm-sheet-overlay').classList.add('active');
    });
}

function _resolveConfirmSheet(result) {
    $('confirm-sheet-overlay').classList.remove('active');
    const r = _confirmSheetResolve;
    _confirmSheetResolve = null;
    if (r) r(result);
}
function confirmSheetYes() { _resolveConfirmSheet(true); }
function confirmSheetNo() { _resolveConfirmSheet(false); }

// Undo for the most recent journal delete. The snackbar action wires this up.
let _lastDeletedId = null;
async function undoLastDelete() {
    if (_lastDeletedId == null) return;
    const id = _lastDeletedId;
    _lastDeletedId = null;
    try {
        const entry = await performDB('workouts', 'get', id);
        if (!entry) { hideSnackbar(); return; }
        delete entry.deleted;
        entry.modifiedAt = Date.now();
        await performDB('workouts', 'put', entry);
        markFrequencyDirty();
        await recomputePR(entry.exercise);
        await renderHistory();
        await renderFocus();
        await renderRecommendedNext();
        await renderStrain();
        await refreshLatestStats();
        await renderSuggestedQueue();
        haptic(15);
    } catch (err) { console.error('Undo failed', err); }
    hideSnackbar();
}

// iOS install hint. Shows once when:
//   - on iPhone/iPad Safari
//   - the PWA is NOT already in standalone mode
//   - the user hasn't already dismissed it
function maybeShowInstallHint() {
    if (localStorage.getItem('ironInstallHintShown') === '1') return;
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/.test(ua) && !window.MSStream;
    const standalone = window.navigator.standalone === true
        || window.matchMedia?.('(display-mode: standalone)').matches;
    if (!isIOS || standalone) return;
    // Wait a beat after first paint so it doesn't fight the profile sheet.
    setTimeout(() => $('install-banner')?.classList.add('active'), 900);
}
function dismissInstallHint() {
    $('install-banner')?.classList.remove('active');
    localStorage.setItem('ironInstallHintShown', '1');
    haptic(8);
}

// PWA shortcut handler — invoked at boot to honor manifest.json's
// `shortcuts` array. The shortcut URL like ./?action=plate is parsed here
// and dispatched after the boot sequence has installed the action handlers.
// Wrapped in setTimeout so it runs after initSpeech / initActionDispatcher
// finish, and so the home screen has rendered before a sheet pops over it.
function handleShortcutAction() {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    if (!action) return;
    // Strip the param from the URL so a refresh doesn't re-fire the action.
    if (history.replaceState) {
        history.replaceState({}, '', location.pathname + location.hash);
    }
    setTimeout(() => {
        if (action === 'start-workout' && typeof toggleWorkoutSession === 'function') {
            toggleWorkoutSession();
        } else if (action === 'plate' && typeof openPlate === 'function') {
            openPlate();
        } else if (action === 'help' && typeof openHelp === 'function') {
            openHelp();
        }
    }, 400);
}

// Voice unsupported (iOS Safari, older browsers) — show a one-time snackbar
// the first time the user opens the app on a non-supporting browser so they
// know why the mic appears disabled. Suppressed thereafter via a flag.
function maybeShowVoiceUnsupportedBanner() {
    if (localStorage.getItem('ironVoiceUnsupportedShown') === '1') return;
    setTimeout(() => {
        showSnackbar(
            'Voice logging needs Chrome. You can still log manually.',
            {
                actionLabel: 'OK',
                onAction: () => {
                    localStorage.setItem('ironVoiceUnsupportedShown', '1');
                    hideSnackbar();
                },
                duration: 12000,
            }
        );
    }, 1200);
}
function voiceUnsupportedHint() {
    setStatus('Voice not supported', 'error');
    showSnackbar(
        'Voice logging needs Chrome on Android or desktop.',
        { actionLabel: 'OK', onAction: hideSnackbar, duration: 5000 }
    );
}

// First-run voice tip — shown only when the user has zero entries
// and hasn't seen it before. One nudge, then never again.
async function maybeShowVoiceTip() {
    if (localStorage.getItem('ironVoiceTipShown') === '1') return;
    if (!userProfile?.first) return;   // wait for profile setup
    try {
        const all = await getActiveWorkouts();
        if (all.length > 0) {
            // Already used the app; mark as "shown" so we never bother them.
            localStorage.setItem('ironVoiceTipShown', '1');
            return;
        }
        setTimeout(() => {
            showSnackbar(
                "Tap the mic and try: \"bench two twenty-five for five\"",
                { actionLabel: 'Got it', onAction: dismissVoiceTip, duration: 12000 }
            );
            localStorage.setItem('ironVoiceTipShown', '1');
        }, 1500);
    } catch (_) { /* DB not ready yet; skip silently */ }
}
function dismissVoiceTip() {
    localStorage.setItem('ironVoiceTipShown', '1');
    hideSnackbar();
}

// ============================================================================
// Strict-CSP dispatcher.
// Every interactive element in index.html declares its handler via a
// data-action / data-on-input / data-on-focus attribute instead of an
// inline `on*=""` handler. Document-level listeners look up the named
// function in a whitelist and call it. Functions not in the map cannot
// be invoked from markup — much smaller attack surface than `'unsafe-inline'`.
// ============================================================================
function initActionDispatcher() {
    const ACTIONS = {
        applyUpdate, cancelCustomExercise, cancelTemplate, closeExercise,
        closePlate, closeSettings, closeShare, deleteCustomExercise,
        deleteTemplate, dismissTimer, exportHealthCSV,
        exportJSON, handleManualEntry, logoutFromSettings, nativeShare,
        newCustomExercise, newTemplate, openPlate, openSettings,
        restoreFromNAS, saveCustomExercise, saveProfile, saveTemplate,
        sharePR, syncToNAS, testConnection, testVoice, toggleListening,
        wipeFromSettings,
        // help / install hint additions land here too
        openHelp, closeHelp, dismissInstallHint, dismissVoiceTip,
        undoLastDelete,
        // v6 additions
        goPRs, toggleWorkoutSession,
        // Home pill + Workout tab — navigate to Workout AND start the
        // session in one tap (was a navigate-only data-screen-target).
        enterWorkout,
        // v9.2 — End-workout confirm wrapper (button only; voice bypasses)
        confirmEndWorkout,
        // v9.1: Today-card tap routes state-aware (active → Workout, else → History)
        goToday,
        // v9.0 — PR celebration sheet (auto-presented on new PR)
        closePRCelebrate, shareCelebrate,
        // v9.2 — quick-add another set for the same exercise during a workout
        openQuickAdd, closeQuickAdd, saveQuickAdd,
        // v9.6 — tap a pill → action sheet (Edit / Delete). Replaces the
        // v9.2 long-press gesture.
        openSetAction, closeSetAction, editFromSetAction, deleteFromSetAction,
        // v9.8 — custom confirm/info sheet button handlers (replaces all
        // native confirm()/alert() so the system dialog never shows).
        confirmSheetYes, confirmSheetNo,
        // a11y: surfaces an explanatory snackbar on browsers without
        // SpeechRecognition (iOS Safari, etc.). The mic's data-action is
        // rewritten to this in initSpeech() when SR is unavailable.
        voiceUnsupportedHint,
        // v9.18: Home "Recommended next" card CTA. Stashes the picks as
        // the suggested-queue in localStorage, starts a session, routes
        // to Workout. Missing this entry would silently no-op the button.
        startRecommendedWorkout,
        // v9.19: tap-to-dismiss for the voice-response overlay (the big
        // top-of-screen card that mirrors TTS replies). Without this the
        // card is dismiss-only via its 10s auto-hide.
        hideVoiceResponse,
        // v9.21: quick-add ± stepper buttons. data-target='w'|'r',
        // data-step=signed decimal. Lets the user bump weight/reps
        // without opening the keyboard mid-workout.
        bumpQuickAdd,
        // v9.25: PR rows. Row body opens the exercise sheet; the share
        // icon goes straight to the share overlay (skips the sheet).
        openExerciseFromPR, sharePRFromRow,
        // v9.26: warmup support. Quick-add overlay toggle; per-set toggle
        // from the action sheet; per-exercise overflow menu actions.
        toggleQuickAddWarmup, toggleWarmupFromSetAction,
        openExerciseMenu, closeExerciseMenu, closeSwapExercise,
        swapExerciseFromMenu, deleteExerciseFromMenu, warmupAllFromMenu,
        // v9.26: per-exercise collapse on the active workout screen.
        toggleExerciseCollapse,
        // v9.32: What's New bottom-sheet — dismissed from either the
        // primary "Got it" button or the Done sheet-header button.
        closeWhatsNew,
    };
    const INPUT_ACTIONS = { filterExercises, filterSwapExercises };
    // v9.21 — selectAll: focus handler that highlights any prefilled value
    // in a number input so a single tap lets the user type the replacement
    // instead of having to long-press to select. Applied via
    // data-on-focus="selectAll" on weight/reps/plate inputs.
    const FOCUS_ACTIONS = { showExercises, selectAll: selectInputContents };

    document.addEventListener('click', e => {
        // Snackbar's action button is dynamic — handle it before the dispatcher.
        if (e.target.id === 'snackbar-action') {
            if (typeof _snackbarOnAction === 'function') _snackbarOnAction();
            else hideSnackbar();
            return;
        }
        // v6: tab bar buttons that switch screens.
        const tabTarget = e.target.closest('[data-screen-target]');
        if (tabTarget) {
            showScreen(tabTarget.dataset.screenTarget);
            return;
        }
        // v6: PR tab segmented buttons.
        const prTabBtn = e.target.closest('#pr-tab-segment button[data-val]');
        if (prTabBtn) {
            setPRTab(prTabBtn.dataset.val);
            return;
        }
        const el = e.target.closest('[data-action]');
        if (!el) return;
        const fn = ACTIONS[el.dataset.action];
        if (typeof fn === 'function') fn(el, e);
    });
    document.addEventListener('input', e => {
        const el = e.target.closest('[data-on-input]');
        if (!el) return;
        const fn = INPUT_ACTIONS[el.dataset.onInput];
        if (typeof fn === 'function') fn(el, e);
    }, true);
    document.addEventListener('focus', e => {
        const el = e.target.closest('[data-on-focus]');
        if (!el) return;
        const fn = FOCUS_ACTIONS[el.dataset.onFocus];
        if (typeof fn === 'function') fn(el, e);
    }, true);

    // v6: history-screen prev/next week buttons.
    $('history-prev')?.addEventListener('click', () => { historyWeekOffset--; historySelectedDate = null; renderHistoryScreen(); });
    $('history-next')?.addEventListener('click', () => { historyWeekOffset++; historySelectedDate = null; renderHistoryScreen(); });
}

// ============================================================================
// v9.18: Plan — prescriptive Home cards (Focus + Recommended next).
//
// Home pivoted from a stats dashboard to a coach. The old Trends section
// (Strength Trajectory, Training Rhythm, Balance vs Your Norm) and the
// Insights deload alert showed numbers without telling the user what to do
// with them. They're replaced by two cards driven by the same data:
//
//   Focus (14d)         — six muscle rows with set count over the last two
//                          weeks; headline calls out what's trailing.
//   Recommended next    — an ad-hoc workout the app picks for the user:
//                          1-2 exercises per trailing muscle, sets sized to
//                          their median session length, plus a CTA that
//                          starts a session and queues the suggestions as
//                          tap-to-fill chips on the Workout screen.
//
// All data inputs are existing: workouts (per-muscle set counts), sessions
// (median workout time + sec-per-set), exerciseLibrary + customExercises
// (the catalog the recommender picks from). No new IndexedDB store.
// ============================================================================

// Trailing-window per-muscle set count. Counts ENTRIES, not volume — set
// count is the right unit for "did you train it" vs "how hard". Returns
// the canonical 6-muscle object so callers can iterate MUSCLES safely.
async function computeMuscleCoverage(days = 14) {
    const cutoff = isoForOffset(days - 1);
    // v9.26 — coverage answers "did you train it" and a warmup of 95×8 isn't
    // really training the muscle. Excluding warmups keeps the Focus card and
    // the recommender's trailing-muscle scoring honest.
    const all = await getActiveWorkSets();
    const counts = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
    all.filter(w => w.date >= cutoff).forEach(w => {
        counts[muscleOf(w.exercise)]++;
    });
    return counts;
}

// v9.21 — adaptive lookback for the recommender. New users get a short
// window so a single early workout doesn't dominate; established users get
// a longer one so a quiet week doesn't reset their pattern. Tenure is the
// age of the earliest workout id.
async function computeLookbackDays() {
    const all = await getActiveWorkouts();
    if (!all.length) return 7;
    let firstId = Infinity;
    for (const w of all) if (w.id < firstId) firstId = w.id;
    const ageDays = Math.max(0, Math.floor((Date.now() - firstId) / 86400000));
    if (ageDays <= 14) return 7;
    if (ageDays <= 28) return 14;
    if (ageDays <= 56) return 21;
    return 28;
}

// v9.21 — weekday muscle profile. For a given weekday (0=Sun..6=Sat),
// aggregate per-muscle set counts across sessions that started on that
// weekday within the lookback window. The "weekday lock" rule (≥3 sessions
// AND one muscle ≥40% of weekday total) lives in the recommender; this
// helper just produces the inputs.
async function computeWeekdayMuscleProfile(weekday, lookbackDays) {
    const cutoff = Date.now() - lookbackDays * 86400000;
    const sessions = (await performDB('sessions', 'getAll'))
        .filter(s => s.endedAt && !s.estimated && s.startedAt >= cutoff
                  && new Date(s.startedAt).getDay() === weekday);
    const counts = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
    if (!sessions.length) return { counts, sessions: 0 };
    const sessionIds = new Set(sessions.map(s => s.id));
    // v9.26 — work sets only; weekday-lock is a routine-detection signal,
    // not a "did you walk into the gym" signal.
    const all = await getActiveWorkSets();
    for (const w of all) {
        if (sessionIds.has(w.sessionId)) counts[muscleOf(w.exercise)]++;
    }
    return { counts, sessions: sessions.length };
}

// v9.21 — per-muscle trend over the lookback window. Splits the window in
// half, compares recent volume to older volume, returns a -1..1 score per
// muscle. Positive = trending up, negative = trending down. The recommender
// uses negative trend as a "this is slipping, recommend it" boost.
async function computeMuscleTrend(lookbackDays) {
    // v9.26 — trend reads volume; warmups would smuggle in light tonnage
    // that doesn't reflect actual training load.
    const all = await getActiveWorkSets();
    const half = Math.max(1, Math.floor(lookbackDays / 2));
    const recentCutoff = isoForOffset(half - 1);                 // last `half` days
    const olderCutoff  = isoForOffset(lookbackDays - 1);         // window start
    const recent = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
    const older  = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
    for (const w of all) {
        const vol = (w.weight || 0) * (w.reps || 0);
        if (w.date >= recentCutoff) recent[muscleOf(w.exercise)] += vol;
        else if (w.date >= olderCutoff) older[muscleOf(w.exercise)] += vol;
    }
    const trend = {};
    for (const m of MUSCLES) {
        const r = recent[m], o = older[m];
        if (!r && !o) trend[m] = 0;
        else trend[m] = (r - o) / (r + o + 1);
    }
    return trend;
}

// v9.21 — per-exercise historical median sets-per-session within the
// lookback window. Replaces the old global 2..4 cap; if the user
// typically does 5 sets of squats, the rec says 5. Capped 2..6 to keep
// outliers (one-off 10-set days) from leaking into a recommendation.
async function medianSetsForExercise(name, lookbackDays) {
    const cutoff = Date.now() - lookbackDays * 86400000;
    const sessions = (await performDB('sessions', 'getAll'))
        .filter(s => s.endedAt && !s.estimated && s.startedAt >= cutoff);
    if (!sessions.length) return 3;
    const sessionIds = new Set(sessions.map(s => s.id));
    // v9.26 — sets-per-exercise is a work-set count; recommending "5 sets of
    // squats" should mean 5 work sets, not 3 warmups + 2 work sets.
    const all = await getActiveWorkSets();
    const setsBySession = new Map();
    for (const w of all) {
        if (!sessionIds.has(w.sessionId)) continue;
        if (w.exercise !== name) continue;
        setsBySession.set(w.sessionId, (setsBySession.get(w.sessionId) || 0) + 1);
    }
    if (!setsBySession.size) return 3;
    const vals = [...setsBySession.values()].sort((a, b) => a - b);
    const mid = Math.floor(vals.length / 2);
    const m = vals.length % 2 ? vals[mid] : Math.round((vals[mid - 1] + vals[mid]) / 2);
    return Math.max(2, Math.min(6, m));
}

// v9.21 — progressive-overload counter. Increments in endWorkoutSession()
// when the just-ended session was launched as a recommendation. Every
// 3rd recommended workout, the generator adds +1 set to one exercise.
// localStorage-only, ephemeral; counts since the feature shipped.
const REC_BUMP_KEY = 'ironRecBumpCount';
function readRecBumpCount() {
    const n = parseInt(localStorage.getItem(REC_BUMP_KEY) || '0', 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
}
function incrementRecBumpCount() {
    localStorage.setItem(REC_BUMP_KEY, String(readRecBumpCount() + 1));
}

// Median total-minutes (wall clock, includes rest) from real sessions in
// the last N weeks. Skips the active session and any estimated/backfilled
// session (those have synthetic durations and would pull the median
// around). Falls back to 45 min with no real sessions yet.
//
// v9.21 — switched from workoutMs to totalMs. The recommender uses this
// to size workouts to what the user actually spends at the gym (including
// rest, plate changes, walking), not just time-under-the-bar — so the
// "≈ 32 min" line on the Plan card reads wall-clock and the user can plan
// around it.
async function computeMedianSessionMinutes(weeks = 4) {
    const cutoff = Date.now() - weeks * 7 * 24 * 60 * 60 * 1000;
    const sessions = (await performDB('sessions', 'getAll'))
        .filter(s => s.endedAt && !s.estimated && s.startedAt >= cutoff
                  && (!activeSession || s.id !== activeSession.id));
    if (!sessions.length) return 45;
    const allWorkouts = await getActiveWorkouts();
    const minutes = sessions.map(s => {
        const sets = allWorkouts
            .filter(w => w.sessionId === s.id)
            .sort((a, b) => a.id - b.id);
        return computeSessionTimes(s, sets).totalMs / 60000;
    }).filter(m => m > 0).sort((a, b) => a - b);
    if (!minutes.length) return 45;
    const mid = Math.floor(minutes.length / 2);
    return minutes.length % 2 ? minutes[mid] : (minutes[mid - 1] + minutes[mid]) / 2;
}

// Average total-seconds-per-set (wall clock, includes rest) across recent
// real sessions. Used to size the recommended workout to the user's median
// session length. v9.21 — totalMs basis; clamp widened to 60..300s/set and
// fallback raised to 150s/set to reflect wall-clock vs work-only timing.
async function computeMedianSecPerSet(weeks = 4) {
    const cutoff = Date.now() - weeks * 7 * 24 * 60 * 60 * 1000;
    const sessions = (await performDB('sessions', 'getAll'))
        .filter(s => s.endedAt && !s.estimated && s.startedAt >= cutoff
                  && (!activeSession || s.id !== activeSession.id));
    if (!sessions.length) return 150;
    const allWorkouts = await getActiveWorkouts();
    let totalSec = 0, totalSets = 0;
    sessions.forEach(s => {
        const sets = allWorkouts
            .filter(w => w.sessionId === s.id)
            .sort((a, b) => a.id - b.id);
        if (!sets.length) return;
        totalSec += computeSessionTimes(s, sets).totalMs / 1000;
        totalSets += sets.length;
    });
    return totalSets ? Math.max(60, Math.min(300, totalSec / totalSets)) : 150;
}

// Build the candidate catalog: built-in exerciseLibrary + user's custom
// exercises (non-tombstoned), de-duped by name. Custom takes precedence so
// the user's own canonical naming wins.
async function buildExerciseCatalog() {
    const customs = (await performDB('customExercises', 'getAll'))
        .filter(c => !c.deleted);
    const byName = new Map();
    exerciseLibrary.forEach(e => byName.set(e.name, { name: e.name, muscle: e.muscle, isCustom: false }));
    customs.forEach(c => byName.set(c.name, { name: c.name, muscle: c.muscle, isCustom: true }));
    return [...byName.values()];
}

// v9.21 — Recommender redesign. Picks two target muscles from three
// signals (recency deficit, declining trend, day-of-week affinity), then
// chooses 1–2 exercises per target ranked by familiarity. Sets-per-exercise
// come from the user's historical median for that exercise in the adaptive
// lookback window (1–4 weeks by tenure). Total session time is the budget,
// not just time-under-the-bar. Every 3rd recommendation-launched workout
// adds +1 set to the most familiar exercise for a slow progressive nudge.
async function generateRecommendedWorkout() {
    const all = await getActiveWorkouts();
    if (all.length < 5) return null;

    const lookbackDays = await computeLookbackDays();

    // ---- Signals ---------------------------------------------------------
    const coverage = await computeMuscleCoverage(lookbackDays);
    const trend = await computeMuscleTrend(lookbackDays);
    const todayDow = new Date().getDay();
    const weekdayProfile = await computeWeekdayMuscleProfile(todayDow, lookbackDays);
    const wTotal = Object.values(weekdayProfile.counts).reduce((a, b) => a + b, 0);
    const maxCoverage = Math.max(1, ...Object.values(coverage));

    // Weekday lock: if today's weekday has ≥3 sessions historically AND
    // one muscle accounts for ≥40% of those sessions' sets, that muscle
    // is "the day's lift" — a near-fixed pick. Reflects routine users who
    // have Mon = push, Tue = pull etc.
    let weekdayLock = null;
    if (weekdayProfile.sessions >= 3 && wTotal > 0) {
        let bestM = null, bestShare = 0;
        for (const m of MUSCLES) {
            const share = weekdayProfile.counts[m] / wTotal;
            if (share > bestShare) { bestShare = share; bestM = m; }
        }
        if (bestShare >= 0.4) weekdayLock = bestM;
    }

    // Combined per-muscle score = (1 − normalized recency) + decline trend.
    // Deterministic alpha tie-break so repeated calls don't flip-flop.
    const scored = MUSCLES.map(m => ({
        muscle: m,
        score: (1 - coverage[m] / maxCoverage) + Math.max(0, -trend[m]),
    })).sort((a, b) => b.score - a.score || a.muscle.localeCompare(b.muscle));

    const targets = [];
    if (weekdayLock) targets.push(weekdayLock);
    for (const s of scored) {
        if (targets.includes(s.muscle)) continue;
        targets.push(s.muscle);
        if (targets.length >= 2) break;
    }

    // ---- Exercise picks --------------------------------------------------
    const freq = {};
    for (const w of all) freq[w.exercise] = (freq[w.exercise] || 0) + 1;
    const dayJitter = new Date().getDate();

    const catalog = await buildExerciseCatalog();
    const picks = [];
    targets.forEach((m, ti) => {
        const candidates = catalog
            .filter(c => c.muscle === m)
            .map((c, idx) => ({
                name: c.name,
                muscle: c.muscle,
                familiarity: freq[c.name] || 0,
                jitter: (idx + dayJitter + ti * 7) % 5,
            }))
            .sort((a, b) => b.familiarity - a.familiarity || a.jitter - b.jitter);
        let added = 0;
        for (const c of candidates) {
            if (picks.find(p => p.name === c.name)) continue;
            picks.push({ name: c.name, muscle: c.muscle });
            added++;
            if (added >= 2) break;
        }
    });
    if (!picks.length) return null;

    // ---- Set sizing ------------------------------------------------------
    // Each exercise gets the user's historical median sets-per-session for
    // that exercise (capped 2..6 inside the helper). Trim/expand to fit the
    // total-time budget ±25%. Total-time basis means rest is folded in, so
    // the duration headline matches wall clock.
    const targetMinutes = await computeMedianSessionMinutes(4);
    const secPerSet = await computeMedianSecPerSet(4);
    const targetSeconds = targetMinutes * 60;

    let exercises = [];
    for (const p of picks) {
        const sets = await medianSetsForExercise(p.name, lookbackDays);
        exercises.push({ ...p, sets });
    }

    const totalSets = () => exercises.reduce((s, e) => s + e.sets, 0);
    let guard = 0;
    while (totalSets() * secPerSet > targetSeconds * 1.25 && exercises.length > 1 && guard++ < 20) {
        // Shrink: drop a set from the highest-set exercise; if all already
        // at the 2-set floor, drop the trailing exercise instead.
        let maxIdx = 0;
        for (let i = 1; i < exercises.length; i++) {
            if (exercises[i].sets > exercises[maxIdx].sets) maxIdx = i;
        }
        if (exercises[maxIdx].sets > 2) exercises[maxIdx].sets -= 1;
        else exercises.pop();
    }
    if (totalSets() * secPerSet < targetSeconds * 0.75 && exercises.length < 4) {
        const used = new Set(exercises.map(e => e.name));
        for (const m of targets) {
            const extra = catalog
                .filter(c => c.muscle === m && !used.has(c.name))
                .sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0))[0];
            if (extra) {
                const sets = await medianSetsForExercise(extra.name, lookbackDays);
                exercises.push({ name: extra.name, muscle: extra.muscle, sets });
                break;
            }
        }
    }

    // Progressive nudge: every 3rd completed rec'd workout adds +1 to the
    // most familiar exercise in the picks. Capped at 6 inside the helper
    // semantics — also re-clamped here so the bump never breaks the ceiling.
    const bumpCount = readRecBumpCount();
    if (bumpCount > 0 && bumpCount % 3 === 0 && exercises.length) {
        let bumpIdx = 0;
        for (let i = 1; i < exercises.length; i++) {
            if ((freq[exercises[i].name] || 0) > (freq[exercises[bumpIdx].name] || 0)) bumpIdx = i;
        }
        if (exercises[bumpIdx].sets < 6) exercises[bumpIdx].sets += 1;
    }

    const estSeconds = exercises.reduce((s, e) => s + e.sets * secPerSet, 0);
    return {
        exercises,
        estimatedMinutes: Math.max(1, Math.round(estSeconds / 60)),
        targets,
        lookbackDays,
        weekdayLocked: !!weekdayLock,
    };
}

// ----------------------------------------------------------------------------
// Focus card — six muscle rows with set count over the trailing 14 days.
//
// Sorted descending by set count so the over-trained muscles sit at the
// top and the trailing pair lands at the bottom — the same pair the
// Recommended-next card will target. The headline calls out the trailing
// muscle(s) when they're <50% of the leading muscle, otherwise reports
// "Balanced across muscle groups".
// ----------------------------------------------------------------------------
async function renderFocus() {
    const card = $('focus-card');
    const list = $('focus-list');
    const headline = $('focus-headline');
    if (!list || !headline) return;
    list.innerHTML = "";

    // Hide the card (and the Plan section header — owned by renderFocus
    // since it runs first in renderAll) entirely when the user has logged
    // nothing. The welcome hint at the bottom of Home covers the
    // zero-data case, so stacking three empty-state messages would just
    // feel noisy.
    const all = await getActiveWorkouts();
    const header = $('plan-section-header');
    if (card) card.style.display = all.length ? '' : 'none';
    if (header) header.style.display = all.length ? '' : 'none';
    if (!all.length) return;

    const coverage = await computeMuscleCoverage(14);
    const total = Object.values(coverage).reduce((a, b) => a + b, 0);

    if (!total) {
        headline.textContent = 'No sets in the last 14 days — log one to get a recommendation.';
        return;
    }

    const sorted = [...MUSCLES].sort((a, b) => coverage[b] - coverage[a]);
    const max = coverage[sorted[0]] || 1;

    // Trailing muscles: count is <50% of the leading muscle. Only flag two
    // at most so the headline stays scannable.
    const trailing = sorted.filter(m => coverage[m] < max * 0.5).slice(-2);
    if (trailing.length && coverage[trailing[trailing.length - 1]] === 0) {
        // At least one muscle has zero sets — name them explicitly.
        const zeroes = sorted.filter(m => coverage[m] === 0);
        const named = zeroes.slice(0, 2).map(titleCase).join(' and ');
        headline.textContent = `${named} untouched in the last 14 days.`;
    } else if (trailing.length) {
        const named = trailing.map(titleCase).join(' and ');
        headline.textContent = `${named} trailing — balance those next.`;
    } else {
        headline.textContent = 'Balanced across muscle groups.';
    }

    sorted.forEach(m => {
        const v = coverage[m];
        const pct = max ? (v / max) * 100 : 0;
        const row = document.createElement('div');
        row.className = 'focus-row';
        row.innerHTML = `
            <span class="focus-name"><span class="muscle-tag" style="background:${muscleColor[m]}"></span>${titleCase(m)}</span>
            <div class="focus-track"><div class="focus-fill" style="width:${pct.toFixed(1)}%;background:${muscleColor[m]}"></div></div>
            <span class="focus-count">${v}</span>
        `;
        list.appendChild(row);
    });
}

// ----------------------------------------------------------------------------
// Recommended next card — an ad-hoc workout picked to target the user's
// trailing muscles, sized to their median session length.
//
// Renders the exercise list, an estimated duration ("≈ 42 min · targets
// legs, core"), and a CTA that starts a session with the picks queued as
// tap-to-fill chips on the Workout screen. Empty state fires when the
// user has fewer than ~5 logged sets total.
// ----------------------------------------------------------------------------
async function renderRecommendedNext() {
    const card = $('recommended-card');
    const list = $('recommended-list');
    const headline = $('recommended-headline');
    const dur = $('recommended-duration');
    const cta = $('recommended-cta');
    if (!list || !headline) return;

    // Hide the card entirely when the user has logged nothing — see the
    // same rationale in renderFocus().
    const all = await getActiveWorkouts();
    if (card) card.style.display = all.length ? '' : 'none';
    if (!all.length) return;

    const rec = await generateRecommendedWorkout();
    if (!rec) {
        headline.textContent = 'Log a few sets and I’ll recommend your next workout.';
        list.innerHTML = '';
        if (dur) dur.textContent = '';
        if (cta) cta.style.display = 'none';
        return;
    }

    const targetsLabel = rec.targets.map(titleCase).join(', ');
    headline.textContent = `Targets ${targetsLabel.toLowerCase()}.`;
    if (dur) dur.textContent = `≈ ${rec.estimatedMinutes} min`;

    list.innerHTML = rec.exercises.map(ex => `
        <div class="recommended-row">
            <span class="recommended-name"><span class="muscle-tag" style="background:${muscleColor[ex.muscle]}"></span>${escapeHtml(titleCase(ex.name))}</span>
            <span class="recommended-sets">${ex.sets} sets</span>
        </div>
    `).join('');

    if (cta) cta.style.display = '';
}

// ----------------------------------------------------------------------------
// Suggested-queue (Workout screen) — chips above the active session that
// reflect the recommendation the user tapped on Home. Each chip shows
// "exercise · logged/target"; tapping opens quick-add prefilled. The queue
// lives in localStorage under ironSuggestedQueue and is cleared in
// endWorkoutSession. Not synced — ephemeral session state.
// ----------------------------------------------------------------------------
const SUGGESTED_QUEUE_KEY = 'ironSuggestedQueue';

function readSuggestedQueue() {
    try {
        const raw = localStorage.getItem(SUGGESTED_QUEUE_KEY);
        if (!raw) return null;
        const q = JSON.parse(raw);
        return Array.isArray(q) ? q : null;
    } catch { return null; }
}

function writeSuggestedQueue(q) {
    if (!q || !q.length) localStorage.removeItem(SUGGESTED_QUEUE_KEY);
    else localStorage.setItem(SUGGESTED_QUEUE_KEY, JSON.stringify(q));
}

function clearSuggestedQueue() {
    localStorage.removeItem(SUGGESTED_QUEUE_KEY);
    const el = $('suggested-queue');
    if (el) { el.style.display = 'none'; el.innerHTML = ''; }
}

async function renderSuggestedQueue() {
    const el = $('suggested-queue');
    if (!el) return;
    const queue = readSuggestedQueue();
    if (!activeSession || !queue?.length) {
        el.style.display = 'none';
        el.innerHTML = '';
        return;
    }
    // Recompute per-exercise set counts from the active session so chips
    // reflect reality even after edits/deletes/voice logs.
    const sessionSets = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === activeSession.id && !w.deleted);
    const counts = {};
    sessionSets.forEach(w => { counts[w.exercise] = (counts[w.exercise] || 0) + 1; });

    el.style.display = '';
    el.innerHTML = `
        <div class="suggested-queue-label">Suggested</div>
        <div class="suggested-queue-chips">
            ${queue.map(q => {
                const done = counts[q.name] || 0;
                const complete = done >= q.sets;
                return `<button type="button" class="suggested-chip${complete ? ' done' : ''}" data-action="openQuickAdd" data-exercise="${escapeHtml(q.name)}" aria-label="Log ${escapeHtml(titleCase(q.name))}, ${done} of ${q.sets} sets logged">
                    <span class="suggested-chip-dot" style="background:${muscleColor[q.muscle] || '#888'}"></span>
                    <span class="suggested-chip-name">${escapeHtml(titleCase(q.name))}</span>
                    <span class="suggested-chip-count">${done}/${q.sets}</span>
                </button>`;
            }).join('')}
        </div>
    `;
}

// CTA handler — wired into ACTIONS as startRecommendedWorkout. Stashes the
// current recommendation as the suggested queue, starts a session (silent
// so the explicit-action haptic on the session card doesn't double the
// queue-stash haptic), and routes to Workout so the user lands on the
// suggested chips ready to log.
async function startRecommendedWorkout() {
    const rec = await generateRecommendedWorkout();
    if (!rec) return;   // CTA shouldn't be visible in this case; defensive
    writeSuggestedQueue(rec.exercises.map(e => ({
        name: e.name, muscle: e.muscle, sets: e.sets,
    })));
    showScreen('workout');
    if (!activeSession) await startWorkoutSession();
    await renderSuggestedQueue();
    haptic(15);
}

// ============================================================================
// Strain / recovery score
// ============================================================================

async function renderStrain() {
    const card = $('strain-card');
    const text = $('strain-text');
    const sub = $('strain-sub');
    card.classList.remove('recovery', 'steady', 'high', 'over');

    // v9.26 — strain is a tonnage signal; warmups don't load the body the
    // way work sets do, so they shouldn't push you toward "Overreach".
    const workouts = await getActiveWorkSets();
    if (!workouts.length) {
        text.textContent = '—';
        sub.textContent = 'Log a set';
        return;
    }

    // Volume over windows
    const w = workouts;
    const sum = (since) => w.filter(x => x.date >= since).reduce((s, x) => s + x.weight * x.reps, 0);
    const last7 = sum(isoForOffset(6));
    const prev7 = sum(isoForOffset(13)) - last7;

    // Days since last lift
    const lastDate = w.map(x => x.date).sort().pop();
    const dsl = dayDiff(lastDate, todayISO());

    // Sessions in last 7
    const dates7 = new Set(w.filter(x => x.date >= isoForOffset(6)).map(x => x.date));

    let label, subtext, cls;
    // Rested: whenever the user has been 4+ days since their last lift,
    // regardless of whether they had earlier sessions in the rolling 7-day
    // window. Previously required dates7.size === 0, which incorrectly
    // skipped "Rested" if you had a Monday session and it was now Friday.
    if (dsl >= 4) {
        label = 'Rested'; subtext = `${dsl}d off`; cls = 'recovery';
    } else if (prev7 === 0 && last7 > 0) {
        label = 'Ramping'; subtext = `${dates7.size} session${dates7.size === 1 ? '' : 's'}`; cls = 'steady';
    } else {
        const delta = (last7 - prev7) / Math.max(prev7, 1);
        if (delta > 0.5) { label = 'Overreach'; subtext = `+${Math.round(delta * 100)}% vs prior wk`; cls = 'over'; }
        else if (delta > 0.2) { label = 'High strain'; subtext = `+${Math.round(delta * 100)}% vs prior wk`; cls = 'high'; }
        else if (delta < -0.3) { label = 'Deload'; subtext = `${Math.round(delta * 100)}% vs prior wk`; cls = 'steady'; }
        else { label = 'Steady'; subtext = `${dates7.size} session${dates7.size === 1 ? '' : 's'} · 7d`; cls = 'steady'; }
    }

    text.textContent = label;
    sub.textContent = subtext;
    card.classList.add(cls);
}

// ============================================================================
// Swipe-to-delete
// ============================================================================

async function deleteEntry(id, silent = false) {
    try {
        const entry = await performDB('workouts', 'get', id);
        if (!entry) return;
        entry.deleted = true;
        entry.modifiedAt = Date.now();
        await performDB('workouts', 'put', entry);
        markUnsynced();   // v8
        markFrequencyDirty();
        await recomputePR(entry.exercise);
        await renderHistory();
        await renderFocus();
        await renderRecommendedNext();
        await renderStrain();
        await refreshLatestStats();
        await refreshSessionCard();   // v8: keep workout dashboard in sync if a session set was removed
        await renderSuggestedQueue();
        if (!silent) {
            haptic(20);
            // Stage the entry for one-tap undo; snackbar dismisses itself
            // after 5s and we just leave the tombstone in place.
            _lastDeletedId = id;
            const label = `Deleted ${titleCase(entry.exercise)}`;
            showSnackbar(label, {
                actionLabel: 'Undo',
                onAction: undoLastDelete,
                duration: 5000,
            });
        }
    } catch (err) { console.error('Delete failed', err); }
}

async function recomputePR(exercise) {
    // Warmups are excluded — they're tracked but never count toward the
    // record. Same rule the Worker's recomputePRs enforces server-side.
    const all = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && !w.warmup && w.exercise === exercise);
    if (!all.length) { await performDB('prs', 'delete', exercise); return; }
    // Two independent winners — heaviest weight ever lifted, and best
    // estimated 1RM. They may be the same set (combo PR) or different
    // (rep work beat a heavy single's Epley). prType picks which is more
    // recent, so the card leads with the latest milestone.
    const bestByW   = all.reduce((b, w) => w.weight > b.weight ? w : b);
    const bestBy1RM = all.reduce((b, w) => w.oneRM  > b.oneRM  ? w : b);
    const prType    = bestByW.id >= bestBy1RM.id ? 'weight' : '1rm';
    await performDB('prs', 'put', {
        exercise,
        maxWeight:      bestByW.weight,
        maxWeightReps:  bestByW.reps,
        max1RM:         bestBy1RM.oneRM,
        max1RMWeight:   bestBy1RM.weight,
        max1RMReps:     bestBy1RM.reps,
        achievedAt:     Math.max(bestByW.id, bestBy1RM.id),
        prType,
    });
}

// ============================================================================
// Rest timer
// ============================================================================

function startRestTimer(seconds) {
    if (restTimerHandle) clearInterval(restTimerHandle);
    if (restCompleteTimeout) clearTimeout(restCompleteTimeout);
    const pill = $('rest-timer');
    const text = $('timer-text');
    let remaining = seconds;

    pill.classList.remove('complete');
    pill.classList.add('active');

    const update = () => {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        text.textContent = `${m}:${String(s).padStart(2, '0')}`;
    };
    update();

    restTimerHandle = setInterval(() => {
        remaining--;
        update();
        if (remaining <= 0) {
            clearInterval(restTimerHandle);
            restTimerHandle = null;
            pill.classList.add('complete');
            text.textContent = "Go";
            haptic([60, 80, 60, 80, 120]);
            restCompleteTimeout = setTimeout(() => pill.classList.remove('active'), 4000);
        }
    }, 1000);
}

// v9.7 — extracted so endWorkoutSession can reuse the timer cleanup
// without firing a haptic blip on top of the end-workout vibration.
function clearRestTimer() {
    if (restTimerHandle) { clearInterval(restTimerHandle); restTimerHandle = null; }
    if (restCompleteTimeout) { clearTimeout(restCompleteTimeout); restCompleteTimeout = null; }
    const pill = $('rest-timer');
    if (pill) {
        pill.classList.remove('active');
        pill.classList.remove('complete');
    }
}

function dismissTimer() {
    clearRestTimer();
    haptic(10);
}

// ============================================================================
// Profile
// ============================================================================

function saveProfile() {
    const first = $('first-name').value.trim();
    const last = $('last-name').value.trim();
    const email = $('user-email').value.trim();
    if (!first) { $('first-name').focus(); return; }
    userProfile = { first, last, email };
    localStorage.setItem('ironUser', JSON.stringify(userProfile));
    $('user-display').textContent = `Hi, ${first}`;
    $('profile-overlay').classList.remove('active');
    haptic(15);
    maybeShowVoiceTip();   // first-run nudge
}

// ============================================================================
// Profile screen (v9.0)
//
// v8 had this content in a sheet (settings-overlay) opened from the Profile
// tab. v9.0 promotes it to a real screen. The same input IDs are reused so
// the existing functions (testConnection, restoreFromNAS, exportJSON, etc.)
// continue to work without modification.
//
// Field saves used to happen on sheet-dismiss (closeSettings); now they
// happen on tab-switch via saveProfileFromScreen, which showScreen() calls
// when navigating away from the Profile screen.
// ============================================================================

function renderProfileScreen() {
    $('settings-first').value = userProfile?.first || '';
    if ($('settings-last')) $('settings-last').value = userProfile?.last || '';
    $('settings-email').value = userProfile?.email || '';
    $('settings-token').value = getToken();
    setSegmentedActive($('rest-segment'), b => parseInt(b.dataset.val, 10) === restDuration);
    setSegmentedActive($('theme-segment'), b => b.dataset.val === theme);
    setSegmentedActive($('workout-mode-segment'), b => b.dataset.val === (workoutMode ? 'on' : 'off'));
    populateVoicePicker();
    if ($('voice-rate')) {
        $('voice-rate').value = voiceRate;
        $('voice-rate-label').textContent = `${voiceRate.toFixed(2)}×`;
        $('voice-rate').setAttribute('aria-valuetext', `${voiceRate.toFixed(2)} times speed`);
    }
    $('ping-state').textContent = '—';
    $('ping-state').className = 'row-trailing';
    renderTemplatesList();
    renderCustomsList();
    renderSyncMeta();
    renderVersionFooter();   // re-render version string in case of bump
}

function saveProfileFromScreen() {
    if (!$('settings-first')) return;   // screen not in the DOM (early boot)
    const first = $('settings-first').value.trim();
    const last = $('settings-last') ? $('settings-last').value.trim() : (userProfile?.last || '');
    const email = $('settings-email').value.trim();
    if (userProfile) {
        userProfile.first = first || userProfile.first;
        userProfile.last = last;     // v9.1: last name editable from Profile (was capture-only at signup)
        userProfile.email = email;
        localStorage.setItem('ironUser', JSON.stringify(userProfile));
        $('user-display').textContent = `Hi, ${userProfile.first}`;
    }
    const token = $('settings-token').value.trim();
    if (token) localStorage.setItem('ironToken', token);
    else localStorage.removeItem('ironToken');
}

// Compatibility shims — internal callers (e.g. the welcome flow) used to
// call these names. Map them onto the new screen-based equivalents.
function openSettings() { showScreen('profile'); }
function closeSettings() { saveProfileFromScreen(); }

function renderSyncMeta() {
    const el = $('sync-meta');
    if (!el) return;
    if (!lastSyncMeta) { el.textContent = 'No sync activity yet.'; return; }
    const ago = Math.floor((Date.now() - lastSyncMeta.at) / 60000);
    const agoStr = ago < 1 ? 'just now' : ago < 60 ? `${ago}m ago` : `${Math.floor(ago / 60)}h ago`;
    const parts = [`Last sync: ${agoStr}`];
    if (lastSyncMeta.delta) parts.push(`+${lastSyncMeta.delta.added}, ✕${lastSyncMeta.delta.marked}`);
    if (lastSyncMeta.error) parts.push('Last attempt failed');
    el.textContent = parts.join(' · ');
}

async function testConnection() {
    const token = $('settings-token').value.trim();
    if (!token) { $('ping-state').textContent = 'No token'; $('ping-state').className = 'row-trailing error'; return; }
    $('ping-state').textContent = '…';
    $('ping-state').className = 'row-trailing';
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ action: 'ping' })
        });
        if (res.ok) {
            $('ping-state').textContent = 'OK';
            $('ping-state').className = 'row-trailing success';
            localStorage.setItem('ironToken', token);
        } else if (res.status === 401) {
            $('ping-state').textContent = 'Bad token';
            $('ping-state').className = 'row-trailing error';
        } else {
            $('ping-state').textContent = `HTTP ${res.status}`;
            $('ping-state').className = 'row-trailing error';
        }
    } catch (err) {
        $('ping-state').textContent = 'Offline';
        $('ping-state').className = 'row-trailing error';
    }
    haptic(10);
}

async function logoutFromSettings() {
    const ok = await confirmSheet({
        title: 'Sign out of this device?',
        body: 'Cloud history is preserved — sign back in with the same email to restore.',
        confirmLabel: 'Sign out',
        danger: true,
    });
    if (!ok) return;
    localStorage.removeItem('ironUser');
    localStorage.removeItem('ironToken');
    location.reload();
}

async function wipeFromSettings() {
    const ok = await confirmSheet({
        title: 'Wipe local data?',
        body: 'All local history, PRs, and templates will be removed. This cannot be undone.',
        confirmLabel: 'Wipe',
        danger: true,
    });
    if (!ok) return;
    await performDB('workouts', 'clear');
    await performDB('prs', 'clear');
    await performDB('templates', 'clear');
    location.reload();
}

async function exportJSON() {
    const data = await performDB('workouts', 'getAll');
    const prs = await performDB('prs', 'getAll');
    const templates = await performDB('templates', 'getAll');
    const blob = new Blob([JSON.stringify({ user: userProfile, data, prs, templates, exportedAt: Date.now() }, null, 2)], { type: 'application/json' });
    triggerDownload(blob, `ironvoice-${todayISO()}.json`);
    haptic(15);
}

async function exportHealthCSV() {
    const data = await getActiveWorkouts();
    if (!data.length) {
        await infoSheet({ title: 'No data to export', body: 'Log at least one set, then try again.' });
        return;
    }
    // Schema compatible with Health Auto Export "Workout" CSV import
    const lines = ['Date,Exercise,Muscle Group,Weight (lb),Reps,Estimated 1RM (lb),Volume (lb)'];
    data.sort((a, b) => a.id - b.id).forEach(w => {
        lines.push([
            new Date(w.id).toISOString(),
            `"${w.exercise}"`,
            muscleOf(w.exercise),
            w.weight,
            w.reps,
            Math.round(w.oneRM),
            Math.round(w.weight * w.reps),
        ].join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    triggerDownload(blob, `ironvoice-health-${todayISO()}.csv`);
    haptic(15);
}

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// Templates (with per-exercise targets)
// ============================================================================

async function renderTemplateChips() {
    const container = $('template-chips');
    container.innerHTML = "";
    const templates = await getActiveTemplates();

    if (templates.length) {
        const allChip = document.createElement('button');
        allChip.className = 'tpl-chip' + (activeTemplate ? '' : ' active');
        allChip.textContent = 'All';
        allChip.onclick = () => { activeTemplate = null; renderTemplateChips(); renderTemplateProgress(); };
        container.appendChild(allChip);

        templates.forEach(t => {
            const chip = document.createElement('button');
            chip.className = 'tpl-chip' + (activeTemplate?.id === t.id ? ' active' : '');
            chip.textContent = t.name;
            chip.onclick = () => {
                activeTemplate = activeTemplate?.id === t.id ? null : t;
                renderTemplateChips();
                renderTemplateProgress();
                haptic(8);
            };
            container.appendChild(chip);
        });
    }

    const addChip = document.createElement('button');
    addChip.className = 'tpl-chip tpl-chip-add';
    addChip.textContent = templates.length ? '+' : '+ New template';
    addChip.onclick = newTemplate;
    container.appendChild(addChip);
}

async function renderTemplatesList() {
    const list = $('templates-list');
    list.innerHTML = "";
    const templates = await getActiveTemplates();
    if (!templates.length) { list.innerHTML = `<div class="empty-mini">No templates yet</div>`; return; }
    templates.forEach(t => {
        const row = document.createElement('div');
        row.className = 'tpl-row';
        row.innerHTML = `<div class="tpl-meta"><span class="tpl-name">${escapeHtml(t.name)}</span><span class="tpl-count">${t.exercises.length} exercise${t.exercises.length === 1 ? '' : 's'}</span></div><span class="chev">›</span>`;
        row.onclick = () => editTemplate(t);
        list.appendChild(row);
    });
}

function newTemplate() {
    editingTemplate = { id: Date.now(), name: '', exercises: [] };
    $('tpl-name').value = '';
    $('tpl-delete-wrap').style.display = 'none';
    renderTemplateEditor();
    $('tpl-overlay').classList.add('active');
    setTimeout(() => $('tpl-name').focus(), 350);
}

function editTemplate(t) {
    editingTemplate = JSON.parse(JSON.stringify(t));
    $('tpl-name').value = t.name;
    $('tpl-delete-wrap').style.display = '';
    renderTemplateEditor();
    $('tpl-overlay').classList.add('active');
}

function renderTemplateEditor() {
    const grid = $('tpl-exercises');
    const targets = $('tpl-targets');
    grid.innerHTML = "";
    targets.innerHTML = "";

    MUSCLES.forEach(m => {
        const exForGroup = exerciseLibrary.filter(ex => ex.muscle === m);
        if (!exForGroup.length) return;
        const group = document.createElement('div');
        group.className = 'ex-group';
        const label = document.createElement('div');
        label.className = 'ex-group-label';
        label.innerHTML = `<span class="leg-dot" style="background:${muscleColor[m]}"></span>${titleCase(m)}`;
        group.appendChild(label);
        const chipRow = document.createElement('div');
        chipRow.className = 'chip-grid';
        exForGroup.forEach(ex => {
            const isSelected = editingTemplate.exercises.some(e => e.name === ex.name);
            const chip = document.createElement('button');
            chip.className = 'chip' + (isSelected ? ' selected' : '');
            chip.textContent = titleCase(ex.name);
            chip.onclick = () => {
                const idx = editingTemplate.exercises.findIndex(e => e.name === ex.name);
                if (idx >= 0) editingTemplate.exercises.splice(idx, 1);
                else editingTemplate.exercises.push({ name: ex.name });
                renderTemplateEditor();
                haptic(6);
            };
            chipRow.appendChild(chip);
        });
        group.appendChild(chipRow);
        grid.appendChild(group);
    });

    if (!editingTemplate.exercises.length) return;

    const header = document.createElement('div');
    header.className = 'section-label';
    header.style.padding = '20px 4px 8px';
    header.textContent = 'Targets (optional)';
    targets.appendChild(header);

    editingTemplate.exercises.forEach((target, idx) => {
        const row = document.createElement('div');
        row.className = 'target-row';
        row.innerHTML = `
            <div class="target-name">${titleCase(target.name)}</div>
            <div class="target-inputs">
                <label><span>Weight</span><input type="number" inputmode="decimal" placeholder="—" value="${target.targetWeight ?? ''}" data-field="targetWeight" data-idx="${idx}"></label>
                <label><span>Reps</span><input type="number" inputmode="numeric" placeholder="—" value="${target.targetReps ?? ''}" data-field="targetReps" data-idx="${idx}"></label>
                <label><span>Sets</span><input type="number" inputmode="numeric" placeholder="—" value="${target.sets ?? ''}" data-field="sets" data-idx="${idx}"></label>
            </div>`;
        targets.appendChild(row);
    });

    targets.querySelectorAll('input[data-field]').forEach(input => {
        input.addEventListener('input', e => {
            const idx = parseInt(e.target.dataset.idx, 10);
            const field = e.target.dataset.field;
            const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
            if (val === undefined) delete editingTemplate.exercises[idx][field];
            else editingTemplate.exercises[idx][field] = val;
        });
    });
}

function cancelTemplate() {
    $('tpl-overlay').classList.remove('active');
    editingTemplate = null;
    haptic(8);
}

async function saveTemplate() {
    const name = $('tpl-name').value.trim();
    if (!name) { $('tpl-name').focus(); haptic([20,50,20]); return; }
    if (!editingTemplate.exercises.length) { haptic([20,50,20]); return; }
    editingTemplate.name = name;
    editingTemplate.modifiedAt = Date.now();
    await performDB('templates', 'put', editingTemplate);
    markUnsynced();   // v8
    if (activeTemplate?.id === editingTemplate.id) activeTemplate = editingTemplate;
    $('tpl-overlay').classList.remove('active');
    await renderTemplateChips();
    await renderTemplatesList();
    await renderTemplateProgress();
    haptic(15);
}

async function deleteTemplate() {
    const ok = await confirmSheet({
        title: `Delete "${editingTemplate.name}"?`,
        body: 'The template will be removed. Logged sets that used it stay in your history.',
        confirmLabel: 'Delete',
        danger: true,
    });
    if (!ok) return;
    editingTemplate.deleted = true;
    editingTemplate.modifiedAt = Date.now();
    await performDB('templates', 'put', editingTemplate);
    markUnsynced();   // v8
    if (activeTemplate?.id === editingTemplate.id) activeTemplate = null;
    $('tpl-overlay').classList.remove('active');
    await renderTemplateChips();
    await renderTemplatesList();
    await renderTemplateProgress();
    haptic(20);
}

// ============================================================================
// Item 13: Custom exercises
// ============================================================================

async function renderCustomsList() {
    const list = $('customs-list');
    if (!list) return;
    list.innerHTML = "";
    const customs = await getActiveCustoms();
    if (!customs.length) {
        list.innerHTML = `<div class="empty-mini">None yet</div>`;
        return;
    }
    customs.sort((a, b) => a.name.localeCompare(b.name));
    customs.forEach(c => {
        const row = document.createElement('div');
        row.className = 'tpl-row';
        const name = escapeHtml(titleCase(c.name));
        const muscle = escapeHtml(titleCase(c.muscle));
        const dot = escapeHtml(muscleColor[c.muscle] || '#888');
        row.innerHTML = `<div class="tpl-meta"><span class="tpl-name">${name}</span><span class="tpl-count"><span class="leg-dot" style="background:${dot};display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;vertical-align:middle"></span>${muscle}</span></div><span class="chev">›</span>`;
        row.addEventListener('click', () => editCustomExercise(c));
        list.appendChild(row);
    });
}

function newCustomExercise() {
    editingCustomExercise = { name: '', muscle: 'arms', synonyms: [], modifiedAt: Date.now() };
    $('custom-name').value = '';
    $('custom-name').disabled = false;
    $('custom-delete-wrap').style.display = 'none';
    setSegmentedActive($('custom-muscle-segment'), b => b.dataset.val === 'arms');
    $('custom-overlay').classList.add('active');
    setTimeout(() => $('custom-name').focus(), 350);
}

function editCustomExercise(c) {
    editingCustomExercise = { ...c };
    $('custom-name').value = titleCase(c.name);
    // Renames would orphan journal entries pointing at the old name.
    // Allow muscle re-tagging only.
    $('custom-name').disabled = true;
    $('custom-delete-wrap').style.display = '';
    setSegmentedActive($('custom-muscle-segment'), b => b.dataset.val === c.muscle);
    $('custom-overlay').classList.add('active');
}

function cancelCustomExercise() {
    $('custom-overlay').classList.remove('active');
    editingCustomExercise = null;
    haptic(8);
}

async function saveCustomExercise() {
    if (!editingCustomExercise) return;
    const isNew = !$('custom-name').disabled;
    const name = $('custom-name').value.trim().toLowerCase();
    if (!name) {
        $('custom-name').focus();
        haptic([20, 50, 20]);
        return;
    }
    if (isNew) {
        const collision = exerciseLibrary.find(ex => ex.name === name);
        if (collision) {
            haptic([20, 50, 20]);
            await infoSheet({
                title: 'Already in the library',
                body: `"${titleCase(name)}" already exists. Pick a different name, or delete the existing entry first.`,
            });
            return;
        }
    }

    editingCustomExercise.name = name;
    editingCustomExercise.modifiedAt = Date.now();
    delete editingCustomExercise.deleted;
    await performDB('customExercises', 'put', editingCustomExercise);
    markUnsynced();   // v8

    // Mutate the in-memory library so search/voice immediately picks it up.
    let lib = exerciseLibrary.find(ex => ex.name === name);
    if (!lib) {
        lib = { name, muscle: editingCustomExercise.muscle, synonyms: [], custom: true };
        exerciseLibrary.push(lib);
    } else if (lib.custom) {
        lib.muscle = editingCustomExercise.muscle;
    }
    rebuildMatchOrder();

    $('custom-overlay').classList.remove('active');
    editingCustomExercise = null;
    await renderCustomsList();
    await renderAll();   // re-render journal + chart with new muscle assignment
    haptic(15);
}

async function deleteCustomExercise() {
    if (!editingCustomExercise) return;
    const ok = await confirmSheet({
        title: `Delete "${titleCase(editingCustomExercise.name)}"?`,
        body: "Existing journal entries with this name stay. New voice/search matches won't include it.",
        confirmLabel: 'Delete',
        danger: true,
    });
    if (!ok) return;

    editingCustomExercise.deleted = true;
    editingCustomExercise.modifiedAt = Date.now();
    await performDB('customExercises', 'put', editingCustomExercise);
    markUnsynced();   // v8

    const idx = exerciseLibrary.findIndex(ex => ex.name === editingCustomExercise.name && ex.custom);
    if (idx >= 0) exerciseLibrary.splice(idx, 1);
    rebuildMatchOrder();

    $('custom-overlay').classList.remove('active');
    editingCustomExercise = null;
    await renderCustomsList();
    await renderAll();
    haptic(20);
}

// ============================================================================
// Template progress (when active template has set targets)
// ============================================================================

async function renderTemplateProgress() {
    const wrap = $('template-progress');
    wrap.innerHTML = "";
    if (!activeTemplate || !activeTemplate.exercises.some(e => e.sets)) {
        wrap.classList.remove('active');
        return;
    }

    const today = todayISO();
    const todays = (await getActiveWorkouts()).filter(w => w.date === today);

    let totalSets = 0, doneSets = 0;
    const items = activeTemplate.exercises.map(target => {
        const goal = target.sets || 0;
        if (!goal) return null;
        totalSets += goal;
        const done = todays.filter(w => w.exercise === target.name).length;
        const doneClipped = Math.min(done, goal);
        doneSets += doneClipped;
        const targetText = [target.targetWeight && `${target.targetWeight}`, target.targetReps && `× ${target.targetReps}`, `× ${goal}`].filter(Boolean).join(' ');
        return `<div class="tp-item ${doneClipped >= goal ? 'done' : ''}"><span><span class="tp-check"></span><span class="tp-ex">${titleCase(target.name)}</span></span><span class="tp-target">${targetText} · ${doneClipped}/${goal}</span></div>`;
    }).filter(Boolean);

    if (!items.length) { wrap.classList.remove('active'); return; }

    wrap.innerHTML = `
        <div class="tp-header">
            <span class="tp-title">${escapeHtml(activeTemplate.name)} · today</span>
            <span class="tp-summary">${doneSets}/${totalSets} sets</span>
        </div>
        <div class="tp-list">${items.join('')}</div>`;
    wrap.classList.add('active');
}

// ============================================================================
// Plate calculator
// ============================================================================

const PLATES = [45, 35, 25, 10, 5, 2.5];

function computePlates(target, bar) {
    if (target < bar) return { error: true };
    const perSide = (target - bar) / 2;
    if (perSide < 0) return { error: true };
    const used = [];
    let remaining = perSide;
    for (const p of PLATES) {
        while (remaining >= p - 0.001) {
            used.push(p);
            remaining -= p;
        }
    }
    const stillLeft = Math.round(remaining * 100) / 100;
    const spoken = used.length ? used.join(', ') + ' per side' : 'just the bar';
    return { perSide, used, leftover: stillLeft, spoken };
}

function openPlate() {
    const cur = parseFloat($('manual-w').value);
    if (!isNaN(cur) && cur > 0) $('plate-target').value = cur;
    $('plate-overlay').classList.add('active');
    setTimeout(() => {
        const el = $('plate-target');
        el.focus();
        selectInputContents(el);
    }, 350);
    renderPlate();
}

function closePlate() { $('plate-overlay').classList.remove('active'); }

// v9.2 — Quick-add another set for an exercise already being worked. Opens
// from the "+ Add set" pill on each session-set-group during an active
// workout. Pre-fills the weight/reps inputs with the previous set's values
// so the common case (same weight × same reps) is one tap → Save.
//
// v9.6 — The same overlay also serves Edit mode: when _quickAddEditId is
// set (by openEditSet), the title reads "Edit set", the inputs pre-fill
// from the entry being edited, and Save routes to updateEntry instead of
// buildEntry/saveAndSyncUI. This avoids duplicating the input markup.
let _quickAddExercise = null;
let _quickAddEditId = null;
// v9.26 — warmup toggle state for the open quick-add sheet. Reset on every
// open so it doesn't carry forward between adds (a warmup is usually one set,
// not a streak). The set-action sheet's warmup toggle goes through a
// separate path (toggleWarmupFromSetAction) so it doesn't share this state.
let _quickAddWarmup = false;
let _setActionId = null;

async function openQuickAdd(el) {
    const exercise = el?.dataset?.exercise;
    if (!exercise) return;
    _quickAddExercise = exercise;
    _quickAddEditId = null;   // explicit Add path
    _quickAddWarmup = false;
    syncQuickAddWarmupRow();

    const lib = exerciseLibrary.find(ex => ex.name === exercise);
    const muscle = lib?.muscle || muscleOf(exercise) || 'core';
    $('quick-add-title').textContent = 'Add set';
    $('quick-add-name').textContent = titleCase(exercise);
    const tagEl = $('quick-add-muscle');
    if (tagEl) tagEl.style.background = muscleColor[muscle] || '#888';

    // Pre-fill from the most recent set of this exercise — first try the
    // active session, then fall back to the all-time most recent so the
    // dialog still has something useful even outside a session. Source
    // drives the messaging: "previous set" reads ambiguous when it's
    // actually from a prior workout, so the prior-workout case gets the
    // explicit last-performed disclaimer (matches selectExercise's hint).
    let prev = null;
    let source = null; // 'session' | 'prior'
    const all = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && w.exercise === exercise);
    if (activeSession) {
        prev = all
            .filter(w => w.sessionId === activeSession.id)
            .sort((a, b) => b.id - a.id)[0] || null;
        if (prev) source = 'session';
    }
    if (!prev) {
        prev = all.sort((a, b) => b.id - a.id)[0] || null;
        if (prev) source = 'prior';
    }

    $('quick-add-w').value = prev ? String(prev.weight) : '';
    $('quick-add-r').value = prev ? String(prev.reps) : '';
    if (!prev) {
        $('quick-add-prev').textContent = 'No previous sets — enter weight and reps.';
    } else if (source === 'session') {
        $('quick-add-prev').textContent = `Previous set: ${prev.weight} × ${prev.reps}`;
    } else {
        $('quick-add-prev').textContent = `Last set: ${prev.weight} × ${prev.reps}`;
    }
    const foot = $('quick-add-foot');
    if (foot) {
        foot.textContent = source === 'prior'
            ? 'No sets logged in this workout yet. Pre-filled from your last performance.'
            : 'Same exercise, new weight × reps. Pre-filled from the previous set.';
    }

    $('quick-add-overlay').classList.add('active');
    setTimeout(() => {
        const el = $('quick-add-w');
        el.focus({ preventScroll: true });
        selectInputContents(el);
    }, 350);
}

// v9.21 — Quick-add stepper handler. Wired to the ± buttons flanking the
// weight and reps inputs. Reads data-target ('w' or 'r') and data-step
// (signed decimal: -5, -2.5, -1, +1, +2.5, +5) off the tapped button,
// applies the delta to the corresponding input, floors at 0, writes back
// without re-focusing — so the iOS keyboard never pops on a stepper tap
// and the gym-floor path can stay keyboard-free.
function bumpQuickAdd(el) {
    if (!el) return;
    // data-input (full element ID, e.g. "manual-w") wins when present so
    // the same handler drives steppers on any surface; the quick-add
    // overlay keeps the original data-target shorthand for backward
    // compatibility.
    const inputId = el.dataset.input
        || (el.dataset.target === 'r' ? 'quick-add-r' : 'quick-add-w');
    const step = parseFloat(el.dataset.step);
    if (!isFinite(step)) return;
    const input = $(inputId);
    if (!input) return;
    const current = parseFloat(input.value);
    let next = (isFinite(current) ? current : 0) + step;
    if (next < 0) next = 0;
    // Round to one decimal so float artifacts (e.g. 225 + 2.5 - 2.5 ≠ 225
    // through repeated taps) never leak into the rendered value. Steps
    // are always 0.5 multiples so .1 precision is enough.
    next = Math.round(next * 10) / 10;
    input.value = String(next);
    haptic(8);
}

function closeQuickAdd() {
    $('quick-add-overlay').classList.remove('active');
    _quickAddExercise = null;
    _quickAddEditId = null;
    _quickAddWarmup = false;
}

// v9.26 — paint the quick-add warmup toggle row to match _quickAddWarmup.
// Both opens (Add and Edit) call this; the in-overlay tap handler
// (toggleQuickAddWarmup) flips state and re-syncs.
function syncQuickAddWarmupRow() {
    const row = $('quick-add-warmup-row');
    if (!row) return;
    row.setAttribute('aria-pressed', _quickAddWarmup ? 'true' : 'false');
    row.classList.toggle('is-on', _quickAddWarmup);
}

function toggleQuickAddWarmup() {
    _quickAddWarmup = !_quickAddWarmup;
    syncQuickAddWarmupRow();
    haptic(6);
}

async function saveQuickAdd() {
    const exercise = _quickAddExercise;
    const w = parseFloat($('quick-add-w').value);
    const r = parseInt($('quick-add-r').value, 10);
    if (!exercise || isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
        haptic([20, 50, 20]);
        return;
    }
    const warmup = _quickAddWarmup;
    if (_quickAddEditId != null) {
        const id = _quickAddEditId;
        closeQuickAdd();
        await updateEntry(id, w, r, { warmup });
        haptic(15);
        return;
    }
    const entry = buildEntry(exercise, w, r, { warmup });
    closeQuickAdd();
    await saveAndSyncUI(entry);
    haptic(15);
}

// v9.6 — Open the quick-add overlay in Edit mode for an existing entry.
// Same overlay markup as Add; differs in title, prefilled values (current
// entry, not previous set), and the Save handler routes to updateEntry.
async function openEditSet(id) {
    const entry = await performDB('workouts', 'get', id);
    if (!entry || entry.deleted) return;
    _quickAddExercise = entry.exercise;
    _quickAddEditId = id;
    _quickAddWarmup = !!entry.warmup;
    syncQuickAddWarmupRow();

    const lib = exerciseLibrary.find(ex => ex.name === entry.exercise);
    const muscle = lib?.muscle || muscleOf(entry.exercise) || 'core';
    $('quick-add-title').textContent = 'Edit set';
    $('quick-add-name').textContent = titleCase(entry.exercise);
    const tagEl = $('quick-add-muscle');
    if (tagEl) tagEl.style.background = muscleColor[muscle] || '#888';

    $('quick-add-w').value = String(entry.weight);
    $('quick-add-r').value = String(entry.reps);
    $('quick-add-prev').textContent =
        `Logged ${new Date(entry.id).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    const foot = $('quick-add-foot');
    if (foot) foot.textContent = 'Edits update this set in place — its order and timestamp are preserved.';

    $('quick-add-overlay').classList.add('active');
    setTimeout(() => {
        const el = $('quick-add-w');
        el.focus({ preventScroll: true });
        selectInputContents(el);
    }, 350);
}

// v9.6 — Update an existing set's weight/reps. Mirrors deleteEntry's
// re-render fan-out so PR badges, charts, and the active session card
// reflect the new value immediately. PR is recomputed (not just compared)
// because an edit can move the PR up OR down.
async function updateEntry(id, weight, reps, { warmup } = {}) {
    try {
        const entry = await performDB('workouts', 'get', id);
        if (!entry || entry.deleted) return;
        entry.weight = weight;
        entry.reps = reps;
        entry.oneRM = epley(weight, reps);
        // v9.26 — when the caller passes warmup, write it; otherwise keep
        // the existing flag. Toggling warmup forces a PR recompute below
        // because the set may be entering or leaving the PR candidate pool.
        if (warmup !== undefined) entry.warmup = !!warmup;
        entry.modifiedAt = Date.now();
        await performDB('workouts', 'put', entry);
        markUnsynced();
        await recomputePR(entry.exercise);
        await renderHistory();
        await renderFocus();
        await renderRecommendedNext();
        await renderStrain();
        await refreshLatestStats();
        await refreshSessionCard();
        showSnackbar(`Updated ${titleCase(entry.exercise)}`, { duration: 3000 });
    } catch (err) { console.error('Edit failed', err); }
}

// v9.6 — Set action sheet. Tap a pill on the active workout screen or in
// History day-detail to open this; surfaces a summary plus Edit / Delete.
// Replaces the v9.2 long-press-to-delete gesture, which sighted users
// couldn't discover. Active-workout pills had no delete path before this.
async function openSetAction(el) {
    const id = parseInt(el?.dataset?.id, 10);
    if (!Number.isFinite(id)) return;
    const entry = await performDB('workouts', 'get', id);
    if (!entry || entry.deleted) return;
    _setActionId = id;

    const lib = exerciseLibrary.find(ex => ex.name === entry.exercise);
    const muscle = lib?.muscle || muscleOf(entry.exercise) || 'core';

    const muscleEl = $('set-action-muscle');
    if (muscleEl) muscleEl.style.background = muscleColor[muscle] || '#888';
    $('set-action-name').textContent = titleCase(entry.exercise);
    $('set-action-weight').textContent = String(entry.weight);
    $('set-action-reps').textContent = `${entry.reps} reps`;
    $('set-action-onerm').textContent =
        `est 1RM ${Number.isFinite(entry.oneRM) ? entry.oneRM.toFixed(1) : '—'} lb`;

    // Compute "Set N of M" within (sessionId, exercise). Untagged sets fall
    // back to the day's bucket so the meta line still gives useful context.
    const sameContext = (await performDB('workouts', 'getAll')).filter(w => {
        if (w.deleted) return false;
        if (w.exercise !== entry.exercise) return false;
        if (entry.sessionId) return w.sessionId === entry.sessionId;
        return w.date === entry.date && !w.sessionId;
    }).sort((a, b) => a.id - b.id);
    const setIdx = sameContext.findIndex(w => w.id === id);
    const setNumber = setIdx >= 0 ? setIdx + 1 : 1;
    const setTotal = sameContext.length || 1;
    const timeLabel = new Date(entry.id).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    $('set-action-meta').textContent = `Set ${setNumber} of ${setTotal} · ${timeLabel}`;

    // PR badge: only show if this entry IS the current PR for its exercise.
    const pr = await performDB('prs', 'get', entry.exercise);
    const prBadge = $('set-action-pr');
    if (prBadge) prBadge.hidden = !(pr && pr.achievedAt === id);

    // v9.26 — surface the warmup state both as a tag next to the exercise
    // name and as the button label ("Mark as warmup" / "Unmark warmup") so
    // the toggle's effect is unambiguous before the user taps.
    const warmupTag = $('set-action-warmup-tag');
    if (warmupTag) warmupTag.hidden = !entry.warmup;
    const warmupBtn = $('set-action-warmup-btn');
    if (warmupBtn) warmupBtn.textContent = entry.warmup ? 'Unmark warmup' : 'Mark as warmup';

    $('set-action-overlay').classList.add('active');
}

function closeSetAction() {
    $('set-action-overlay').classList.remove('active');
    _setActionId = null;
}

function editFromSetAction() {
    const id = _setActionId;
    closeSetAction();
    if (id != null) openEditSet(id);
}

function deleteFromSetAction() {
    const id = _setActionId;
    closeSetAction();
    if (id != null) deleteEntry(id);
}

// v9.26 — Flip a single existing set's warmup flag. Same write path as a
// weight/rep edit, just toggling the flag — updateEntry handles PR recompute
// and the full re-render fan-out. Closes the sheet first so the user sees
// the new pill state when the dust settles.
async function toggleWarmupFromSetAction() {
    const id = _setActionId;
    closeSetAction();
    if (id == null) return;
    const entry = await performDB('workouts', 'get', id);
    if (!entry || entry.deleted) return;
    await updateEntry(id, entry.weight, entry.reps, { warmup: !entry.warmup });
}

// ============================================================================
// v9.26 — Per-exercise overflow menu (⋮)
//
// Opened from the ⋮ button on the active workout's per-exercise group header.
// Operates on every set of that exercise within the active session (untagged
// sets are not the target — they belong to past data, not the live workout).
//
// Actions:
//   - Swap exercise:  pick a replacement from the library; every set in the
//                     active session for the original exercise is renamed
//                     to the new one. PRs are recomputed for both.
//   - Mark all as warmup / Unmark: bulk-toggle the warmup flag. Decision
//                     reads the *majority* state — if most sets are work,
//                     mark all as warmup; if most are warmup, unmark all.
//                     Avoids two presses to undo a mis-mark.
//   - Delete all sets: tombstone every set of the exercise in this session.
//                     Single confirm sheet, no per-set Undo (already a bulk
//                     destructive action, so it owns its own confirm path).
// ============================================================================

let _exerciseMenuName = null;
let _swapSourceName = null;
// v9.26 — per-exercise collapse state for the active workout screen.
// In-memory only (cleared in endWorkoutSession both branches) — the next
// session's exercises are almost always new and persistence would just be
// a footgun. Keyed by exercise canonical name. History day-detail does
// NOT honor this set (collapse is workout-screen only).
let _collapsedExercises = new Set();

function openExerciseMenu(el) {
    const name = el?.dataset?.exercise;
    if (!name || !activeSession) return;
    _exerciseMenuName = name;
    const title = $('exercise-menu-title');
    if (title) title.textContent = titleCase(name);
    // Decide the warmup-toggle label up front by looking at the current
    // session's sets for this exercise — majority wins.
    updateWarmupAllLabel(name);
    $('exercise-menu-overlay').classList.add('active');
}

async function updateWarmupAllLabel(name) {
    const label = $('exercise-menu-warmup-label');
    if (!label || !activeSession) return;
    const sets = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && w.sessionId === activeSession.id && w.exercise === name);
    if (!sets.length) { label.textContent = 'Mark all as warmup'; return; }
    const warmupCount = sets.filter(w => w.warmup).length;
    label.textContent = warmupCount > sets.length / 2
        ? 'Unmark all as warmup'
        : 'Mark all as warmup';
}

function closeExerciseMenu() {
    $('exercise-menu-overlay').classList.remove('active');
    _exerciseMenuName = null;
}

async function swapExerciseFromMenu() {
    if (!_exerciseMenuName) return;
    _swapSourceName = _exerciseMenuName;
    closeExerciseMenu();
    // Open the swap picker. Reset the search and render the full list.
    $('swap-search').value = '';
    renderSwapResults('');
    $('swap-exercise-overlay').classList.add('active');
    setTimeout(() => $('swap-search')?.focus({ preventScroll: true }), 250);
}

function closeSwapExercise() {
    $('swap-exercise-overlay').classList.remove('active');
    _swapSourceName = null;
}

function filterSwapExercises(el) {
    renderSwapResults((el?.value || '').toLowerCase().trim());
}

function renderSwapResults(query) {
    const results = $('swap-results');
    if (!results) return;
    const matches = exerciseLibrary
        .filter(ex => ex.name !== _swapSourceName)
        .filter(ex => !query || ex.name.includes(query) || ex.synonyms.some(s => s.includes(query)))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 60);
    if (!matches.length) {
        results.innerHTML = `<div class="search-empty">No matches.</div>`;
        return;
    }
    results.innerHTML = matches.map(ex => `
        <button type="button" class="swap-result-row" data-swap-target="${escapeHtml(ex.name)}">
            <span class="muscle-tag" style="background:${escapeHtml(muscleColor[ex.muscle] || '#888')}"></span>
            <span class="swap-result-name">${escapeHtml(titleCase(ex.name))}</span>
        </button>`).join('');
    // Wire row clicks once; the rows are recreated on every filter.
    results.querySelectorAll('.swap-result-row').forEach(row => {
        row.addEventListener('click', () => applyExerciseSwap(row.dataset.swapTarget));
    });
}

async function applyExerciseSwap(targetName) {
    const source = _swapSourceName;
    if (!source || !targetName || !activeSession) { closeSwapExercise(); return; }
    if (source === targetName) { closeSwapExercise(); return; }
    try {
        const sets = (await performDB('workouts', 'getAll'))
            .filter(w => !w.deleted && w.sessionId === activeSession.id && w.exercise === source);
        const now = Date.now();
        for (const set of sets) {
            set.exercise = targetName;
            set.oneRM = epley(set.weight, set.reps);
            set.modifiedAt = now;
            await performDB('workouts', 'put', set);
        }
        markUnsynced();
        markFrequencyDirty();
        await recomputePR(source);
        await recomputePR(targetName);
        closeSwapExercise();
        await refreshSessionCard();
        await renderHistory();
        await renderFocus();
        await renderRecommendedNext();
        showSnackbar(`Swapped to ${titleCase(targetName)}`, { duration: 3000 });
        haptic(15);
    } catch (err) {
        console.error('Swap failed:', err);
        closeSwapExercise();
    }
}

async function warmupAllFromMenu() {
    const name = _exerciseMenuName;
    if (!name || !activeSession) { closeExerciseMenu(); return; }
    try {
        const sets = (await performDB('workouts', 'getAll'))
            .filter(w => !w.deleted && w.sessionId === activeSession.id && w.exercise === name);
        if (!sets.length) { closeExerciseMenu(); return; }
        // Majority-state decision: if most sets are already warmup, the
        // tap means "undo all"; otherwise "mark all".
        const warmupCount = sets.filter(w => w.warmup).length;
        const targetState = !(warmupCount > sets.length / 2);
        const now = Date.now();
        for (const set of sets) {
            if (!!set.warmup === targetState) continue;
            set.warmup = targetState;
            set.modifiedAt = now;
            await performDB('workouts', 'put', set);
        }
        markUnsynced();
        await recomputePR(name);
        closeExerciseMenu();
        await refreshSessionCard();
        await renderHistory();
        await renderFocus();
        await renderRecommendedNext();
        await renderStrain();
        showSnackbar(targetState
            ? `${titleCase(name)} marked as warmup`
            : `${titleCase(name)} unmarked`, { duration: 3000 });
        haptic(12);
    } catch (err) {
        console.error('Warmup-all failed:', err);
        closeExerciseMenu();
    }
}

// v9.26 — Flip the collapsed state for one exercise group on the active
// workout screen. Re-renders the session card so the chevron rotates and
// the pill row hides/shows. No animation beyond the chevron tween — the
// pills snap in/out for instant feedback during a workout.
function toggleExerciseCollapse(el) {
    const name = el?.dataset?.exercise;
    if (!name) return;
    if (_collapsedExercises.has(name)) _collapsedExercises.delete(name);
    else _collapsedExercises.add(name);
    haptic(6);
    refreshSessionCard();
}

async function deleteExerciseFromMenu() {
    const name = _exerciseMenuName;
    if (!name || !activeSession) { closeExerciseMenu(); return; }
    closeExerciseMenu();
    const sets = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && w.sessionId === activeSession.id && w.exercise === name);
    if (!sets.length) return;
    const ok = await confirmSheet({
        title: `Delete all ${titleCase(name)} sets?`,
        body: `${sets.length} set${sets.length === 1 ? '' : 's'} will be removed from this workout. This isn't easily undone.`,
        confirmLabel: 'Delete all',
        cancelLabel: 'Keep',
        danger: true,
    });
    if (!ok) return;
    try {
        const now = Date.now();
        for (const set of sets) {
            set.deleted = true;
            set.modifiedAt = now;
            await performDB('workouts', 'put', set);
        }
        markUnsynced();
        markFrequencyDirty();
        await recomputePR(name);
        await refreshSessionCard();
        await renderHistory();
        await renderFocus();
        await renderRecommendedNext();
        await renderStrain();
        await refreshLatestStats();
        showSnackbar(`Deleted ${sets.length} ${titleCase(name)} set${sets.length === 1 ? '' : 's'}`, { duration: 4000 });
        haptic([20, 40, 20]);
    } catch (err) {
        console.error('Delete-all failed:', err);
    }
}

function renderPlate() {
    const target = parseFloat($('plate-target').value);
    const bar = parseFloat($('plate-bar').value) || 45;
    const result = $('plate-result');
    if (isNaN(target) || target <= 0) { result.innerHTML = '<div class="plate-text">Enter a target weight</div>'; return; }
    const r = computePlates(target, bar);
    if (r.error) { result.innerHTML = `<div class="plate-text">Below the bar weight (${bar} lb)</div>`; return; }

    const plateClass = p => p === 45 ? 'p45' : p === 35 ? 'p35' : p === 25 ? 'p25' : p === 10 ? 'p10' : p === 5 ? 'p5' : 'p2';
    const platesHtml = r.used.map(p => `<div class="plate ${plateClass(p)}">${p}</div>`).join('');

    result.innerHTML = `
        <div class="plate-target-text">${target} lb total</div>
        <div class="plate-bar-vis">
            <div class="plate-side left">${platesHtml}</div>
            <div class="plate-bar-mid"></div>
            <div class="plate-side">${platesHtml}</div>
        </div>
        <div class="plate-text">
            <strong>${r.perSide} lb</strong> per side<br>
            ${r.used.length ? r.used.join(' + ') + ' lb' : 'Just the bar'}
            ${r.leftover > 0 ? `<br><span style="color:var(--orange)">${r.leftover} lb cannot be loaded with standard plates</span>` : ''}
        </div>`;
}

// Wire plate inputs to live render
document.addEventListener('DOMContentLoaded', () => {
    ['plate-target', 'plate-bar'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', renderPlate);
    });
});

// ============================================================================
// Per-exercise sheet (1RM trend chart)
// ============================================================================

async function openExercise(exerciseName) {
    const all = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && w.exercise === exerciseName)
        .sort((a, b) => a.id - b.id);
    if (!all.length) return;

    currentExerciseSheet = { exercise: exerciseName, sets: all };

    $('ex-title').textContent = titleCase(exerciseName);

    // Stats — volume tally excludes warmups so the headline number on the
    // exercise sheet matches every other surface that uses work-set tonnage.
    const pr = await getCurrentPR(exerciseName);
    const sessions = new Set(all.map(w => w.date)).size;
    const totalVolume = all.filter(w => !w.warmup).reduce((s, w) => s + w.weight * w.reps, 0);

    $('ex-stats').innerHTML = `
        <div class="ex-stat"><div class="v">${pr ? Math.round(pr.max1RM) : '—'}</div><div class="l">1RM (lb)</div></div>
        <div class="ex-stat"><div class="v">${sessions}</div><div class="l">Sessions</div></div>
        <div class="ex-stat"><div class="v">${Math.round(totalVolume).toLocaleString()}</div><div class="l">Volume</div></div>
    `;

    renderTrendChart(all);

    // Recent sets
    const recent = all.slice(-10).reverse();
    $('ex-sets').innerHTML = recent.map(w => `
        <div class="row-input" style="border-bottom:0.5px solid var(--hairline)">
            <span style="flex:1">${formatDate(w.date)}</span>
            <span style="font-variant-numeric:tabular-nums;font-weight:600">${w.warmup ? '<span class="warmup-tag">W</span>' : ''}${w.weight} × ${w.reps}</span>
        </div>`).join('');

    $('ex-overlay').classList.add('active');
}

function closeExercise() {
    $('ex-overlay').classList.remove('active');
    currentExerciseSheet = null;
}

function renderTrendChart(sets) {
    const container = $('ex-trend');
    const meta = $('ex-trend-meta');

    // Best 1RM per session date in last 90 days
    const cutoff = isoForOffset(89);
    const recent = sets.filter(w => w.date >= cutoff);
    const byDate = {};
    recent.forEach(w => { byDate[w.date] = Math.max(byDate[w.date] || 0, w.oneRM); });
    const points = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0]));

    if (points.length < 2) {
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--label-tertiary);font-size:0.88rem">Need 2+ sessions for a trend</div>`;
        meta.textContent = `${points.length} session${points.length === 1 ? '' : 's'}`;
        return;
    }

    const W = 600, H = 100, P = 8;
    const xs = points.map(p => new Date(p[0] + 'T00:00:00').getTime());
    const ys = points.map(p => p[1]);
    const xMin = xs[0], xMax = xs[xs.length - 1];
    const yMin = Math.min(...ys) * 0.95;
    const yMax = Math.max(...ys) * 1.05;

    const xScale = x => P + ((x - xMin) / Math.max(1, xMax - xMin)) * (W - 2 * P);
    const yScale = y => H - P - ((y - yMin) / Math.max(0.01, yMax - yMin)) * (H - 2 * P);

    const lineD = points.map((p, i) => {
        const x = xScale(xs[i]); const y = yScale(ys[i]);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const areaD = `${lineD} L${xScale(xs[xs.length - 1]).toFixed(1)},${H - P} L${xScale(xs[0]).toFixed(1)},${H - P} Z`;

    const allTimeMaxIdx = ys.indexOf(Math.max(...ys));

    const dots = points.map((p, i) => {
        const x = xScale(xs[i]); const y = yScale(ys[i]);
        return `<circle class="point ${i === allTimeMaxIdx ? 'pr' : ''}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === allTimeMaxIdx ? 4 : 2.5}"/>`;
    }).join('');

    container.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0a84ff" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="#0a84ff" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <path class="area" d="${areaD}"/>
            <path class="line" d="${lineD}"/>
            ${dots}
        </svg>`;

    const first = ys[0], last = ys[ys.length - 1];
    const delta = ((last - first) / first) * 100;
    meta.textContent = `${points.length} sessions · ${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
}

// ============================================================================
// PR share canvas
// ============================================================================

function sharePR() {
    if (!currentExerciseSheet) return;
    drawPRCanvas('pr-canvas', currentExerciseSheet.exercise);
    $('share-overlay').classList.add('active');
}

// v9.25: tapping the share icon on a PR row goes straight to the share
// overlay without first opening the exercise sheet. Seeds
// currentExerciseSheet so nativeShare/closeShare keep working unchanged
// — those handlers only read .exercise off the state object.
function sharePRFromRow(el) {
    const name = el && el.dataset && el.dataset.exercise;
    if (!name) return;
    currentExerciseSheet = { exercise: name, sets: [] };
    drawPRCanvas('pr-canvas', name);
    $('share-overlay').classList.add('active');
}

function openExerciseFromPR(el) {
    const name = el && el.dataset && el.dataset.exercise;
    if (!name) return;
    openExercise(name);
}

function closeShare() { $('share-overlay').classList.remove('active'); }

// v9.0: PR celebration — auto-presented from updateUI when a set sets a new
// PR. Same canvas as the share preview, framed as the moment-of-celebration.
let _celebratingExercise = null;
async function presentPRCelebration(entry) {
    _celebratingExercise = entry.exercise;
    await drawPRCanvas('pr-celebrate-canvas', entry.exercise);
    const sub = $('pr-celebrate-sub');
    if (sub) {
        sub.textContent = `${titleCase(entry.exercise)} — ${entry.weight} × ${entry.reps} (est. 1RM ${Math.round(entry.oneRM)} lb)`;
    }
    $('pr-celebrate-overlay').classList.add('active');
    haptic([20, 60, 20, 60, 80]);
}
function closePRCelebrate() {
    $('pr-celebrate-overlay').classList.remove('active');
    _celebratingExercise = null;
}
async function shareCelebrate() {
    if (!_celebratingExercise) return;
    await shareOrDownloadCanvas('pr-celebrate-canvas', _celebratingExercise);
}

// Single share path for both the celebration sheet and the share sheet.
// On iOS the native share sheet exposes Save to Photos as a destination,
// so we no longer surface an explicit "Save image" button. On platforms
// without Web Share file support (older Safari, desktop Firefox), fall
// back to a direct download — same end state, no broken affordance.
async function shareOrDownloadCanvas(canvasId, exerciseName) {
    const c = $(canvasId);
    if (!c) return;
    const filename = `pr-${exerciseName.replace(/\s+/g, '-')}-${todayISO()}.png`;
    c.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], 'ironvoice-pr.png', { type: 'image/png' });
        const text = `New ${titleCase(exerciseName)} PR via IronVoice`;
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: 'New PR', text });
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.warn('Share failed, falling back to download', err);
            }
        }
        triggerDownload(blob, filename);
    }, 'image/png');
}

// IronVoice brand mark, lazy-loaded once and reused across renders. The
// PR canvas redraws on every share/celebrate, so caching the decoded
// image avoids re-decoding on every call.
let _ivLogoImg = null;
async function getLogoImage() {
    if (_ivLogoImg && _ivLogoImg.complete && _ivLogoImg.naturalWidth > 0) {
        return _ivLogoImg;
    }
    return new Promise(resolve => {
        const img = new Image();
        img.onload  = () => { _ivLogoImg = img; resolve(img); };
        img.onerror = () => { resolve(null); };
        img.src = './icon-512.png';
    });
}

async function drawPRCanvas(canvasId, exerciseName) {
    // v9.0: accepts an explicit canvas id so the same renderer powers both
    // the share preview ('pr-canvas') and the celebration sheet
    // ('pr-celebrate-canvas'). Older callers that omit the id fall back to
    // the original share canvas for backward compatibility.
    if (typeof exerciseName === 'undefined') {
        exerciseName = canvasId;
        canvasId = 'pr-canvas';
    }
    const c = $(canvasId);
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;

    const pr = await getCurrentPR(exerciseName);
    if (!pr) return;
    const m = muscleOf(exerciseName);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#000000');
    bg.addColorStop(1, '#0a0a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial accent matching muscle color
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue(`--m-${m}`).trim() || '#0a84ff';
    const radial = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, W * 0.7);
    radial.addColorStop(0, accentColor + '40');
    radial.addColorStop(1, '#00000000');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, W, H);

    // Top-left brand mark + tag. Logo + tag share a baseline so the lockup
    // reads as a single magazine-style mark rather than two separate things.
    const logo = await getLogoImage();
    const logoSize = 120;
    const logoX = 96, logoY = 120;
    if (logo) ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('IRONVOICE · NEW PR', logoX + logoSize + 28, logoY + logoSize / 2);
    ctx.textBaseline = 'alphabetic';

    // Exercise name (centered)
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 80px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(titleCase(exerciseName), W / 2, 420);

    // Headline is always the actual barbell weight — the milestone the user
    // physically lifted. Max-weight variant shows the all-time heaviest lift;
    // rep-PR variant shows the bar weight on the PR-earning set, with the
    // estimated 1RM demoted to the secondary line. Legacy records (pre-v9.9)
    // lack max1RMWeight; fall through to maxWeight.
    const prType = pr.prType === 'weight' ? 'weight' : '1rm';
    const headline = prType === 'weight'
        ? Math.round(pr.maxWeight)
        : Math.round(Number(pr.max1RMWeight) || pr.maxWeight);
    ctx.font = '800 360px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';
    const goldGrad = ctx.createLinearGradient(0, H * 0.4, 0, H * 0.7);
    goldGrad.addColorStop(0, '#ffd60a');
    goldGrad.addColorStop(1, '#ff9f0a');
    ctx.fillStyle = goldGrad;
    ctx.fillText(String(headline), W / 2, H * 0.6);

    // Tag below headline
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 56px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.fillText(prType === 'weight' ? 'LB · NEW MAX WEIGHT' : 'LB · NEW REP PR', W / 2, H * 0.66);

    // Secondary line — supporting context for the headline. Both variants
    // share the same structure (`for N reps · est. M lb 1RM`) so the cards
    // read as parallel milestones differentiated only by the tag line.
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 64px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    const reps = prType === 'weight'
        ? Number(pr.maxWeightReps) || 0
        : Number(pr.max1RMReps)    || 0;
    const oneRM = Math.round(pr.max1RM);
    const secondary = reps > 0
        ? `for ${reps} rep${reps === 1 ? '' : 's'} · est. ${oneRM} lb 1RM`
        : `est. ${oneRM} lb 1RM`;
    ctx.fillText(secondary, W / 2, H * 0.78);

    // Date
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '500 38px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.fillText(new Date(pr.achievedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), W / 2, H * 0.84);

    // Decorative bar near bottom (muscle color)
    ctx.fillStyle = accentColor;
    ctx.fillRect(W * 0.35, H * 0.92, W * 0.3, 6);
}

async function nativeShare() {
    if (!currentExerciseSheet) return;
    await shareOrDownloadCanvas('pr-canvas', currentExerciseSheet.exercise);
}

// ============================================================================
// Workout sessions  (v6)
//
// A session bundles consecutive lifting effort: startedAt, endedAt,
// durationMs, derived setCount + totalVolume. Sets logged while a session
// is active get tagged with sessionId. Sets logged with no active session
// remain untagged forever.
//
// Recovery: if the app starts with an active session in localStorage but
// no sets logged in the last 30 minutes, prompt to end at the last set's
// timestamp. If sets are recent, silently resume.
//
// Backfill: on first v6 boot, walk all historical workouts and group
// consecutive sets within a 90-minute gap into estimated sessions
// (estimated: true). Skip if backfill has already run.
// ============================================================================

const ACTIVE_SESSION_KEY = 'ironActiveSession';
const FORGOTTEN_THRESHOLD_MS = 30 * 60 * 1000;   // 30 min inactivity = "forgot to end"
const BACKFILL_GAP_MS = 90 * 60 * 1000;          // 90 min gap = new session
const BACKFILL_DONE_KEY = 'ironSessionsBackfilled';

// --- start / end ---

async function startWorkoutSession({ silent = false } = {}) {
    if (activeSession) return activeSession;
    const id = Date.now();
    activeSession = {
        id,
        startedAt: id,
        endedAt: null,
        durationMs: 0,
        modifiedAt: id,
    };
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
    await performDB('sessions', 'put', activeSession);
    markUnsynced();   // v8
    startSessionTicker();
    acquireScreenWakeLock();
    await refreshSessionCard();
    updateWorkoutTabUI();
    // v9.1: flip Home tiles + header subtitle into "in session" mode now,
    // not on the next minute boundary.
    await renderTodayCard();
    await renderHomePrimaryAction();
    await renderHeaderSubtitle();
    // Silent path is the auto-start-on-set hook in saveAndSyncUI: the set
    // log already fires its own haptic via updateUI, so the session-start
    // triple-pulse on top reads as "two events happened" — exactly the
    // opposite of "invisible plumbing" that the auto-start path is for.
    if (!silent) haptic([15, 40, 15]);
    return activeSession;
}

async function endWorkoutSession({ atTimestamp = Date.now(), silent = false } = {}) {
    if (!activeSession) return null;
    // v9.7 — Rest is workout-scoped: clear the rest pill the moment the
    // workout ends (or is cancelled via the empty-discard path below).
    // Without this, the orange "rest" pill keeps ticking after End and
    // competes with the post-end snackbar for attention.
    clearRestTimer();
    const session = activeSession;
    session.endedAt = atTimestamp;
    session.durationMs = atTimestamp - session.startedAt;
    session.modifiedAt = Date.now();

    // Discard zero-set sessions silently — Start/End with nothing logged
    // shouldn't pollute history.
    const setsInSession = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === session.id && !w.deleted);
    if (setsInSession.length === 0) {
        await performDB('sessions', 'delete', session.id);
        activeSession = null;
        localStorage.removeItem(ACTIVE_SESSION_KEY);
        stopSessionTicker();
        releaseScreenWakeLock();
        // v9.18: discard the suggested-queue alongside the empty session.
        clearSuggestedQueue();
        _collapsedExercises.clear();
        await refreshSessionCard();
        updateWorkoutTabUI();
        // v9.1: flip Home back to idle copy.
        await renderTodayCard();
        await renderHomePrimaryAction();
        await renderHeaderSubtitle();
        if (!silent) showSnackbar('Empty workout discarded', { duration: 3000 });
        return null;
    }

    await performDB('sessions', 'put', session);
    markUnsynced();   // v8
    activeSession = null;
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    stopSessionTicker();
    releaseScreenWakeLock();
    // v9.21 — if the session was launched as a recommendation (queue
    // still set at end time), increment the rec-bump counter so the
    // generator's progressive-overload nudge fires every 3rd rec'd
    // workout. Manual workouts don't count.
    const wasRecommended = !!readSuggestedQueue();
    // v9.18: suggested-queue is session-scoped — clear on end so the next
    // workout doesn't inherit the last recommendation's chips.
    clearSuggestedQueue();
    _collapsedExercises.clear();
    if (wasRecommended) incrementRecBumpCount();
    await refreshSessionCard();
    updateWorkoutTabUI();
    // v9.1: flip Home tiles + subtitle back to idle now that the session ended.
    await renderTodayCard();
    await renderWeekCard();
    await renderHomePrimaryAction();
    await renderHeaderSubtitle();
    // v9.21: re-evaluate the next recommendation immediately so the user
    // lands on Home with a fresh pick ready to review. Focus + Today + Week
    // are already covered above; the Plan card needs an explicit refresh
    // because its inputs (coverage, trend, weekday profile) all just
    // changed.
    await renderFocus();
    await renderRecommendedNext();
    // v8: auto-sync the completed workout. Fire-and-forget — the user shouldn't
    // wait for network to see "workout ended". Errors will retry on next trigger.
    autoSync('workout-end');
    if (!silent) {
        const mins = Math.round(session.durationMs / 60000);
        showSnackbar(`Workout ended · ${mins}m · ${setsInSession.length} sets`, { duration: 4000 });
    }
    haptic([20, 40, 20]);
    return session;
}

// Voice-friendly + tab-button toggle
async function toggleWorkoutSession() {
    if (activeSession) await endWorkoutSession();
    else await startWorkoutSession();
}

// Wired to the Home "Start/Resume workout" pill AND the bottom-tray
// Workout tab button. Two responsibilities in one tap: navigate to the
// Workout screen, and start a session if one isn't already running.
// Idle → start + navigate (one tap, not two). Active → just navigate
// (the Resume path; the !activeSession guard prevents accidentally
// ending the workout). Renamed from startWorkoutFromHome in v9.21 when
// the tab button started reusing the same handler.
async function enterWorkout() {
    showScreen('workout');
    if (!activeSession) await startWorkoutSession();
}

// v9.2 — Click-only path for the End workout button. Asks for confirmation
// before tearing down the session so a misplaced tap (the button now lives
// inside the In-progress card, where the rest of the active UI is) can't
// accidentally end a workout in progress. Voice ("end workout") still goes
// through executeIntent → endWorkoutSession({ silent: true }) directly —
// hands-busy paths don't get the prompt.
async function confirmEndWorkout() {
    if (!activeSession) return;
    const setsInSession = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === activeSession.id && !w.deleted);
    const mins = Math.max(1, Math.round((Date.now() - activeSession.startedAt) / 60000));
    const setCount = setsInSession.length;
    const body = setCount > 0
        ? `${mins}m · ${setCount} set${setCount === 1 ? '' : 's'} logged.`
        : 'No sets logged — the empty session will be discarded.';
    const ok = await confirmSheet({
        title: 'End this workout?',
        body,
        confirmLabel: 'End workout',
        cancelLabel: 'Keep going',
        danger: true,
    });
    if (!ok) return;
    await endWorkoutSession();
}

// --- live ticker for the session card ---

// v9.1: track the elapsed minute we last rendered into the home tiles, so
// the home renders only fire on a minute boundary instead of every second.
// The session-card timer keeps ticking per-second; only the home copy is
// rate-limited (it reads the DB and would be wasteful at 1Hz).
let _lastTickedMinute = -1;
function startSessionTicker() {
    stopSessionTicker();
    _lastTickedMinute = -1;
    _sessionTickerTimer = setInterval(() => {
        if (!activeSession) { stopSessionTicker(); return; }
        renderSessionCardTime();
        updateWorkoutTabUI();
        const m = Math.floor((Date.now() - activeSession.startedAt) / 60000);
        if (m !== _lastTickedMinute) {
            _lastTickedMinute = m;
            // Re-render only the elements that show elapsed minutes.
            renderTodayCard();
            renderHomePrimaryAction();
            renderHeaderSubtitle();
        }
    }, 1000);
}
function stopSessionTicker() {
    if (_sessionTickerTimer) { clearInterval(_sessionTickerTimer); _sessionTickerTimer = null; }
}

function formatElapsed(ms) {
    if (ms < 0) ms = 0;
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
}

// Compact duration for History rollup chips ("1h 12m" / "47m" / "—").
// formatElapsed renders h:mm:ss for live clocks; that's the wrong shape
// for summary numbers, hence a second formatter rather than a flag.
function formatDurationCompact(ms) {
    if (!ms || ms <= 0) return '—';
    const totalMin = Math.round(ms / 60000);
    if (totalMin < 60) return `${totalMin}m`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Per-session Total / Workout / Rest. Caller passes the session record
// and its sets sorted chronologically (non-deleted). Each set's rest
// contribution is min(scheduled, gap-to-next-set); the last set is
// capped by the session's end (or now, if active). Workout = Total −
// Rest, which folds in plate changes / walking / overrun rest into
// "workout" — see plan's non-goals for the tradeoff.
function computeSessionTimes(session, sets) {
    const endedAt = session.endedAt ?? Date.now();
    const totalMs = Math.max(0, endedAt - session.startedAt);
    let restMs = 0;
    for (let i = 0; i < sets.length; i++) {
        const cur = sets[i];
        const nextAt = sets[i + 1]?.id ?? endedAt;
        // Fall back to the user's current rest preference for entries
        // that predate the restDurationMs schema field.
        const scheduled = cur.restDurationMs ?? (restDuration * 1000);
        restMs += Math.min(scheduled, Math.max(0, nextAt - cur.id));
    }
    const workoutMs = Math.max(0, totalMs - restMs);
    return { totalMs, restMs, workoutMs };
}

function renderSessionCardTime() {
    if (!activeSession) return;
    const el = $('session-card-time');
    if (el) el.textContent = formatElapsed(Date.now() - activeSession.startedAt);
}

async function refreshSessionCard() {
    const card = $('session-card');
    const sessionSets = $('session-sets');
    const workoutIdle = $('workout-idle');
    if (!card) return;

    if (!activeSession) {
        // No session: hide the active-state pieces of the Workout screen and
        // show the idle pieces (Start CTA, recent templates, last workout).
        card.style.display = 'none';
        if (sessionSets) sessionSets.style.display = 'none';
        if (workoutIdle) workoutIdle.style.display = '';
        return;
    }

    // Session active: flip the Workout screen into active mode.
    card.style.display = '';
    if (workoutIdle) workoutIdle.style.display = 'none';

    renderSessionCardTime();

    const setsInSession = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === activeSession.id && !w.deleted);
    // v9.26 — session card stats read work sets only. The pill list (below)
    // still shows warmups; the counts on the card are the load-bearing tally.
    const workSetsInSession = setsInSession.filter(w => !w.warmup);
    const totalVol = workSetsInSession.reduce((s, w) => s + w.weight * w.reps, 0);
    $('session-card-sets').textContent = String(workSetsInSession.length);
    $('session-card-vol').textContent = totalVol >= 1000
        ? `${(totalVol / 1000).toFixed(1)}k`
        : String(Math.round(totalVol));

    // v8: render the in-session set list grouped by exercise (async since
    // v9.26 — pulls prev-session data per exercise to populate the PREV
    // hint under each pill).
    if (sessionSets) await renderSessionSets(sessionSets, setsInSession);

    // v9.18: keep the suggested-queue chips in sync — counts derive from
    // setsInSession, so logging or deleting a set bumps the chip totals.
    await renderSuggestedQueue();
}

// v9.0: Render the Workout screen idle surface — recent templates and the
// "Last workout" summary card. Active-state UI is handled by refreshSessionCard.
async function renderWorkoutScreen() {
    await refreshSessionCard();
    if (activeSession) return;   // active state: nothing else to render here
    await renderTemplateChips();
    await renderTemplateProgress();
    await renderLastWorkoutCard();
}

async function renderLastWorkoutCard() {
    const el = $('last-workout-card');
    if (!el) return;
    const sessions = (await performDB('sessions', 'getAll'))
        .filter(s => s.endedAt)
        .sort((a, b) => b.endedAt - a.endedAt);
    if (!sessions.length) {
        el.innerHTML = `<div class="last-workout-empty">No workouts yet — tap Start to begin.</div>`;
        return;
    }
    const last = sessions[0];
    const sets = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === last.id && !w.deleted);
    if (!sets.length) {
        el.innerHTML = `<div class="last-workout-empty">No workouts yet — tap Start to begin.</div>`;
        return;
    }
    // v9.26 — last-workout summary numbers are work sets only; the "top"
    // lift skips warmups so it never highlights a 95-lb prep set.
    const workSets = sets.filter(w => !w.warmup);
    const totalVol = workSets.reduce((s, w) => s + w.weight * w.reps, 0);
    const mins = Math.max(1, Math.round(last.durationMs / 60000));
    const dateLabel = formatDate(new Date(last.endedAt).toISOString().slice(0, 10));
    // Surface the heaviest single work set as the "headline" lift.
    const top = (workSets.length ? workSets : sets).slice().sort((a, b) => b.weight - a.weight)[0];
    el.innerHTML = `
        <div class="last-workout-summary">
            <span class="lw-date">${escapeHtml(dateLabel)}</span>
            <span class="lw-stats">${mins}m · ${workSets.length} sets · ${Math.round(totalVol).toLocaleString()} lb</span>
        </div>
        <div class="last-workout-top">Top: ${escapeHtml(titleCase(top.exercise))} ${escapeHtml(String(top.weight))} × ${escapeHtml(String(top.reps))}</div>
    `;
}

// v9.0: Show the welcome hint on Home when the user has zero workouts logged.
// Once any data exists, the hint is hidden and the dashboard cards take over.
async function renderHomeEmptyState() {
    const el = $('home-empty');
    if (!el) return;
    try {
        const all = await getActiveWorkouts();
        el.style.display = all.length ? 'none' : '';
    } catch (_) { el.style.display = 'none'; }
}

// v8: render the session set list, grouped by exercise (most recently
// performed first), each with a horizontal row of "weight × reps" pills.
// v9.26 — Most recent prior session's sets for a given exercise. Used by
// the pill renderer to draw "prev W×R" under each pill. The split below
// (sessionId vs untagged-date fallback) means historical pre-session data
// still drives a useful prev hint for users coming back to a lift after a
// while. Returns sets in chronological order so prev[index] matches the
// current session's same-index set; falls back to prev[last] when the
// current session has more sets than the prior one.
async function getPrevExerciseSets(exercise, excludingSessionId) {
    const all = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && w.exercise === exercise
                  && (excludingSessionId == null || w.sessionId !== excludingSessionId));
    if (!all.length) return [];
    // Bucket by (sessionId || ('untagged-' + date)) and pick the bucket
    // with the latest set id — that's the user's "last time."
    const buckets = new Map();
    for (const w of all) {
        const key = w.sessionId != null ? `s:${w.sessionId}` : `u:${w.date}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(w);
    }
    let latestKey = null, latestId = -Infinity;
    for (const [k, arr] of buckets) {
        const maxId = Math.max(...arr.map(s => s.id));
        if (maxId > latestId) { latestId = maxId; latestKey = k; }
    }
    return (buckets.get(latestKey) || []).sort((a, b) => a.id - b.id);
}

// v9.29 — pill markup, shared by active-workout and history day-detail.
// Three column-aligned cells: SET # (or W for warmups) | PREV (last-time
// weight×reps, em-dash when none) | weight × reps (right-aligned, the
// "headline" cell). Set numbering is computed by the caller and passed
// in via opts.setLabel — warmups display 'W' and don't consume a number
// in the work-set sequence. Replaces the v9.26 stacked-flex chip; see
// CLAUDE.md "Row-form pill layout" for the rationale.
function renderSetPill(s, prev, opts = {}) {
    const { isPR = false, setLabel = '?', extraClass = '' } = opts;
    const prevText = prev
        ? `${escapeHtml(String(prev.weight))} × ${escapeHtml(String(prev.reps))}`
        : '—';
    const setHtml = s.warmup
        ? '<span class="warmup-tag">W</span>'
        : escapeHtml(setLabel);
    const prTag = isPR ? '<span class="pill-pr-tag">PR</span>' : '';
    const aria = `${s.warmup ? 'Warmup. ' : ''}Set ${s.weight} pounds for ${s.reps} reps. Tap to edit or delete.`;
    const classes = [
        'session-set-pill', 'history-pill',
        s.warmup ? 'is-warmup' : '',
        isPR ? 'is-pr' : '',
        extraClass,
    ].filter(Boolean).join(' ');
    return `<button type="button" class="${classes}" data-action="openSetAction" data-id="${s.id}" aria-label="${escapeHtml(aria)}">
        <span class="pill-col-set">${setHtml}</span>
        <span class="pill-col-prev">${prevText}</span>
        <span class="pill-col-main">${escapeHtml(String(s.weight))} <span class="pill-x">×</span> ${escapeHtml(String(s.reps))}${prTag}</span>
    </button>`;
}

async function renderSessionSets(container, sets) {
    if (!sets.length) {
        container.style.display = 'none';
        return;
    }
    container.style.display = '';

    // Bucket sets by exercise. The order we iterate is set in the next
    // block, so insertion order here doesn't matter.
    const groups = new Map();   // exercise → [sets]
    for (const set of sets) {
        if (!groups.has(set.exercise)) groups.set(set.exercise, []);
        groups.get(set.exercise).push(set);
    }

    // v9.28 — rotation-aware ordering. Groups sorted by their most-recent
    // set ASC: the exercise the user has been "waiting longest" to return
    // to is on top; the just-logged exercise drops to the bottom. Matches
    // the circuit/superset workflow where logging biceps should leave
    // triceps (the next-up) at the top of the list, not bury it.
    //
    // Brand-new exercises follow the same rule — they don't get a pinning
    // bonus. Their first set is the newest in the session, so they land
    // at the bottom and the prior exercises (older last-sets) stay on top.
    // v9.27 shipped a hybrid with a pinned tier; user feedback was that
    // it surfaced the just-added exercise on top instead of leaving the
    // earlier one there — reverted in v9.28. See CLAUDE.md
    // "Rotation-aware set-group ordering" for the full rationale.
    const sortedGroups = [...groups.entries()]
        .map(([exercise, exSets]) => ({
            exercise,
            exSets,
            lastId: Math.max(...exSets.map(s => s.id)),
        }))
        .sort((a, b) => a.lastId - b.lastId);

    // v9.26 — preload prev sets per unique exercise so per-pill rendering
    // is synchronous below. One small getAll per exercise; if this ever
    // proves measurable on huge datasets, swap to a single getAll + group.
    const prevByExercise = new Map();
    for (const { exercise } of sortedGroups) {
        prevByExercise.set(exercise, await getPrevExerciseSets(exercise, activeSession?.id ?? null));
    }

    let html = '';
    for (const { exercise, exSets } of sortedGroups) {
        const lib = exerciseLibrary.find(ex => ex.name === exercise);
        const muscle = lib?.muscle || 'core';
        const muscleBg = escapeHtml(muscleColor[muscle] || '#888');
        // Order within an exercise: chronological (oldest first) so reading
        // left to right matches the order you actually did the sets in.
        const orderedSets = [...exSets].sort((a, b) => a.id - b.id);
        const prevSets = prevByExercise.get(exercise) || [];

        // v9.29 — walk in chronological order and number work sets 1..N;
        // warmups display 'W' and don't consume a number. Per-index PREV
        // matching is unchanged from v9.26.
        let workIdx = 0;
        const setPills = orderedSets.map((s, i) => {
            const setLabel = s.warmup ? 'W' : String(++workIdx);
            const prev = prevSets[i] || prevSets[prevSets.length - 1] || null;
            return renderSetPill(s, prev, { setLabel });
        }).join('');
        // v9.29 — tiny column-header row inside each group. Labels the
        // three pill columns so the layout reads as a table even when
        // there's only one row.
        const colHeader = `<div class="session-set-cols">
            <span class="pill-col-set">SET</span>
            <span class="pill-col-prev">PREV</span>
            <span class="pill-col-main">LBS × REPS</span>
        </div>`;

        // v9.26 — per-exercise overflow ⋮ opens a sheet with Swap exercise,
        // Mark all as warmup, Delete all sets. Sits between the title and
        // the set-count chip so it's tap-target-clear at the right edge.
        const exTitle = escapeHtml(titleCase(exercise));
        const exName = escapeHtml(exercise);
        const moreBtn =
            `<button type="button" class="session-set-more" data-action="openExerciseMenu" data-exercise="${exName}" aria-label="More for ${exTitle}">` +
                `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="6" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="18" r="1.7"/></svg>` +
            `</button>`;
        // v9.26 — collapse chevron at the start of the header. Tapping the
        // chevron (or anywhere on the header except the ⋮ button) toggles
        // _collapsedExercises membership and re-renders. The ⋮ button has
        // its own data-action; the dispatcher resolves to closest, so
        // tapping ⋮ doesn't bubble up to the collapse handler.
        const isCollapsed = _collapsedExercises.has(exercise);
        const collapseBtn =
            `<button type="button" class="group-chevron" data-action="toggleExerciseCollapse" data-exercise="${exName}" aria-label="${isCollapsed ? 'Expand' : 'Collapse'} ${exTitle}" aria-expanded="${isCollapsed ? 'false' : 'true'}">` +
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>` +
            `</button>`;
        // v9.2 — trailing "+ Add set" pill opens the quick-add sheet so the
        // user can log another set of the same exercise without re-typing
        // the name in the search box.
        const addPill =
            `<button type="button" class="session-set-pill session-set-add" data-action="openQuickAdd" data-exercise="${exName}" aria-label="Add another set of ${exTitle}">` +
                `<span class="session-set-add-icon" aria-hidden="true">+</span>` +
                `<span class="session-set-add-label">Add set</span>` +
            `</button>`;
        // Set count includes warmups (matches what's visible as pills);
        // the session-card's work-only count is the load-bearing number.
        html += `
            <div class="session-set-group${isCollapsed ? ' is-collapsed' : ''}">
                <div class="session-set-group-header">
                    ${collapseBtn}
                    <span class="muscle-tag" style="background:${muscleBg}"></span>
                    <span class="session-set-group-name">${exTitle}</span>
                    <span class="session-set-count">${orderedSets.length} set${orderedSets.length === 1 ? '' : 's'}</span>
                    ${moreBtn}
                </div>
                <div class="session-set-pills">${colHeader}${setPills}${addPill}</div>
            </div>`;
    }
    container.innerHTML = html;
}

function updateWorkoutTabUI() {
    // v9.0: the Workout button is a navigation tab now (data-screen-target),
    // not a state-changing action. So we no longer overload the icon/label
    // with start-vs-end signaling — the tab always reads "Workout". A subtle
    // .session-active class colors the icon/label red while a session runs,
    // mirroring the same affordance other apps use to signal "live."
    const btn = $('tab-workout');
    const icon = $('tab-workout-icon');
    const label = $('tab-workout-label');
    if (!btn) return;
    if (activeSession) {
        btn.classList.add('session-active');
    } else {
        btn.classList.remove('session-active');
    }
    if (icon) icon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"/>';
    if (label) label.textContent = 'Workout';
}

// --- recovery on app boot ---

async function resumeOrPromptSession() {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return;
    let stored;
    try { stored = JSON.parse(raw); } catch (_) { localStorage.removeItem(ACTIVE_SESSION_KEY); return; }
    if (!stored?.id) { localStorage.removeItem(ACTIVE_SESSION_KEY); return; }

    // Find this session's most recent set timestamp.
    const setsInSession = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === stored.id && !w.deleted);
    const lastSetAt = setsInSession.length
        ? Math.max(...setsInSession.map(w => w.id))
        : stored.startedAt;
    const idleMs = Date.now() - lastSetAt;

    if (idleMs < FORGOTTEN_THRESHOLD_MS) {
        // Recent activity — resume silently.
        activeSession = stored;
        startSessionTicker();
        acquireScreenWakeLock();
        return;
    }

    // Forgotten session — prompt to end at the last set's timestamp,
    // or resume if user is genuinely back. Default to "End at last set"
    // because that's the most likely correct answer.
    _forgottenPromptDidFire = true;   // v8: suppress launch prompt this load
    const lastWhen = new Date(lastSetAt);
    const lastTimeLabel = lastWhen.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endAtLast = await confirmSheet({
        title: 'Resume your workout?',
        body:
            `You started a workout earlier and didn't end it. ` +
            `Your last set was at ${lastTimeLabel}.`,
        confirmLabel: 'End at last set',
        cancelLabel: 'Resume workout',
    });
    if (endAtLast) {
        activeSession = stored;
        await endWorkoutSession({ atTimestamp: lastSetAt, silent: true });
        showSnackbar(`Closed forgotten workout`, { duration: 4000 });
    } else {
        activeSession = stored;
        startSessionTicker();
        acquireScreenWakeLock();
    }
}

// --- backfill historical sessions ---

async function backfillHistoricalSessions() {
    if (localStorage.getItem(BACKFILL_DONE_KEY) === '1') return;
    const all = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && !w.sessionId)
        .sort((a, b) => a.id - b.id);
    if (all.length === 0) {
        localStorage.setItem(BACKFILL_DONE_KEY, '1');
        return;
    }

    // Group: same date AND gap from previous set <= 90 min.
    let buckets = [];
    let cur = [];
    for (const w of all) {
        if (cur.length === 0) { cur.push(w); continue; }
        const prev = cur[cur.length - 1];
        const sameDay = prev.date === w.date;
        const gap = w.id - prev.id;
        if (sameDay && gap <= BACKFILL_GAP_MS) cur.push(w);
        else { buckets.push(cur); cur = [w]; }
    }
    if (cur.length) buckets.push(cur);

    const now = Date.now();
    for (const bucket of buckets) {
        const startedAt = bucket[0].id;
        const endedAt = bucket[bucket.length - 1].id;
        // Skip "sessions" of one set on a day with no other lifting noise:
        // they get a 0 duration, displayed as "1 set" with no time.
        const sessionId = startedAt;   // reuse first set's timestamp as id
        const session = {
            id: sessionId,
            startedAt,
            endedAt,
            durationMs: endedAt - startedAt,
            estimated: true,
            modifiedAt: now,
        };
        await performDB('sessions', 'put', session);
        // Tag every set in the bucket with this sessionId.
        for (const w of bucket) {
            w.sessionId = sessionId;
            w.modifiedAt = now;   // mark for next sync
            await performDB('workouts', 'put', w);
        }
    }

    localStorage.setItem(BACKFILL_DONE_KEY, '1');
    console.log(`Backfilled ${buckets.length} estimated sessions across ${all.length} sets`);
}

// ============================================================================
// Screen router  (v9.0)
//
// Five screens now: home, prs, history, workout, profile. Workout was a
// tab-action in v8; promoting it to a real screen separates navigation from
// state-changing actions (the screen contains the Start/End buttons).
// Profile was a sheet; promoting it to a screen restores normal back-nav
// muscle memory and pairs with the inline grouped-list content in markup.
// ============================================================================

let currentScreen = 'home';
const VALID_SCREENS = ['home', 'prs', 'history', 'workout', 'profile'];

function showScreen(name) {
    // Save profile-screen field edits before navigating away. closeSettings
    // used to do this on sheet-dismiss; the equivalent here runs whenever
    // the Profile screen loses focus.
    if (currentScreen === 'profile' && name !== 'profile') {
        saveProfileFromScreen();
    }
    if (!VALID_SCREENS.includes(name)) name = 'home';
    currentScreen = name;
    document.querySelectorAll('main > .screen').forEach(s => {
        s.hidden = s.dataset.screen !== name;
    });
    document.querySelectorAll('.tab-btn[data-screen-target]').forEach(b => {
        const on = b.dataset.screenTarget === name;
        b.classList.toggle('active', on);
        if (on) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
    });
    // Lazy-render the screen we just landed on so it's always fresh.
    if (name === 'prs') renderPRsScreen();
    if (name === 'history') renderHistoryScreen();
    if (name === 'home') {
        refreshSessionCard();          // keep workout-screen state in sync too
        renderHomeEmptyState();        // first-launch empty hint
        // v9.1: re-pull state-aware tiles and subtitle. Cheap and matters
        // because state can change while another screen was up (e.g. a set
        // logged via voice while user is on PRs tab).
        renderTodayCard();
        renderWeekCard();
        renderHomePrimaryAction();
        renderHeaderSubtitle();
    }
    if (name === 'workout') { renderWorkoutScreen(); updateWorkoutClock(); }
    if (name === 'profile') renderProfileScreen();
    // Scroll to top so the new screen always starts at the top.
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// Convenience: PR card tap routes to the PRs screen.
function goPRs() { showScreen('prs'); }

// ============================================================================
// PRs screen  (v6)
//
// Tab 1: heaviest weight ever lifted per exercise (any reps).
// Tab 2: that same heaviest weight, plus the most reps you've done at it.
// Both tabs show the same exercises in the same order — only the
// secondary metric changes.
// ============================================================================

async function computePRTiles() {
    // Warmups never count toward the PR shelf — same rule as recomputePR.
    const all = (await performDB('workouts', 'getAll')).filter(w => !w.deleted && !w.warmup);
    if (!all.length) return [];

    // Bucket by exercise.
    const byEx = {};
    for (const w of all) {
        (byEx[w.exercise] ||= []).push(w);
    }

    const tiles = [];
    for (const [ex, sets] of Object.entries(byEx)) {
        // Tab 1 anchor: the max weight ever lifted (any reps).
        const maxWeight = Math.max(...sets.map(s => s.weight));
        // Tab 2: at that exact max weight, the highest rep count.
        const repsAtMax = Math.max(
            ...sets.filter(s => s.weight === maxWeight).map(s => s.reps)
        );
        tiles.push({
            exercise: ex,
            muscle: muscleOf(ex),
            maxWeight,
            repsAtMax,
        });
    }
    // Order: alphabetical A→Z by exercise name. Row layout (v9.25) made
    // weight-order useless for scanning — you look things up by name now.
    tiles.sort((a, b) => a.exercise.localeCompare(b.exercise));
    return tiles;
}

async function renderPRsScreen() {
    const grid = $('pr-grid');
    const empty = $('pr-empty');
    if (!grid) return;

    const tiles = await computePRTiles();

    if (!tiles.length) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }
    empty.style.display = 'none';

    grid.innerHTML = tiles.map(t => {
        const bg = escapeHtml(muscleColor[t.muscle] || '#888');
        const exAttr = escapeHtml(t.exercise);
        const name = escapeHtml(titleCase(t.exercise));
        const weightHtml = `${escapeHtml(String(t.maxWeight))}<span class="pr-row-unit"> lb</span>`;
        const valueHtml = (prTab === 'weight-reps')
            ? `${escapeHtml(String(t.maxWeight))} × ${escapeHtml(String(t.repsAtMax))}`
            : weightHtml;
        const ariaSuffix = (prTab === 'weight-reps')
            ? `${t.maxWeight} pounds for ${t.repsAtMax} rep${t.repsAtMax === 1 ? '' : 's'}`
            : `${t.maxWeight} pounds`;
        const ariaLabel = escapeHtml(`${titleCase(t.exercise)}, ${ariaSuffix}. Open history.`);
        const shareAria = escapeHtml(`Share ${titleCase(t.exercise)} PR card`);
        return `
            <div class="pr-row" data-exercise="${exAttr}">
                <button type="button" class="pr-row-main" data-action="openExerciseFromPR" data-exercise="${exAttr}" aria-label="${ariaLabel}">
                    <span class="pr-row-dot" style="background:${bg}" aria-hidden="true"></span>
                    <span class="pr-row-name">${name}</span>
                    <span class="pr-row-value">${valueHtml}</span>
                    <svg class="pr-row-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <button type="button" class="pr-row-share" data-action="sharePRFromRow" data-exercise="${exAttr}" aria-label="${shareAria}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </button>
            </div>`;
    }).join('');
}

function setPRTab(tab) {
    if (tab !== 'weight' && tab !== 'weight-reps') return;
    prTab = tab;
    setSegmentedActive($('pr-tab-segment'), b => b.dataset.val === tab);
    renderPRsScreen();
}

// ============================================================================
// History screen  (v6)
//
// Top: 7-day strip for the selected week (offsetable by week).
// Selecting a day reveals that day's session header(s) and set list below.
// Reuses the existing renderHistory row markup — swipe-to-delete and the
// undo snackbar still work because the markup contract is identical.
// ============================================================================

function startOfWeek(date) {
    // Monday-based week: pick the most recent Monday at 00:00 local.
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();              // 0=Sun .. 6=Sat
    const diff = (day === 0 ? -6 : 1) - day;   // shift to Mon
    d.setDate(d.getDate() + diff);
    return d;
}

function isoForLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

async function renderHistoryScreen() {
    const stripEl = $('history-week-strip');
    const labelEl = $('history-week-label');
    const detail = $('history-day-detail');
    if (!stripEl) return;

    // Compute the seven dates for this offset.
    const weekStart = startOfWeek(new Date());
    weekStart.setDate(weekStart.getDate() + (historyWeekOffset * 7));
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        days.push(d);
    }

    // Label for the week.
    if (historyWeekOffset === 0) labelEl.textContent = 'This week';
    else if (historyWeekOffset === -1) labelEl.textContent = 'Last week';
    else {
        const monthName = days[0].toLocaleDateString([], { month: 'short' });
        const lastMonthName = days[6].toLocaleDateString([], { month: 'short' });
        labelEl.textContent = monthName === lastMonthName
            ? `${monthName} ${days[0].getDate()} – ${days[6].getDate()}`
            : `${monthName} ${days[0].getDate()} – ${lastMonthName} ${days[6].getDate()}`;
    }

    // Default the selected day to today on first visit, or the last selected
    // if it's still in this week.
    const todayISOStr = todayISO();
    if (!historySelectedDate || !days.some(d => isoForLocalDate(d) === historySelectedDate)) {
        historySelectedDate = days.some(d => isoForLocalDate(d) === todayISOStr)
            ? todayISOStr
            : isoForLocalDate(days[6]);
    }

    // Pulled once here for the day-detail renderer + per-week rollup
    // downstream. (v9.33 — the per-day volume bar was removed, so no
    // per-day volume / dominant-muscle bookkeeping is needed at this
    // stage anymore.)
    const allWorkouts = (await performDB('workouts', 'getAll')).filter(w => !w.deleted);

    // Render strip
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    stripEl.innerHTML = days.map((d, i) => {
        const iso = isoForLocalDate(d);
        const classes = [
            'week-day',
            iso === todayISOStr ? 'today' : '',
            iso === historySelectedDate ? 'active' : '',
        ].filter(Boolean).join(' ');
        return `
            <button class="${classes}" data-date="${iso}">
                <span class="week-day-name">${dayNames[i]}</span>
                <span class="week-day-num">${d.getDate()}</span>
            </button>`;
    }).join('');

    stripEl.querySelectorAll('.week-day').forEach(btn => {
        btn.addEventListener('click', () => {
            historySelectedDate = btn.dataset.date;
            renderHistoryScreen();
        });
    });

    // Sessions are needed both here (per-week rollup) and inside the
    // day-detail. Pull once and pass through to avoid a double-fetch.
    const allSessions = await performDB('sessions', 'getAll');

    // Per-week rollup: sum Total/Workout/Rest across sessions whose
    // startedAt falls in the visible week. Hidden when the week has
    // no sessions.
    const weekDateSet = new Set(days.map(d => isoForLocalDate(d)));
    const weekSessions = allSessions.filter(s =>
        weekDateSet.has(isoForLocalDate(new Date(s.startedAt)))
    );
    renderRollupTotals('history-week-rollup', weekSessions, allWorkouts);

    // Render the selected day's detail
    await renderHistoryDayDetail(historySelectedDate, allWorkouts, allSessions);
}

// Builds the {totalMs, restMs, workoutMs} sum across a list of sessions
// (using the workouts pool to find each session's sets), then writes
// the three-cell HTML into the target element. Hides the element when
// there's nothing to show. Reused by per-week and per-day rollups.
function renderRollupTotals(elId, sessions, allWorkouts) {
    const el = $(elId);
    if (!el) return;
    if (!sessions.length) { el.style.display = 'none'; el.innerHTML = ''; return; }

    const setsBySession = new Map();
    for (const w of allWorkouts) {
        if (!w.sessionId) continue;
        if (!setsBySession.has(w.sessionId)) setsBySession.set(w.sessionId, []);
        setsBySession.get(w.sessionId).push(w);
    }
    for (const arr of setsBySession.values()) arr.sort((a, b) => a.id - b.id);

    let totalMs = 0, restMs = 0, workoutMs = 0;
    let volume = 0, setCount = 0;
    for (const s of sessions) {
        const sets = setsBySession.get(s.id) || [];
        const t = computeSessionTimes(s, sets);
        totalMs += t.totalMs;
        restMs += t.restMs;
        workoutMs += t.workoutMs;
        // v9.26 — volume and set count are work-only; warmups still count
        // toward the time rollups (you actually spent that minute on them).
        for (const w of sets) {
            if (w.warmup) continue;
            volume += (w.weight || 0) * (w.reps || 0);
            setCount += 1;
        }
    }
    if (totalMs <= 0) { el.style.display = 'none'; el.innerHTML = ''; return; }

    el.style.display = '';
    el.innerHTML = rollupCellsHtml({ totalMs, workoutMs, restMs, volume, setCount });
}

// Five-cell grid markup shared by week/day rollups. Volume + Sets come
// first (the "how much did I do" answer), then Total / Workout / Rest
// (the "how long did it take" answer). The Rest cell stays blue to
// mirror the green session card's REST label color.
function rollupCellsHtml({ totalMs, workoutMs, restMs, volume, setCount }) {
    return `
        <div class="history-rollup-cell">
            <div class="history-rollup-label">Volume</div>
            <div class="history-rollup-value">${escapeHtml(formatVol(volume || 0))}</div>
        </div>
        <div class="history-rollup-cell">
            <div class="history-rollup-label">Sets</div>
            <div class="history-rollup-value">${setCount || 0}</div>
        </div>
        <div class="history-rollup-cell">
            <div class="history-rollup-label">Total</div>
            <div class="history-rollup-value">${escapeHtml(formatDurationCompact(totalMs))}</div>
        </div>
        <div class="history-rollup-cell">
            <div class="history-rollup-label">Workout</div>
            <div class="history-rollup-value">${escapeHtml(formatDurationCompact(workoutMs))}</div>
        </div>
        <div class="history-rollup-cell history-rollup-cell-rest">
            <div class="history-rollup-label">Rest</div>
            <div class="history-rollup-value">${escapeHtml(formatDurationCompact(restMs))}</div>
        </div>`;
}

async function renderHistoryDayDetail(date, allWorkouts, allSessions) {
    const empty = $('history-day-empty');
    const headers = $('history-session-headers');
    const groups = $('history-day-groups');
    const dayRollup = $('history-day-rollup');
    const dayWorkouts = allWorkouts.filter(w => w.date === date);

    if (!dayWorkouts.length) {
        headers.innerHTML = '';
        groups.innerHTML = '';
        if (dayRollup) { dayRollup.style.display = 'none'; dayRollup.innerHTML = ''; }
        empty.style.display = '';
        empty.textContent = 'No sets on this day.';
        return;
    }
    empty.style.display = 'none';

    // v9.2 — History day detail mirrors the active-workout pill layout:
    // for each session of the day we render one or more session-set-group
    // cards (one per exercise) with horizontal pills for each set, instead
    // of the old per-row swipe-to-delete list. Tap the group header to open
    // the exercise sheet. v9.6 — tapping a pill opens the set-action sheet
    // (Edit / Delete); the dispatcher handles the click via the pill's
    // data-action attribute, so no per-pill JS wiring is needed here.
    if (!allSessions) allSessions = await performDB('sessions', 'getAll');
    const sessionMap = Object.fromEntries(allSessions.map(s => [s.id, s]));
    const prs = await performDB('prs', 'getAll');
    const prMap = Object.fromEntries(prs.map(p => [p.exercise, p.achievedAt]));

    // Bucket sets into sessions (or a synthetic "untagged" bucket). Each
    // bucket carries its sets in chronological order so pills read left to
    // right in the order they were performed.
    const sessionBuckets = new Map();   // sessionId | 'untagged' → sets[]
    for (const w of dayWorkouts) {
        const key = w.sessionId || 'untagged';
        if (!sessionBuckets.has(key)) sessionBuckets.set(key, []);
        sessionBuckets.get(key).push(w);
    }
    for (const sets of sessionBuckets.values()) sets.sort((a, b) => a.id - b.id);

    // Order: tagged sessions by start time, then any untagged sets last.
    const orderedKeys = [...sessionBuckets.keys()]
        .filter(k => k !== 'untagged')
        .sort((a, b) => {
            const sa = sessionMap[a]?.startedAt || 0;
            const sb = sessionMap[b]?.startedAt || 0;
            return sa - sb;
        });
    if (sessionBuckets.has('untagged')) orderedKeys.push('untagged');

    // Top-of-detail summary header(s) — start time + set count on the
    // first line, Total/Workout/Rest chips on a second sub-row. The
    // bare-minute "dur" was redundant once the rollup chips landed.
    // Track per-day totals as we iterate so we can render the per-day
    // rollup above the headers in a single pass.
    let headerHtml = '';
    let dayTotalMs = 0, dayRestMs = 0, dayWorkoutMs = 0;
    let dayVolume = 0, daySetCount = 0;
    let realSessionCount = 0;
    for (const key of orderedKeys) {
        if (key === 'untagged') continue;
        const s = sessionMap[key];
        if (!s) continue;
        const setsInSession = sessionBuckets.get(key);
        const startTime = new Date(s.startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const t = computeSessionTimes(s, setsInSession);
        dayTotalMs   += t.totalMs;
        dayRestMs    += t.restMs;
        dayWorkoutMs += t.workoutMs;
        realSessionCount++;
        // Per-session volume — work sets only. The meta line still shows the
        // total set count (warmups included) so the user can reconcile the
        // visible pills with the number; the volume + day rollup count work
        // sets only so the tonnage matches every other "how much" surface.
        let sessionVolume = 0;
        let sessionWorkSetCount = 0;
        for (const w of setsInSession) {
            if (w.warmup) continue;
            sessionVolume += (w.weight || 0) * (w.reps || 0);
            sessionWorkSetCount += 1;
        }
        dayVolume += sessionVolume;
        daySetCount += sessionWorkSetCount;
        const estimatedFlag = s.estimated ? `<span class="estimated">~estimated</span>` : '';
        // v9.26 — warmup count is shown as a small flag in the head row when
        // present, so the grid's "Sets" cell (work-only) and the warmup
        // annotation refer to the same population. Without the flag the user
        // would see "Sets 4" but 5 visible pills — reads as a count error.
        const warmupInSession = setsInSession.length - sessionWorkSetCount;
        const warmupFlag = warmupInSession > 0
            ? `<span class="session-header-warmup">${warmupInSession}W</span>`
            : '';
        // v9.33 — per-session header is now a card matching the rollup grid
        // above: head row (checkmark + start time + optional flags) then the
        // same 5-cell Volume/Sets/Total/Workout/Rest layout used by the day
        // and week rollups. Reuses rollupCellsHtml() so the visual + content
        // contract stays in lockstep.
        headerHtml += `
            <div class="session-header-row">
                <div class="session-header-head">
                    <span class="session-header-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span class="session-header-time">${escapeHtml(startTime)}</span>
                    ${warmupFlag}
                    ${estimatedFlag}
                </div>
                <div class="history-rollup">
                    ${rollupCellsHtml({ totalMs: t.totalMs, workoutMs: t.workoutMs, restMs: t.restMs, volume: sessionVolume, setCount: sessionWorkSetCount })}
                </div>
            </div>`;
    }

    // Per-day rollup: only meaningful if at least one real session
    // contributed. Untagged-only days fall through to the existing
    // "no session timer" header below without a rollup row.
    if (dayRollup) {
        if (realSessionCount > 0 && dayTotalMs > 0) {
            dayRollup.style.display = '';
            dayRollup.innerHTML = rollupCellsHtml({
                totalMs: dayTotalMs, workoutMs: dayWorkoutMs, restMs: dayRestMs,
                volume: dayVolume, setCount: daySetCount,
            });
        } else {
            dayRollup.style.display = 'none';
            dayRollup.innerHTML = '';
        }
    }
    const untaggedSets = sessionBuckets.get('untagged');
    if (untaggedSets && !sessionMap[orderedKeys[0]]) {
        // Only emit the untagged note if there are no real sessions for the
        // day; otherwise the session header(s) above carry the count.
        headerHtml += `<div class="session-header-row session-header-row--untagged">
            <span class="session-header-icon" style="background:var(--label-tertiary)"><svg viewBox="0 0 24 24" fill="white" width="13" height="13"><circle cx="12" cy="12" r="10"/></svg></span>
            <span>${untaggedSets.length} sets · no session timer</span>
        </div>`;
    }
    headers.innerHTML = headerHtml;

    // Build the pill groups. For each session bucket, group its sets by
    // exercise (preserving first-seen order) and render the same markup
    // renderSessionSets() emits — minus the trailing "+ Add set" pill,
    // which is workout-screen-only.
    let bodyHtml = '';
    for (const key of orderedKeys) {
        const sets = sessionBuckets.get(key) || [];
        if (!sets.length) continue;

        // Optional per-bucket label only when there are multiple sessions
        // in the day, so a single-session day doesn't get redundant chrome.
        const realSessionCount = orderedKeys.filter(k => k !== 'untagged').length;
        if (key !== 'untagged' && realSessionCount > 1) {
            const s = sessionMap[key];
            const startTime = s ? new Date(s.startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
            bodyHtml += `<div class="history-session-divider">${escapeHtml(startTime)}</div>`;
        }

        const exerciseGroups = new Map();
        for (const w of sets) {
            if (!exerciseGroups.has(w.exercise)) exerciseGroups.set(w.exercise, []);
            exerciseGroups.get(w.exercise).push(w);
        }

        for (const [exercise, exSets] of exerciseGroups) {
            const lib = exerciseLibrary.find(ex => ex.name === exercise);
            const muscle = lib?.muscle || muscleOf(exercise) || 'core';
            const muscleBg = escapeHtml(muscleColor[muscle] || '#888');
            const exTitle = escapeHtml(titleCase(exercise));
            const exName = escapeHtml(exercise);
            const hasPR = exSets.some(s => prMap[s.exercise] === s.id);

            // v9.26 — same per-index PREV hint as the active workout pills;
            // excludes the current row's sessionId so we don't compare a
            // historical day against itself. Untagged sets pass null,
            // which the helper handles by skipping the exclusion.
            const prevSets = await getPrevExerciseSets(
                exercise,
                key !== 'untagged' ? Number(key) : null
            );

            // v9.29 — same work-set numbering as the active workout. exSets
            // is already in chronological order from the bucket builder above.
            let workIdx = 0;
            const pills = exSets.map((s, i) => {
                const isPR = prMap[s.exercise] === s.id;
                const setLabel = s.warmup ? 'W' : String(++workIdx);
                const prev = prevSets[i] || prevSets[prevSets.length - 1] || null;
                return renderSetPill(s, prev, { isPR, setLabel });
            }).join('');
            const colHeader = `<div class="session-set-cols">
                <span class="pill-col-set">SET</span>
                <span class="pill-col-prev">PREV</span>
                <span class="pill-col-main">LBS × REPS</span>
            </div>`;

            bodyHtml += `
                <div class="session-set-group history-set-group">
                    <button type="button" class="session-set-group-header history-group-header" data-history-exercise="${exName}">
                        <span class="muscle-tag" style="background:${muscleBg}"></span>
                        <span class="session-set-group-name">${exTitle}${hasPR ? '<span class="item-pr-tag">PR</span>' : ''}</span>
                        <span class="session-set-count">${exSets.length} set${exSets.length === 1 ? '' : 's'}</span>
                    </button>
                    <div class="session-set-pills">${colHeader}${pills}</div>
                </div>`;
        }
    }
    groups.innerHTML = bodyHtml || '';

    // Tap a group header to open the exercise sheet. Pill taps are handled
    // by the global dispatcher via data-action="openSetAction".
    groups.querySelectorAll('.history-group-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const ex = btn.dataset.historyExercise;
            if (ex) openExercise(ex);
        });
    });
}

// Items 7 + 9: incremental sync + restore-typo detection.
//
// Sync sends only entries with modifiedAt > serverSyncedAt when we have a
// baseline; otherwise sends a full payload. customExercises ride along.
// The server is authoritative for PRs after each merge — we replace local
// PRs with whatever it returns. serverSyncedAt persists across reloads.
// ============================================================================
// Workout-start prompts (v8)
//
// Two automatic triggers reduce the friction of remembering to tap "Start":
//
//   1. App launch — if it's been >12 hours since last activity AND no
//      session is currently active AND no forgotten-session prompt fired
//      already this load, ask "Start a workout now?"
//
//   2. First set logged — if no session is active when a set lands, ask
//      "Start the session timer?"
//
// Throttling: once either prompt has fired in the last 6 hours (declined
// or accepted), neither fires again until the throttle window passes.
// The "Don't ask again today" option pushes the throttle to end-of-day.
//
// Coordination with the forgotten-session prompt (already exists from v6):
// the forgotten prompt runs FIRST during boot. If it fires, the launch
// prompt is suppressed for this session — one prompt at a time.
// ============================================================================

const PROMPT_THROTTLE_KEY = 'ironPromptThrottleUntil';
const LAUNCH_PROMPT_THRESHOLD_MS = 12 * 60 * 60 * 1000;   // 12h since last activity
const PROMPT_THROTTLE_MS = 6 * 60 * 60 * 1000;            // 6h cooldown between prompts

let _forgottenPromptDidFire = false;   // set by resumeOrPromptSession when it asks

function isPromptThrottled() {
    const until = parseInt(localStorage.getItem(PROMPT_THROTTLE_KEY) || '0', 10);
    return Date.now() < until;
}

function throttlePrompts(durationMs = PROMPT_THROTTLE_MS) {
    localStorage.setItem(PROMPT_THROTTLE_KEY, String(Date.now() + durationMs));
}

// Push throttle to end of today (local time) — used when the user says
// "Don't ask again today."
function throttleUntilEndOfDay() {
    const eod = new Date();
    eod.setHours(23, 59, 59, 999);
    localStorage.setItem(PROMPT_THROTTLE_KEY, String(eod.getTime()));
}

// Find the most recent activity timestamp across all data. Used to decide
// whether enough time has passed to warrant "want to start a workout?"
async function lastActivityTimestamp() {
    const all = (await performDB('workouts', 'getAll')).filter(w => !w.deleted);
    if (!all.length) return 0;
    return Math.max(...all.map(w => w.id));
}

// Launch prompt — call this AFTER resumeOrPromptSession (so the forgotten
// case takes precedence) and only if no session ended up active.
async function maybePromptStartOnLaunch() {
    if (activeSession) return;                  // already in a workout
    if (_forgottenPromptDidFire) return;        // user just dealt with one prompt
    if (isPromptThrottled()) return;            // recently asked, don't pester
    const lastAt = await lastActivityTimestamp();
    if (lastAt === 0) return;                   // brand new user — don't prompt
    if (Date.now() - lastAt < LAUNCH_PROMPT_THRESHOLD_MS) return;  // too recent

    const ok = await confirmSheet({
        title: 'Start a workout now?',
        body: "Track session time and rest while you lift, or keep logging individual sets without a session.",
        confirmLabel: 'Start workout',
        cancelLabel: 'Not now',
    });
    throttlePrompts();   // either way, don't re-ask for 6h
    if (ok) {
        await startWorkoutSession();
        showSnackbar('Workout started', { duration: 2500 });
    }
}

//
// Sync fires automatically without user action in three situations:
//   1. A workout session ends (after a real workout, push the batch)
//   2. The app goes to background mid-workout or with unsynced data
//      (visibilitychange — safety net for "phone dies" / iOS app suspension)
//   3. App boots with the unsynced flag still set (catch-up from a missed
//      previous sync — e.g., the page was killed before background-sync fired)
//
// Per-set syncing is intentionally NOT done — it would generate one network
// request per logged set, drain battery, and hammer the Worker on long
// workouts. Workout-level granularity is the right tradeoff.
//
// Manual sync (header button) always remains available regardless of these.
// ============================================================================

const UNSYNCED_KEY = 'ironHasUnsynced';

function markUnsynced() {
    if (!hasUnsyncedChanges) {
        hasUnsyncedChanges = true;
        localStorage.setItem(UNSYNCED_KEY, '1');
    }
}

function clearUnsynced() {
    if (hasUnsyncedChanges) {
        hasUnsyncedChanges = false;
        localStorage.removeItem(UNSYNCED_KEY);
    }
}

// Fire a sync silently if conditions are met. Used by every auto-trigger so
// they don't all need to know the eligibility rules.
async function autoSync(reason) {
    if (!userProfile?.email || !getToken()) return;     // unconfigured: nothing to sync to
    if (!hasUnsyncedChanges) return;                    // nothing pending
    if (!navigator.onLine) return;                      // offline: SW queue handles it
    console.log(`[autoSync] firing — reason: ${reason}`);
    try {
        await syncToNAS();
        // syncToNAS clears `hasUnsyncedChanges` only on success. If it
        // failed and queued, the next trigger (background, launch) will retry.
    } catch (err) {
        console.warn('[autoSync] failed:', err);
    }
}

// Background / page-hide handler — best-effort sync when the user leaves.
// On iOS, switching apps suspends the page within seconds; the request may
// not complete. The SW queue and the on-launch retry both cover this.
function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        autoSync('page-hidden');
    } else if (document.visibilityState === 'visible') {
        // v9.10 — When the PWA returns to the foreground (lock-screen
        // unlock, app-switch back, etc.), poke the SW to re-check for a
        // new version. Cheap conditional GET; if we're already on the
        // latest, the browser short-circuits with a 304 and nothing
        // happens. This shifts "next update check" from "up to 30 min"
        // (the setInterval poll) to "the moment the user looks at the
        // app" — by far the most common moment a user would benefit.
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration()
                .then(reg => reg?.update())
                .catch(() => {});
        }
        // Browser auto-releases the screen wake lock on hide; re-acquire
        // if we're returning mid-session.
        if (activeSession) acquireScreenWakeLock();
        // The clock can be many minutes stale if the page was suspended.
        updateWorkoutClock();
    }
}


async function syncToNAS() {
    if (!userProfile?.email) { setStatus('Add email in Profile', 'error'); return; }
    if (!getToken()) { setStatus('Add access key in Profile', 'error'); return; }

    setStatus('Syncing…', 'listening');
    try {
        await garbageCollectTombstones();   // item 8: drop expired tombstones first

        const allData      = await performDB('workouts', 'getAll');
        const allTpls      = await performDB('templates', 'getAll');
        const allCustoms   = await performDB('customExercises', 'getAll');
        const allSessions  = await performDB('sessions', 'getAll');   // v6

        const useDelta = serverSyncedAt > 0;
        const since = serverSyncedAt;
        const filterChanged = arr => arr.filter(r => (r.modifiedAt ?? r.id ?? 0) > since);

        const dataToSend     = useDelta ? filterChanged(allData)     : allData;
        const tplsToSend     = useDelta ? filterChanged(allTpls)     : allTpls;
        const customsToSend  = useDelta ? filterChanged(allCustoms)  : allCustoms;
        const sessionsToSend = useDelta ? filterChanged(allSessions) : allSessions;

        if (useDelta && !dataToSend.length && !tplsToSend.length && !customsToSend.length && !sessionsToSend.length) {
            setStatus('Up to date', 'synced');
            clearUnsynced();   // v8: nothing to send means we're already in sync
            lastSyncMeta = { at: Date.now(), error: false, sent: 0, mode: 'delta' };
            localStorage.setItem('ironSyncMeta', JSON.stringify(lastSyncMeta));
            renderSyncMeta();
            setTimeout(() => setStatus('Ready'), 2000);
            return;
        }

        const body = JSON.stringify({
            action: 'backup',
            mode: useDelta ? 'delta' : 'full',
            user: userProfile,
            data: dataToSend,
            templates: tplsToSend,
            customExercises: customsToSend,
            sessions: sessionsToSend,
            syncedAt: Date.now(),
        });

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const reply = await res.json();

        // Server is authoritative for PRs — replace local set.
        if (Array.isArray(reply.prs)) {
            const existing = await performDB('prs', 'getAll');
            for (const e of existing) await performDB('prs', 'delete', e.exercise);
            for (const pr of reply.prs) await performDB('prs', 'put', pr);
        }

        if (typeof reply.syncedAt === 'number') {
            serverSyncedAt = reply.syncedAt;
            localStorage.setItem('ironServerSyncedAt', String(serverSyncedAt));
        }

        await performDB('syncQueue', 'delete', 'pending');
        lastSyncFailed = false;
        clearUnsynced();   // v8: success — local data now matches server
        lastSyncMeta = {
            at: Date.now(),
            error: false,
            sent: dataToSend.length,
            mode: reply.mode || (useDelta ? 'delta' : 'full'),
        };
        localStorage.setItem('ironSyncMeta', JSON.stringify(lastSyncMeta));

        const label = (reply.mode === 'delta')
            ? `Synced (+${dataToSend.length})`
            : `Synced (${reply.totalCount ?? dataToSend.length})`;
        setStatus(label, 'synced');
        haptic(15);
        setTimeout(() => setStatus('Ready'), 2500);

        await refreshLatestStats();
        renderSyncMeta();
    } catch (err) {
        console.error('Sync failed', err);
        lastSyncFailed = true;
        lastSyncMeta = { at: Date.now(), error: true };
        localStorage.setItem('ironSyncMeta', JSON.stringify(lastSyncMeta));
        setStatus('Sync failed (will retry)', 'error');
        // Always queue a full payload for SW background-sync replay so we don't
        // lose anything if the connection comes back hours later.
        try {
            const data       = await performDB('workouts', 'getAll');
            const templates  = await performDB('templates', 'getAll');
            const customs    = await performDB('customExercises', 'getAll');
            const sessions   = await performDB('sessions', 'getAll');
            const body = JSON.stringify({
                action: 'backup', mode: 'full', user: userProfile,
                data, templates, customExercises: customs, sessions,
                syncedAt: Date.now()
            });
            await performDB('syncQueue', 'put', { id: 'pending', token: getToken(), body });
            const reg = await navigator.serviceWorker?.ready;
            if (reg && 'sync' in reg) await reg.sync.register('ironvoice-sync');
        } catch (qErr) { console.warn('Queue failed', qErr); }
    }
}

async function restoreFromNAS() {
    if (!userProfile?.email) {
        await infoSheet({ title: 'Add an email first', body: 'Restore looks up your cloud backup by email — set one in Profile.' });
        return;
    }
    if (!getToken()) {
        await infoSheet({ title: 'Add your access key first', body: 'Restore needs the bearer token saved in Profile to authorize the request.' });
        return;
    }
    const ok = await confirmSheet({
        title: 'Pull from the cloud and merge?',
        body: 'Local data is kept; remote-only entries are added; deletes win on either side.',
        confirmLabel: 'Restore',
    });
    if (!ok) return;

    setStatus('Restoring…', 'listening');
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ action: 'restore', user: userProfile })
        });

        // Item 9: 404 means no backup exists for this email. Most often a typo.
        if (res.status === 404) {
            setStatus('No backup found', 'error');
            await infoSheet({
                title: 'No backup found',
                body: `Nothing in the cloud for ${userProfile.email}. If this was a typo, fix the email in Profile and try again. Your local data is untouched.`,
            });
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const remote = await res.json();

        const local = await performDB('workouts', 'getAll');
        const localMap = new Map(local.map(w => [w.id, w]));
        let added = 0, marked = 0, updated = 0;

        for (const r of remote.data || []) {
            const existing = localMap.get(r.id);
            if (!existing) {
                await performDB('workouts', 'put', r);
                added++;
            } else if (r.deleted && !existing.deleted) {
                existing.deleted = true;
                existing.modifiedAt = r.modifiedAt || Date.now();
                await performDB('workouts', 'put', existing);
                marked++;
            } else if ((r.modifiedAt ?? 0) > (existing.modifiedAt ?? 0)) {
                await performDB('workouts', 'put', r);
                updated++;
            }
        }

        const localTpls = await performDB('templates', 'getAll');
        const localTplMap = new Map(localTpls.map(t => [t.id, t]));
        for (const r of remote.templates || []) {
            const existing = localTplMap.get(r.id);
            if (!existing || (r.modifiedAt ?? 0) > (existing.modifiedAt ?? 0) || (r.deleted && !existing.deleted)) {
                await performDB('templates', 'put', r);
            }
        }

        // Pull custom exercises and refresh the in-memory library.
        const localCust = await performDB('customExercises', 'getAll');
        const localCustMap = new Map(localCust.map(c => [c.name, c]));
        for (const r of remote.customExercises || []) {
            const existing = localCustMap.get(r.name);
            if (!existing || (r.modifiedAt ?? 0) > (existing.modifiedAt ?? 0)) {
                await performDB('customExercises', 'put', r);
            }
        }
        // Strip stale customs out of the library; reload from the merged set.
        for (let i = exerciseLibrary.length - 1; i >= 0; i--) {
            if (exerciseLibrary[i].custom) exerciseLibrary.splice(i, 1);
        }
        await loadCustomExercisesIntoLibrary();

        // v6: merge sessions by id; newer modifiedAt wins.
        const localSess = await performDB('sessions', 'getAll');
        const localSessMap = new Map(localSess.map(s => [s.id, s]));
        for (const r of remote.sessions || []) {
            const existing = localSessMap.get(r.id);
            if (!existing || (r.modifiedAt ?? 0) > (existing.modifiedAt ?? 0)) {
                await performDB('sessions', 'put', r);
            }
        }

        // Recompute PRs locally from the merged active set.
        const exercises = new Set((await getActiveWorkouts()).map(w => w.exercise));
        for (const ex of exercises) await recomputePR(ex);
        markFrequencyDirty();

        // Adopt the server's syncedAt so subsequent syncs go delta.
        if (typeof remote.syncedAt === 'number') {
            serverSyncedAt = remote.syncedAt;
            localStorage.setItem('ironServerSyncedAt', String(serverSyncedAt));
        }

        await renderAll();
        const delta = { added, marked, updated };
        lastSyncMeta = { at: Date.now(), error: false, delta };
        localStorage.setItem('ironSyncMeta', JSON.stringify(lastSyncMeta));
        setStatus(`Restored: +${added}, ✕${marked}${updated ? `, ⟲${updated}` : ''}`, 'synced');
        haptic([20, 40, 20]);
        setTimeout(() => setStatus('Ready'), 3000);
        renderSyncMeta();
        closeSettings();
    } catch (err) {
        console.error('Restore failed', err);
        setStatus('Restore failed', 'error');
    }
}
