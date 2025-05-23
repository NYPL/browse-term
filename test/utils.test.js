import { describe, it } from "node:test";
import { firstSubfields, hashByKeys, valuesByKeys } from "../utils.ts";
import { expect } from "chai";

describe("utils", () => {
  describe("valuesBykeys", () => {
    it("returns the values by keys", () => {
      const subfields = {
        a: "a", b: "b", c: "c", x: "x", y: "y", z: "z"
      }
      const values = valuesByKeys(subfields, firstSubfields)
      expect(values).to.deep.eq(['a', 'b', 'c'])
    })
    it("skips falsey values", () => {
      const subfields = {
        a: null, b: "b", c: "c", x: "x", y: "y", z: "z"
      }
      const values = valuesByKeys(subfields, firstSubfields)
      expect(values).to.deep.eq(['b', 'c'])
    })
  })
})
