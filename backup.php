<?php
// ============================================================================
// IronVoice Pro — backup endpoint  (v5)
//
// Actions: backup (full or delta), restore, ping
//
// Environment variables:
//   IRONVOICE_TOKEN        Required. The bearer token clients must send.
//   IRONVOICE_SALT         Required. Per-user directory hashing salt.
//   IRONVOICE_BACKUP_DIR   Optional. Where to store JSON files. Recommended:
//                          a path OUTSIDE the webroot (e.g. /var/lib/ironvoice).
//                          Defaults to __DIR__ . '/backups' for backward compat.
//   IRONVOICE_ALLOW_HTTP   Optional. Set to "1" to permit plaintext HTTP — only
//                          useful for LAN-only test rigs. HTTPS is required by
//                          default.
//   IRONVOICE_TOMBSTONE_DAYS  Optional. Days to retain deleted entries before
//                          garbage collection. Default 90.
// ============================================================================

declare(strict_types=1);

$SHARED_TOKEN    = getenv('IRONVOICE_TOKEN') ?: 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
$SALT            = getenv('IRONVOICE_SALT')  ?: 'CHANGE_ME_TOO';
$BACKUP_ROOT     = getenv('IRONVOICE_BACKUP_DIR') ?: (__DIR__ . '/backups');
$ALLOW_HTTP      = getenv('IRONVOICE_ALLOW_HTTP') === '1';
$TOMBSTONE_DAYS  = (int)(getenv('IRONVOICE_TOMBSTONE_DAYS') ?: 90);
$MAX_BYTES       = 4 * 1024 * 1024;

function fail(int $code, string $msg): void {
    http_response_code($code);
    header('Content-Type: application/json');
    header('X-Content-Type-Options: nosniff');
    echo json_encode(['error' => $msg]);
    exit;
}

function ok(array $payload): void {
    http_response_code(200);
    header('Content-Type: application/json');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload);
    exit;
}

// ---- HTTPS guard (item 1) ----
$is_https = (
    !empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off'
) || (
    isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https'
);
if (!$is_https && !$ALLOW_HTTP) fail(400, 'HTTPS required');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Method not allowed');

$len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($len <= 0 || $len > $MAX_BYTES) fail(413, 'Payload too large or empty');

// ---- Auth ----
$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!preg_match('/^Bearer\s+(.+)$/', $auth, $m) || !hash_equals($SHARED_TOKEN, $m[1])) {
    fail(401, 'Unauthorized');
}

$raw = file_get_contents('php://input', false, null, 0, $MAX_BYTES + 1);
if ($raw === false || strlen($raw) > $MAX_BYTES) fail(413, 'Payload too large');

$data = json_decode($raw, true);
if (!is_array($data)) fail(400, 'Invalid JSON');

$action = $data['action'] ?? 'backup';
if (!in_array($action, ['backup', 'restore', 'ping'], true)) fail(400, 'Invalid action');

// PING — token sanity check, no data needed.
if ($action === 'ping') ok(['ok' => true, 'serverTime' => time()]);

$email = $data['user']['email'] ?? null;
if (!is_string($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, 'Invalid email');

$slug = hash('sha256', $SALT . strtolower(trim($email)));
$dir  = $BACKUP_ROOT . '/' . $slug;
$file = $dir . '/history.json';

if (!is_dir($BACKUP_ROOT) && !mkdir($BACKUP_ROOT, 0750, true)) fail(500, 'Storage init failed');

// ============================================================================
// Helpers
// ============================================================================

function recompute_prs(array $workouts): array {
    $best = [];
    foreach ($workouts as $w) {
        if (!empty($w['deleted'])) continue;
        $ex = $w['exercise'] ?? null;
        if (!is_string($ex)) continue;
        $oneRM = (float)($w['oneRM'] ?? 0);
        if ($oneRM <= 0) continue;
        if (!isset($best[$ex]) || $oneRM > $best[$ex]['max1RM']) {
            $best[$ex] = [
                'exercise'   => $ex,
                'maxWeight'  => (float)($w['weight'] ?? 0),
                'max1RM'     => $oneRM,
                'achievedAt' => (int)($w['id'] ?? 0),
            ];
        }
    }
    return array_values($best);
}

function gc_tombstones(array $rows, int $days): array {
    if ($days <= 0) return $rows;
    $cutoff = (time() - $days * 86400) * 1000;  // entries store ms epochs
    return array_values(array_filter($rows, function ($r) use ($cutoff) {
        if (empty($r['deleted'])) return true;
        $modAt = (int)($r['modifiedAt'] ?? $r['id'] ?? 0);
        return $modAt >= $cutoff;
    }));
}

function load_state(string $file): array {
    if (!is_file($file)) {
        return ['data' => [], 'prs' => [], 'templates' => [], 'customExercises' => [], 'sessions' => [], 'syncedAt' => 0];
    }
    $raw = (string)file_get_contents($file);
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return ['data' => [], 'prs' => [], 'templates' => [], 'customExercises' => [], 'sessions' => [], 'syncedAt' => 0];
    return [
        'data'             => $decoded['data']             ?? [],
        'prs'              => $decoded['prs']              ?? [],
        'templates'        => $decoded['templates']        ?? [],
        'customExercises'  => $decoded['customExercises']  ?? [],
        'sessions'         => $decoded['sessions']         ?? [],
        'syncedAt'         => $decoded['syncedAt']         ?? 0,
    ];
}

function write_state(string $dir, string $file, array $state): void {
    if (!is_dir($dir) && !mkdir($dir, 0750, true)) fail(500, 'User dir init failed');
    $tmp = $file . '.tmp';
    $fp = fopen($tmp, 'w');
    if (!$fp) fail(500, 'Write failed');
    if (!flock($fp, LOCK_EX)) { fclose($fp); fail(500, 'Lock failed'); }
    fwrite($fp, json_encode($state, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    if (!rename($tmp, $file)) fail(500, 'Commit failed');
}

function merge_records(array $existing, array $incoming, string $key = 'id'): array {
    $byKey = [];
    foreach ($existing as $r) {
        if (!isset($r[$key])) continue;
        $byKey[$r[$key]] = $r;
    }
    foreach ($incoming as $r) {
        if (!isset($r[$key])) continue;
        $cur = $byKey[$r[$key]] ?? null;
        if (!$cur) { $byKey[$r[$key]] = $r; continue; }
        $rMod = (int)($r['modifiedAt'] ?? 0);
        $cMod = (int)($cur['modifiedAt'] ?? 0);
        if ($rMod > $cMod) $byKey[$r[$key]] = $r;
        elseif ($rMod === $cMod && !empty($r['deleted'])) $byKey[$r[$key]] = $r;
    }
    return array_values($byKey);
}

// Item 12: tiered snapshot retention.
function prune_snapshots(string $dir): void {
    $snaps = glob($dir . '/history-*.json') ?: [];
    if (count($snaps) <= 7) return;

    $now = time();
    $byDay = []; $byWeek = []; $byMonth = [];

    foreach ($snaps as $f) {
        if (!preg_match('/history-(\d{8})-(\d{6})\.json$/', basename($f), $m)) continue;
        $ts = strtotime(
            substr($m[1], 0, 4) . '-' . substr($m[1], 4, 2) . '-' . substr($m[1], 6, 2)
            . 'T' . substr($m[2], 0, 2) . ':' . substr($m[2], 2, 2) . ':' . substr($m[2], 4, 2)
        );
        if (!$ts) continue;
        $age = $now - $ts;

        if ($age < 7 * 86400) {
            $k = date('Y-m-d', $ts);
            if (!isset($byDay[$k]) || $f > $byDay[$k]) $byDay[$k] = $f;
        } elseif ($age < 30 * 86400) {
            $k = date('o-W', $ts);
            if (!isset($byWeek[$k]) || $f > $byWeek[$k]) $byWeek[$k] = $f;
        } elseif ($age < 365 * 86400) {
            $k = date('Y-m', $ts);
            if (!isset($byMonth[$k]) || $f > $byMonth[$k]) $byMonth[$k] = $f;
        }
        // > 1 year: drop entirely (will be unlinked since not in any bucket)
    }

    $keep = array_flip(array_merge(array_values($byDay), array_values($byWeek), array_values($byMonth)));
    foreach ($snaps as $f) {
        if (!isset($keep[$f])) @unlink($f);
    }
}

// ============================================================================
// RESTORE  (item 9: 404 if no backup exists for this email)
// ============================================================================
if ($action === 'restore') {
    if (!is_file($file)) fail(404, 'No backup found for this email');
    $state = load_state($file);
    ok([
        'data'             => $state['data'],
        'prs'              => $state['prs'],
        'templates'        => $state['templates'],
        'customExercises'  => $state['customExercises'],
        'sessions'         => $state['sessions'],
        'syncedAt'         => $state['syncedAt'],
    ]);
}

// ============================================================================
// BACKUP  (full or delta — item 7)
// ============================================================================
if (!isset($data['data']) || !is_array($data['data'])) fail(400, 'Missing data array');
if (count($data['data']) > 100000) fail(413, 'Too many entries');

$mode      = ($data['mode'] ?? 'full') === 'delta' ? 'delta' : 'full';
$incoming  = $data['data'];
$inTpls    = $data['templates']        ?? [];
$inCustoms = $data['customExercises']  ?? [];
$inSessions = $data['sessions']        ?? [];

$state = load_state($file);

if ($mode === 'delta') {
    $state['data']             = merge_records($state['data'],             $incoming,   'id');
    $state['templates']        = merge_records($state['templates'],        $inTpls,     'id');
    $state['customExercises']  = merge_records($state['customExercises'],  $inCustoms,  'name');
    $state['sessions']         = merge_records($state['sessions'],         $inSessions, 'id');
} else {
    $state['data']             = $incoming;
    $state['templates']        = $inTpls;
    $state['customExercises']  = $inCustoms;
    $state['sessions']         = $inSessions;
}

// Item 8: garbage collect old tombstones.
$state['data']             = gc_tombstones($state['data'],             $TOMBSTONE_DAYS);
$state['templates']        = gc_tombstones($state['templates'],        $TOMBSTONE_DAYS);
$state['customExercises']  = gc_tombstones($state['customExercises'],  $TOMBSTONE_DAYS);
$state['sessions']         = gc_tombstones($state['sessions'],         $TOMBSTONE_DAYS);

// Server is authoritative for PRs after a merge.
$state['prs']      = recompute_prs($state['data']);
$state['syncedAt'] = time() * 1000;

write_state($dir, $file, $state);

@copy($file, $dir . '/history-' . gmdate('Ymd-His') . '.json');
prune_snapshots($dir);

ok([
    'ok'         => true,
    'mode'       => $mode,
    'syncedAt'   => $state['syncedAt'],
    'totalCount' => count($state['data']),
    'received'   => count($incoming),
    'prs'        => $state['prs'],
]);
