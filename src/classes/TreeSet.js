import {LeUtils} from '../LeUtils.js';


/**
 * A TreeSet is a set of elements, sorted by a comparator.
 * Binary search is used to find elements, which makes it very fast to find elements.
 *
 * The comparator is also used to determine if two values are equal to each other.
 * This way, you can have values that aren't the same be treated as if they are. This can be used to deal with issues such as floating point errors for example.
 */
export class TreeSet
{
	/** @type {*[]} */
	#elements;
	
	/** @type {(valueA:*, valueB:*) => number} */
	#comparator;
	
	
	/**
	 * Creates a new TreeSet with the given elements and comparator.
	 *
	 * @param {*[]} [elements=[]] - The initial elements of the set.
	 * @param {(valueA:*, valueB:*) => number} [comparator=LeUtils.compare] - The comparator function to use for sorting.
	 */
	constructor(elements, comparator)
	{
		this.#comparator = comparator || LeUtils.compare;
		this.#elements = elements || [];
		this.#elements.sort(this.#comparator);
	}
	
	
	/**
	 *
	 *
	 * @param {*} value - The value to search for in the set.
	 * @returns {{found:boolean, index:number, value:*|undefined}} - An object containing whether the value was found, the index where it would be inserted, and the value at that index (if found).
	 * @private
	 */
	binarySearch(value)
	{
		let low = 0;
		let high = this.#elements.length - 1;
		while(low <= high)
		{
			const mid = Math.floor((low + high) / 2);
			const midValue = this.#elements[mid];
			const cmp = this.#comparator(midValue, value);
			if(cmp < 0)
			{
				low = mid + 1;
			}
			else if(cmp > 0)
			{
				high = mid - 1;
			}
			else
			{
				return {found:true, index:mid, value:midValue};
			}
		}
		return {found:false, index:low, value:undefined};
	};
	
	
	/**
	 * Returns the elements of the set.
	 */
	getElements()
	{
		return this.#elements;
	}
	
	/**
	 * Returns the comparator of the set.
	 *
	 * @returns {(valueA:*, valueB:*) => number}
	 */
	getComparator()
	{
		return this.#comparator;
	}
	
	/**
	 * Returns the size of the set.
	 *
	 * @returns {number}
	 */
	size()
	{
		return this.#elements.length;
	}
	
	/**
	 * Returns true if the set is empty, false otherwise.
	 *
	 * @returns {boolean}
	 */
	isEmpty()
	{
		return (this.#elements.length <= 0);
	}
	
	/**
	 * Returns true if the set contains a value that is equal to the given value, returns false otherwise.
	 *
	 * @param {*} value - The value to check for in the set.
	 * @return {boolean} - True if the set contains the value, false otherwise.
	 */
	contains(value)
	{
		return this.binarySearch(value).found;
	}
	
	/**
	 * Returns the first element of the set, or undefined if it is empty.
	 *
	 * @return {*|undefined} - The first element of the set, or undefined if it is empty.
	 */
	first()
	{
		return (this.#elements.length > 0) ? this.#elements[0] : undefined;
	}
	
	/**
	 * Returns the last element of the set, or undefined if it is empty.
	 *
	 * @return {*|undefined} - The last element of the set, or undefined if it is empty.
	 */
	last()
	{
		return (this.#elements.length > 0) ? this.#elements[this.#elements.length - 1] : undefined;
	}
	
	/**
	 * Removes and returns the first element of the set, or undefined if it is empty.
	 *
	 * @returns {*|undefined} - The first element of the set, or undefined if it is empty.
	 */
	pollFirst()
	{
		return (this.#elements.length > 0) ? this.#elements.splice(0, 1)[0] : undefined;
	}
	
	/**
	 * Removes and returns the last element of the set, or undefined if it is empty.
	 *
	 * @returns {*|undefined} - The last element of the set, or undefined if it is empty.
	 */
	pollLast()
	{
		return (this.#elements.length > 0) ? this.#elements.splice(this.#elements.length - 1, 1)[0] : undefined;
	}
	
	/**
	 * Adds the given value to the set. Will only do so if no equal value already exists.
	 * @param {*} value - The value to add to the set.
	 */
	add(value)
	{
		const result = this.binarySearch(value);
		if(result.found)
		{
			return;
		}
		this.#elements.splice(result.index, 0, value);
	}
	
	/**
	 * Adds all the given values to the set. Will only do so if no equal value already exists.
	 *
	 * @param {*} values - The values to add to the set.
	 */
	addAll(values)
	{
		LeUtils.each(values, this.add.bind(this));
	}
	
	/**
	 * Returns an equal value that's already in the tree set, or undefined if no equal values in it exist.
	 *
	 * @param {*} value - The value to search for in the set.
	 * @return {*|undefined} - The equal value if found, or undefined if not found.
	 */
	getEqualValue(value)
	{
		const result = this.binarySearch(value);
		if(result.found)
		{
			return result.value;
		}
		return undefined;
	}
	
	/**
	 * Returns an equal value that's already in the tree set. If no equal values in it exist, the given value will be added and returned.
	 *
	 * @param {*} value - The value to search for in the set.
	 * @return {*} - The equal value if found, or the added value if not found.
	 */
	getEqualValueOrAdd(value)
	{
		const result = this.binarySearch(value);
		if(result.found)
		{
			return result.value;
		}
		this.#elements.splice(result.index, 0, value);
		return value;
	}
	
	/**
	 * Returns a string representation of the TreeSet.
	 *
	 * @returns {string} - A string representation of the TreeSet, including its elements and comparator.
	 */
	toString()
	{
		return `TreeSet{elements:${this.#elements}, comparator:${this.#comparator}}`;
	}
	
	/**
	 * Returns a JSON representation of the TreeSet.
	 *
	 * @returns {Object} - An object containing the elements and comparator of the TreeSet.
	 */
	toJSON()
	{
		return {
			elements:  this.#elements,
			comparator:this.#comparator.toString(),
		};
	}
}
