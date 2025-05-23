/**
 *  Generally usable formatting utils
 */

/**
 *  Given a hash, returns a new hash containing key-value pairs that meet:
 *   1) key must be in given `keys`
 *   2) value must by truthy
 */
export const hashByKeys = (
  hash: Record<string, string>,
  keys: string[]
): Record<string, string> => {
  const newHash: Record<string, string> = {};
  return Object.keys(hash).reduce((newHash, key) => {
    const value = hash[key];
    // If the keys requested include this key
    // .. and extracted value is truthy
    // .. include it in new hash.
    if (keys.includes(key) && value) newHash[key] = value;
    return newHash;
  }, newHash);
};

/**
 * Get array of truthy values from hash matching given keys (but only if the
 * values are truthy)
 *
 * @example
 * valuesByKeys ({ key1: 'value1', key2: 'value2', key3: null }, ['key2'])
 *   => ['value2']
 */
export const valuesByKeys = (
  hash: Record<string, string>,
  keys: string[]
): string[] => {
  hash = hashByKeys(hash, keys);
  return Object.keys(hash).map((key) => hash[key]);
};
