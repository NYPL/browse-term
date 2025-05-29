const { describe, it } = require("node:test")
const { valuesByKeys } = require("../src/utils.js")
const { firstSubfields } = require("../src/constants.js")
const assert = require("node:assert")

describe("utils", () => {
  describe("valuesBykeys", () => {
    it("returns the values by keys", () => {
      const subfields = {
        a: "a",
        b: "b",
        c: "c",
        x: "x",
        y: "y",
        z: "z",
      };
      const values = valuesByKeys(subfields, firstSubfields);
      assert.deepEqual(values, ["a", "b", "c"]);
    });
    it("skips falsey values", () => {
      const subfields = {
        a: null,
        b: "b",
        c: "c",
        x: "x",
        y: "y",
        z: "z",
      };
      const values = valuesByKeys(subfields, firstSubfields);
      assert.deepEqual(values, ["b", "c"]);
    });
  });
});
