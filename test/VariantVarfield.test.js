import { describe, it } from "node:test";
import { expect } from "chai"
import VariantVarfield from "../models/VariantVarfield.ts";

describe("VariantVarfield", () => {
  describe("display", () => {
    it("returns true if there is no subfield w/3 character", () => {
      const variantVarfield = new VariantVarfield({
        fieldTag: "d",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012",
          },
        ],
      })
      expect(variantVarfield.display).to.be.true
    })
    it("returns true if there is no subfield w/3 is n", () => {
      const variantVarfield = new VariantVarfield({
        fieldTag: "d",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012n",
          },
        ],
      })
      expect(variantVarfield.display).to.be.true
    })
    it("returns false if subfield w/3 is in do not display array", () => {
      const variantVarfield = new VariantVarfield({
        fieldTag: "d",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012a",
          },
        ],
      })
      expect(variantVarfield.display).to.be.false
    })
  })
})