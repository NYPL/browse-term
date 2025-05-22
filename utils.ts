/**
 *  Generally usable formatting utils
 */

/**
 *  Given a hash, returns a new hash containing key-value pairs that meet:
 *   1) key must be in given `keys`
 *   2) value must by truthy
 */
const hashByKeys = (hash: Record<string, string>, keys: string[]): Record<string, string> => {
  const newHash: Record<string, string> = {}
  return Object.keys(hash).reduce((newHash, key) => {
    const value = hash[key]
    const valueIsTruthy = value !== undefined && value !== ''
    // If the keys requested include this key
    // .. and extracted value is truthy
    // .. include it in new hash.
    if (keys.includes(key) && valueIsTruthy) newHash[key] = value
    return newHash
  }, newHash)
}

/**
 * Get array of truthy values from hash matching given keys (but only if the
 * values are truthy)
 *
 * @example
 * valuesByKeys ({ key1: 'value1', key2: 'value2', key3: null }, ['key2'])
 *   => ['value2']
 */
export const valuesByKeys = (hash: Record<string, string>, keys: string[]): string[] => {
  hash = hashByKeys(hash, keys)
  return Object.keys(hash).map((key) => hash[key])
}

export const headings = {
  0: 'Personal Name',
  10: 'Corporate Name',
  11: 'Meeting Name',
  30: 'Uniform Title',
  47: 'Named Event',
  48: 'Chronological Term',
  50: 'Topical Term',
  51: 'Geographic Name',
  55: 'Genre/Form Term',
  62: 'Medium of Performance Term',
  80: 'General Subdivision',
  81: 'Geographic Subdivision',
  82: 'Chronological Subdivision',
  85: 'Form Subdivision'
}
