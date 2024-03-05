import {ISSET, IS_OBJECT, STRING, INT_LAX, FLOAT_LAX, INT_LAX_ANY, FLOAT_LAX_ANY} from './LeTypes.js';


export const LeUtils = {
	/**
	 * Parses the given version string, and returns an object with the major, minor, and patch numbers, as well as some comparison functions.
	 *
	 * Expects a version string such as:
	 * - "1"
	 * - "1.2"
	 * - "1.2.3"
	 * - "1.2.3 anything"
	 * - "1.2.3-anything"
	 *
	 * @param {string|*} versionString
	 * @returns {{major: (number),  minor: (number),  patch: (number),  toString: (function(): string),  equals: (function(string|*): boolean),  smallerThan: (function(string|*): boolean),  smallerThanOrEquals: (function(string|*): boolean),  largerThan: (function(string|*): boolean),  largerThanOrEquals: (function(string|*): boolean)}}
	 */
	parseVersionString:
		(versionString) =>
		{
			if(IS_OBJECT(versionString) && ISSET(versionString?.major) && ISSET(versionString?.minor) && ISSET(versionString?.patch))
			{
				return versionString;
			}
			
			versionString = STRING(versionString).trim();
			const partsVersion = versionString.split(' ')[0].split('-')[0].split('.');
			const major = INT_LAX(partsVersion[0]);
			const minor = INT_LAX(partsVersion[1]);
			const patch = INT_LAX(partsVersion[2]);
			
			const THIS = {
				major:major,
				minor:minor,
				patch:patch,
				
				toString:
					() => major + '.' + minor + '.' + patch,
				
				equals:
					(otherVersion) =>
					{
						otherVersion = LeUtils.parseVersionString(otherVersion);
						return (major === otherVersion.major) && (minor === otherVersion.minor) && (patch === otherVersion.patch);
					},
				
				largerThan:
					(otherVersion) =>
					{
						otherVersion = LeUtils.parseVersionString(otherVersion);
						
						if(major > otherVersion.major)
						{
							return true;
						}
						if(major < otherVersion.major)
						{
							return false;
						}
						
						if(minor > otherVersion.minor)
						{
							return true;
						}
						if(minor < otherVersion.minor)
						{
							return false;
						}
						
						return (patch > otherVersion.patch);
					},
				
				largerThanOrEquals:
					(otherVersion) =>
					{
						otherVersion = LeUtils.parseVersionString(otherVersion);
						
						if(major > otherVersion.major)
						{
							return true;
						}
						if(major < otherVersion.major)
						{
							return false;
						}
						
						if(minor > otherVersion.minor)
						{
							return true;
						}
						if(minor < otherVersion.minor)
						{
							return false;
						}
						
						return (patch >= otherVersion.patch);
					},
				
				smallerThan:
					(otherVersion) => !THIS.largerThanOrEquals(otherVersion),
				
				smallerThanOrEquals:
					(otherVersion) => !THIS.largerThan(otherVersion),
			};
			return THIS;
		},
	
	/**
	 * Returns true if the array or object contains the given value.
	 *
	 * Values are compared by casting both of them to a string.
	 *
	 * @param {array|object|Function} array
	 * @param {*} value
	 * @returns {boolean}
	 */
	contains:
		(array, value) =>
		{
			if(!array)
			{
				return false;
			}
			let result = false;
			value = STRING(value);
			LeUtils.each(array, (val) =>
			{
				if(STRING(val) === value)
				{
					result = true;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the array or object contains the given value.
	 *
	 * Values are compared by casting both of them to a string, and then lowercasing them.
	 *
	 * @param {array|object|Function} array
	 * @param {*} value
	 * @returns {boolean}
	 */
	containsCaseInsensitive:
		(array, value) =>
		{
			if(!array)
			{
				return false;
			}
			let result = false;
			value = STRING(value).toLowerCase();
			LeUtils.each(array, (val) =>
			{
				if(STRING(val).toLowerCase() === value)
				{
					result = true;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the array or object contains all the given values.
	 *
	 * Values are compared by casting both of them to a string.
	 *
	 * @param {array|object|Function} array
	 * @param {array|object|Function} values
	 * @returns {boolean}
	 */
	containsAll:
		(array, values) =>
		{
			if(!array)
			{
				return false;
			}
			let result = true;
			LeUtils.each(values, function(value)
			{
				if(!LeUtils.contains(array, value))
				{
					result = false;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the array or object contains all the given values.
	 *
	 * Values are compared by casting both of them to a string, and then lowercasing them.
	 *
	 * @param {array|object|Function} array
	 * @param {array|object|Function} values
	 * @returns {boolean}
	 */
	containsAllCaseInsensitive:
		(array, values) =>
		{
			if(!array)
			{
				return false;
			}
			let result = true;
			LeUtils.each(values, function(value)
			{
				if(!LeUtils.containsCaseInsensitive(array, value))
				{
					result = false;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the array or object contains any of the given values.
	 *
	 * Values are compared by casting both of them to a string.
	 *
	 * @param {array|object|Function} array
	 * @param {array|object|Function} values
	 * @returns {boolean}
	 */
	containsAny:
		(array, values) =>
		{
			if(!array)
			{
				return false;
			}
			let result = false;
			LeUtils.each(values, function(value)
			{
				if(LeUtils.contains(array, value))
				{
					result = true;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the array or object contains any of the given values.
	 *
	 * Values are compared by casting both of them to a string, and then lowercasing them.
	 *
	 * @param {array|object|Function} array
	 * @param {array|object|Function} values
	 * @returns {boolean}
	 */
	containsAnyCaseInsensitive:
		(array, values) =>
		{
			if(!array)
			{
				return false;
			}
			let result = false;
			LeUtils.each(values, function(value)
			{
				if(LeUtils.containsCaseInsensitive(array, value))
				{
					result = true;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the array or object contains none of the given values.
	 *
	 * Values are compared by casting both of them to a string.
	 *
	 * @param {array|object|Function} array
	 * @param {array|object|Function} values
	 * @returns {boolean}
	 */
	containsNone:
		(array, values) =>
		{
			if(!array)
			{
				return true;
			}
			let result = true;
			LeUtils.each(values, function(value)
			{
				if(LeUtils.contains(array, value))
				{
					result = false;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the array or object contains none of the given values.
	 *
	 * Values are compared by casting both of them to a string, and then lowercasing them.
	 *
	 * @param {array|object|Function} array
	 * @param {array|object|Function} values
	 * @returns {boolean}
	 */
	containsNoneCaseInsensitive:
		(array, values) =>
		{
			if(!array)
			{
				return true;
			}
			let result = true;
			LeUtils.each(values, function(value)
			{
				if(LeUtils.containsCaseInsensitive(array, value))
				{
					result = false;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * @callback LeUtils~__eachCallback
	 * @param {*} value
	 * @param {*} index
	 */
	/**
	 * Loops through each element in the given array or object, and calls the callback for each element.
	 *
	 * @param {*[]|object|Function} elements
	 * @param {LeUtils~__eachCallback} callback
	 * @param {boolean} [optionalSkipHasOwnPropertyCheck]
	 * @returns {*[]|object|Function}
	 */
	each:
		(elements, callback, optionalSkipHasOwnPropertyCheck = false) =>
		{
			if((elements !== null) && (typeof elements !== 'undefined'))
			{
				if(Array.isArray(elements))
				{
					for(let index = 0; index < elements.length; index++)
					{
						if(callback.call(elements[index], elements[index], index) === false)
						{
							break;
						}
					}
				}
				else if((typeof elements === 'object') || (typeof elements === 'function'))
				{
					for(let index in elements)
					{
						if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(elements, index))
						{
							if(callback.call(elements[index], elements[index], index) === false)
							{
								break;
							}
						}
					}
				}
				else
				{
					console.warn('Executed LeUtils.each() on an invalid type: [' + (typeof elements) + ']', elements);
				}
			}
			return elements;
		},
	
	/**
	 * Like LeUtils.each(), except that it expects an async callback.
	 *
	 * @param {*[]|object|function} elements
	 * @param {LeUtils~__eachCallback} asyncCallback
	 * @param {number} [optionalParallelCount]
	 * @param {boolean} [optionalSkipHasOwnPropertyCheck]
	 * @returns {*[]|object|function}
	 */
	eachAsync:
		(() =>
		{
			const eachAsyncParallel = async (elements, asyncCallback, optionalParallelCount, optionalSkipHasOwnPropertyCheck) =>
			{
				let promises = [];
				let doBreak = false;
				await LeUtils.eachAsync(elements, async (element, index) =>
				{
					while(promises.length > optionalParallelCount)
					{
						let newPromises = [];
						LeUtils.each(promises, (promise) =>
						{
							if(!promise.__lowentry_utils__promise_is_done__)
							{
								newPromises.push(promise);
							}
						});
						promises = newPromises;
						if(promises.length > optionalParallelCount)
						{
							await Promise.any(promises);
						}
					}
					
					if(doBreak)
					{
						return false;
					}
					
					const promise = (async () =>
					{
						if((await asyncCallback.call(element, element, index)) === false)
						{
							doBreak = true;
						}
						promise.__lowentry_utils__promise_is_done__ = true;
					})();
					promises.push(promise);
				}, optionalSkipHasOwnPropertyCheck);
				await Promise.all(promises);
				return elements;
			};
			
			return async (elements, asyncCallback, parallelCount = 1, optionalSkipHasOwnPropertyCheck = false) =>
			{
				if((elements !== null) && (typeof elements !== 'undefined'))
				{
					parallelCount = INT_LAX(parallelCount);
					if(parallelCount > 1)
					{
						return await eachAsyncParallel(elements, asyncCallback, parallelCount, optionalSkipHasOwnPropertyCheck);
					}
					
					if(Array.isArray(elements))
					{
						for(let index = 0; index < elements.length; index++)
						{
							if((await asyncCallback.call(elements[index], elements[index], index)) === false)
							{
								break;
							}
						}
					}
					else if((typeof elements === 'object') || (typeof elements === 'function'))
					{
						for(let index in elements)
						{
							if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(elements, index))
							{
								if((await asyncCallback.call(elements[index], elements[index], index)) === false)
								{
									break;
								}
							}
						}
					}
					else
					{
						console.warn('Executed LeUtils.eachAsync() on an invalid type: [' + (typeof elements) + ']', elements);
					}
				}
				return elements;
			};
		})(),
	
	/**
	 * @callback LeUtils~__filterCallback
	 * @param {*} value
	 * @param {*} index
	 */
	/**
	 * Loops through the given elements, and returns a new array or object, with only the elements that didn't return false from the callback.
	 *
	 * @param {*[]|object|Function} elements
	 * @param {LeUtils~__filterCallback} callback
	 * @param {boolean} [optionalSkipHasOwnPropertyCheck]
	 * @returns {*[]|object|Function}
	 */
	filter:
		(elements, callback, optionalSkipHasOwnPropertyCheck = false) =>
		{
			if((elements !== null) && (typeof elements !== 'undefined'))
			{
				if(Array.isArray(elements))
				{
					let result = [];
					for(let index = 0; index < elements.length; index++)
					{
						if(callback.call(elements[index], elements[index], index) !== false)
						{
							result.push(elements[index]);
						}
					}
					return result;
				}
				else if((typeof elements === 'object') || (typeof elements === 'function'))
				{
					let result = {};
					for(let index in elements)
					{
						if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(elements, index))
						{
							if(callback.call(elements[index], elements[index], index) !== false)
							{
								result[index] = elements[index];
							}
						}
					}
					return result;
				}
				else
				{
					console.warn('Executed LeUtils.filter() on an invalid type: [' + (typeof elements) + ']', elements);
				}
			}
			return elements;
		},
	
	/**
	 * @callback LeUtils~__mapCallback
	 * @param {*} value
	 * @param {*} index
	 */
	/**
	 * Loops through the given elements, and returns a new array or object, with the elements that were returned from the callback.
	 *
	 * @param {*[]|object|Function} elements
	 * @param {LeUtils~__mapCallback} callback
	 * @param {boolean} [optionalSkipHasOwnPropertyCheck]
	 * @returns {*[]|object|Function}
	 */
	map:
		(elements, callback, optionalSkipHasOwnPropertyCheck = false) =>
		{
			if((elements !== null) && (typeof elements !== 'undefined'))
			{
				if(Array.isArray(elements))
				{
					let result = [];
					for(let index = 0; index < elements.length; index++)
					{
						result[index] = callback.call(elements[index], elements[index], index);
					}
					return result;
				}
				else if((typeof elements === 'object') || (typeof elements === 'function'))
				{
					let result = {};
					for(let index in elements)
					{
						if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(elements, index))
						{
							result[index] = callback.call(elements[index], elements[index], index);
						}
					}
					return result;
				}
				else
				{
					console.warn('Executed LeUtils.map() on an invalid type: [' + (typeof elements) + ']', elements);
				}
			}
			return elements;
		},
	
	/**
	 * @callback LeUtils~__mapToArrayCallback
	 * @param {*} value
	 * @param {*} index
	 */
	/**
	 * Loops through the given elements, and returns a new array, with the elements that were returned from the callback. Always returns an array.
	 *
	 * @param {*[]|object|Function} elements
	 * @param {LeUtils~__mapToArrayCallback} callback
	 * @param {boolean} [optionalSkipHasOwnPropertyCheck]
	 * @returns {*[]}
	 */
	mapToArray:
		(elements, callback, optionalSkipHasOwnPropertyCheck = false) =>
		{
			let result = [];
			if((elements !== null) && (typeof elements !== 'undefined'))
			{
				if(Array.isArray(elements))
				{
					for(let index = 0; index < elements.length; index++)
					{
						result.push(callback.call(elements[index], elements[index], index));
					}
				}
				else if((typeof elements === 'object') || (typeof elements === 'function'))
				{
					for(let index in elements)
					{
						if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(elements, index))
						{
							result.push(callback.call(elements[index], elements[index], index));
						}
					}
				}
				else
				{
					console.warn('Executed LeUtils.mapToArray() on an invalid type: [' + (typeof elements) + ']', elements);
				}
			}
			return result;
		},
	
	/**
	 * @callback LeUtils~__mapToArraySortedCallback
	 * @param {*} value
	 * @param {*} index
	 */
	/**
	 * Loops through the given elements, and returns a new array, with the elements that were returned from the callback. The elements will be sorted by the result from the given comparator. Always returns an array.
	 *
	 * @param {*[]|object|Function} elements
	 * @param {LeUtils~__sortKeysComparatorCallback} comparator
	 * @param {LeUtils~__mapToArraySortedCallback} callback
	 * @param {boolean} [optionalSkipHasOwnPropertyCheck]
	 * @returns {*[]}
	 */
	mapToArraySorted:
		(elements, comparator, callback, optionalSkipHasOwnPropertyCheck = false) =>
		{
			const keys = LeUtils.sortKeys(elements, comparator, optionalSkipHasOwnPropertyCheck);
			let result = [];
			for(let i = 0; i < keys.length; i++)
			{
				result.push(callback.call(elements[keys[i]], elements[keys[i]], keys[i]));
			}
			return result;
		},
	
	/**
	 * @callback LeUtils~__sortKeysComparatorCallback
	 * @param {*} elementA
	 * @param {*} elementB
	 */
	/**
	 * Loops through the given elements, and returns a new array, with the keys from the given elements, sorted by the result from the given comparator. Always returns an array.
	 *
	 * @param {*[]|object|Function} elements
	 * @param {LeUtils~__sortKeysComparatorCallback} comparator
	 * @param {boolean} [optionalSkipHasOwnPropertyCheck]
	 * @returns {*[]}
	 */
	sortKeys:
		(elements, comparator, optionalSkipHasOwnPropertyCheck = false) =>
		{
			let keys = [];
			if((elements !== null) && (typeof elements !== 'undefined'))
			{
				if(Array.isArray(elements))
				{
					for(let index = 0; index < elements.length; index++)
					{
						keys.push(index);
					}
				}
				else if((typeof elements === 'object') || (typeof elements === 'function'))
				{
					for(let index in elements)
					{
						if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(elements, index))
						{
							keys.push(index);
						}
					}
				}
				else
				{
					console.warn('Executed LeUtils.sortKeys() on an invalid type: [' + (typeof elements) + ']', elements);
				}
			}
			keys.sort((a, b) => comparator(elements[a], elements[b]));
			return keys;
		},
	
	/**
	 * Turns the given value(s) into a 1 dimensional array.
	 *
	 * Does the same thing as Array.flat(Infinity).
	 *
	 * @param {*} array
	 * @returns {*[]}
	 */
	flattenArray:
		(() =>
		{
			const flattenArrayRecursive = (result, array) =>
			{
				if(!Array.isArray(array))
				{
					result.push(array);
					return;
				}
				array.forEach((entry) =>
				{
					flattenArrayRecursive(result, entry);
				});
			};
			
			return (array) =>
			{
				if(!Array.isArray(array))
				{
					return [array];
				}
				let result = [];
				array.forEach((entry) =>
				{
					flattenArrayRecursive(result, entry);
				});
				return result;
			};
		})(),
	
	/**
	 * Compares two values. Primarily used for sorting.
	 *
	 * @param {*} a
	 * @param {*} b
	 * @returns {number}
	 */
	compare:
		(a, b) =>
		{
			if(a < b)
			{
				return -1;
			}
			if(a > b)
			{
				return 1;
			}
			return 0;
		},
	
	/**
	 * Compares two numbers. Primarily used for sorting.
	 *
	 * @param {number} a
	 * @param {number} b
	 * @returns {number}
	 */
	compareNumbers:
		(a, b) => a - b,
	
	/**
	 * Compares two numeric strings. Primarily used for sorting.
	 *
	 * @param {string|number} a
	 * @param {string|number} b
	 * @returns {number}
	 */
	compareNumericStrings:
		(a, b) =>
		{
			a = STRING(a).trim();
			b = STRING(b).trim();
			if(a.length === b.length)
			{
				return (a < b) ? -1 : ((a > b) ? 1 : 0);
			}
			return (a.length < b.length) ? -1 : 1;
		},
	
	/**
	 * Returns true if the given object is empty, false otherwise.
	 *
	 * @param {object} obj
	 * @param [optionalSkipHasOwnPropertyCheck]
	 * @returns {boolean}
	 */
	isEmptyObject:
		(obj, optionalSkipHasOwnPropertyCheck = false) =>
		{
			for(let field in obj)
			{
				if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(obj, field))
				{
					return false;
				}
			}
			return true;
		},
	
	/**
	 * Returns the number of fields in the given object.
	 *
	 * @param {object} obj
	 * @param [optionalSkipHasOwnPropertyCheck]
	 * @returns {number}
	 */
	getObjectFieldsCount:
		(obj, optionalSkipHasOwnPropertyCheck = false) =>
		{
			let count = 0;
			for(let field in obj)
			{
				if((optionalSkipHasOwnPropertyCheck === true) || Object.prototype.hasOwnProperty.call(obj, field))
				{
					count++;
				}
			}
			return count;
		},
	
	/**
	 * Returns true if the given function is a generator function (like: "function* (){}"), returns false otherwise.
	 *
	 * @param {Function} func
	 * @returns {boolean}
	 */
	isGeneratorFunction:
		(() =>
		{
			const GeneratorFunction = function* ()
			{
			}.constructor;
			
			const AsyncGeneratorFunction = async function* ()
			{
			}.constructor;
			
			const RegularFunction = function()
			{
			}.constructor;
			
			const PossibleGeneratorFunctionNames = Array.from(new Set(['GeneratorFunction', 'AsyncFunction', 'AsyncGeneratorFunction', GeneratorFunction.name, GeneratorFunction.displayName, AsyncGeneratorFunction.name, AsyncGeneratorFunction.displayName])).filter((element) =>
			{
				return (element && (element !== RegularFunction.name) && (element !== RegularFunction.displayName));
			});
			
			return (func) =>
			{
				if(!func)
				{
					return false;
				}
				const constructor = func.constructor;
				if(!constructor)
				{
					return false;
				}
				return ((constructor.name && PossibleGeneratorFunctionNames.includes(constructor.name)) || (constructor.displayName && PossibleGeneratorFunctionNames.includes(constructor.displayName)));
			};
		})(),
	
	/**
	 * @callback LeUtils~__setTimeoutCallback
	 * @param {number} deltaTime
	 */
	/**
	 * Executes the callback after the given number of milliseconds. Passes the elapsed time in seconds to the callback.
	 *
	 * To cancel the timeout, call remove() on the result of this function (example: "const timeoutHandler = LeUtils.setTimeout((deltaTime)=>{}, 1000); timeoutHandler.remove();")
	 *
	 * @param {LeUtils~__setTimeoutCallback} callback ([number] deltaTime)
	 * @param {number} ms
	 * @returns {{remove:Function}}
	 */
	setTimeout:
		(callback, ms) =>
		{
			ms = FLOAT_LAX(ms);
			
			let lastTime = performance.now();
			let handler = setTimeout(() =>
			{
				const currentTime = performance.now();
				try
				{
					callback((currentTime - lastTime) / 1000);
				}
				catch(e)
				{
					console.error(e);
				}
				lastTime = currentTime;
			}, ms);
			
			return {
				remove:
					() =>
					{
						if(handler !== null)
						{
							clearTimeout(handler);
							handler = null;
						}
					},
			};
		},
	
	/**
	 * @callback LeUtils~__setIntervalCallback
	 * @param {number} deltaTime
	 */
	/**
	 * Executes the callback every given number of milliseconds. Passes the time difference in seconds between the last frame and now to it.
	 *
	 * To remove the interval, call remove() on the result of this function (example: "const intervalHandler = LeUtils.setInterval((deltaTime)=>{}, 1000); intervalHandler.remove();")
	 *
	 * @param {LeUtils~__setIntervalCallback} callback ([number] deltaTime)
	 * @param {number} [intervalMs]
	 * @param {boolean} [fireImmediately]
	 * @returns {{remove:Function}}
	 */
	setInterval:
		(callback, intervalMs = 1000, fireImmediately = false) =>
		{
			intervalMs = FLOAT_LAX_ANY(intervalMs, 1000);
			
			if(fireImmediately)
			{
				try
				{
					callback(0);
				}
				catch(e)
				{
					console.error(e);
				}
			}
			
			let lastTime = performance.now();
			let handler = setInterval(() =>
			{
				const currentTime = performance.now();
				try
				{
					callback((currentTime - lastTime) / 1000);
				}
				catch(e)
				{
					console.error(e);
				}
				lastTime = currentTime;
			}, intervalMs);
			
			return {
				remove:
					() =>
					{
						if(handler !== null)
						{
							clearInterval(handler);
							handler = null;
						}
					},
			};
		},
	
	/**
	 * @callback LeUtils~__setAnimationFrameTimeoutCallback
	 * @param {number} deltaTime
	 */
	/**
	 * Executes the callback after the given number of frames. Passes the elapsed time in seconds to the callback.
	 *
	 * To cancel the timeout, call remove() on the result of this function (example: "const timeoutHandler = LeUtils.setAnimationFrameTimeout((deltaTime){}, 5); timeoutHandler.remove();")
	 *
	 * @param {LeUtils~__setAnimationFrameTimeoutCallback} callback ([number] deltaTime)
	 * @param {number} [frames]
	 * @returns {{remove:Function}}
	 */
	setAnimationFrameTimeout:
		(callback, frames = 1) =>
		{
			frames = INT_LAX_ANY(frames, 1);
			
			let run = true;
			let requestAnimationFrameId = null;
			let lastTime = performance.now();
			const tick = () =>
			{
				if(run)
				{
					if(frames <= 0)
					{
						run = false;
						requestAnimationFrameId = null;
						const currentTime = performance.now();
						try
						{
							callback((currentTime - lastTime) / 1000);
						}
						catch(e)
						{
							console.error(e);
						}
						lastTime = currentTime;
						return;
					}
					frames--;
					requestAnimationFrameId = (typeof window === 'undefined') ? setTimeout(tick, 1000 / 60) : requestAnimationFrame(tick);
				}
			};
			tick();
			
			return {
				remove:
					() =>
					{
						run = false;
						if(requestAnimationFrameId !== null)
						{
							(typeof window === 'undefined') ? clearTimeout(requestAnimationFrameId) : cancelAnimationFrame(requestAnimationFrameId);
							requestAnimationFrameId = null;
						}
					},
			};
		},
	
	/**
	 * @callback LeUtils~__setAnimationFrameIntervalCallback
	 * @param {number} deltaTime
	 */
	/**
	 * Executes the callback every given number of frames. Passes the time difference in seconds between the last frame and now to it.
	 *
	 * To remove the interval, call remove() on the result of this function (example: "const intervalHandler = LeUtils.setAnimationFrameInterval((deltaTime)=>{}, 5); intervalHandler.remove();")
	 *
	 * @param {LeUtils~__setAnimationFrameIntervalCallback} callback ([number] deltaTime)
	 * @param {number} [intervalFrames]
	 * @param {boolean} [fireImmediately]
	 * @returns {{remove:Function}}
	 */
	setAnimationFrameInterval:
		(callback, intervalFrames = 1, fireImmediately = false) =>
		{
			intervalFrames = INT_LAX_ANY(intervalFrames, 1);
			
			if(fireImmediately)
			{
				try
				{
					callback(0);
				}
				catch(e)
				{
					console.error(e);
				}
			}
			
			let run = true;
			let requestAnimationFrameId = null;
			let lastTime = performance.now();
			let frames = intervalFrames;
			const tick = () =>
			{
				if(run)
				{
					if(frames <= 0)
					{
						let currentTime = performance.now();
						try
						{
							callback((currentTime - lastTime) / 1000);
						}
						catch(e)
						{
							console.error(e);
						}
						lastTime = currentTime;
						frames = intervalFrames;
					}
					frames--;
					
					if(run)
					{
						requestAnimationFrameId = (typeof window === 'undefined') ? setTimeout(tick, 1000 / 60) : requestAnimationFrame(tick);
					}
				}
			};
			(typeof window === 'undefined') ? setTimeout(tick, 1000 / 60) : requestAnimationFrame(tick);
			
			return {
				remove:
					() =>
					{
						run = false;
						if(requestAnimationFrameId !== null)
						{
							(typeof window === 'undefined') ? clearTimeout(requestAnimationFrameId) : cancelAnimationFrame(requestAnimationFrameId);
							requestAnimationFrameId = null;
						}
					},
			};
		},
	
	/**
	 * Returns a promise, which will be resolved after the given number of milliseconds.
	 *
	 * @param {number} ms
	 * @returns {Promise}
	 */
	promiseTimeout:
		(ms) =>
		{
			ms = FLOAT_LAX(ms);
			if(ms <= 0)
			{
				return new Promise(resolve => resolve());
			}
			return new Promise(resolve => setTimeout(resolve, ms));
		},
	
	/**
	 * Returns a promise, which will be resolved after the given number of frames.
	 *
	 * @param {number} frames
	 * @returns {Promise}
	 */
	promiseAnimationFrameTimeout:
		(frames) =>
		{
			frames = INT_LAX(frames);
			if(frames <= 0)
			{
				return new Promise(resolve => resolve());
			}
			return new Promise(resolve => LeUtils.setAnimationFrameTimeout(resolve, frames));
		},
	
	/**
	 * Returns true if the user is on a smartphone device (mobile).
	 * Will return false if the user is on a tablet or on a desktop.
	 *
	 * In short:
	 * - Mobile: True
	 * - Tablet: False
	 * - Desktop: False
	 *
	 * @returns {boolean}
	 */
	platformIsMobile:
		() =>
		{
			if(typeof window === 'undefined')
			{
				return false;
			}
			// noinspection JSDeprecatedSymbols, JSUnresolvedReference
			/** navigator.userAgentData.mobile doesn't return the correct value on some platforms, so this is a work-around, code from:  http://detectmobilebrowsers.com **/
			const a = STRING(window.navigator?.userAgent || window.navigator?.vendor || window.opera || '');
			const b = a.substring(0, 4);
			return !!(
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
					.test(a) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ /])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i
					.test(b)
			);
		},
	
	/**
	 * Returns true if the user has a cursor (mouse, touchpad, etc).
	 * In this context, a cursor is defined as an input device that can hover over elements without necessarily interacting with them.
	 *
	 * @returns {boolean}
	 */
	platformHasCursor:
		() =>
		{
			if(typeof window === 'undefined')
			{
				return true;
			}
			return !LeUtils.platformIsMobile() && !window.matchMedia('(any-hover: none)')?.matches;
		},
	
	/**
	 * Returns the given string, with the first character capitalized.
	 *
	 * @param {String} string
	 * @returns {string}
	 */
	capitalize:
		(string) =>
		{
			string = STRING(string).trim();
			if(string.length <= 0)
			{
				return string;
			}
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
	
	/**
	 * Returns true if the given string ends with any of the given characters or words.
	 *
	 * @param {string} string
	 * @param {string|string[]} endingCharsStringOrArray
	 * @returns {boolean}
	 */
	endsWithAny:
		(string, endingCharsStringOrArray) =>
		{
			string = STRING(string);
			let endingCharsArray;
			if(Array.isArray(endingCharsStringOrArray))
			{
				endingCharsArray = endingCharsStringOrArray;
			}
			else
			{
				endingCharsArray = STRING(endingCharsStringOrArray).split('');
			}
			let result = false;
			LeUtils.each(endingCharsArray, (chars) =>
			{
				if(string.endsWith(STRING(chars)))
				{
					result = true;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Returns true if the given string starts with any of the given characters or words.
	 *
	 * @param {string} string
	 * @param {string|string[]} startingCharsStringOrArray
	 * @returns {boolean}
	 */
	startsWithAny:
		(string, startingCharsStringOrArray) =>
		{
			string = STRING(string);
			let startingCharsArray;
			if(Array.isArray(startingCharsStringOrArray))
			{
				startingCharsArray = startingCharsStringOrArray;
			}
			else
			{
				startingCharsArray = STRING(startingCharsStringOrArray).split('');
			}
			let result = false;
			LeUtils.each(startingCharsArray, (chars) =>
			{
				if(string.startsWith(STRING(chars)))
				{
					result = true;
					return false;
				}
			});
			return result;
		},
	
	/**
	 * Trims the end of the given string, by removing the given characters from it.
	 *
	 * @param {string} string
	 * @param {string|string[]} trimCharsStringOrArray
	 */
	trimEnd:
		(string, trimCharsStringOrArray) =>
		{
			string = STRING(string);
			let endingCharsArray;
			if(Array.isArray(trimCharsStringOrArray))
			{
				endingCharsArray = trimCharsStringOrArray;
			}
			else
			{
				endingCharsArray = STRING(trimCharsStringOrArray).split('');
			}
			const trimChars = (chars) =>
			{
				chars = STRING(chars);
				if(string.endsWith(chars))
				{
					string = string.substring(0, string.length - chars.length);
					run = true;
				}
			};
			let run = true;
			while(run)
			{
				run = false;
				LeUtils.each(endingCharsArray, trimChars);
			}
			return string;
		},
	
	/**
	 * Trims the start of the given string, by removing the given characters from it.
	 *
	 * @param {string} string
	 * @param {string|string[]} trimCharsStringOrArray
	 */
	trimStart:
		(string, trimCharsStringOrArray) =>
		{
			string = STRING(string);
			let startingCharsArray;
			if(Array.isArray(trimCharsStringOrArray))
			{
				startingCharsArray = trimCharsStringOrArray;
			}
			else
			{
				startingCharsArray = STRING(trimCharsStringOrArray).split('');
			}
			const trimChars = (chars) =>
			{
				chars = STRING(chars);
				if(string.startsWith(chars))
				{
					string = string.substring(chars.length);
					run = true;
				}
			};
			let run = true;
			while(run)
			{
				run = false;
				LeUtils.each(startingCharsArray, trimChars);
			}
			return string;
		},
	
	/**
	 * Trims the start and end of the given string, by removing the given characters from it.
	 *
	 * @param {string} string
	 * @param {string|string[]} trimCharsStringOrArray
	 */
	trim:
		(string, trimCharsStringOrArray) => LeUtils.trimEnd(LeUtils.trimStart(string, trimCharsStringOrArray), trimCharsStringOrArray),
	
	/**
	 * Returns the given string, trims the start and end, and makes sure it ends with a valid sentence ending character (such as !?;.).
	 *
	 * @param {string} sentence
	 * @returns {string}
	 */
	purgeSentence:
		(sentence) =>
		{
			sentence = LeUtils.trimEnd(STRING(sentence).trim(), '.: \r\n\t');
			sentence += (LeUtils.endsWithAny(sentence, '!?;') ? '' : '.');
			return sentence;
		},
	
	/**
	 * Attempts to obtain and return an error message from the given error, regardless of what is passed to this function.
	 *
	 * @param {*} error
	 * @returns {string}
	 */
	purgeErrorMessage:
		(error) =>
		{
			const message = STRING(((typeof error === 'string') ? error : (error.message ?? JSON.stringify(error))));
			const messageParts = message.split('threw an error:');
			return messageParts[messageParts.length - 1].trim();
		},
	
	/**
	 * Increases the given numeric string by 1, this allows you to increase a numeric string without a limit.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	increaseNumericStringByOne:
		(string) =>
		{
			if(typeof string !== 'string')
			{
				string = '' + string;
				for(let i = string.length - 1; i >= 0; i--)
				{
					const c = string.charAt(i);
					if((c < '0') || (c > '9'))
					{
						return '1';
					}
				}
			}
			if(string === '')
			{
				return '1';
			}
			for(let i = string.length - 1; i >= 0; i--)
			{
				let c = string.charAt(i);
				if((c < '0') || (c > '9'))
				{
					return '1';
				}
				if(c < '9')
				{
					c++;
					string = string.substring(0, i) + c + string.substring(i + 1);// string[i] = (char + 1);
					break;
				}
				string = string.substring(0, i) + '0' + string.substring(i + 1);// string[i] = '0';
			}
			if(string.charAt(0) === '0')
			{
				string = '1' + string;
			}
			return string;
		},
	
	/**
	 * Generates a string that is guaranteed to be unique (across the entire frontend).
	 *
	 * @returns {string}
	 */
	uniqueId:
		(() =>
		{
			let previousUniqueIdsTime = null;
			let previousUniqueIds = {};
			
			const generateUniqueId = () =>
			{
				let now;
				try
				{
					// noinspection JSDeprecatedSymbols
					now = (performance.timeOrigin || performance.timing.navigationStart) + performance.now();
					if(typeof now !== 'number')
					{
						throw new Error();
					}
				}
				catch(e)
				{
					now = (Date.now ? Date.now() : (new Date()).getTime());
				}
				
				return {
					time:now,
					id:  (now + '_' + (Math.random() + '').substring(2)).replace(/\D/g, '_'),
				};
			};
			
			return () =>
			{
				while(true)
				{
					const result = generateUniqueId();
					if(previousUniqueIdsTime !== result.time)
					{
						previousUniqueIdsTime = result.time;
						previousUniqueIds = {[result.id]:true};
						return result.id;
					}
					else if(previousUniqueIds[result.id] !== true)
					{
						previousUniqueIds[result.id] = true;
						return result.id;
					}
				}
			};
		})(),
	
	/**
	 * Returns a data URL of a 1x1 transparent pixel.
	 *
	 * @returns {string}
	 */
	getEmptyImageSrc:
		() =>
		{
			// noinspection SpellCheckingInspection
			return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
		},
	
	/**
	 * Calculates and returns the percentage of the part and total ((part / total) * 100).
	 *
	 * @param {number|string} part
	 * @param {number|string} total
	 * @returns {number}
	 */
	getPercentage:
		(part, total) =>
		{
			part = FLOAT_LAX(part);
			total = FLOAT_LAX(total);
			if(total <= 0)
			{
				return 100;
			}
			return Math.max(0, Math.min(100, ((part / total) * 100)));
		},
	
	/**
	 * Returns the pixels of the given Image object.
	 *
	 * @param {HTMLImageElement} image
	 * @returns {Uint8ClampedArray}
	 */
	getImagePixels:
		(image) =>
		{
			if(!document)
			{
				return new Uint8ClampedArray();
			}
			const canvas = document.createElement('canvas');
			document.body.appendChild(canvas);
			try
			{
				const ctx = canvas.getContext('2d');
				const width = Math.floor(image.width);
				const height = Math.floor(image.height);
				if((width <= 0) || (height <= 0))
				{
					canvas.width = 1;
					canvas.height = 1;
				}
				else
				{
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				}
				return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
			}
			finally
			{
				canvas.parentNode.removeChild(canvas);
			}
		},
	
	/**
	 * Returns the data URL (mimetype "image/png") of a colored version of the given Image object.
	 *
	 * @param {HTMLImageElement} image
	 * @param {string} color
	 * @returns {string}
	 */
	getColoredImage:
		(image, color) =>
		{
			if(!document)
			{
				return LeUtils.getEmptyImageSrc();
			}
			const canvas = document.createElement('canvas');
			document.body.appendChild(canvas);
			try
			{
				const ctx = canvas.getContext('2d');
				const width = Math.floor(image.width);
				const height = Math.floor(image.height);
				if((width <= 0) || (height <= 0))
				{
					canvas.width = 1;
					canvas.height = 1;
				}
				else
				{
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				}
				ctx.globalCompositeOperation = 'source-in';
				ctx.fillStyle = color;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				return canvas.toDataURL('image/png');
			}
			finally
			{
				canvas.parentNode.removeChild(canvas);
			}
		},
	
	/**
	 * Returns the hex color of the given RGB(A).
	 *
	 * @param {number[]} rgb
	 * @returns {string}
	 */
	rgbToHex:
		(rgb) =>
		{
			return '#' + rgb.map((x) =>
			{
				const hex = x.toString(16);
				return ((hex.length === 1) ? '0' + hex : hex);
			}).join('');
		},
	
	/**
	 * Returns the Lab of the given RGB.
	 *
	 * @param {number[]} rgb
	 * @returns {number[]}
	 */
	rgbToLab:
		(rgb) =>
		{
			let r = rgb[0] / 255;
			let g = rgb[1] / 255;
			let b = rgb[2] / 255;
			r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
			g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
			b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
			let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
			let y = (r * 0.2126 + g * 0.7152 + b * 0.0722);
			let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
			x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
			y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
			z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
			return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
		},
	
	/**
	 * Returns the HSL(A) of the given RGB(A).
	 *
	 * @param {number[]} rgb
	 * @returns {number[]}
	 */
	rgbToHsl:
		(rgb) =>
		{
			const r = rgb[0] / 255;
			const g = rgb[1] / 255;
			const b = rgb[2] / 255;
			
			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
			let h, s, l = (max + min) / 2;
			
			if(max === min)
			{
				h = s = 0;
			}
			else
			{
				const d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max)
				{
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
				}
				h /= 6;
			}
			
			if(rgb.length >= 4)
			{
				return [h, s, l, rgb[3] / 255];
			}
			return [h, s, l];
		},
	
	/**
	 * Returns the difference (calculated with DeltaE) of the Lab values of the given RGB values.
	 *
	 * Returns a number:
	 *
	 * <pre>
	 *   < 1.0    is not perceptible by human eyes
	 *     1-2    is perceptible through close observation
	 *     2-10   is perceptible at a glance
	 *     11-49  is more similar than opposite
	 *     100    is exactly the opposite color
	 * </pre>
	 *
	 * @param {number[]} rgbA
	 * @param {number[]} rgbB
	 * @returns {number}
	 */
	getDifferenceBetweenRgb:
		(rgbA, rgbB) =>
		{
			const labA = LeUtils.rgbToLab(rgbA);
			const labB = LeUtils.rgbToLab(rgbB);
			return LeUtils.getDifferenceBetweenLab(labA, labB);
		},
	
	/**
	 * Returns the difference (calculated with DeltaE) of the given Lab values.
	 *
	 * Returns a number:
	 *
	 * <pre>
	 *   < 1.0    is not perceptible by human eyes
	 *     1-2    is perceptible through close observation
	 *     2-10   is perceptible at a glance
	 *     11-49  is more similar than opposite
	 *     100    is exactly the opposite color
	 * </pre>
	 *
	 * @param {number[]} labA
	 * @param {number[]} labB
	 * @returns {number}
	 */
	getDifferenceBetweenLab:
		(labA, labB) =>
		{
			const deltaL = labA[0] - labB[0];
			const deltaA = labA[1] - labB[1];
			const deltaB = labA[2] - labB[2];
			const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
			const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
			const deltaC = c1 - c2;
			let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
			deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
			const sc = 1.0 + 0.045 * c1;
			const sh = 1.0 + 0.015 * c1;
			const deltaLKlsl = deltaL / (1.0);
			const deltaCkcsc = deltaC / (sc);
			const deltaHkhsh = deltaH / (sh);
			const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
			return i < 0 ? 0 : Math.sqrt(i);
		},
	
	/**
	 * Returns the RGB(A) of the given RGB(A) values, based on the given percentage (0-100).
	 * This allows you to define a gradient of colors to fade in between, rather than just having a start and an end color.
	 *
	 * Usage:
	 *
	 * <pre>
	 * LeUtils.getRgbOfGradient({
	 *   0:  [255, 0,   0],
	 *   33: [255, 255, 0],
	 *   66: [0,   255, 0],
	 *   100:[0,   255, 255],
	 * }, 45.1234);
	 * </pre>
	 *
	 * @param {{[percentage]: number[]}} gradient
	 * @param {number} percentage
	 * @returns {number[]}
	 */
	getRgbOfGradient:
		(gradient, percentage) =>
		{
			percentage = Math.max(0, Math.min(100, FLOAT_LAX(percentage)));
			
			let closest = null;
			LeUtils.each(gradient, (color, percent) =>
			{
				percent = INT_LAX(percent);
				if(closest === null)
				{
					closest = [percent, Math.abs(percentage - percent)];
				}
				else
				{
					const difference = Math.abs(percentage - percent);
					if(difference < closest[1])
					{
						closest = [percent, difference];
					}
				}
			});
			if(closest === null)
			{
				return null;
			}
			closest = closest[0];
			
			let higher = 99999;
			let lower = -99999;
			LeUtils.each(gradient, (color, percent) =>
			{
				percent = INT_LAX(percent);
				if(percent < closest)
				{
					if(percent > lower)
					{
						lower = percent;
					}
				}
				if(percent > closest)
				{
					if(percent < higher)
					{
						higher = percent;
					}
				}
			});
			if(higher === 99999)
			{
				higher = null;
			}
			if(lower === -99999)
			{
				lower = null;
			}
			
			if(((higher === null) && (lower === null)) || (higher === lower))
			{
				return gradient[closest];
			}
			else if((higher !== null) && (lower !== null))
			{
				const higherDifference = Math.abs(higher - percentage);
				const lowerDifference = Math.abs(percentage - lower);
				if(higherDifference > lowerDifference)
				{
					higher = closest;
				}
				else
				{
					lower = closest;
				}
			}
			else if(lower === null)
			{
				lower = closest;
			}
			else
			{
				higher = closest;
			}
			
			if(lower > higher)
			{
				const tmp = higher;
				higher = lower;
				lower = tmp;
			}
			
			const total = (higher - lower);
			const part = (percentage - lower);
			return LeUtils.getRgbBetween(gradient[lower], gradient[higher], ((part / total) * 100));
		},
	
	/**
	 * Returns the RGB(A) between the two given RGB(A) values, based on the given percentage (0-100).
	 *
	 * @param {number[]} startRgb
	 * @param {number[]} endRgb
	 * @param {number} percentage
	 * @returns {number[]}
	 */
	getRgbBetween:
		(startRgb, endRgb, percentage) =>
		{
			percentage = FLOAT_LAX(percentage);
			const partEnd = Math.max(0, Math.min(1, (percentage / 100.0)));
			const partStart = (1 - partEnd);
			const length = Math.min(startRgb.length, endRgb.length);
			let result = [];
			for(let i = 0; i < length; i++)
			{
				result.push(Math.max(0, Math.min(255, Math.round((startRgb[i] * partStart) + (endRgb[i] * partEnd)))));
			}
			return result;
		},
	
	/**
	 * An implementation of the btoa function, which should work in all environments.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	btoa:
		(string) =>
		{
			if(typeof btoa === 'function')
			{
				return btoa(string);
			}
			return Buffer.from(string).toString('base64');
		},
	
	/**
	 * An implementation of the atob function, which should work in all environments.
	 *
	 * @param {string} base64string
	 * @returns {string}
	 */
	atob:
		(base64string) =>
		{
			if(typeof atob === 'function')
			{
				return atob(base64string);
			}
			return Buffer.from(base64string, 'base64').toString();
		},
	
	/**
	 * Encodes a UTF-8 string into a base64 string.
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	utf8ToBase64:
		(string) =>
		{
			return LeUtils.btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
		},
	
	/**
	 * Decodes a base64 string back into a UTF-8 string.
	 *
	 * @param {string} base64string
	 * @returns {string}
	 */
	base64ToUtf8:
		(base64string) =>
		{
			return decodeURIComponent(LeUtils.atob(base64string).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
		},
	
	/**
	 * Converts a base64 string into a hex string.
	 *
	 * @param {string} base64string
	 * @returns {string}
	 */
	base64ToHex:
		(base64string) =>
		{
			return LeUtils.atob(base64string).split('').map((c) => ('0' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
		},
	
	/**
	 * Converts a hex string into a base64 string.
	 *
	 * @param {string} hexstring
	 * @returns {string}
	 */
	hexToBase64:
		(hexstring) =>
		{
			return LeUtils.btoa(hexstring.match(/\w{2}/g).map((a) => String.fromCharCode(parseInt(a, 16))).join(''));
		},
	
	/**
	 * Converts a base64 string into bytes (Uint8Array).
	 *
	 * @param {string} base64string
	 * @returns {Uint8Array}
	 */
	base64ToBytes:
		(base64string) =>
		{
			const binary = LeUtils.atob(base64string);
			const len = binary.length;
			let data = new Uint8Array(len);
			for(let i = 0; i < len; i++)
			{
				data[i] = binary.charCodeAt(i);
			}
			return data;
		},
	
	/**
	 * Converts bytes into a base64 string.
	 *
	 * @param {ArrayLike<number>|ArrayBufferLike} arraybuffer
	 * @returns {string}
	 */
	bytesToBase64:
		(arraybuffer) =>
		{
			const bytes = new Uint8Array(arraybuffer);
			const len = bytes.byteLength;
			let binary = '';
			for(let i = 0; i < len; i++)
			{
				binary += String.fromCharCode(bytes[i]);
			}
			return LeUtils.btoa(binary);
		},
	
	/**
	 * Loads the value from the browser, returns undefined if the value doesn't exist.
	 *
	 * @param {string} id
	 * @returns {*}
	 */
	localStorageGet:
		(id) =>
		{
			if(typeof window === 'undefined')
			{
				return;
			}
			let result = window.localStorage.getItem('LeUtils_' + id);
			if(typeof result !== 'string')
			{
				return;
			}
			try
			{
				result = JSON.parse(result);
				if(typeof result['-'] !== 'undefined')
				{
					return result['-'];
				}
			}
			catch(e)
			{
			}
		},
	
	/**
	 * Saves the given data in the browser.
	 *
	 * @param {string} id
	 * @param {*} data
	 */
	localStorageSet:
		(id, data) =>
		{
			if(typeof window === 'undefined')
			{
				return;
			}
			if(typeof data === 'undefined')
			{
				window.localStorage.removeItem('LeUtils_' + id);
				return;
			}
			window.localStorage.setItem('LeUtils_' + id, JSON.stringify({'-':data}));
		},
	
	/**
	 * Removes the data from the browser.
	 *
	 * @param {string} id
	 */
	localStorageRemove:
		(id) =>
		{
			if(typeof window === 'undefined')
			{
				return;
			}
			window.localStorage.removeItem('LeUtils_' + id);
		},
};
