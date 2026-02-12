const { describe, it } = require("node:test")
const assert = require("node:assert")
const Varfield = require("../src/models/Varfield.js");
const VariantVarfield = require("../src/models/VariantVarfield.js");

describe("Varfield", () => {
  describe("type", () => {
    it("returns headings from the headings mapping", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: "Horror in art",
          },
        ],
      });
      assert.equal(varfield.type, "Topical Term");
    });
    it("returns headings from the headings mapping for marcTag 100", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "100",
        subfields: [
          {
            tag: "a",
            content: "Horror in art",
          },
        ],
      });
      assert.equal(varfield.type, "Personal Name");
    });
  });
  describe("skip adding period for special characters", () => {
    it("skips for !", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: "Horror in art!",
          },
        ],
      });
      assert.equal(varfield.label, "Horror in art!");
    })
    it("skips for ?", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: "Horror in art?",
          },
        ],
      });
      assert.equal(varfield.label, "Horror in art?");
    })
    it("skips for \"", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: 'Horror in art"',
          },
        ],
      });
      assert.equal(varfield.label, 'Horror in art"');
    })
    it("skips for ]", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: "Horror in art]",
          },
        ],
      });
      assert.equal(varfield.label, "Horror in art]");
    })
    it("skips for )", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: "Horror in art)",
          },
        ],
      });
      assert.equal(varfield.label, "Horror in art)");
    })
    it("skips for >", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: "Horror in art>",
          },
        ],
      });
      assert.equal(varfield.label, "Horror in art>");
    })
    it("skips for -", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        subfields: [
          {
            tag: "a",
            content: "Horror in art-",
          },
        ],
      });
      assert.equal(varfield.label, "Horror in art-");
    })
  })
});
