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
        fieldTag: "e",
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
  describe("isBroaderTerm", () => {
    it("returns true when g is present in subfield w/0", () => {
      const variantVarfield = new VariantVarfield({
        fieldTag: "f",
        marcTag: "550",
        subfields: [
          {
            tag: "w",
            content: "g",
          },
        ],
      })
      expect(variantVarfield.isBroaderTerm).to.be.true
    })
    it("returns false when g is not present in subfield w/0", () => {
      const variantVarfield = new VariantVarfield({
        fieldTag: "f",
        marcTag: "550",
        subfields: [
          {
            tag: "w",
            content: "x",
          },
        ],
      })
      expect(variantVarfield.isBroaderTerm).to.be.false
    })
  })
})