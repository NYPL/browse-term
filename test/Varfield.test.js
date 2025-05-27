import { describe, it } from "node:test";
import { expect } from "chai"
import Varfield from "../models/Varfield.ts";

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
      expect(varfield.source).to.eq("bib")
    })
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
      expect(varfield.source).to.eq("authority")
    })
  })
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
      expect(varfield.bibOnly).to.be.false
    })
    it("returns true when varfield source bib and subject source is valid", () => {
      const isValidBibOnlySubjectSource = Varfield.prototype.isValidBibOnlySubjectSource
      Varfield.prototype.isValidBibOnlySubjectSource = () => true
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
      expect(varfield.bibOnly).to.be.true
      Varfield.prototype.isValidBibOnlySubjectSource = isValidBibOnlySubjectSource
    })
    it("returns false when varfield source bib and subject source is invalid", () => {
      const isValidBibOnlySubjectSource = Varfield.prototype.isValidBibOnlySubjectSource
      Varfield.prototype.isValidBibOnlySubjectSource = () => false
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
      expect(varfield.bibOnly).to.be.false
      Varfield.prototype.isValidBibOnlySubjectSource = isValidBibOnlySubjectSource
    })
  })
  describe("isValidBibOnlySubjectSource", () => {
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
      // so this return value is not relevant to Sierra authority subjects. It is
      // also definitely a valid *source* if it comes from the Sierra Authority
      // database, even if it might be skipped for other reasons
      expect(varfield.isValidBibOnlySubjectSource()).to.be.true
    })
    it("returns true for ")
  })
  describe("label", () => {
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
      expect(varfield.label).to.equal("Horror in art");
    });
    it("puts together a label with starting subfields and xyz subfields with dashes", () => {
      const varfield = new Varfield({
        "fieldTag": "d",
        "marcTag": "150",
        "ind1": " ",
        "ind2": " ",
        "subfields": [
          {
            "tag": "a",
            "content": "a"
          },
          {
            "tag": "b",
            "content": "b"
          },
          {
            "tag": "c",
            "content": "c"
          },
          {
            "tag": "z",
            "content": "z"
          },
          {
            "tag": "x",
            "content": "x"
          }
        ]
      });
      expect(varfield.label).to.equal("a b c -- z -- x");
    });
    it("doesn't explode with no subfields", () => {
      expect(new Varfield({
        "fieldTag": "d",
        "marcTag": "150",
        "ind1": " ",
        "ind2": " ",
        "subfields": []
      }).label).to.eq('')
    })
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
      })
      expect(varfield.type).to.eq("Topical Term")
    })
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
      })
      expect(varfield.type).to.eq("Personal Name")
    })
  })
});
