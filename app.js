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
const formatDate = iso => {
    if (iso === todayISO()) return "Today";
    if (iso === isoForOffset(1)) return "Yesterday";
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};
const haptic = (pattern = 10) => { try { navigator.vibrate?.(pattern); } catch {} };
const setStatus = (text, cls = '') => { const el = $('status'); el.textContent = text; el.className = cls; };
const getToken = () => localStorage.getItem('ironToken') || '';
const epley = (w, r) => w * (1 + r / 30);
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

// ============================================================================
// Boot
// ============================================================================

window.addEventListener('load', () => {
    applyTheme(theme);  // before anything paints
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
    showScreen('home');   // mark Home tab active on first load
});

function applyTheme(next) {
    theme = next;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ironTheme', theme);
    updateThemeColor();
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
        // Listen for updates
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    pendingSWUpdate = newWorker;
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
        }
        if (!e.target.closest('.history-row')) {
            document.querySelectorAll('.history-item.revealed').forEach(el => el.classList.remove('revealed'));
        }
    });
}

function initSegmented() {
    $('rest-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn) return;
        $('rest-segment').querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        restDuration = parseInt(btn.dataset.val, 10);
        localStorage.setItem('ironRest', String(restDuration));
        haptic(8);
    });

    $('theme-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn) return;
        $('theme-segment').querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyTheme(btn.dataset.val);
        haptic(8);
    });

    // Item 10: Workout mode (continuous voice)
    $('workout-mode-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn) return;
        $('workout-mode-segment').querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setWorkoutMode(btn.dataset.val === 'on');
        haptic(8);
    });

    // Item 13: Custom-exercise muscle picker
    $('custom-muscle-segment')?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-val]');
        if (!btn || !editingCustomExercise) return;
        $('custom-muscle-segment').querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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
            renderChart();
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

function showExercises() { filterExercises(); $('ex-dropdown').classList.add('active'); }

function filterExercises() {
    const input = $('ex-search').value.toLowerCase();
    const dropdown = $('ex-dropdown');
    dropdown.innerHTML = "";

    let pool = exerciseLibrary;
    if (activeTemplate) {
        const names = activeTemplate.exercises.map(e => e.name);
        pool = pool.filter(ex => names.includes(ex.name));
    }
    const matches = pool.filter(ex =>
        !input || ex.name.includes(input) || ex.synonyms.some(s => s.includes(input))
    ).sort((a, b) => a.name.localeCompare(b.name));

    if (!matches.length) {
        const div = document.createElement('div');
        div.style.color = 'var(--label-tertiary)';
        div.textContent = activeTemplate ? `No matches in "${activeTemplate.name}"` : 'No matches';
        dropdown.appendChild(div);
        return;
    }

    matches.forEach(ex => {
        const div = document.createElement('div');
        div.innerHTML = `<span class="muscle-tag" style="background:${muscleColor[ex.muscle]}"></span>${titleCase(ex.name)}`;
        div.onclick = () => selectExercise(ex.name);
        dropdown.appendChild(div);
    });
}

function selectExercise(name) {
    selectedExercise = name;
    $('ex-search').value = titleCase(name);
    $('ex-dropdown').classList.remove('active');

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
        await updateUI(entry, isNewPR);
        await renderHistory();
        await renderChart();
        await renderMuscleDistribution();
        await renderStrain();
        await renderInsights();
        await renderTemplateProgress();
        // v6: keep the live session card in sync if a session is active.
        await refreshSessionCard();
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
    $('mic-btn').classList.remove('listening');
    setStatus(statusText);
}

function initSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        $('mic-btn').style.opacity = '0.4';
        $('mic-btn').onclick = () => setStatus('Voice not supported', 'error');
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
        $('mic-btn').classList.add('listening');
        setStatus(workoutMode ? 'Workout mode on' : 'Listening', 'listening');
        haptic(20);
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
    await renderChart();
    await renderMuscleDistribution();
    await renderStrain();
    await renderInsights();
    await refreshLatestStats();
    await refreshLatestPRCard();   // v6
    await refreshSessionCard();    // v6
    await renderTemplateChips();
    await renderTemplateProgress();
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
    $('last-lift').textContent = `${entry.weight} × ${entry.reps}`;

    // v6: "Latest PR" card now shows the most recently achieved PR across
    // all exercises, not just the current exercise's. This gives the home
    // screen a sense of recency and pairs better with the new PRs tab.
    await refreshLatestPRCard();

    if (isNewPR) {
        const card = $('pr-card');
        card.classList.remove('pr-flash');
        void card.offsetWidth;
        card.classList.add('pr-flash');
        setStatus('New PR!', 'synced');
        speak("New personal record!");
        haptic([30, 50, 30, 50, 60]);
    }
}

async function refreshLatestPRCard() {
    const display = $('pr-display');
    const card = $('pr-card');
    if (!display) return;
    const prs = await performDB('prs', 'getAll');
    if (!prs.length) {
        display.textContent = '—';
        return;
    }
    // Most recently achieved PR.
    const latest = prs.sort((a, b) => (b.achievedAt ?? 0) - (a.achievedAt ?? 0))[0];
    const exTitle = titleCase(latest.exercise);
    const wt = Math.round(latest.maxWeight);
    display.innerHTML = `
        <div style="font-size:1.05rem;font-weight:700;letter-spacing:-0.02em">${escapeHtml(String(wt))} <span style="font-size:0.7rem;color:var(--label-tertiary)">LB</span></div>
        <div style="font-size:0.72rem;color:var(--label-secondary);margin-top:2px;line-height:1.15">${escapeHtml(exTitle)}</div>
    `;
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
        await renderChart();
        await renderMuscleDistribution();
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
// Volume chart with mode toggle
// ============================================================================

async function renderChart() {
    const container = $('volume-chart');
    container.innerHTML = "";
    const workouts = await getActiveWorkouts();

    const days = [];
    for (let i = 13; i >= 0; i--) {
        const iso = isoForOffset(i);
        const todayEntries = workouts.filter(w => w.date === iso);
        const value = chartMode === 'sets'
            ? todayEntries.length
            : todayEntries.reduce((sum, w) => sum + (w.weight * w.reps), 0);
        days.push({ iso, value });
    }

    const max = Math.max(1, ...days.map(d => d.value));
    const today = todayISO();
    const totalLast7 = days.slice(-7).reduce((s, d) => s + d.value, 0);

    days.forEach(d => {
        const bar = document.createElement('div');
        bar.className = 'vbar';
        if (d.value > 0) bar.classList.add('active');
        if (d.iso === today) bar.classList.add('today');
        bar.style.height = `${Math.max(3, (d.value / max) * 100)}%`;
        const labelVal = chartMode === 'sets' ? `${d.value} set${d.value === 1 ? '' : 's'}` : `${Math.round(d.value).toLocaleString()} lbs`;
        bar.title = `${formatDate(d.iso)}: ${labelVal}`;
        container.appendChild(bar);
    });

    if (totalLast7 > 0) {
        $('chart-total').textContent = chartMode === 'sets'
            ? `${totalLast7} sets · 7d`
            : `${Math.round(totalLast7).toLocaleString()} lb · 7d`;
    } else {
        $('chart-total').textContent = '—';
    }
}

// ============================================================================
// Muscle distribution (last 7 days)
// ============================================================================

async function renderMuscleDistribution() {
    const bar = $('muscle-bar');
    const legend = $('muscle-legend');
    bar.innerHTML = "";
    legend.innerHTML = "";

    const workouts = await getActiveWorkouts();
    const cutoff = isoForOffset(7);
    const recent = workouts.filter(w => w.date >= cutoff);
    const totals = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
    recent.forEach(w => {
        const m = muscleOf(w.exercise);
        totals[m] += w.weight * w.reps;
    });
    const grand = Object.values(totals).reduce((a, b) => a + b, 0);

    if (!grand) {
        bar.innerHTML = `<div style="flex:1;background:var(--surface-3)"></div>`;
        legend.innerHTML = `<span class="leg-item" style="color:var(--label-tertiary)">No volume in last 7 days</span>`;
        return;
    }

    const order = MUSCLES;
    order.forEach(m => {
        const seg = document.createElement('div');
        const pct = (totals[m] / grand) * 100;
        seg.style.flex = String(totals[m] || 0.001);
        seg.style.background = muscleColor[m];
        seg.title = `${m}: ${pct.toFixed(0)}%`;
        bar.appendChild(seg);

        if (totals[m] > 0) {
            const item = document.createElement('span');
            item.className = 'leg-item';
            item.innerHTML = `<span class="leg-dot" style="background:${muscleColor[m]}"></span>${titleCase(m)} ${pct.toFixed(0)}%`;
            legend.appendChild(item);
        }
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
    const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
    const dsl = dayDiff(lastDate, todayISO());

    // Sessions in last 7
    const dates7 = new Set(w.filter(x => x.date >= isoForOffset(6)).map(x => x.date));

    let label, subtext, cls;
    if (dsl >= 4 && dates7.size === 0) {
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

function attachSwipe(item) {
    let startX = 0, dx = 0, pointerId = null, isOpen = false;
    item.addEventListener('pointerdown', e => {
        if (e.target.closest('.row-delete')) return;
        pointerId = e.pointerId;
        startX = e.clientX;
        isOpen = item.classList.contains('revealed');
        item.classList.add('swiping');
    });
    item.addEventListener('pointermove', e => {
        if (e.pointerId !== pointerId) return;
        dx = e.clientX - startX;
        if (isOpen) dx -= 78;
        const offset = Math.min(0, Math.max(-160, dx));
        item.style.transform = `translateX(${offset}px)`;
    });
    const finish = e => {
        if (e.pointerId !== pointerId) return;
        item.classList.remove('swiping');
        item.style.transform = '';
        const total = isOpen ? dx - 78 : dx;
        if (total < -120) {
            const id = parseInt(item.closest('.history-row').dataset.id, 10);
            deleteEntry(id);
        } else if (total < -40) {
            item.classList.add('revealed');
        } else {
            item.classList.remove('revealed');
        }
        pointerId = null; dx = 0;
    };
    item.addEventListener('pointerup', finish);
    item.addEventListener('pointercancel', finish);
}

async function deleteEntry(id, silent = false) {
    try {
        const entry = await performDB('workouts', 'get', id);
        if (!entry) return;
        entry.deleted = true;
        entry.modifiedAt = Date.now();
        await performDB('workouts', 'put', entry);
        await recomputePR(entry.exercise);
        await renderHistory();
        await renderChart();
        await renderMuscleDistribution();
        await renderStrain();
        await renderInsights();
        await refreshLatestStats();
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

function dismissTimer() {
    if (restTimerHandle) { clearInterval(restTimerHandle); restTimerHandle = null; }
    if (restCompleteTimeout) { clearTimeout(restCompleteTimeout); restCompleteTimeout = null; }
    $('rest-timer').classList.remove('active');
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
// Settings sheet
// ============================================================================

function openSettings() {
    $('settings-first').value = userProfile?.first || '';
    $('settings-email').value = userProfile?.email || '';
    $('settings-token').value = getToken();
    $('rest-segment').querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.val, 10) === restDuration);
    });
    $('theme-segment').querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b.dataset.val === theme);
    });
    $('workout-mode-segment')?.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b.dataset.val === (workoutMode ? 'on' : 'off'));
    });
    populateVoicePicker();
    if ($('voice-rate')) {
        $('voice-rate').value = voiceRate;
        $('voice-rate-label').textContent = `${voiceRate.toFixed(2)}×`;
    }
    $('ping-state').textContent = '—';
    $('ping-state').className = 'row-trailing';
    renderTemplatesList();
    renderCustomsList();
    renderSyncMeta();
    $('settings-overlay').classList.add('active');
}

function closeSettings() {
    const first = $('settings-first').value.trim();
    const email = $('settings-email').value.trim();
    if (userProfile) {
        userProfile.first = first || userProfile.first;
        userProfile.email = email;
        localStorage.setItem('ironUser', JSON.stringify(userProfile));
        $('user-display').textContent = `Hi, ${userProfile.first}`;
    }
    const token = $('settings-token').value.trim();
    if (token) localStorage.setItem('ironToken', token);
    else localStorage.removeItem('ironToken');
    $('settings-overlay').classList.remove('active');
}

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
    if (!confirm("Sign out? Local lift history stays on this device.")) return;
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
    $('custom-muscle-segment').querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b.dataset.val === 'arms');
    });
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
    $('custom-muscle-segment').querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b.dataset.val === c.muscle);
    });
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
    drawPRCanvas(currentExerciseSheet.exercise);
    $('share-overlay').classList.add('active');
}

function closeShare() { $('share-overlay').classList.remove('active'); }

async function drawPRCanvas(exerciseName) {
    const c = $('pr-canvas');
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
    startSessionTicker();
    await refreshSessionCard();
    updateWorkoutTabUI();
    haptic([15, 40, 15]);
    return activeSession;
}

async function endWorkoutSession({ atTimestamp = Date.now(), silent = false } = {}) {
    if (!activeSession) return null;
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
        if (!silent) showSnackbar('Empty workout discarded', { duration: 3000 });
        return null;
    }

    await performDB('sessions', 'put', session);
    activeSession = null;
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    stopSessionTicker();
    await refreshSessionCard();
    updateWorkoutTabUI();
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

// --- live ticker for the session card ---

function startSessionTicker() {
    stopSessionTicker();
    _sessionTickerTimer = setInterval(() => {
        if (!activeSession) { stopSessionTicker(); return; }
        renderSessionCardTime();
        updateWorkoutTabUI();
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
    if (!card) return;
    if (!activeSession) {
        card.style.display = 'none';
        return;
    }
    card.style.display = '';
    renderSessionCardTime();
    const setsInSession = (await performDB('workouts', 'getAll'))
        .filter(w => w.sessionId === activeSession.id && !w.deleted);
    const totalVol = setsInSession.reduce((s, w) => s + w.weight * w.reps, 0);
    $('session-card-sets').textContent = String(setsInSession.length);
    $('session-card-vol').textContent = totalVol >= 1000
        ? `${(totalVol / 1000).toFixed(1)}k`
        : String(Math.round(totalVol));
}

function updateWorkoutTabUI() {
    const btn = $('tab-workout');
    const icon = $('tab-workout-icon');
    const label = $('tab-workout-label');
    if (!btn) return;
    if (activeSession) {
        btn.classList.add('session-active');
        // Stop icon
        icon.innerHTML = '<rect x="6" y="6" width="12" height="12" rx="1.5"/>';
        label.textContent = 'End · ' + formatElapsed(Date.now() - activeSession.startedAt);
    } else {
        btn.classList.remove('session-active');
        // Play icon
        icon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"/>';
        label.textContent = 'Start';
    }
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
// Screen router  (v6)
//
// Three top-level screens (home / prs / history) plus the Profile button
// which opens the existing Settings modal rather than a full screen.
// ============================================================================

let currentScreen = 'home';

function showScreen(name) {
    if (name === 'profile') {
        // Profile is the existing Settings sheet, not a screen.
        openSettings();
        return;
    }
    if (!['home', 'prs', 'history'].includes(name)) name = 'home';
    currentScreen = name;
    document.querySelectorAll('main > .screen').forEach(s => {
        s.hidden = s.dataset.screen !== name;
    });
    document.querySelectorAll('.tab-btn[data-screen-target]').forEach(b => {
        b.classList.toggle('active', b.dataset.screenTarget === name);
    });
    // Lazy-render the screen we just landed on so it's always fresh.
    if (name === 'prs') renderPRsScreen();
    if (name === 'history') renderHistoryScreen();
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
        return `
            <div class="pr-tile" data-exercise="${escapeHtml(t.exercise)}">
                <div class="pr-tile-icon" style="background:${bg}">${escapeHtml(initials)}</div>
                <div class="pr-tile-name">${name}</div>
                <div class="pr-tile-weight">${escapeHtml(String(t.maxWeight))} lb</div>
                ${subtitle ? `<div class="pr-tile-sub">${escapeHtml(subtitle)}</div>` : ''}
            </div>`;
    }).join('');

    // Wire tap handlers (delegation kept tiny because the grid is small)
    grid.querySelectorAll('.pr-tile').forEach(t => {
        t.addEventListener('click', () => openExercise(t.dataset.exercise));
    });
}

function setPRTab(tab) {
    if (tab !== 'weight' && tab !== 'weight-reps') return;
    prTab = tab;
    document.querySelectorAll('#pr-tab-segment button').forEach(b => {
        b.classList.toggle('active', b.dataset.val === tab);
    });
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

    // Index workout dates so we can mark days that have data.
    const allWorkouts = (await performDB('workouts', 'getAll')).filter(w => !w.deleted);
    const datesWithSets = new Set(allWorkouts.map(w => w.date));

    // Render strip
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    stripEl.innerHTML = days.map((d, i) => {
        const iso = isoForLocalDate(d);
        const has = datesWithSets.has(iso);
        const classes = [
            'week-day',
            iso === todayISOStr ? 'today' : '',
            iso === historySelectedDate ? 'active' : '',
        ].filter(Boolean).join(' ');
        return `
            <button class="${classes}" data-date="${iso}">
                <span class="week-day-name">${dayNames[i]}</span>
                <span class="week-day-num">${d.getDate()}</span>
                <span class="week-day-dot ${has ? '' : 'empty'}"></span>
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
    const dayWorkouts = allWorkouts
        .filter(w => w.date === date)
        .sort((a, b) => b.id - a.id);

    if (!dayWorkouts.length) {
        headers.innerHTML = '';
        groups.innerHTML = '';
        empty.style.display = '';
        empty.textContent = 'No sets on this day.';
        return;
    }
    empty.style.display = 'none';

    // Build session header(s) for the day.
    const allSessions = await performDB('sessions', 'getAll');
    const sessionMap = Object.fromEntries(allSessions.map(s => [s.id, s]));
    const sessionIdsSeen = new Set();
    for (const w of dayWorkouts) if (w.sessionId) sessionIdsSeen.add(w.sessionId);

    let headerHtml = '';
    const sortedSessions = [...sessionIdsSeen]
        .map(id => sessionMap[id])
        .filter(Boolean)
        .sort((a, b) => a.startedAt - b.startedAt);

    for (const s of sortedSessions) {
        const setsInSession = dayWorkouts.filter(w => w.sessionId === s.id);
        const setCount = setsInSession.length;
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
                    <span>${setCount} sets</span>
                    ${estimatedFlag}
                </div>
            </div>`;
    }
    // Untagged sets get a tiny note so they're explained.
    const untaggedCount = dayWorkouts.filter(w => !w.sessionId).length;
    if (untaggedCount && sortedSessions.length === 0) {
        headerHtml = `<div class="session-header-row">
            <div class="session-header-icon" style="background:var(--label-tertiary)"><svg viewBox="0 0 24 24" fill="white" width="13" height="13"><circle cx="12" cy="12" r="10"/></svg></div>
            <div class="session-header-meta"><span>${untaggedCount} sets · no session timer</span></div>
        </div>`;
    }
    headers.innerHTML = headerHtml;

    // Render the actual sets — same row markup as the journal had, so
    // swipe-to-delete and the click delegation already wired up will work.
    const prs = await performDB('prs', 'getAll');
    const prMap = Object.fromEntries(prs.map(p => [p.exercise, p.achievedAt]));

    const itemsHtml = dayWorkouts.map(set => {
        const isPRSet = prMap[set.exercise] === set.id;
        const m = muscleOf(set.exercise);
        const exName = escapeHtml(set.exercise);
        const exTitle = escapeHtml(titleCase(set.exercise));
        const muscleBg = escapeHtml(muscleColor[m] || '#888');
        return `
            <div class="history-row" data-id="${set.id}" data-exercise="${exName}">
                <button class="row-delete" type="button">Delete</button>
                <div class="history-item">
                    <span class="item-name tappable"><span class="muscle-tag" style="background:${muscleBg}"></span>${exTitle}${isPRSet ? '<span class="item-pr-tag">PR</span>' : ''}</span>
                    <span class="item-data">${escapeHtml(String(set.weight))}<span class="reps"> × ${escapeHtml(String(set.reps))}</span></span>
                </div>
            </div>`;
    }).join('');

    groups.innerHTML = `<div class="day-group"><div class="items">${itemsHtml}</div></div>`;
    groups.querySelectorAll('.history-item').forEach(attachSwipe);

    // Ensure the click-delegation listener is wired for this container too.
    initJournalDelegationFor(groups);
}

// Delegation for any history container — the existing initJournalDelegation
// hardcoded #history-groups; this generic version takes any element.
function initJournalDelegationFor(container) {
    if (!container || container.dataset.delegated === '1') return;
    container.dataset.delegated = '1';
    container.addEventListener('click', e => {
        const row = e.target.closest('.history-row');
        if (!row) return;
        if (e.target.closest('.row-delete')) {
            const id = parseInt(row.dataset.id, 10);
            if (Number.isFinite(id)) deleteEntry(id);
            return;
        }
        if (e.target.closest('.item-name.tappable')) {
            const ex = row.dataset.exercise;
            if (ex) openExercise(ex);
        }
    });
}



// Items 7 + 9: incremental sync + restore-typo detection.
//
// Sync sends only entries with modifiedAt > serverSyncedAt when we have a
// baseline; otherwise sends a full payload. customExercises ride along.
// The server is authoritative for PRs after each merge — we replace local
// PRs with whatever it returns. serverSyncedAt persists across reloads.
async function syncToNAS() {
    if (!userProfile?.email) { setStatus('Add email in settings', 'error'); return; }
    if (!getToken()) { setStatus('Add token in settings', 'error'); return; }

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
    if (!getToken()) { alert('Add API token first'); return; }
    if (!confirm("Pull from NAS and merge with local? Local is kept; remote-only is added; deletes win on either side.")) return;

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
            alert(`No backup found on the NAS for ${userProfile.email}.\n\nIf this was a typo, fix the email in Settings and try again. Your local data is untouched.`);
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
