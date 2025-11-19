const { describe, it } = require("node:test")
const assert = require("node:assert")
const SubjectVariantVarfield = require("../src/models/SubjectVariantVarfield.js")

describe("SubjectVariantVarfield", () => {
  describe("suppressed", () => {
    it("returns false if there is no subfield w/3 character", () => {
      const SubjectvariantVarfield = new SubjectVariantVarfield({
        fieldTag: "d",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012",
          },
        ],
      });
      assert.equal(SubjectvariantVarfield.suppressed, false);
    });
    it("returns false if there is no subfield w/3 is n", () => {
      const SubjectvariantVarfield = new SubjectVariantVarfield({
        fieldTag: "d",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012n",
          },
        ],
      });
      assert.equal(SubjectvariantVarfield.suppressed, false);
    });
    it("returns true if subfield w/3 is in suppressed array", () => {
      const SubjectvariantVarfield = new SubjectVariantVarfield({
        fieldTag: "e",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012a",
          },
        ],
      });
      assert.equal(SubjectvariantVarfield.suppressed, true);
    });
  });
  describe("isBroaderTerm", () => {
    it("returns true when g is present in subfield w/0", () => {
      const SubjectvariantVarfield = new SubjectVariantVarfield({
        fieldTag: "f",
        marcTag: "550",
        subfields: [
          {
            tag: "w",
            content: "g",
          },
        ],
      });
      assert.equal(SubjectvariantVarfield.isBroaderTerm, true);
    });
    it("returns false when g is not present in subfield w/0", () => {
      const SubjectvariantVarfield = new SubjectVariantVarfield({
        fieldTag: "f",
        marcTag: "550",
        subfields: [
          {
            tag: "w",
            content: "x",
          },
        ],
      });
      assert.equal(SubjectvariantVarfield.isBroaderTerm, false);
    });
  });
});
