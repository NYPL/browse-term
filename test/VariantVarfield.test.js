const { describe, it } = require("node:test")
const assert = require("node:assert")
const VariantVarfield = require("../src/models/VariantVarfield.js")

describe("VariantVarfield", () => {
  describe("suppressed", () => {
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
      });
      assert.equal(variantVarfield.suppressed, true);
    });
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
      });
      assert.equal(variantVarfield.suppressed, true);
    });
    it("returns false if subfield w/3 is in do not suppressed array", () => {
      const variantVarfield = new VariantVarfield({
        fieldTag: "e",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012a",
          },
        ],
      });
      assert.equal(variantVarfield.suppressed, false);
    });
  });
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
      });
      assert.equal(variantVarfield.isBroaderTerm, true);
    });
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
      });
      assert.equal(variantVarfield.isBroaderTerm, false);
    });
  });
});
