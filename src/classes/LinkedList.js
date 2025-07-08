class LinkedListNode
{
	/** @type {*} */
	value;
	
	/** @type {LinkedListNode|null} */
	next = null;
	
	/** @type {LinkedListNode|null} */
	previous = null;
	
	/**
	 * @param {*} value
	 */
	constructor(value)
	{
		this.value = value;
	}
}

export class LinkedList
{
	/** @type {LinkedListNode|null} */
	#head = null;
	
	/** @type {LinkedListNode|null} */
	#tail = null;
	
	/** @type {number} */
	#size = 0;
	
	constructor()
	{
	}
	
	/**
	 * Returns the number of elements in the list.
	 *
	 * @returns {number}
	 */
	get size()
	{
		return this.#size;
	}
	
	/**
	 * Adds a new value to the beginning of the list.
	 *
	 * @param {*} value
	 */
	unshift(value)
	{
		const newNode = new LinkedListNode(value);
		if(this.#head === null)
		{
			this.#head = newNode;
			this.#tail = newNode;
		}
		else
		{
			newNode.next = this.#head;
			this.#head.previous = newNode;
			this.#head = newNode;
		}
		this.#size++;
	}
	
	/**
	 * Adds a new value to the end of the list.
	 *
	 * @param {*} value
	 */
	push(value)
	{
		const newNode = new LinkedListNode(value);
		if(this.#tail === null)
		{
			this.#head = newNode;
			this.#tail = newNode;
		}
		else
		{
			newNode.previous = this.#tail;
			this.#tail.next = newNode;
			this.#tail = newNode;
		}
		this.#size++;
	}
	
	/**
	 * Removes the first value from the list and returns it.
	 *
	 * @returns {*|undefined}
	 */
	shift()
	{
		if(this.#head === null)
		{
			return undefined;
		}
		
		const value = this.#head.value;
		this.#head = this.#head.next;
		
		if(this.#head !== null)
		{
			this.#head.previous = null;
		}
		else
		{
			this.#tail = null;
		}
		
		this.#size--;
		return value;
	}
	
	/**
	 * Removes the last value from the list and returns it.
	 *
	 * @returns {*|undefined}
	 */
	pop()
	{
		if(this.#tail === null)
		{
			return undefined;
		}
		
		const value = this.#tail.value;
		this.#tail = this.#tail.previous;
		
		if(this.#tail !== null)
		{
			this.#tail.next = null;
		}
		else
		{
			this.#head = null;
		}
		
		this.#size--;
		return value;
	}
}
