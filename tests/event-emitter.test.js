import {describe, test, expect} from 'vitest';
import {EventEmitter} from '../src/index.js';


describe('EventEmitter', () =>
{
	test('should create an instance of EventEmitter', () =>
	{
		const emitter = new EventEmitter();
		expect(emitter).toBeInstanceOf(EventEmitter);
	});
	
	test('should emit and listen to events', () =>
	{
		const emitter = new EventEmitter();
		let called = 0;
		
		emitter.on('testEvent', () =>
		{
			called++;
		});
		
		emitter.emit('testEvent');
		expect(called).toBe(1);
	});
	
	test('should remove event listeners', () =>
	{
		const emitter = new EventEmitter();
		let called = 0;
		
		const listener = () =>
		{
			called++;
		};
		
		emitter.on('testEvent', listener);
		emitter.off('testEvent', listener);
		
		emitter.emit('testEvent');
		expect(called).toBe(0);
	});
	
	test('should handle multiple listeners for the same event', () =>
	{
		const emitter = new EventEmitter();
		let called1 = 0;
		let called2 = 0;
		
		const listener1 = () =>
		{
			called1++;
		};
		const listener2 = () =>
		{
			called2++;
		};
		
		emitter.on('testEvent', listener1);
		emitter.on('testEvent', listener2);
		
		emitter.emit('testEvent');
		expect(called1).toBe(1);
		expect(called2).toBe(1);
		
		emitter.off('testEvent', listener1);
		emitter.emit('testEvent');
		expect(called1).toBe(1);
		expect(called2).toBe(2);
	});
	
	test('should handle event names with special characters', () =>
	{
		const emitter = new EventEmitter();
		let called = 0;
		
		emitter.on('test-event!@#$', () =>
		{
			called++;
		});
		
		emitter.emit('test-event!@#$');
		expect(called).toBe(1);
	});
	
	test('should handle event names with spaces', () =>
	{
		const emitter = new EventEmitter();
		let called = 0;
		
		emitter.on('test event with spaces', () =>
		{
			called++;
		});
		
		emitter.emit('test event with spaces');
		expect(called).toBe(1);
	});
	
	test('should be able to remove a listener using the returned listener object', () =>
	{
		const emitter = new EventEmitter();
		let called = 0;
		
		const listener = emitter.on('test123', () =>
		{
			called++;
		});
		
		emitter.emit('test123');
		expect(called).toBe(1);
		
		listener.remove();
		emitter.emit('test123');
		expect(called).toBe(1);
	});
	
	test('should handle multiple events with the same name', () =>
	{
		const emitter = new EventEmitter();
		let called1 = 0;
		let called2 = 0;
		
		emitter.on('testEvent', () =>
		{
			called1++;
		});
		
		emitter.on('testEvent', () =>
		{
			called2++;
		});
		
		emitter.emit('testEvent');
		expect(called1).toBe(1);
		expect(called2).toBe(1);
		
		emitter.clear('testEvent');
		emitter.emit('testEvent');
		expect(called1).toBe(1);
		expect(called2).toBe(1);
	});
	
	test('should handle once() method', () =>
	{
		const emitter = new EventEmitter();
		let called = 0;
		
		emitter.once('testOnce', () =>
		{
			called++;
		});
		
		emitter.emit('testOnce');
		expect(called).toBe(1);
		
		emitter.emit('testOnce');
		expect(called).toBe(1);
	});
	
	test('should allow canceling a once listener using .remove()', () =>
	{
		const emitter = new EventEmitter();
		let called = 0;
		
		const listener = emitter.once('testOnceCancel', () =>
		{
			called++;
		});
		
		listener.remove();
		
		emitter.emit('testOnceCancel');
		expect(called).toBe(0);
		
		emitter.emit('testOnceCancel');
		expect(called).toBe(0);
	});
});
