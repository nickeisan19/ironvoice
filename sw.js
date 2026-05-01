// ============================================================================
// IronVoice Pro — Service Worker
// - Cache-first for app shell
// - Network-only for backup.php
// - Background Sync API for retry-on-reconnect (where supported)
// - Update prompt: holds new SW until page asks to skipWaiting
// ============================================================================

const CACHE_VERSION = 'ironvoice-v6';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(SHELL)));
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
    if (url.pathname.endsWith('backup.php')) { e.respondWith(fetch(e.request)); return; }
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            const network = fetch(e.request).then(res => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
                }
                return res;
            }).catch(() => cached);
            return cached || network;
        })
    );
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

        const res = await fetch('backup.php', {
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
