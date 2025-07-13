import {describe, test, expect} from 'vitest';
import {LeUtils} from '../src/index.js';

const wait = ms => LeUtils.promiseTimeout(ms ?? 100);


describe('LeUtils.flattenToArray crash tests', () =>
{
	test('flattenToArray on strings', () =>
	{
		const res = LeUtils.flattenToArray('test123');
		expect(res).toEqual(['test123']);
	});
});


describe('LeUtils.each()', () =>
{
	test('array order', () =>
	{
		const out = [];
		LeUtils.each([1, 2, 3], v =>
		{
			out.push(v);
		});
		expect(out).toEqual([1, 2, 3]);
	});
	test('breaks on false', () =>
	{
		const out = [];
		LeUtils.each([1, 2, 3], v =>
		{
			out.push(v);
			if(v === 2)
			{
				return false;
			}
		});
		expect(out).toEqual([1, 2]);
	});
	test('Map iteration', () =>
	{
		const m = new Map([['a', 1], ['b', 2]]);
		const seen = [];
		LeUtils.each(m, (v, k) =>
		{
			seen.push([k, v]);
		});
		expect(seen).toEqual([['a', 1], ['b', 2]]);
	});
	test('Set iteration', () =>
	{
		const s = new Set([10, 20]);
		const seen = [];
		LeUtils.each(s, (v, k) =>
		{
			seen.push([k, v]);
		});
		expect(seen).toEqual([[10, 10], [20, 20]]);
	});
	test('object skips prototype props', () =>
	{
		const proto = {z:9};
		const o = Object.create(proto);
		o.a = 1;
		o.b = 2;
		const seen = [];
		LeUtils.each(o, v =>
		{
			seen.push(v);
		});
		expect(seen).toEqual([1, 2]);
	});
});


describe('LeUtils.supportsEach()', () =>
{
	test('truthy for iterable types', () =>
	{
		expect(LeUtils.supportsEach([1])).toBe(true);
		expect(LeUtils.supportsEach(new Map())).toBe(true);
		expect(LeUtils.supportsEach(new Set())).toBe(true);
	});
	test('false for primitives', () =>
	{
		expect(LeUtils.supportsEach(5)).toBe(false);
		expect(LeUtils.supportsEach(5.55)).toBe(false);
		expect(LeUtils.supportsEach('xyz')).toBe(false);
		expect(LeUtils.supportsEach(true)).toBe(false);
		expect(LeUtils.supportsEach(null)).toBe(false);
		expect(LeUtils.supportsEach(undefined)).toBe(false);
	});
});


describe('LeUtils.getValueAtIndex()', () =>
{
	test('array index', () =>
	{
		expect(LeUtils.getValueAtIndex([4, 5, 6], 1)).toBe(5);
	});
	test('Map key', () =>
	{
		const m = new Map([['k', 99]]);
		expect(LeUtils.getValueAtIndex(m, 'k')).toBe(99);
	});
	test('Set returns key itself', () =>
	{
		const s = new Set([7]);
		expect(LeUtils.getValueAtIndex(s, 7)).toBe(7);
	});
});


describe('LeUtils.filter()', () =>
{
	test('array truthy filter default', () =>
	{
		const out = LeUtils.filter([0, 1, '', 'x', false, true]);
		expect(out).toEqual([1, 'x', true]);
	});
	test('object value > 1', () =>
	{
		const res = LeUtils.filter({a:1, b:2, c:3}, v => v > 1);
		expect(res).toEqual({b:2, c:3});
	});
	test('Map retain even', () =>
	{
		const m = new Map([['a', 1], ['b', 2]]);
		const out = LeUtils.filter(m, v => v % 2 === 0);
		expect(out instanceof Map).toBe(true);
		expect(out.get('b')).toBe(2);
	});
});


describe('LeUtils.map utilities', () =>
{
	test('map array double', () =>
	{
		expect(LeUtils.map([1, 2], n => n * 2)).toEqual([2, 4]);
	});
	test('map object values++', () =>
	{
		expect(LeUtils.map({x:1}, v => v + 1)).toEqual({x:2});
	});
	test('map typed array', () =>
	{
		const ta = new Uint8Array([1, 2]);
		expect(LeUtils.map(ta, n => n + 3)).toEqual([4, 5]);
	});
	test('mapToArray', () =>
	{
		const m = new Map([['k', 2]]);
		expect(LeUtils.mapToArray(m, v => v * 3)).toEqual([6]);
	});
	test('mapToArraySorted', () =>
	{
		const o = {a:3, b:1, c:2};
		const arr = LeUtils.mapToArraySorted(o, (x, y) => x - y, v => v);
		expect(arr).toEqual([1, 2, 3]);
	});
});


describe('LeUtils.sortKeys()', () =>
{
	test('object keys by descending value', () =>
	{
		const obj = {a:1, b:3, c:2};
		const keys = LeUtils.sortKeys(obj, (x, y) => y - x);
		expect(keys).toEqual(['b', 'c', 'a']);
	});
});


describe('LeUtils flatten helpers', () =>
{
	test('flattenArray', () =>
	{
		expect(LeUtils.flattenArray([1, [2, [3]]])).toEqual([1, 2, 3]);
	});
	test('flattenToArray mixed', () =>
	{
		const mixed = [1, new Set([2, 3]), {x:4}, new Map([['a', 5], ['b', 6]])];
		expect(LeUtils.flattenToArray(mixed)).toEqual([1, 2, 3, 4, 5, 6]);
	});
});


describe('LeUtils.getEmptySimplifiedCollection()', () =>
{
	test('array source returns array add()', () =>
	{
		const [ok, collection, add] = LeUtils.getEmptySimplifiedCollection([5]);
		expect(ok).toBe(true);
		add(1, 0);
		add(2, 1);
		expect(collection).toEqual([1, 2]);
	});
	test('map source returns Map add()', () =>
	{
		const [ok, collection, add] = LeUtils.getEmptySimplifiedCollection(new Map());
		expect(ok).toBe(true);
		add('v', 'k');
		expect(collection instanceof Map).toBe(true);
		expect(collection.get('k')).toBe('v');
	});
});


describe('LeUtils.eachAsync()', () =>
{
	test('serial preserves order', async () =>
	{
		const seen = [];
		await LeUtils.eachAsync([1, 2, 3], async v =>
		{
			await wait();
			seen.push(v);
		}, 1);
		expect(seen).toEqual([1, 2, 3]);
	});
	test('parallel limit honoured', async () =>
	{
		const active = [];
		const max = [];
		await LeUtils.eachAsync([1, 2, 3, 4, 5], async v =>
		{
			active.push(v);
			max.push(active.length);
			await wait();
			active.splice(active.indexOf(v), 1);
		}, 2);
		expect(Math.max(...max)).toBeLessThanOrEqual(2);
	});
	test('early break stops queuing', async () =>
	{
		const processed = [];
		await LeUtils.eachAsync([1, 2, 3, 4], async v =>
		{
			processed.push(v);
			if(v === 2)
			{
				return false;
			}
			await wait();
		}, 2);
		expect(processed).toContain(1);
		expect(processed).toContain(2);
		expect(processed.length).toBeLessThan(4);
	});
	test('works on Map', async () =>
	{
		const m = new Map([['a', 1], ['b', 2]]);
		const out = [];
		await LeUtils.eachAsync(m, async (v, k) =>
		{
			out.push([k, v]);
		});
		expect(out).toEqual([['a', 1], ['b', 2]]);
	});
	test('works on Set', async () =>
	{
		const s = new Set([3, 4]);
		const out = [];
		await LeUtils.eachAsync(s, async (v, k) =>
		{
			out.push([k, v]);
		});
		expect(out).toEqual([[3, 3], [4, 4]]);
	});
});


describe('LeUtils.getEmptySimplifiedCollection()', () =>
{
	test('custom iterable source object returns object', () =>
	{
		const iterable = {
			* [Symbol.iterator]()
			{
				yield 1;
			},
		};
		const [ok, collection, add] = LeUtils.getEmptySimplifiedCollection(iterable);
		expect(ok).toBe(true);
		expect(Array.isArray(collection)).toBe(false);
		add(2, '0');
		add(3, '1');
		add(4, '2');
		expect(collection).toEqual({0:2, 1:3, 2:4});
	});
	test('custom iterable source returns array', () =>
	{
		class CustomIterable
		{
			* [Symbol.iterator]()
			{
				yield 1;
			}
		}
		
		const iterable = new CustomIterable();
		const [ok, collection, add] = LeUtils.getEmptySimplifiedCollection(iterable);
		expect(ok).toBe(true);
		expect(Array.isArray(collection)).toBe(true);
		add(2, 0);
		add(3, 1);
		add(4, 2);
		expect(collection).toEqual([2, 3, 4]);
	});
});


describe('LeUtils.eachIterator()', () =>
{
	test('Map yields [value,key] in order', () =>
	{
		const m = new Map([['a', 1], ['b', 2]]);
		const out = [...LeUtils.eachIterator(m)];
		expect(out).toEqual([[1, 'a'], [2, 'b']]);
	});
});


describe('LeUtils.filter() edge', () =>
{
	test('Map truthy default retains only truthy', () =>
	{
		const m = new Map([['a', 0], ['b', 2]]);
		const res = LeUtils.filter(m);
		expect(res instanceof Map).toBe(true);
		expect([...res.entries()]).toEqual([['b', 2]]);
	});
});


describe('LeUtils.map() identity on Map', () =>
{
	test('returns Map clone when callback omitted', () =>
	{
		const m = new Map([['k', 5]]);
		const res = LeUtils.map(m);
		expect(res instanceof Map).toBe(true);
		expect(res.get('k')).toBe(5);
		expect(res).not.toBe(m);
	});
});


describe('LeUtils.mapToArraySorted() on Map', () =>
{
	test('sorts by squared value', () =>
	{
		const m = new Map([['x', 2], ['y', 3]]);
		const arr = LeUtils.mapToArraySorted(
			m,
			(a, b) => a - b,
			v => v * v,
		);
		expect(arr).toEqual([4, 9]);
	});
});


describe('LeUtils.sortKeys() on object with string length comparator', () =>
{
	test('sorts keys by length of value string', () =>
	{
		const obj = {a:'tool', b:'hi', c:'alpha'};
		const keys = LeUtils.sortKeys(obj, (x, y) => x.length - y.length);
		expect(keys).toEqual(['b', 'a', 'c']);
	});
});


describe('LeUtils.flattenArray and flattenToArray deep mix', () =>
{
	test('flattenArray non-array passthrough', () =>
	{
		expect(LeUtils.flattenArray(7)).toEqual([7]);
	});
	test('flattenToArray deep nested mix', () =>
	{
		const mixed = [1, [2, new Set([3]), {a:4}], new Map([['z', 5], ['', 6]])];
		const flat = LeUtils.flattenToArray(mixed);
		expect(flat).toEqual([1, 2, 3, 4, 5, 6]);
	});
});


describe('LeUtils.supportsEach() custom forEach object and function', () =>
{
	test('object with forEach()', () =>
	{
		const obj = {
			forEach:() =>
			        {
			        },
		};
		expect(LeUtils.supportsEach(obj)).toBe(true);
	});
	test('plain function returns true', () =>
	{
		const fn = () =>
		{
		};
		expect(LeUtils.supportsEach(fn)).toBe(true);
	});
});


describe('LeUtils.eachAsync() heavy parallel', () =>
{
	test('processes 100 items with concurrency 20', async () =>
	{
		const size = 100;
		const data = [...Array(size).keys()];
		const active = [];
		const max = [];
		await LeUtils.eachAsync(
			data,
			async v =>
			{
				active.push(v);
				max.push(active.length);
				await wait();
				active.splice(active.indexOf(v), 1);
			},
			20,
		);
		expect(max.length).toBe(size);
		expect(Math.max(...max)).toBeLessThanOrEqual(20);
	}, 10000);
});


describe('LeUtils.getValueAtIndex() custom iterable', () =>
{
	test('returns value from generator sequence', () =>
	{
		class CustomIterable
		{
			* [Symbol.iterator]()
			{
				yield 5;
				yield 6;
			}
		}
		
		const gen = new CustomIterable();
		expect(LeUtils.getValueAtIndex(gen, 0)).toBe(5);
		expect(LeUtils.getValueAtIndex(gen, 1)).toBe(6);
	});
});


describe('LeUtils.each() extra', () =>
{
	test('typed array', () =>
	{
		const ta = new Uint16Array([9, 8]);
		const out = [];
		LeUtils.each(ta, (v, i) =>
		{
			out.push([i, v]);
		});
		expect(out).toEqual([[0, 9], [1, 8]]);
	});
	test('custom forEach object', () =>
	{
		const obj = {
			forEach(cb)
			{
				[1, 2].forEach(cb);
			},
		};
		const seen = [];
		LeUtils.each(obj, (v, k) =>
		{
			seen.push(k);
		});
		expect(seen).toEqual(['forEach']);
	});
	test('custom forEach class', () =>
	{
		class ForEachObject
		{
			forEach(cb)
			{
				[1, 2].forEach(cb);
			}
		}
		
		const obj = new ForEachObject();
		const seen = [];
		LeUtils.each(obj, v =>
		{
			seen.push(v);
		});
		expect(seen).toEqual([1, 2]);
	});
	test('custom forEach class returns false', () =>
	{
		class ForEachObject
		{
			forEach(cb)
			{
				[1, 2].forEach(cb);
			}
		}
		
		const obj = new ForEachObject();
		const seen = [];
		LeUtils.each(obj, v =>
		{
			seen.push(v);
			if(v === 1)
			{
				return false;
			}
		});
		expect(seen).toEqual([1]);
	});
});


describe('LeUtils.supportsEach() extra', () =>
{
	test('typed array true', () =>
	{
		expect(LeUtils.supportsEach(new Int8Array(2))).toBe(true);
	});
});


describe('LeUtils.filter() extra', () =>
{
	test('Set keep odd', () =>
	{
		const s = new Set([1, 2, 3]);
		const res = LeUtils.filter(s, v => v % 2 === 1);
		expect(res).toEqual([1, 3]);
	});
});


describe('LeUtils.mapToArraySorted() extra', () =>
{
	test('numeric array sort descending', () =>
	{
		const arr = [3, 1, 2];
		const res = LeUtils.mapToArraySorted(arr, (a, b) => b - a, v => v);
		expect(res).toEqual([3, 2, 1]);
	});
});


describe('LeUtils.sortKeys() extra', () =>
{
	test('Map keys by numeric value asc', () =>
	{
		const m = new Map([['x', 5], ['y', 2]]);
		const keys = LeUtils.sortKeys(m, (a, b) => a - b);
		expect(keys).toEqual(['y', 'x']);
	});
});


describe('LeUtils.flattenArray/flattenToArray extra', () =>
{
	test('flattenArray one-level', () =>
	{
		expect(LeUtils.flattenArray([1, [2]])).toEqual([1, 2]);
	});
	test('flattenToArray skips empty arrays', () =>
	{
		const res = LeUtils.flattenToArray([[], [1], new Set()]);
		expect(res).toEqual([1]);
	});
});


describe('LeUtils.getEmptySimplifiedCollection() extra', () =>
{
	test('function source returns object', () =>
	{
		const fn = () =>
		{
		};
		const [ok, collection, add] = LeUtils.getEmptySimplifiedCollection(fn);
		expect(ok).toBe(true);
		add('v', 'k');
		expect(collection).toEqual({k:'v'});
	});
});


describe('LeUtils.eachAsync() stress 1000 items', () =>
{
	test('parallel 200 completes', async () =>
	{
		const N = 1000;
		const src = [...Array(N).keys()];
		let count = 0;
		await LeUtils.eachAsync(src, async () =>
		{
			count++;
			await wait();
		}, 200);
		expect(count).toBe(N);
	}, 20000);
	test('early false stops further enqueues', async () =>
	{
		const list = [...Array(50).keys()];
		const seen = [];
		await LeUtils.eachAsync(list, async v =>
		{
			seen.push(v);
			if(v === 10)
			{
				return false;
			}
			await wait();
		}, 5);
		expect(seen.includes(0)).toBe(true);
		expect(seen.includes(10)).toBe(true);
		expect(seen.length).toBeLessThan(50);
	});
});
