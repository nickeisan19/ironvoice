// ============================================================================
// IronVoice Pro — Service Worker
// - Cache-first for app shell
// - Network-only for the Worker API (different origin)
// - Background Sync API for retry-on-reconnect (where supported)
// - Update prompt: holds new SW until page asks to skipWaiting
// ============================================================================

// The Worker API origin. Any cross-origin POST goes through unmodified —
// the SW never caches it. Update this here AND in app.js (API_URL) AND in
// index.html's CSP if you migrate to a custom domain.
const API_ORIGIN = 'https://ironvoice-api.nickeisan19.workers.dev';

// Version is the single source of truth in version.js. Importing it here
// means a bump in version.js auto-invalidates the cache without a separate
// edit to this file. See version.js for the bumping rules.
importScripts('./version.js');
const CACHE_VERSION = `ironvoice-v${self.APP_VERSION}`;
// Pre-cached at install. Anything outside this list is served from network
// only and never written to cache (bounded growth — old icons / dev
// artifacts can't accumulate over months of use).
const SHELL = [
    './',
    'index.html',
    'style.css',
    'app.js',
    'version.js',
    'manifest.json',
    'favicon.png',
    'icon-180.png',
    'icon-192.png',
    'icon-512.png',
    'icon-512-maskable.png',
    'splash-750x1334.png',
    'splash-1170x2532.png',
    'splash-1290x2796.png',
    'splash-1668x2388.png',
];

// Normalize a same-origin URL pathname to its SHELL key form.
// e.g. "/foo/bar/style.css" → "style.css"; "/" stays "./".
function isShellPath(pathname) {
    if (pathname === '/' || pathname === '') return true;
    const tail = pathname.replace(/^.*\//, '');
    return SHELL.includes(tail);
}

self.addEventListener('install', e => {
    // addAll() is atomic: if any one fetch fails install fails. Use add()
    // per-entry with a swallow so a missing splash variant on a fresh
    // checkout doesn't take down the whole install.
    e.waitUntil(
        caches.open(CACHE_VERSION).then(cache =>
            Promise.all(SHELL.map(p => cache.add(p).catch(() => {})))
        )
    );
    // NOTE: no skipWaiting() — page decides when to swap.
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    // API calls bypass cache entirely — always hit the Worker.
    if (url.origin === API_ORIGIN) { e.respondWith(fetch(e.request)); return; }
    // Cross-origin or non-GET: let the browser handle natively.
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;

    e.respondWith((async () => {
        const cache = await caches.open(CACHE_VERSION);
        const cached = await cache.match(e.request);
        if (cached) {
            // Stale-while-revalidate, but only refresh entries we already track.
            fetch(e.request).then(res => {
                if (res.ok) cache.put(e.request, res.clone()).catch(() => {});
            }).catch(() => {});
            return cached;
        }
        // Cache miss. Fetch live; only persist responses for known shell
        // paths so transient assets (one-off images, dev artifacts) don't
        // accumulate in cache storage over time.
        try {
            const res = await fetch(e.request);
            if (res.ok && isShellPath(url.pathname)) {
                cache.put(e.request, res.clone()).catch(() => {});
            }
            return res;
        } catch (_) {
            return cached || Response.error();
        }
    })());
});

// ---- Page → SW message handler (update activation) ----
self.addEventListener('message', e => {
    if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

// ---- Background Sync (Phase 1.4) ----
// Page registers tag 'ironvoice-sync' on failed sync.
// On reconnect, this fires — we read the queued payload from IDB and POST.
self.addEventListener('sync', e => {
    if (e.tag === 'ironvoice-sync') e.waitUntil(replayQueuedSync());
});

async function replayQueuedSync() {
    try {
        const dbReq = indexedDB.open('IronVoiceDB', 6);
        const db = await new Promise((res, rej) => {
            dbReq.onsuccess = () => res(dbReq.result);
            dbReq.onerror = () => rej(dbReq.error);
        });
        if (!db.objectStoreNames.contains('syncQueue')) { db.close(); return; }

        const tx = db.transaction(['syncQueue'], 'readonly');
        const req = tx.objectStore('syncQueue').get('pending');
        const queued = await new Promise(res => { req.onsuccess = () => res(req.result); req.onerror = () => res(null); });
        db.close();
        if (!queued) return;

        const res = await fetch(API_ORIGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${queued.token}` },
            body: queued.body
        });
        if (!res.ok) throw new Error('Sync replay failed');

        // Clear the queue
        const db2 = await new Promise(r => {
            const req = indexedDB.open('IronVoiceDB', 6);
            req.onsuccess = () => r(req.result);
        });
        const tx2 = db2.transaction(['syncQueue'], 'readwrite');
        tx2.objectStore('syncQueue').delete('pending');
        db2.close();

        // Notify any open tabs
        const clients = await self.clients.matchAll();
        clients.forEach(c => c.postMessage({ type: 'SYNC_REPLAYED' }));
    } catch (err) {
        console.warn('Background sync replay error', err);
        throw err; // tells the platform to retry later
    }
}
