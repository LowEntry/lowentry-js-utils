import {describe, test, expect, jest} from '@jest/globals';
import {LeUtils} from '../src/index.js';

const wait = ms => LeUtils.promiseTimeout(ms ?? 100);


describe('LeUtils.compareNaturalStrings', () =>
{
	test('should return 0 for equal paths', () =>
	{
		expect(LeUtils.compareNaturalStrings('path/to/file.txt', 'path/to/file.txt')).toBe(0);
	});
	
	test('should return -1 for first path being "less than" second', () =>
	{
		expect(LeUtils.compareNaturalStrings('path/to/a.txt', 'path/to/b.txt')).toBeLessThan(0);
	});
	
	test('should return 1 for first path being "greater than" second', () =>
	{
		expect(LeUtils.compareNaturalStrings('path/to/b.txt', 'path/to/a.txt')).toBeGreaterThan(0);
	});
	
	test('test/5/test.txt should be less than test/10/test.txt', () =>
	{
		expect(LeUtils.compareNaturalStrings('test/5/test.txt', 'test/10/test.txt')).toBeLessThan(0);
	});
	
	test('test5.txt should be less than test10.txt', () =>
	{
		expect(LeUtils.compareNaturalStrings('test5.txt', 'test10.txt')).toBeLessThan(0);
	});
});
