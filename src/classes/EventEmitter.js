/**
 * A simple event emitter class that allows you to register listeners for events, emit events, and remove listeners.
 */
export class EventEmitter
{
	/** @type {Map<string, Set<Function>>} */
	#events;
	
	
	/**
	 * Creates a new EventEmitter instance.
	 */
	constructor()
	{
		this.#events = new Map();
	}
	
	
	/**
	 * Registers a listener for a specific event.
	 *
	 * @param {string} event - The name of the event to listen for.
	 * @param {Function} listener - The function to call when the event is emitted.
	 * @returns {{remove:(()=>void)}}
	 */
	on(event, listener)
	{
		if(!this.#events.has(event))
		{
			this.#events.set(event, new Set());
		}
		this.#events.get(event)?.add(listener);
		
		return {
			remove:
				() => this.off(event, listener),
		};
	}
	
	/**
	 * Registers a listener for a specific event, this listener will be called only once.
	 *
	 * @param {string} event - The name of the event to listen for.
	 * @param {Function} listener - The function to call when the event is emitted.
	 * @returns {{remove:()=>void}}
	 */
	once(event, listener)
	{
		const wrapper = (/** @type {*[]} */ ...args) =>
		{
			this.off(event, wrapper);
			listener(...args);
		};
		
		this.on(event, wrapper);
		
		return {
			remove:
				() => this.off(event, wrapper),
		};
	}
	
	/**
	 * Removes a listener for a specific event.
	 *
	 * @param {string} event - The name of the event to stop listening for.
	 * @param {Function} listener - The function to remove from the event listeners.
	 */
	off(event, listener)
	{
		const listeners = this.#events.get(event);
		if(listeners)
		{
			listeners.delete(listener);
			if(listeners.size === 0)
			{
				this.#events.delete(event);
			}
		}
	}
	
	/**
	 * Emits an event, calling all registered listeners with the provided arguments.
	 *
	 * @param {string} event - The name of the event to emit.
	 * @param {...*} args - The arguments to pass to the listeners.
	 */
	emit(event, ...args)
	{
		const listeners = this.#events.get(event);
		if(listeners)
		{
			const snapshot = [...listeners];
			for(const listener of snapshot)
			{
				try
				{
					listener(...args);
				}
				catch(err)
				{
					console.error(`Error in listener for "${event}":`, err);
				}
			}
		}
	}
	
	/**
	 * Clears all listeners for a specific event or all events if no event is specified.
	 *
	 * @param {string} [event] - The name of the event to clear listeners for. If not provided, all events will be cleared.
	 */
	clear(event)
	{
		if(event !== undefined)
		{
			this.#events.delete(event);
		}
		else
		{
			this.#events.clear();
		}
	}
}
