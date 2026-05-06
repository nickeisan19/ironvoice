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
let chartMode = localStorage.getItem('ironChartMode') || 'volume';
let theme = localStorage.getItem('ironTheme') || 'dark';
let workoutMode = localStorage.getItem('ironWorkoutMode') === 'on';
let serverSyncedAt = parseInt(localStorage.getItem('ironServerSyncedAt') || '0', 10);
let editingCustomExercise = null;
let voiceURI = localStorage.getItem('ironVoiceURI') || '';
// v6: workout sessions
let activeSession = null;        // current in-progress session, or null
let _sessionTickerTimer = null;  // setInterval handle for live time updates
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
    initChartFilters();
    initOnlineHandler();
    initSWMessages();
    initJournalDelegation();
    initVoicePicker();
    initActionDispatcher();
    maybeShowInstallHint();
    handleShortcutAction();
    showScreen('home');   // mark Home tab active on first load
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
    pendingSWUpdate.postMessage({ type: 'SKIP_WAITING' });
    $('update-toast').classList.remove('active');
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

function initChartFilters() {
    document.querySelectorAll('.chart-filters .filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chart-filters .filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            chartMode = chip.dataset.mode;
            localStorage.setItem('ironChartMode', chartMode);
            renderTrainingRhythm();
            haptic(6);
        });
        if (chip.dataset.mode === chartMode) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
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

function filterExercises() {
    const input = $('ex-search').value.toLowerCase();
    const dropdown = $('ex-dropdown');
    dropdown.innerHTML = "";

    // v8: when a workout is active, inject a "This workout" section at the
    // top with the exercises already logged in this session (most recent
    // first). Helps logging consecutive sets of the same lift without
    // re-typing. Only shows when search is empty so it doesn't interfere
    // with normal search behavior.
    if (activeSession && !input) {
        renderSessionSearchSection(dropdown);
    }

    let pool = exerciseLibrary;
    if (activeTemplate) {
        const names = activeTemplate.exercises.map(e => e.name);
        pool = pool.filter(ex => names.includes(ex.name));
    }
    const matches = pool.filter(ex =>
        !input || ex.name.includes(input) || ex.synonyms.some(s => s.includes(input))
    ).sort((a, b) => a.name.localeCompare(b.name));

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

function selectExercise(name) {
    selectedExercise = name;
    $('ex-search').value = titleCase(name);
    $('ex-dropdown').classList.remove('active');
    $('ex-search')?.setAttribute('aria-expanded', 'false');

    // If active template has a target for this exercise, prefill
    if (activeTemplate) {
        const target = activeTemplate.exercises.find(e => e.name === name);
        if (target?.targetWeight) $('manual-w').value = target.targetWeight;
        if (target?.targetReps) $('manual-r').value = target.targetReps;
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
    selectedExercise = "";
    document.activeElement?.blur();
    haptic(15);
}

function buildEntry(exercise, weight, reps) {
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
    };
}

async function saveAndSyncUI(entry) {
    try {
        await performDB('workouts', 'put', entry);
        const oldPR = await performDB('prs', 'get', entry.exercise);
        const isNewPR = !oldPR || entry.oneRM > oldPR.max1RM;
        if (isNewPR) {
            await performDB('prs', 'put', { exercise: entry.exercise, maxWeight: entry.weight, max1RM: entry.oneRM, achievedAt: entry.id });
        }
        markUnsynced();   // v8: flag for auto-sync triggers (background, end-of-workout)
        await updateUI(entry, isNewPR);
        await renderHistory();
        await renderStrengthTrajectory();
        await renderTrainingRhythm();
        await renderBalance();
        await renderStrain();
        await renderInsights();
        await renderTemplateProgress();
        // v6: keep the live session card in sync if a session is active.
        await refreshSessionCard();
        if (restDuration > 0) startRestTimer(restDuration);
        // v8: if no session is active and we haven't recently asked, offer
        // to start one. Defer slightly so the new set has visibly rendered
        // before the prompt appears — feels reactive rather than blocking.
        if (!activeSession) {
            setTimeout(() => maybePromptStartOnFirstSet(), 400);
        }
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
            const w = await getActiveWorkouts();
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
            const entry = buildEntry(intent.exercise, intent.weight, intent.reps);
            await saveAndSyncUI(entry);
            speak(`Logged ${entry.weight} for ${entry.reps}.`);
            break;
        }
    }
    // Single-tap mode: a successful command means the user got what they
    // came for — close the session. Workout mode keeps listening for the
    // next set until the user toggles it off.
    if (!workoutMode && isListening) endSession('Ready');
}

function speak(text) {
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
    await renderStrengthTrajectory();
    await renderTrainingRhythm();
    await renderBalance();
    await renderStrain();
    await renderInsights();
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

    const all = await getActiveWorkouts();

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

    const all = await getActiveWorkouts();
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
    // Lift the snackbar above the rest-timer pill if one is currently
    // visible — both default to bottom: 128 + safe-area, which would stack.
    const timerActive = $('rest-timer')?.classList.contains('active');
    bar.classList.toggle('over-timer', !!timerActive);
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
        await recomputePR(entry.exercise);
        await renderHistory();
        await renderStrengthTrajectory();
        await renderTrainingRhythm();
        await renderBalance();
        await renderStrain();
        await renderInsights();
        await refreshLatestStats();
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
        deleteTemplate, dismissTimer, downloadShare, exportHealthCSV,
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
        // v9.2 — End-workout confirm wrapper (button only; voice bypasses)
        confirmEndWorkout,
        // v9.1: Today-card tap routes state-aware (active → Workout, else → History)
        goToday,
        // v9.0 — PR celebration sheet (auto-presented on new PR)
        closePRCelebrate, downloadCelebrate, shareCelebrate,
        // v9.2 — quick-add another set for the same exercise during a workout
        openQuickAdd, closeQuickAdd, saveQuickAdd,
        // v9.6 — tap a pill → action sheet (Edit / Delete). Replaces the
        // v9.2 long-press gesture.
        openSetAction, closeSetAction, editFromSetAction, deleteFromSetAction,
        // a11y: surfaces an explanatory snackbar on browsers without
        // SpeechRecognition (iOS Safari, etc.). The mic's data-action is
        // rewritten to this in initSpeech() when SR is unavailable.
        voiceUnsupportedHint,
    };
    const INPUT_ACTIONS = { filterExercises };
    const FOCUS_ACTIONS = { showExercises };

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
// v9.4: Insight-led Trends — three cards on Home (Strength, Rhythm, Balance).
// Replaces the old 14-day Volume bar chart and absolute Muscle distribution.
// Each card leads with a one-line takeaway and a small visual underneath.
// ============================================================================

// Shared 4-week aggregator: returns 4 rolling 7-day buckets, oldest first.
// bucket[0] = days 21-27 ago, bucket[3] = last 7 days. Each entry is the
// raw workouts array for that window so callers can derive any metric.
function fourWeekBuckets(workouts) {
    const buckets = [[], [], [], []];
    for (let b = 0; b < 4; b++) {
        const startOffset = (3 - b) * 7 + 6;   // older edge, inclusive
        const endOffset = (3 - b) * 7;         // newer edge, inclusive
        const startISO = isoForOffset(startOffset);
        const endISO = isoForOffset(endOffset);
        buckets[b] = workouts.filter(w => w.date >= startISO && w.date <= endISO);
    }
    return buckets;
}

// ----------------------------------------------------------------------------
// Card 1 — Strength Trajectory
//
// For the user's top 3 most-frequent exercises in the last 4 weeks, surface
// the change in best estimated 1RM from week-1 to week-4. The headline gives
// a single-glance answer to "am I getting stronger?"; the per-row sparkline
// shows the shape underneath. Tapping a row opens the existing exercise
// sheet (which has the full-history trend chart).
// ----------------------------------------------------------------------------
async function renderStrengthTrajectory() {
    const list = $('strength-list');
    const headline = $('strength-headline');
    if (!list || !headline) return;
    list.innerHTML = "";

    const workouts = await getActiveWorkouts();
    const buckets = fourWeekBuckets(workouts);
    const all4w = buckets.flat();

    if (!all4w.length) {
        headline.textContent = 'Log a few sets to see your strength trajectory.';
        return;
    }

    // Per-exercise: max oneRM in each of the 4 weekly buckets, plus a
    // session-count for ranking. A "session" = a distinct date with a set.
    const byEx = {};
    buckets.forEach((bucket, weekIdx) => {
        bucket.forEach(w => {
            if (!byEx[w.exercise]) byEx[w.exercise] = { weeks: [0, 0, 0, 0], dates: new Set() };
            if (w.oneRM > byEx[w.exercise].weeks[weekIdx]) byEx[w.exercise].weeks[weekIdx] = w.oneRM;
            byEx[w.exercise].dates.add(w.date);
        });
    });

    const ranked = Object.entries(byEx)
        .map(([ex, d]) => ({ ex, weeks: d.weeks, sessions: d.dates.size }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 3);

    if (!ranked.length) {
        headline.textContent = 'Log a few sets to see your strength trajectory.';
        return;
    }

    // Headline: summarize the deltas across the top exercises. Each gets a
    // short "Bench +5" / "Squat —" fragment; we join with a middle dot.
    const headlineFrags = ranked.map(r => {
        const first = r.weeks.find(v => v > 0) || 0;
        const last = [...r.weeks].reverse().find(v => v > 0) || 0;
        const delta = first && last ? last - first : 0;
        const name = titleCase(r.ex.split(' ').slice(0, 2).join(' '));
        if (!first || !last || first === last || Math.abs(delta) < 1) return `${name} —`;
        const sign = delta > 0 ? '+' : '';
        return `${name} ${sign}${Math.round(delta)}`;
    });
    headline.textContent = headlineFrags.join(' · ');

    // Rows: name, delta pill, sparkline
    ranked.forEach(r => {
        const first = r.weeks.find(v => v > 0) || 0;
        const last = [...r.weeks].reverse().find(v => v > 0) || 0;
        const delta = first && last ? last - first : 0;

        let pillCls = 'flat';
        let pillText = '—';
        if (first && last && Math.abs(delta) >= 1) {
            if (delta > 0) { pillCls = 'up'; pillText = `+${Math.round(delta)}`; }
            else { pillCls = 'down'; pillText = `${Math.round(delta)}`; }
        }

        // Sparkline. Plot only the non-zero weeks (zero = no session that week,
        // not a regression to 0 lbs). One point = render a single dot; <2
        // points overall means no sparkline, just the dot for the latest.
        const points = r.weeks
            .map((v, i) => ({ x: i, v }))
            .filter(p => p.v > 0);
        const maxV = Math.max(...points.map(p => p.v), 1);
        const minV = Math.min(...points.map(p => p.v));
        const range = Math.max(maxV - minV, 1);
        // viewBox 0 0 70 28 — match container px so coords map 1:1
        const px = (p) => ({
            x: 4 + (p.x / 3) * 62,
            y: 4 + (1 - (p.v - minV) / range) * 20,
        });
        const coords = points.map(px);
        const polyline = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
        const endDot = coords[coords.length - 1];
        const sparkSvg = coords.length >= 2
            ? `<svg class="sr-spark ${pillCls}" viewBox="0 0 70 28" preserveAspectRatio="none">
                   <polyline class="line" points="${polyline}"/>
                   <circle class="end-dot" cx="${endDot.x.toFixed(1)}" cy="${endDot.y.toFixed(1)}" r="2.5"/>
               </svg>`
            : `<svg class="sr-spark ${pillCls}" viewBox="0 0 70 28" preserveAspectRatio="none">
                   ${endDot ? `<circle class="end-dot" cx="${endDot.x.toFixed(1)}" cy="${endDot.y.toFixed(1)}" r="2.5"/>` : ''}
               </svg>`;

        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'strength-row';
        row.dataset.exercise = r.ex;
        row.setAttribute('aria-label', `Open ${titleCase(r.ex)} details`);
        row.innerHTML = `
            <span class="sr-name">${escapeHtml(titleCase(r.ex))}</span>
            <span class="sr-delta ${pillCls}">${escapeHtml(pillText)} lb</span>
            ${sparkSvg}
        `;
        row.addEventListener('click', () => openExercise(r.ex));
        list.appendChild(row);
    });
}

// ----------------------------------------------------------------------------
// Card 2 — Training Rhythm
//
// Four weekly bars (rolling 7-day buckets) with a workout-count badge under
// each. Replaces the old 14-day Volume chart at a more useful timescale.
// Headline: avg workouts/week + delta vs prior 4-week window when available.
// Volume/Sets toggle reuses the existing chartMode state.
// ----------------------------------------------------------------------------
async function renderTrainingRhythm() {
    const chart = $('rhythm-chart');
    const headline = $('rhythm-headline');
    if (!chart || !headline) return;
    chart.innerHTML = "";

    const workouts = await getActiveWorkouts();
    const buckets = fourWeekBuckets(workouts);
    const all4w = buckets.flat();

    const metric = (bucket) => chartMode === 'sets'
        ? bucket.length
        : bucket.reduce((s, w) => s + w.weight * w.reps, 0);

    const values = buckets.map(metric);
    const dayCounts = buckets.map(b => new Set(b.map(w => w.date)).size);
    const max = Math.max(1, ...values);

    // Headline. Two-pass logic:
    //   1) avg workouts/week over the last 4 weeks
    //   2) delta vs prior 4 weeks (days 28-55 ago) when there's enough data
    const totalDays4w = dayCounts.reduce((a, b) => a + b, 0);
    const avg = totalDays4w / 4;

    // Prior 4-week window for comparison — straight count of distinct dates.
    const priorStart = isoForOffset(55);
    const priorEnd = isoForOffset(28);
    const priorDates = new Set(
        workouts.filter(w => w.date >= priorStart && w.date <= priorEnd).map(w => w.date)
    );
    const priorAvg = priorDates.size / 4;

    if (!totalDays4w) {
        headline.textContent = 'No workouts logged in the last 4 weeks.';
    } else {
        let head = `${avg.toFixed(1)} workouts/week avg`;
        if (priorAvg > 0) {
            const diff = avg - priorAvg;
            if (Math.abs(diff) >= 0.25) {
                const sign = diff > 0 ? '+' : '';
                head += ` · ${sign}${diff.toFixed(1)} vs prior`;
            } else {
                head += ` · steady`;
            }
        }
        headline.textContent = head;
    }

    // Bars
    buckets.forEach((bucket, i) => {
        const v = values[i];
        const days = dayCounts[i];
        const isCurrent = (i === 3);

        const col = document.createElement('div');
        col.className = 'rhythm-col';
        if (v > 0) col.classList.add('active');
        if (isCurrent) col.classList.add('current');

        const heightPct = Math.max(4, (v / max) * 100);
        const labelVal = chartMode === 'sets'
            ? `${v} set${v === 1 ? '' : 's'}`
            : `${Math.round(v).toLocaleString()} lbs`;
        col.title = `${i === 3 ? 'This week' : `${(3 - i)}w ago`}: ${labelVal}, ${days} day${days === 1 ? '' : 's'}`;

        col.innerHTML = `
            <div class="rc-bar-wrap"><div class="rc-bar" style="height:${heightPct}%"></div></div>
            <div class="rc-count">${days}d</div>
        `;
        chart.appendChild(col);
    });
}

// ----------------------------------------------------------------------------
// Card 3 — Balance vs Your Norm
//
// For each muscle group, compare last-7-day volume to the user's 30-day
// rolling weekly average for that muscle. Renders a horizontal bar with a
// baseline marker; the headline calls out the most under-trained muscle if
// it's >25% below baseline, otherwise reports "balanced". Replaces the
// old absolute-percentage muscle distribution which had no reference.
// ----------------------------------------------------------------------------
async function renderBalance() {
    const list = $('balance-list');
    const headline = $('balance-headline');
    if (!list || !headline) return;
    list.innerHTML = "";

    const workouts = await getActiveWorkouts();
    const cutoff7 = isoForOffset(6);    // last 7 days inclusive
    const cutoff30 = isoForOffset(29);  // last 30 days inclusive

    const recent7 = workouts.filter(w => w.date >= cutoff7);
    const recent30 = workouts.filter(w => w.date >= cutoff30);

    const sumByMuscle = (entries) => {
        const totals = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
        entries.forEach(w => { totals[muscleOf(w.exercise)] += w.weight * w.reps; });
        return totals;
    };
    const cur = sumByMuscle(recent7);
    const baseline30 = sumByMuscle(recent30);
    const baselineWeekly = {};
    MUSCLES.forEach(m => { baselineWeekly[m] = baseline30[m] / (30 / 7); });

    const grandCur = Object.values(cur).reduce((a, b) => a + b, 0);
    const grandBase = Object.values(baselineWeekly).reduce((a, b) => a + b, 0);

    if (!grandCur && !grandBase) {
        headline.textContent = 'No volume in the last 30 days.';
        return;
    }
    if (!grandBase) {
        // First-week user — no baseline yet, just show this week's spread.
        headline.textContent = 'Building your baseline — keep logging.';
    } else if (!grandCur) {
        headline.textContent = 'Nothing logged in the last 7 days.';
    } else {
        // Most under-trained muscle vs baseline (only when baseline has
        // meaningful volume for it). Surface only if deviation > 25%.
        let worst = null;
        MUSCLES.forEach(m => {
            if (baselineWeekly[m] < 100) return; // ignore muscles with negligible baseline
            const dev = (cur[m] - baselineWeekly[m]) / baselineWeekly[m];
            if (dev < -0.25 && (!worst || dev < worst.dev)) worst = { m, dev };
        });
        if (worst) {
            headline.textContent = `${titleCase(worst.m)} ${Math.round(Math.abs(worst.dev) * 100)}% below your norm.`;
        } else {
            headline.textContent = `Balanced — within 25% of your norm.`;
        }
    }

    // Each row: muscle name, track with current fill + baseline marker, pct delta
    // The track scales to the *max* of (current, baseline) across all muscles
    // so bars and markers share a consistent x-axis.
    const trackMax = Math.max(
        1,
        ...MUSCLES.map(m => Math.max(cur[m], baselineWeekly[m]))
    );

    MUSCLES.forEach(m => {
        const curV = cur[m];
        const baseV = baselineWeekly[m];
        const fillPct = (curV / trackMax) * 100;
        const baselinePct = (baseV / trackMax) * 100;

        let cls = '';
        let pctText = '—';
        if (baseV >= 100) {
            const dev = (curV - baseV) / baseV;
            const devPct = Math.round(dev * 100);
            if (dev > 0.1) { cls = 'above'; pctText = `+${devPct}%`; }
            else if (dev < -0.1) { cls = 'below'; pctText = `${devPct}%`; }
            else { pctText = '~norm'; }
        } else if (curV > 0) {
            pctText = 'new';
        } else {
            pctText = '—';
        }

        const row = document.createElement('div');
        row.className = `balance-row ${cls}`;
        row.innerHTML = `
            <span class="br-name">${titleCase(m)}</span>
            <div class="br-track">
                <div class="br-fill" style="width:${fillPct.toFixed(1)}%;background:${muscleColor[m]}"></div>
                ${baseV > 0 ? `<div class="br-baseline" style="left:${baselinePct.toFixed(1)}%" title="30d avg"></div>` : ''}
            </div>
            <span class="br-pct">${escapeHtml(pctText)}</span>
        `;
        list.appendChild(row);
    });
}

// ============================================================================
// Strain / recovery score
// ============================================================================

async function renderStrain() {
    const card = $('strain-card');
    const text = $('strain-text');
    const sub = $('strain-sub');
    card.classList.remove('recovery', 'steady', 'high', 'over');

    const workouts = await getActiveWorkouts();
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
// Insights — auto-deload detection
// ============================================================================

async function renderInsights() {
    const card = $('insights-card');
    const workouts = await getActiveWorkouts();
    if (!workouts.length) { card.style.display = 'none'; return; }

    // Group by exercise + date, take max 1RM per session
    const byEx = {};
    workouts.forEach(w => {
        if (!byEx[w.exercise]) byEx[w.exercise] = {};
        const day = byEx[w.exercise][w.date] || 0;
        if (w.oneRM > day) byEx[w.exercise][w.date] = w.oneRM;
    });

    const stale = [];
    const cutoff = isoForOffset(21); // ignore exercises not done in last 3 weeks
    for (const [ex, dates] of Object.entries(byEx)) {
        const sessions = Object.entries(dates)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .filter(([d]) => d >= cutoff);
        if (sessions.length < 4) continue;
        const last4 = sessions.slice(-4);
        let plateauedCount = 0;
        for (let i = 1; i < last4.length; i++) {
            if (last4[i][1] <= last4[i - 1][1] * 1.005) plateauedCount++;
        }
        if (plateauedCount >= 3) stale.push(ex);
    }

    if (!stale.length) { card.style.display = 'none'; return; }

    $('insight-title').textContent = stale.length === 1
        ? `${titleCase(stale[0])} has plateaued`
        : `${stale.length} exercises plateaued`;
    $('insight-text').textContent = stale.slice(0, 3).map(titleCase).join(', ') +
        (stale.length > 3 ? ` and ${stale.length - 3} more` : '') +
        '. Consider a deload week or a small variation.';
    card.style.display = 'flex';
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
        await recomputePR(entry.exercise);
        await renderHistory();
        await renderStrengthTrajectory();
        await renderTrainingRhythm();
        await renderBalance();
        await renderStrain();
        await renderInsights();
        await refreshLatestStats();
        await refreshSessionCard();   // v8: keep workout dashboard in sync if a session set was removed
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
    const all = (await performDB('workouts', 'getAll')).filter(w => !w.deleted && w.exercise === exercise);
    if (!all.length) { await performDB('prs', 'delete', exercise); return; }
    const best = all.reduce((b, w) => w.oneRM > b.oneRM ? w : b);
    await performDB('prs', 'put', { exercise, maxWeight: best.weight, max1RM: best.oneRM, achievedAt: best.id });
}

// ============================================================================
// Rest timer
// ============================================================================

function startRestTimer(seconds) {
    if (restTimerHandle) clearInterval(restTimerHandle);
    if (restCompleteTimeout) clearTimeout(restCompleteTimeout);
    const pill = $('rest-timer');
    const arc = $('timer-arc');
    const text = $('timer-text');
    const total = seconds;
    let remaining = seconds;
    const circumference = 100.53;

    pill.classList.remove('complete');
    pill.classList.add('active');

    const update = () => {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        text.textContent = `${m}:${String(s).padStart(2, '0')}`;
        arc.style.strokeDashoffset = circumference * (1 - remaining / total);
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

function logoutFromSettings() {
    if (!confirm("Sign out of this device? Cloud history is preserved — sign back in with the same email to restore.")) return;
    localStorage.removeItem('ironUser');
    localStorage.removeItem('ironToken');
    location.reload();
}

async function wipeFromSettings() {
    if (!confirm("Wipe all local history, PRs, and templates? This cannot be undone.")) return;
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
    if (!data.length) { alert('No data to export.'); return; }
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
    if (!confirm(`Delete "${editingTemplate.name}"?`)) return;
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
            alert(`"${titleCase(name)}" already exists in the library.`);
            haptic([20, 50, 20]);
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
    if (!confirm(`Delete "${titleCase(editingCustomExercise.name)}"?\n\nExisting journal entries with this name stay. New voice/search matches won't include it.`)) return;

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
    setTimeout(() => $('plate-target').focus(), 350);
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
let _setActionId = null;

async function openQuickAdd(el) {
    const exercise = el?.dataset?.exercise;
    if (!exercise) return;
    _quickAddExercise = exercise;
    _quickAddEditId = null;   // explicit Add path

    const lib = exerciseLibrary.find(ex => ex.name === exercise);
    const muscle = lib?.muscle || muscleOf(exercise) || 'core';
    $('quick-add-title').textContent = 'Add set';
    $('quick-add-name').textContent = titleCase(exercise);
    const tagEl = $('quick-add-muscle');
    if (tagEl) tagEl.style.background = muscleColor[muscle] || '#888';

    // Pre-fill from the most recent set of this exercise — first try the
    // active session, then fall back to the all-time most recent so the
    // dialog still has something useful even outside a session.
    let prev = null;
    const all = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted && w.exercise === exercise);
    if (activeSession) {
        prev = all
            .filter(w => w.sessionId === activeSession.id)
            .sort((a, b) => b.id - a.id)[0] || null;
    }
    if (!prev) prev = all.sort((a, b) => b.id - a.id)[0] || null;

    $('quick-add-w').value = prev ? String(prev.weight) : '';
    $('quick-add-r').value = prev ? String(prev.reps) : '';
    $('quick-add-prev').textContent = prev
        ? `Previous set: ${prev.weight} × ${prev.reps}`
        : 'No previous sets — enter weight and reps.';
    const foot = $('quick-add-foot');
    if (foot) foot.textContent = 'Same exercise, new weight × reps. Pre-filled from the previous set.';

    $('quick-add-overlay').classList.add('active');
    setTimeout(() => $('quick-add-w').focus({ preventScroll: true }), 350);
}

function closeQuickAdd() {
    $('quick-add-overlay').classList.remove('active');
    _quickAddExercise = null;
    _quickAddEditId = null;
}

async function saveQuickAdd() {
    const exercise = _quickAddExercise;
    const w = parseFloat($('quick-add-w').value);
    const r = parseInt($('quick-add-r').value, 10);
    if (!exercise || isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
        haptic([20, 50, 20]);
        return;
    }
    if (_quickAddEditId != null) {
        const id = _quickAddEditId;
        closeQuickAdd();
        await updateEntry(id, w, r);
        haptic(15);
        return;
    }
    const entry = buildEntry(exercise, w, r);
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
    setTimeout(() => $('quick-add-w').focus({ preventScroll: true }), 350);
}

// v9.6 — Update an existing set's weight/reps. Mirrors deleteEntry's
// re-render fan-out so PR badges, charts, and the active session card
// reflect the new value immediately. PR is recomputed (not just compared)
// because an edit can move the PR up OR down.
async function updateEntry(id, weight, reps) {
    try {
        const entry = await performDB('workouts', 'get', id);
        if (!entry || entry.deleted) return;
        entry.weight = weight;
        entry.reps = reps;
        entry.oneRM = epley(weight, reps);
        entry.modifiedAt = Date.now();
        await performDB('workouts', 'put', entry);
        markUnsynced();
        await recomputePR(entry.exercise);
        await renderHistory();
        await renderStrengthTrajectory();
        await renderTrainingRhythm();
        await renderBalance();
        await renderStrain();
        await renderInsights();
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

    // Stats
    const pr = await getCurrentPR(exerciseName);
    const sessions = new Set(all.map(w => w.date)).size;
    const totalVolume = all.reduce((s, w) => s + w.weight * w.reps, 0);

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
            <span style="font-variant-numeric:tabular-nums;font-weight:600">${w.weight} × ${w.reps}</span>
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
function downloadCelebrate() {
    if (!_celebratingExercise) return;
    $('pr-celebrate-canvas').toBlob(blob => {
        if (!blob) return;
        triggerDownload(blob, `pr-${_celebratingExercise.replace(/\s+/g, '-')}-${todayISO()}.png`);
    }, 'image/png');
}
async function shareCelebrate() {
    const c = $('pr-celebrate-canvas');
    if (!navigator.canShare) { downloadCelebrate(); return; }
    c.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], 'ironvoice-pr.png', { type: 'image/png' });
        try {
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'New PR',
                    text: `New ${titleCase(_celebratingExercise || '')} PR via IronVoice`,
                });
            } else {
                downloadCelebrate();
            }
        } catch (err) {
            if (err.name !== 'AbortError') console.warn('Share failed', err);
        }
    }, 'image/png');
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

    // Top tag
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IRONVOICE · NEW PR', W / 2, 180);

    // Exercise name
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 80px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';
    ctx.fillText(titleCase(exerciseName), W / 2, 360);

    // Big weight (gold gradient)
    const weight = Math.round(pr.max1RM);
    ctx.font = '800 360px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';
    const goldGrad = ctx.createLinearGradient(0, H * 0.4, 0, H * 0.7);
    goldGrad.addColorStop(0, '#ffd60a');
    goldGrad.addColorStop(1, '#ff9f0a');
    ctx.fillStyle = goldGrad;
    ctx.fillText(String(weight), W / 2, H * 0.6);

    // "lb 1RM" subtitle
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 56px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.fillText('LB · ESTIMATED 1RM', W / 2, H * 0.66);

    // Actual lift
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 64px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.fillText(`${pr.maxWeight} × reps for the record`, W / 2, H * 0.78);

    // Date
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '500 38px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.fillText(new Date(pr.achievedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), W / 2, H * 0.84);

    // Decorative bar near bottom (muscle color)
    ctx.fillStyle = accentColor;
    ctx.fillRect(W * 0.35, H * 0.92, W * 0.3, 6);
}

function downloadShare() {
    $('pr-canvas').toBlob(blob => {
        if (!blob) return;
        triggerDownload(blob, `pr-${currentExerciseSheet?.exercise.replace(/\s+/g, '-')}-${todayISO()}.png`);
    }, 'image/png');
}

async function nativeShare() {
    const c = $('pr-canvas');
    if (!navigator.canShare) { downloadShare(); return; }
    c.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], `ironvoice-pr.png`, { type: 'image/png' });
        try {
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: 'New PR', text: `New ${titleCase(currentExerciseSheet.exercise)} PR via IronVoice` });
            } else {
                downloadShare();
            }
        } catch (err) {
            if (err.name !== 'AbortError') console.warn('Share failed', err);
        }
    }, 'image/png');
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

async function startWorkoutSession() {
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
    await refreshSessionCard();
    updateWorkoutTabUI();
    // v9.1: flip Home tiles + header subtitle into "in session" mode now,
    // not on the next minute boundary.
    await renderTodayCard();
    await renderHomePrimaryAction();
    await renderHeaderSubtitle();
    haptic([15, 40, 15]);
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
    await refreshSessionCard();
    updateWorkoutTabUI();
    // v9.1: flip Home tiles + subtitle back to idle now that the session ended.
    await renderTodayCard();
    await renderWeekCard();
    await renderHomePrimaryAction();
    await renderHeaderSubtitle();
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
    const msg = setCount > 0
        ? `End this workout?\n\n${mins}m · ${setCount} set${setCount === 1 ? '' : 's'} logged.`
        : `End this workout?\n\nNo sets logged — the empty session will be discarded.`;
    if (!confirm(msg)) return;
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
    const totalVol = setsInSession.reduce((s, w) => s + w.weight * w.reps, 0);
    $('session-card-sets').textContent = String(setsInSession.length);
    $('session-card-vol').textContent = totalVol >= 1000
        ? `${(totalVol / 1000).toFixed(1)}k`
        : String(Math.round(totalVol));

    // v8: render the in-session set list grouped by exercise
    if (sessionSets) renderSessionSets(sessionSets, setsInSession);
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
    const totalVol = sets.reduce((s, w) => s + w.weight * w.reps, 0);
    const mins = Math.max(1, Math.round(last.durationMs / 60000));
    const dateLabel = formatDate(new Date(last.endedAt).toISOString().slice(0, 10));
    // Surface the heaviest single set as the "headline" lift.
    const top = sets.slice().sort((a, b) => b.weight - a.weight)[0];
    el.innerHTML = `
        <div class="last-workout-summary">
            <span class="lw-date">${escapeHtml(dateLabel)}</span>
            <span class="lw-stats">${mins}m · ${sets.length} sets · ${Math.round(totalVol).toLocaleString()} lb</span>
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
function renderSessionSets(container, sets) {
    if (!sets.length) {
        container.style.display = 'none';
        return;
    }
    container.style.display = '';

    // Group by exercise, preserving order of first appearance (most recent
    // first since the input is reverse-chronological).
    const sortedSets = [...sets].sort((a, b) => b.id - a.id);
    const groups = new Map();   // exercise → [sets]
    for (const set of sortedSets) {
        if (!groups.has(set.exercise)) groups.set(set.exercise, []);
        groups.get(set.exercise).push(set);
    }

    let html = '';
    for (const [exercise, exSets] of groups) {
        const lib = exerciseLibrary.find(ex => ex.name === exercise);
        const muscle = lib?.muscle || 'core';
        const muscleBg = escapeHtml(muscleColor[muscle] || '#888');
        // Order within an exercise: chronological (oldest first) so reading
        // left to right matches the order you actually did the sets in.
        const orderedSets = [...exSets].sort((a, b) => a.id - b.id);
        // v9.6 — pills are now buttons that open the set-action sheet so the
        // user can edit or delete the set. Same visual as before; the button
        // styling is handled by the existing .session-set-pill rules + the
        // shared interaction states from .history-pill.
        const setPills = orderedSets.map(s =>
            `<button type="button" class="session-set-pill history-pill" data-action="openSetAction" data-id="${s.id}" aria-label="Set ${escapeHtml(String(s.weight))} pounds for ${escapeHtml(String(s.reps))} reps. Tap to edit or delete.">${escapeHtml(String(s.weight))}<span class="set-reps"> × ${escapeHtml(String(s.reps))}</span></button>`
        ).join('');
        // v9.2 — trailing "+ Add set" pill opens the quick-add sheet so the
        // user can log another set of the same exercise without re-typing
        // the name in the search box.
        const exTitle = escapeHtml(titleCase(exercise));
        const addPill =
            `<button type="button" class="session-set-pill session-set-add" data-action="openQuickAdd" data-exercise="${escapeHtml(exercise)}" aria-label="Add another set of ${exTitle}">` +
                `<span class="session-set-add-icon" aria-hidden="true">+</span>` +
                `<span class="session-set-add-label">Add set</span>` +
            `</button>`;
        html += `
            <div class="session-set-group">
                <div class="session-set-group-header">
                    <span class="muscle-tag" style="background:${muscleBg}"></span>
                    <span class="session-set-group-name">${exTitle}</span>
                    <span class="session-set-count">${orderedSets.length} set${orderedSets.length === 1 ? '' : 's'}</span>
                </div>
                <div class="session-set-pills">${setPills}${addPill}</div>
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
        return;
    }

    // Forgotten session — prompt to end at the last set's timestamp,
    // or resume if user is genuinely back. Default to "End at last set"
    // because that's the most likely correct answer.
    _forgottenPromptDidFire = true;   // v8: suppress launch prompt this load
    const lastWhen = new Date(lastSetAt);
    const lastTimeLabel = lastWhen.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endAtLast = confirm(
        `You started a workout earlier and didn't end it. ` +
        `Your last set was at ${lastTimeLabel}.\n\n` +
        `OK = end the workout at that time.\n` +
        `Cancel = resume the workout (still going).`
    );
    if (endAtLast) {
        activeSession = stored;
        await endWorkoutSession({ atTimestamp: lastSetAt, silent: true });
        showSnackbar(`Closed forgotten workout`, { duration: 4000 });
    } else {
        activeSession = stored;
        startSessionTicker();
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
    if (name === 'workout') renderWorkoutScreen();
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
    const all = (await performDB('workouts', 'getAll')).filter(w => !w.deleted);
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
    // Order: heaviest first, then alpha tiebreak.
    tiles.sort((a, b) => (b.maxWeight - a.maxWeight) || a.exercise.localeCompare(b.exercise));
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
        const initials = t.exercise.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const bg = escapeHtml(muscleColor[t.muscle] || '#888');
        const name = escapeHtml(titleCase(t.exercise));
        const subtitle = (prTab === 'weight-reps')
            ? `× ${t.repsAtMax} rep${t.repsAtMax === 1 ? '' : 's'}`
            : '';
        const ariaLabel = `${titleCase(t.exercise)}, ${t.maxWeight} pounds${subtitle ? ` ${subtitle}` : ''}`;
        // Rendered as <button> so keyboard activation (Enter/Space) and
        // screen-reader role both come for free.
        return `
            <button type="button" class="pr-tile" data-exercise="${escapeHtml(t.exercise)}" aria-label="${escapeHtml(ariaLabel)}">
                <div class="pr-tile-icon" style="background:${bg}" aria-hidden="true">${escapeHtml(initials)}</div>
                <div class="pr-tile-name">${name}</div>
                <div class="pr-tile-weight">${escapeHtml(String(t.maxWeight))} lb</div>
                ${subtitle ? `<div class="pr-tile-sub">${escapeHtml(subtitle)}</div>` : ''}
            </button>`;
    }).join('');

    // Wire tap handlers (delegation kept tiny because the grid is small)
    grid.querySelectorAll('.pr-tile').forEach(t => {
        t.addEventListener('click', () => openExercise(t.dataset.exercise));
    });
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

    // Index workout data per-day so we can paint a glanceable volume bar
    // (replacing the v8 dot). Bar height scales to the week's max-volume
    // day; bar color is the dominant muscle worked that day.
    const allWorkouts = (await performDB('workouts', 'getAll')).filter(w => !w.deleted);
    const dayStats = new Map();   // iso → { volume, dominantMuscle }
    for (const w of allWorkouts) {
        const stat = dayStats.get(w.date) || { volume: 0, byMuscle: {} };
        const vol = w.weight * w.reps;
        stat.volume += vol;
        const m = muscleOf(w.exercise);
        stat.byMuscle[m] = (stat.byMuscle[m] || 0) + vol;
        dayStats.set(w.date, stat);
    }
    // Pick the dominant muscle per day for color signal.
    for (const stat of dayStats.values()) {
        let topM = 'arms', topV = -1;
        for (const [m, v] of Object.entries(stat.byMuscle)) {
            if (v > topV) { topV = v; topM = m; }
        }
        stat.dominantMuscle = topM;
    }
    // Compute this week's max volume so the bar heights are relative.
    const weekIsoSet = days.map(d => isoForLocalDate(d));
    const weekVolumes = weekIsoSet.map(iso => dayStats.get(iso)?.volume || 0);
    const maxVol = Math.max(1, ...weekVolumes);

    // Render strip
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    stripEl.innerHTML = days.map((d, i) => {
        const iso = isoForLocalDate(d);
        const stat = dayStats.get(iso);
        const classes = [
            'week-day',
            iso === todayISOStr ? 'today' : '',
            iso === historySelectedDate ? 'active' : '',
        ].filter(Boolean).join(' ');
        let barHtml;
        if (stat && stat.volume > 0) {
            const heightPx = Math.max(4, Math.round((stat.volume / maxVol) * 22));
            const color = muscleColor[stat.dominantMuscle] || 'var(--blue)';
            barHtml = `<span class="week-day-bar" style="height:${heightPx}px;background:${color}"></span>`;
        } else {
            barHtml = `<span class="week-day-bar empty"></span>`;
        }
        return `
            <button class="${classes}" data-date="${iso}">
                <span class="week-day-name">${dayNames[i]}</span>
                <span class="week-day-num">${d.getDate()}</span>
                ${barHtml}
            </button>`;
    }).join('');

    stripEl.querySelectorAll('.week-day').forEach(btn => {
        btn.addEventListener('click', () => {
            historySelectedDate = btn.dataset.date;
            renderHistoryScreen();
        });
    });

    // Render the selected day's detail
    await renderHistoryDayDetail(historySelectedDate, allWorkouts);
}

async function renderHistoryDayDetail(date, allWorkouts) {
    const empty = $('history-day-empty');
    const headers = $('history-session-headers');
    const groups = $('history-day-groups');
    const dayWorkouts = allWorkouts.filter(w => w.date === date);

    if (!dayWorkouts.length) {
        headers.innerHTML = '';
        groups.innerHTML = '';
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
    const allSessions = await performDB('sessions', 'getAll');
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

    // Top-of-detail summary header(s) — keep the existing time/duration
    // metadata bar so users can scan the day at a glance.
    let headerHtml = '';
    for (const key of orderedKeys) {
        if (key === 'untagged') continue;
        const s = sessionMap[key];
        if (!s) continue;
        const setsInSession = sessionBuckets.get(key);
        const startTime = new Date(s.startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const dur = s.durationMs > 0 ? `${Math.round(s.durationMs / 60000)}m` : '—';
        const estimatedFlag = s.estimated ? `<span class="estimated">~estimated</span>` : '';
        headerHtml += `
            <div class="session-header-row">
                <div class="session-header-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="session-header-meta">
                    <span>${escapeHtml(startTime)}</span>
                    <span>${escapeHtml(dur)}</span>
                    <span>${setsInSession.length} sets</span>
                    ${estimatedFlag}
                </div>
            </div>`;
    }
    const untaggedSets = sessionBuckets.get('untagged');
    if (untaggedSets && !sessionMap[orderedKeys[0]]) {
        // Only emit the untagged note if there are no real sessions for the
        // day; otherwise the session header(s) above carry the count.
        headerHtml += `<div class="session-header-row">
            <div class="session-header-icon" style="background:var(--label-tertiary)"><svg viewBox="0 0 24 24" fill="white" width="13" height="13"><circle cx="12" cy="12" r="10"/></svg></div>
            <div class="session-header-meta"><span>${untaggedSets.length} sets · no session timer</span></div>
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

            const pills = exSets.map(s => {
                const isPR = prMap[s.exercise] === s.id;
                return `<button type="button" class="session-set-pill history-pill${isPR ? ' is-pr' : ''}" data-action="openSetAction" data-id="${s.id}" aria-label="Set ${escapeHtml(String(s.weight))} pounds for ${escapeHtml(String(s.reps))} reps. Tap to edit or delete.">${escapeHtml(String(s.weight))}<span class="set-reps"> × ${escapeHtml(String(s.reps))}</span>${isPR ? '<span class="pill-pr-tag">PR</span>' : ''}</button>`;
            }).join('');

            bodyHtml += `
                <div class="session-set-group history-set-group">
                    <button type="button" class="session-set-group-header history-group-header" data-history-exercise="${exName}">
                        <span class="muscle-tag" style="background:${muscleBg}"></span>
                        <span class="session-set-group-name">${exTitle}${hasPR ? '<span class="item-pr-tag">PR</span>' : ''}</span>
                        <span class="session-set-count">${exSets.length} set${exSets.length === 1 ? '' : 's'}</span>
                    </button>
                    <div class="session-set-pills">${pills}</div>
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

    // Ask. Plain confirm() — works on every platform, no extra UI.
    const ok = confirm(
        "Start a workout now?\n\n" +
        "OK — start the session timer\n" +
        "Cancel — keep just logging sets without a session"
    );
    throttlePrompts();   // either way, don't re-ask for 6h
    if (ok) {
        await startWorkoutSession();
        showSnackbar('Workout started', { duration: 2500 });
    }
}

// First-set prompt — call this when a set is logged with no active session.
// Throttled the same way so a single workout doesn't get pestered repeatedly.
async function maybePromptStartOnFirstSet() {
    if (activeSession) return;                  // already in a session
    if (isPromptThrottled()) return;
    const ok = confirm(
        "You just logged a set. Start a workout to track session time?\n\n" +
        "OK — start the timer (this set will be included)\n" +
        "Cancel — just keep logging without a session"
    );
    throttlePrompts();
    if (!ok) return;
    // Backdate the session to just before the set we just logged so the
    // set is captured in the session.
    const sessionStart = Date.now() - 5000;   // 5s ago
    activeSession = {
        id: sessionStart,
        startedAt: sessionStart,
        endedAt: null,
        durationMs: 0,
        modifiedAt: Date.now(),
    };
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
    await performDB('sessions', 'put', activeSession);
    markUnsynced();
    // Tag the most recent set with this session so it's part of the workout.
    const all = (await performDB('workouts', 'getAll'))
        .filter(w => !w.deleted)
        .sort((a, b) => b.id - a.id);
    if (all.length && !all[0].sessionId) {
        all[0].sessionId = activeSession.id;
        all[0].modifiedAt = Date.now();
        await performDB('workouts', 'put', all[0]);
    }
    startSessionTicker();
    await refreshSessionCard();
    updateWorkoutTabUI();
    showSnackbar('Workout started', { duration: 2500 });
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
    if (!userProfile?.email) { alert('Add email first'); return; }
    if (!getToken()) { alert('Add your access key first'); return; }
    if (!confirm("Pull from the cloud and merge with local? Local is kept; remote-only is added; deletes win on either side.")) return;

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
            alert(`No backup found in the cloud for ${userProfile.email}.\n\nIf this was a typo, fix the email in Profile and try again. Your local data is untouched.`);
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
