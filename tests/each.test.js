import {describe, test, expect} from '@jest/globals';
import {LeUtils} from '../src/index.js';


describe('LeUtils.each()', () =>
{
	test('iterates arrays', () =>
	{
		const arr = [1, 2, 3];
		const seen = [];
		LeUtils.each(arr, value =>
		{
			seen.push(value);
		});
		expect(seen).toEqual([1, 2, 3]);
	});
	
	test('breaks on false', () =>
	{
		const arr = [1, 2, 3];
		const seen = [];
		LeUtils.each(arr, value =>
		{
			seen.push(value);
			if(value === 2)
			{
				return false;
			}
		});
		expect(seen).toEqual([1, 2]);
	});
	
	test('iterates maps', () =>
	{
		const m = new Map();
		m.set('a', 1);
		m.set('b', 2);
		const seen = [];
		LeUtils.each(m, (value, index) =>
		{
			seen.push([index, value]);
		});
		expect(seen).toEqual([['a', 1], ['b', 2]]);
	});
});
