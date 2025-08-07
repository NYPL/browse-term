const { describe, it } = require("node:test")
const assert = require("node:assert")
const Varfield = require("../src/models/Varfield.js")

describe("Varfield", () => {
  describe("hasValidBibSubjectSource", () => {
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
      assert.equal(varfield.hasValidBibSubjectSource(), false);
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
      assert.equal(bibSubject.hasValidBibSubjectSource(), true);
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
      assert.equal(bibSubject.hasValidBibSubjectSource(), false);
    });
  });
  describe("suppressed", () => {
    it("suprresses a real canadian thesaurus subject", () => {
      // from cb17901782
      const varfield = new Varfield({
        "ind1": " ",
        "ind2": "6",
        "content": null,
        "marcTag": "650",
        "fieldTag": null,
        "subfields": [
          {
            "tag": "a",
            "content": "Photographes de la nature"
          },
          {
            "tag": "0",
            "content": "(CaQQLa)201-0369077"
          },
          {
            "tag": "z",
            "content": "États-Unis"
          },
        ]
      })
      assert.equal(varfield.suppress, true)
    })
    it("does not suppress empty ind2 for 1xx field", () => {
      const varfield = new Varfield({
        fieldTag: 'd',
        marcTag: '100',
        ind1: '0',
        ind2: ' ',
        content: null,
        subfields: [{
          tag: 'z',
          content: 'subfield z 1'
        }
        ]
      })
      assert.equal(varfield.suppress, false)
    })
    it("suppresses based on ind2 values", () => {
      const varfield = new Varfield({
        fieldTag: 'd',
        marcTag: '600',
        ind1: '0',
        ind2: '1',
        content: null,
        subfields: [{
          tag: 'z',
          content: 'subfield z 1'
        }
        ]
      })
      assert.equal(varfield.suppress, true)
    })
    it("does not suppress allowed ind2 values", () => {
      const varfield = new Varfield({
        fieldTag: 'd',
        marcTag: '600',
        ind1: '0',
        ind2: '0',
        content: null,
        subfields: [{
          tag: 'z',
          content: 'subfield z 1'
        }
        ]
      })
      assert.equal(varfield.suppress, false)
    })
  })
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
