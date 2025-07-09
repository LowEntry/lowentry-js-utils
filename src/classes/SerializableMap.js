/**
 * SerializableMap class extends the native Map to provide a JSON representation.
 *
 * This class can only have string keys, as JSON does not support non-string keys.
 */
export class SerializableMap extends Map
{
	/**
	 * Returns a JSON representation of the map.
	 *
	 * @returns {Object}
	 */
	toJSON()
	{
		return Object.fromEntries(this);
	}
}
