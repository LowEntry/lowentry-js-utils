import {describe, test, expect} from 'vitest';
import {LeUtils, SerializableMap} from '../src/index.js';


const KEY_TO_IGNORE = '@ignored@';

const areMapsEqual = (map1, map2) => LeUtils.equalsMapLike(map1, map2);
const areMapsEqualIgnoreKey = (map1, map2) => LeUtils.equalsMapLike(map1, map2, [KEY_TO_IGNORE]);


describe('testing map comparisons', () =>
{
	test('map compare true - different classes', () =>
	{
		const ownMap = new SerializableMap([['key1', 'value1'], ['key2', 'value2']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map compare true', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map compare false', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value3']]);
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map compare true - different order', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = new Map([['key2', 'value2'], ['key1', 'value1']]);
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map compare false - different order', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = new Map([['key2', 'value3'], ['key1', 'value1']]);
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map compare true - with location', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map compare false - with location', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '456']]);
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map compare true - ignore location 1', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(true);
	});
	test('map compare true - ignore location 2', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(true);
	});
	test('map compare false - ignore location 1', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value3']]);
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(false);
	});
	test('map compare false - ignore location 2', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = new Map([['key1', 'value1'], ['key2', 'value3'], [KEY_TO_IGNORE, '123']]);
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(false);
	});
	test('map compare true - empty map', () =>
	{
		const ownMap = new Map();
		const map = new Map();
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map compare false - empty map', () =>
	{
		const ownMap = new Map([['key1', 'value1']]);
		const map = new Map();
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map compare true - empty map with location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = new Map([[KEY_TO_IGNORE, '123']]);
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map compare false - empty map with location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = new Map([[KEY_TO_IGNORE, '456']]);
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map compare true - empty map ignore location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = new Map();
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(true);
	});
	test('map compare false - empty map ignore location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = new Map([['key1', 'value1']]);
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(false);
	});
});


describe('testing map-object comparisons', () =>
{
	test('map-object compare true', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = {'key1':'value1', 'key2':'value2'};
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map-object compare false', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = {'key1':'value1', 'key2':'value3'};
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map-object compare true - different order', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = {'key2':'value2', 'key1':'value1'};
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map-object compare false - different order', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = {'key2':'value3', 'key1':'value1'};
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map-object compare true - with location', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = {'key1':'value1', 'key2':'value2', [KEY_TO_IGNORE]:'123'};
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map-object compare false - with location', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = {'key1':'value1', 'key2':'value2', [KEY_TO_IGNORE]:'456'};
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map-object compare true - ignore location 1', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = {'key1':'value1', 'key2':'value2'};
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(true);
	});
	test('map-object compare true - ignore location 2', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = {'key1':'value1', 'key2':'value2', [KEY_TO_IGNORE]:'123'};
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(true);
	});
	test('map-object compare false - ignore location 1', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2'], [KEY_TO_IGNORE, '123']]);
		const map = {'key1':'value1', 'key2':'value3'};
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(false);
	});
	test('map-object compare false - ignore location 2', () =>
	{
		const ownMap = new Map([['key1', 'value1'], ['key2', 'value2']]);
		const map = {'key1':'value1', 'key2':'value3', [KEY_TO_IGNORE]:'123'};
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(false);
	});
	test('map-object compare true - empty map', () =>
	{
		const ownMap = new Map();
		const map = {};
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map-object compare false - empty map', () =>
	{
		const ownMap = new Map([['key1', 'value1']]);
		const map = {};
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map-object compare true - empty map with location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = {[KEY_TO_IGNORE]:'123'};
		expect(areMapsEqual(ownMap, map)).toBe(true);
	});
	test('map-object compare false - empty map with location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = {[KEY_TO_IGNORE]:'456'};
		expect(areMapsEqual(ownMap, map)).toBe(false);
	});
	test('map-object compare true - empty map ignore location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = {};
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(true);
	});
	test('map-object compare false - empty map ignore location', () =>
	{
		const ownMap = new Map([[KEY_TO_IGNORE, '123']]);
		const map = {'key1':'value1'};
		expect(areMapsEqualIgnoreKey(ownMap, map)).toBe(false);
	});
});
