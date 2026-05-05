// ============================================================================
// Unit tests for the pure data-handling functions in worker.js.
//
// These three functions touch user-data merge / GC / PR semantics. A silent
// regression here corrupts history, so they get the most coverage. Run with
// `npm test`.
// ============================================================================

import { describe, it, expect } from 'vitest';
import { mergeRecords, gcTombstones, recomputePRs } from './worker.js';

describe('mergeRecords', () => {
    it('keeps incoming when existing is empty', () => {
        const out = mergeRecords([], [{ id: 1, modifiedAt: 100 }], 'id');
        expect(out).toEqual([{ id: 1, modifiedAt: 100 }]);
    });

    it('keeps existing when incoming is empty', () => {
        const out = mergeRecords([{ id: 1, modifiedAt: 100 }], [], 'id');
        expect(out).toEqual([{ id: 1, modifiedAt: 100 }]);
    });

    it('newer modifiedAt wins', () => {
        const existing = [{ id: 1, weight: 100, modifiedAt: 100 }];
        const incoming = [{ id: 1, weight: 200, modifiedAt: 200 }];
        const out = mergeRecords(existing, incoming, 'id');
        expect(out).toEqual([{ id: 1, weight: 200, modifiedAt: 200 }]);
    });

    it('older incoming does not overwrite newer existing', () => {
        const existing = [{ id: 1, weight: 200, modifiedAt: 200 }];
        const incoming = [{ id: 1, weight: 100, modifiedAt: 100 }];
        const out = mergeRecords(existing, incoming, 'id');
        expect(out).toEqual([{ id: 1, weight: 200, modifiedAt: 200 }]);
    });

    it('deletion wins on tie', () => {
        const existing = [{ id: 1, weight: 100, modifiedAt: 100 }];
        const incoming = [{ id: 1, weight: 100, modifiedAt: 100, deleted: true }];
        const out = mergeRecords(existing, incoming, 'id');
        expect(out[0].deleted).toBe(true);
    });

    it('records without the key are skipped', () => {
        const existing = [{ id: 1, modifiedAt: 100 }];
        const incoming = [{ modifiedAt: 200 }, null, { id: 2, modifiedAt: 200 }];
        const out = mergeRecords(existing, incoming, 'id');
        expect(out.map(r => r.id).sort()).toEqual([1, 2]);
    });

    it('merges by custom key (e.g. customExercise.name)', () => {
        const existing = [{ name: 'sandbag carry', muscle: 'core', modifiedAt: 100 }];
        const incoming = [{ name: 'sandbag carry', muscle: 'full body', modifiedAt: 200 }];
        const out = mergeRecords(existing, incoming, 'name');
        expect(out).toEqual([{ name: 'sandbag carry', muscle: 'full body', modifiedAt: 200 }]);
    });

    it('treats missing modifiedAt as 0 (incoming wins if existing has 0)', () => {
        const existing = [{ id: 1 }];
        const incoming = [{ id: 1, weight: 200, modifiedAt: 50 }];
        const out = mergeRecords(existing, incoming, 'id');
        expect(out).toEqual([{ id: 1, weight: 200, modifiedAt: 50 }]);
    });
});

describe('gcTombstones', () => {
    it('keeps non-deleted rows regardless of age', () => {
        const old = Date.now() - 1000 * 86400 * 1000; // 1000 days old
        const rows = [{ id: 1, modifiedAt: old }];
        expect(gcTombstones(rows, 90)).toEqual(rows);
    });

    it('drops deleted rows older than the cutoff', () => {
        const old = Date.now() - 100 * 86400 * 1000;
        const rows = [{ id: 1, deleted: true, modifiedAt: old }];
        expect(gcTombstones(rows, 90)).toEqual([]);
    });

    it('keeps deleted rows newer than the cutoff', () => {
        const recent = Date.now() - 30 * 86400 * 1000;
        const rows = [{ id: 1, deleted: true, modifiedAt: recent }];
        expect(gcTombstones(rows, 90)).toEqual(rows);
    });

    it('falls back to id timestamp when modifiedAt is missing', () => {
        const old = Date.now() - 100 * 86400 * 1000;
        const rows = [{ id: old, deleted: true }];
        expect(gcTombstones(rows, 90)).toEqual([]);
    });

    it('days=0 disables GC entirely', () => {
        const old = Date.now() - 1000 * 86400 * 1000;
        const rows = [{ id: 1, deleted: true, modifiedAt: old }];
        expect(gcTombstones(rows, 0)).toEqual(rows);
    });
});

describe('recomputePRs', () => {
    it('returns one PR per exercise', () => {
        const workouts = [
            { id: 1, exercise: 'bench press', weight: 200, oneRM: 220 },
            { id: 2, exercise: 'bench press', weight: 225, oneRM: 245 },
            { id: 3, exercise: 'squat',       weight: 300, oneRM: 330 },
        ];
        const prs = recomputePRs(workouts);
        expect(prs).toHaveLength(2);
        const bench = prs.find(p => p.exercise === 'bench press');
        expect(bench.max1RM).toBe(245);
        expect(bench.maxWeight).toBe(225);
    });

    it('excludes deleted workouts', () => {
        const workouts = [
            { id: 1, exercise: 'bench press', weight: 225, oneRM: 245, deleted: true },
            { id: 2, exercise: 'bench press', weight: 200, oneRM: 220 },
        ];
        const prs = recomputePRs(workouts);
        expect(prs[0].max1RM).toBe(220);
    });

    it('skips entries with non-string exercise or non-positive 1RM', () => {
        const workouts = [
            { id: 1, exercise: null,          weight: 225, oneRM: 245 },
            { id: 2, exercise: 'bench press', weight: 200, oneRM: 0   },
            { id: 3, exercise: 'squat',       weight: 300, oneRM: 330 },
        ];
        const prs = recomputePRs(workouts);
        expect(prs).toHaveLength(1);
        expect(prs[0].exercise).toBe('squat');
    });

    it('returns empty array for empty input', () => {
        expect(recomputePRs([])).toEqual([]);
    });
});
