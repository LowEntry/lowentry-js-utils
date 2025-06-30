import { describe, test, expect, jest } from '@jest/globals';
import { LeUtils } from '../src/index.js';

const pause = ms => LeUtils.promiseTimeout(ms);

describe('LeUtils.each()', () => {
  test('array order', () => {
    const out = [];
    LeUtils.each([1, 2, 3], v => out.push(v));
    expect(out).toEqual([1, 2, 3]);
  });
  test('breaks on false', () => {
    const out = [];
    LeUtils.each([1, 2, 3], v => {
      out.push(v);
      if (v === 2) return false;
    });
    expect(out).toEqual([1, 2]);
  });
  test('Map iteration', () => {
    const m = new Map([['a', 1], ['b', 2]]);
    const seen = [];
    LeUtils.each(m, (v, k) => seen.push([k, v]));
    expect(seen).toEqual([['a', 1], ['b', 2]]);
  });
  test('Set iteration', () => {
    const s = new Set([10, 20]);
    const seen = [];
    LeUtils.each(s, (v, k) => seen.push([k, v]));
    expect(seen).toEqual([[10, 10], [20, 20]]);
  });
  test('string iteration', () => {
    const seen = [];
    LeUtils.each('ab', (c, i) => seen.push([i, c]));
    expect(seen).toEqual([[0, 'a'], [1, 'b']]);
  });
  test('object skips prototype props', () => {
    const proto = { z: 9 };
    const o = Object.create(proto);
    o.a = 1; o.b = 2;
    const seen = [];
    LeUtils.each(o, v => seen.push(v));
    expect(seen).toEqual([1, 2]);
  });
});

describe('LeUtils.supportsEach()', () => {
  test('truthy for iterable types', () => {
    expect(LeUtils.supportsEach([1])).toBe(true);
    expect(LeUtils.supportsEach(new Map())).toBe(true);
    expect(LeUtils.supportsEach(new Set())).toBe(true);
    expect(LeUtils.supportsEach('x')).toBe(true);
  });
  test('false for primitives', () => {
    expect(LeUtils.supportsEach(5)).toBe(false);
    expect(LeUtils.supportsEach(null)).toBe(false);
    expect(LeUtils.supportsEach(undefined)).toBe(false);
  });
});

describe('LeUtils.getValueAtIndex()', () => {
  test('array index', () => {
    expect(LeUtils.getValueAtIndex([4, 5, 6], 1)).toBe(5);
  });
  test('Map key', () => {
    const m = new Map([['k', 99]]);
    expect(LeUtils.getValueAtIndex(m, 'k')).toBe(99);
  });
  test('Set returns key itself', () => {
    const s = new Set([7]);
    expect(LeUtils.getValueAtIndex(s, 7)).toBe(7);
  });
});

describe('LeUtils.filter()', () => {
  test('array truthy filter default', () => {
    const out = LeUtils.filter([0, 1, '', 'x', false, true]);
    expect(out).toEqual([1, 'x', true]);
  });
  test('object value > 1', () => {
    const res = LeUtils.filter({ a: 1, b: 2, c: 3 }, v => v > 1);
    expect(res).toEqual({ b: 2, c: 3 });
  });
  test('Map retain even', () => {
    const m = new Map([['a', 1], ['b', 2]]);
    const out = LeUtils.filter(m, v => v % 2 === 0);
    expect(out instanceof Map).toBe(true);
    expect(out.get('b')).toBe(2);
  });
});

describe('LeUtils.map utilities', () => {
  test('map array double', () => {
    expect(LeUtils.map([1, 2], n => n * 2)).toEqual([2, 4]);
  });
  test('map object values++', () => {
    expect(LeUtils.map({ x: 1 }, v => v + 1)).toEqual({ x: 2 });
  });
  test('map typed array', () => {
    const ta = new Uint8Array([1, 2]);
    expect(LeUtils.map(ta, n => n + 3)).toEqual([4, 5]);
  });
  test('mapToArray', () => {
    const m = new Map([['k', 2]]);
    expect(LeUtils.mapToArray(m, v => v * 3)).toEqual([6]);
  });
  test('mapToArraySorted', () => {
    const o = { a: 3, b: 1, c: 2 };
    const arr = LeUtils.mapToArraySorted(o, (x, y) => x - y, v => v);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe('LeUtils.sortKeys()', () => {
  test('object keys by descending value', () => {
    const obj = { a: 1, b: 3, c: 2 };
    const keys = LeUtils.sortKeys(obj, (x, y) => y - x);
    expect(keys).toEqual(['b', 'c', 'a']);
  });
});

describe('LeUtils flatten helpers', () => {
  test('flattenArray', () => {
    expect(LeUtils.flattenArray([1, [2, [3]]])).toEqual([1, 2, 3]);
  });
  test('flattenToArray mixed', () => {
    const mixed = [1, new Set([2, 3]), { x: 4 }];
    expect(LeUtils.flattenToArray(mixed)).toEqual([1, 2, 3, { x: 4 }]);
  });
});

describe('LeUtils.getEmptySimplifiedCollection()', () => {
  test('array source returns array add()', () => {
    const [ok, col, add] = LeUtils.getEmptySimplifiedCollection([5]);
    add(1);
    add(2);
    expect(ok).toBe(true);
    expect(col).toEqual([1, 2]);
  });
  test('map source returns Map add()', () => {
    const [ok, col, add] = LeUtils.getEmptySimplifiedCollection(new Map());
    add('v', 'k');
    expect(ok).toBe(true);
    expect(col instanceof Map).toBe(true);
    expect(col.get('k')).toBe('v');
  });
});

describe('LeUtils.eachAsync()', () => {
  test('serial preserves order', async () => {
    const seen = [];
    await LeUtils.eachAsync([1, 2, 3], async v => {
      await pause(1);
      seen.push(v);
    }, 1);
    expect(seen).toEqual([1, 2, 3]);
  });
  test('parallel limit honoured', async () => {
    const active = [];
    const max = [];
    await LeUtils.eachAsync([1, 2, 3, 4, 5], async v => {
      active.push(v);
      max.push(active.length);
      await pause(5);
      active.splice(active.indexOf(v), 1);
    }, 2);
    expect(Math.max(...max)).toBeLessThanOrEqual(2);
  });
  test('early break stops queuing', async () => {
    const processed = [];
    await LeUtils.eachAsync([1, 2, 3, 4], async v => {
      processed.push(v);
      if (v === 2) return false;
      await pause(1);
    }, 2);
    expect(processed).toContain(1);
    expect(processed).toContain(2);
    expect(processed.length).toBeLessThan(4);
  });
  test('works on Map', async () => {
    const m = new Map([['a', 1], ['b', 2]]);
    const out = [];
    await LeUtils.eachAsync(m, async (v, k) => out.push([k, v]));
    expect(out).toEqual([['a', 1], ['b', 2]]);
  });
  test('works on Set', async () => {
    const s = new Set([3, 4]);
    const out = [];
    await LeUtils.eachAsync(s, async (v, k) => out.push([k, v]));
    expect(out).toEqual([[3, 3], [4, 4]]);
  });
});

