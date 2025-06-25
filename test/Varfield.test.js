const { describe, it } = require("node:test")
const assert = require("node:assert")
const Varfield = require("../src/models/Varfield.js")

describe("Varfield", () => {
  describe("source", () => {
    it("is bib when given a 600 marctag", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "650",
        subfields: [
          {
            tag: "a",
            content: "Horror in art",
          },
        ],
      });
      assert.equal(varfield.source, "bib");
    });
    it("is authority when not given a 600 marctag", () => {
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
      assert.equal(varfield.source, "authority");
    });
  });
  describe("bibOnly", () => {
    it("returns false when varfield source is not bib subject", () => {
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
      assert.equal(varfield.getBibOnly(), false);
    });
    it("returns true when varfield source bib and subject source is valid local source", () => {
      const hasValidLocalSources = Varfield.prototype.hasValidLocalSources;
      Varfield.prototype.hasValidLocalSources = () => true;
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "650",
        subfields: [
          {
            tag: "a",
            content: "Horror in art",
          },
        ],
      });
      assert.equal(varfield.getBibOnly(), true);
      Varfield.prototype.hasValidLocalSources = hasValidLocalSources;
    });
    it("returns false when varfield source bib and subject source is invalid", () => {
      const hasValidLocalSources = Varfield.prototype.hasValidLocalSources;
      Varfield.prototype.hasValidLocalSources = () => false;
      const varfield = new Varfield({
        marcTag: "600",
        fieldTag: "d",
        subfields: [{ content: "Spaghetti", tag: "a" }],
      });
      assert.equal(varfield.getBibOnly(), false);
      Varfield.prototype.hasValidLocalSources = hasValidLocalSources;
    });
  });
  describe("hasValidLocalSources", () => {
    it("does not explode if there is no subfield 2", () => {
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
      // this method is called after checking if a subject comes from a bib,
      // so this return value is not relevant to Sierra authority subjects.
      assert.equal(varfield.hasValidLocalSources(), false);
    });
    it("returns true for valid source", () => {
      const bibSubject = new Varfield({
        marcTag: "600",
        fieldTag: "d",
        subfields: [
          { content: "Spaghetti", tag: "a" },
          { content: "Local", tag: "2" },
        ],
      });
      assert.equal(bibSubject.hasValidLocalSources(), true);
    });
    it("returns false for invalid source", () => {
      const bibSubject = new Varfield({
        marcTag: "600",
        fieldTag: "d",
        subfields: [
          { content: "Spaghetti", tag: "a" },
          { content: "Dollywood", tag: "2" },
        ],
      });
      assert.equal(bibSubject.hasValidLocalSources(), false);
    });
  });
  describe("label", () => {
    it("can handle a varfield with two subfields with the same tag", () => {
      const varfield = new Varfield({
        fieldTag: 'd',
        marcTag: '600',
        ind1: '0',
        ind2: '0',
        content: null,
        subfields: [{
          tag: 'z',
          content: 'subfield z 1'
        },
        {
          tag: 'z',
          content: 'subfield z 2'
        }
        ]
      })
      assert.equal(varfield.label, 'subfield z 1 -- subfield z 2')
    })
    it("returns direction zero width character when subfield six says so", () => {
      const varfield = new Varfield({
        fieldTag: "x",
        marcTag: "880",
        subfields: [{ tag: "6", content: "245-01/(2/r" }, { tag: "a", content: "spaghetti" }]
      })
      assert.equal(varfield.label, "\u200Fspaghetti")
    })
    it("puts together a label with only one subfield", () => {
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
      assert.equal(varfield.label, "Horror in art");
    });
    it("puts together a label with starting subfields and xyz subfields with dashes", () => {
      const varfield = new Varfield({
        fieldTag: "d",
        marcTag: "150",
        ind1: " ",
        ind2: " ",
        subfields: [
          {
            tag: "a",
            content: "a",
          },
          {
            tag: "b",
            content: "b",
          },
          {
            tag: "c",
            content: "c",
          },
          {
            tag: "z",
            content: "z",
          },
          {
            tag: "x",
            content: "x",
          },
        ],
      });
      assert.equal(varfield.label, "a b c -- z -- x");
    });
  });
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
});
