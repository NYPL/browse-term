const { describe, it } = require("node:test")
const assert = require("node:assert")
const Varfield = require("../src/models/Varfield.js");
const SubjectVariantVarfield = require("../src/models/SubjectVariantVarfield.js");

describe("Varfield", () => {
  describe("label", () => {
    it("Does not trim final periods part of abbreviations when flag is true", () => {
      const varfield = new Varfield({
        "fieldTag": "d",
        "marcTag": "600",
        "ind1": "0",
        "ind2": "0",
        "content": null,
        "subfields": [
          {
            "tag": "a",
            "content": "N. Y. C."
          }
        ]
      }, () => "NYC.", true)
      assert.equal(varfield.label, "NYC.")
    })
    it("can handle two subfield a's", () => {
      const varfield = new Varfield({
        "ind1": " ",
        "ind2": " ",
        "content": null,
        "marcTag": "653",
        "fieldTag": "d",
        "subfields": [
          {
            "tag": "a",
            "content": "Poetry"
          },
          {
            "tag": "a",
            "content": "Songs"
          }
        ]
      }, SubjectVariantVarfield.literalFromSubfieldArray)
      assert.equal(varfield.label, "Poetry Songs.")

    })
    it("does not trim the elect abbreviations permitted periods", () => {
      const varfield = new Varfield({
        "fieldTag": "d",
        "marcTag": "600",
        "ind1": "0",
        "ind2": "0",
        "content": null,
        "subfields": [
          {
            "tag": "a",
            "content": "Spaghetti, pub."
          }
        ]
      }, SubjectVariantVarfield.literalFromSubfieldArray)
      assert.equal(varfield.label, "Spaghetti, pub.")
    })
    it("trims final periods", () => {
      const varfield = new Varfield({
        "fieldTag": "d",
        "marcTag": "600",
        "ind1": "0",
        "ind2": "0",
        "content": null,
        "subfields": [
          {
            "tag": "a",
            "content": "This period stays but probably wouldn't exist IRL."
          },
          {
            "tag": "b",
            "content": "This period goes."
          }
        ]
      }, SubjectVariantVarfield.literalFromSubfieldArray, true)
      assert.equal(varfield.label, "This period stays but probably wouldn't exist IRL. This period goes")
    })
    it("trims whitespace", () => {
      const varfield = new Varfield({
        "fieldTag": "d",
        "marcTag": "600",
        "ind1": "0",
        "ind2": "0",
        "content": null,
        "subfields": [
          {
            "tag": "6",
            "content": "880-01"
          },
          {
            "tag": "a",
            "content": "   600 primary value a"
          },
          {
            "tag": "b",
            "content": "600 primary value b   "
          }
        ]
      }, SubjectVariantVarfield.literalFromSubfieldArray)
      assert.equal(varfield.label, '600 primary value a 600 primary value b.')
    })
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
      }, SubjectVariantVarfield.literalFromSubfieldArray)
      assert.equal(varfield.label, 'subfield z 1 -- subfield z 2.')
    })
    it("returns direction zero width character when subfield six says so", () => {
      const varfield = new Varfield({
        fieldTag: "x",
        marcTag: "880",
        subfields: [{ tag: "6", content: "245-01/(2/r" }, { tag: "a", content: "spaghetti" }]
      }, SubjectVariantVarfield.literalFromSubfieldArray)
      assert.equal(varfield.label, "\u200Fspaghetti.")
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
      assert.equal(varfield.label, "Horror in art.");
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
      assert.equal(varfield.label, "a b c -- z -- x.");
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
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
      }, SubjectVariantVarfield.literalFromSubfieldArray);
      assert.equal(varfield.label, "Horror in art-");
    })
  })
});
