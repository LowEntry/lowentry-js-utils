import FastDeepEqual from 'fast-deep-equal';


/**
 * A deep equals implementation (npm package "fast-deep-equal").
 *
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns true if the values are equivalent.
 */
export const EQUAL = FastDeepEqual;


/**
 * Returns true if the value is set (not undefined and not null).
 *
 * @param {*} value
 * @returns {boolean}
 */
export const ISSET = (value) => (typeof value !== 'undefined') && (value !== null);


/**
 * Returns true if the value is an array.
 *
 * @param {*} value
 * @returns {boolean}
 */
export const IS_ARRAY = (value) => Array.isArray(value);

/**
 * Ensures the given value is an array (returns the value wrapped in an array if it's not).
 *
 * @param {*} value
 * @returns {*[]}
 */
export const ARRAY = (value) => IS_ARRAY(value) ? value : ((typeof value !== 'undefined') ? [value] : []);


/**
 * Returns true if the value is an object.
 *
 * @param {*} value
 * @returns {boolean}
 */
export const IS_OBJECT = (value) => (typeof value === 'object') && (value !== null) && !Array.isArray(value);

/**
 * Ensures the given value is an object (returns an empty object if it's not).
 *
 * @param value
 * @returns {object}
 */
export const OBJECT = (value) => IS_OBJECT(value) ? value : {};


/**
 * Ensures the given value is a string (casts it to a string if it's not, null and undefined will return an empty string).
 *
 * @param {*} value
 * @returns {string}
 */
export const STRING = (value) => ISSET(value) ? ('' + value) : '';

/**
 * Returns the first non-null non-undefined value as a string.
 *
 * @param {*} values
 * @returns {string}
 */
export const STRING_ANY = (...values) =>
{
	for(let value of values)
	{
		if(ISSET(value))
		{
			return '' + value;
		}
	}
	return '';
};


/**
 * Ensures the given value is an integer (attempts to cast it to an integer if it's not, null and undefined will return 0).
 *
 * @param {*} value
 * @returns {number}
 */
export const INT = (value) => Math.round(FLOAT(value));

/**
 * Returns the first non-null non-undefined int-castable value as an integer.
 *
 * @param {*} values
 * @returns {number}
 */
export const INT_ANY = (...values) => Math.round(FLOAT_ANY(...values));


/**
 * Ensures the given value is a float (attempts to cast it to a float if it's not, null and undefined will return 0).
 *
 * @param {*} value
 * @returns {number}
 */
export const FLOAT = (value) =>
{
	const v = +value;
	if(!isNaN(v))
	{
		return v;
	}
	return 0;
};

/**
 * Returns the first non-null non-undefined float-castable value as a float.
 *
 * @param {*} values
 * @returns {number}
 */
export const FLOAT_ANY = (...values) =>
{
	for(let value of values)
	{
		if(value !== null)
		{
			const v = +value;
			if(!isNaN(v))
			{
				return v;
			}
		}
	}
	return 0;
};


/**
 * Ensures the given value is an integer (attempts to cast it to an integer if it's not, null and undefined will return 0).
 * This version is less strict than INT, as it relies on parseFloat instead of on +value, meaning that it will accept strings that contain a number followed by other characters, which +value doesn't.
 *
 * @param {*} value
 * @returns {number}
 */
export const INT_LAX = (value) => Math.round(FLOAT_LAX(value));

/**
 * Returns the first non-null non-undefined int-castable value as an integer.
 * This version is less strict than INT_ANY, as it relies on parseFloat instead of on +value, meaning that it will accept strings that contain a number followed by other characters, which +value doesn't.
 *
 * @param {*} values
 * @returns {number}
 */
export const INT_LAX_ANY = (...values) => Math.round(FLOAT_LAX_ANY(...values));


/**
 * Ensures the given value is a float (attempts to cast it to a float if it's not, null and undefined will return 0).
 * This version is less strict than FLOAT, as it relies on parseFloat instead of on +value, meaning that it will accept strings that contain a number followed by other characters, which +value doesn't.
 *
 * @param {*} value
 * @returns {number}
 */
export const FLOAT_LAX = (value) =>
{
	const v = parseFloat(value);
	if(!isNaN(v))
	{
		return v;
	}
	return 0;
};

/**
 * Returns the first non-null non-undefined float-castable value as a float.
 * This version is less strict than FLOAT_ANY, as it relies on parseFloat instead of on +value, meaning that it will accept strings that contain a number followed by other characters, which +value doesn't.
 *
 * @param {*} values
 * @returns {number}
 */
export const FLOAT_LAX_ANY = (...values) =>
{
	for(let value of values)
	{
		if(value !== null)
		{
			const v = parseFloat(value);
			if(!isNaN(v))
			{
				return v;
			}
		}
	}
	return 0;
};
