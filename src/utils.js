const { firstSubfields, lastSubfields } = require("./constants.js")

/**
 *  Generally usable formatting utils
 */

/**
 *  Given a hash, returns a new hash containing key-value pairs that meet:
 *   1) key must be in given `keys`
 *   2) value must by truthy
 */
const hashByKeys = (hash, keys) => {
  const newHash = {};
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
const valuesByKeys = (
  hash,
  keys
) => {
  hash = hashByKeys(hash, keys);
  return Object.keys(hash).map((key) => hash[key]);
};

const subjectLiteralFromSubfieldMap = (subfieldMap) => {
  return (
    [
      valuesByKeys(subfieldMap, firstSubfields)
        .map((v) => (Array.isArray(v) ? v.join(" ") : v))
        .join(" "),
      valuesByKeys(subfieldMap, lastSubfields)
        .map((v) => (Array.isArray(v) ? v.join(" -- ") : v))
        .join(" -- "),
    ]
      // If either set of values matched nothing, drop it:
      .filter((v) => v)
      // Join sets together with ' -- ':
      .join(" -- ")
  );
};

module.exports = {
  subjectLiteralFromSubfieldMap, hashByKeys, valuesByKeys
}