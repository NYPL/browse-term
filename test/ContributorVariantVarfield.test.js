const { describe, it } = require("node:test")
const assert = require("node:assert")
const ContributorVariantVarfield = require("../src/models/ContributorVariantVarfield.js")

describe("ContributorVariantVarfield", () => {
  describe("suppressed", () => {
    it("returns false if there is no subfield w/3 character", () => {
      const contributorVariantVarfield = new ContributorVariantVarfield({
        fieldTag: "d",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012",
          },
        ],
      });
      assert.equal(contributorVariantVarfield.suppressed, false);
    });
    it("returns false if there is no subfield w/3 is n", () => {
      const contributorVariantVarfield = new ContributorVariantVarfield({
        fieldTag: "d",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012n",
          },
        ],
      });
      assert.equal(contributorVariantVarfield.suppressed, false);
    });
    it("returns true if subfield w/3 is in suppressed array", () => {
      const contributorVariantVarfield = new ContributorVariantVarfield({
        fieldTag: "e",
        marcTag: "450",
        subfields: [
          {
            tag: "w",
            content: "012a",
          },
        ],
      });
      assert.equal(contributorVariantVarfield.suppressed, true);
    });
  });
  describe("isBroaderTerm", () => {
    it("returns true when g is present in subfield w/0", () => {
      const contributorVariantVarfield = new ContributorVariantVarfield({
        fieldTag: "f",
        marcTag: "550",
        subfields: [
          {
            tag: "w",
            content: "g",
          },
        ],
      });
      assert.equal(contributorVariantVarfield.isBroaderTerm, true);
    });
    it("returns false when g is not present in subfield w/0", () => {
      const contributorVariantVarfield = new ContributorVariantVarfield({
        fieldTag: "f",
        marcTag: "550",
        subfields: [
          {
            tag: "w",
            content: "x",
          },
        ],
      });
      assert.equal(contributorVariantVarfield.isBroaderTerm, false);
    });
  });
});
