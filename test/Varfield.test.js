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
      const isValidBibSubjectSource = Varfield.prototype.isValidBibSubjectSource
      Varfield.prototype.isValidBibSubjectSource = () => true
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
      Varfield.prototype.isValidBibSubjectSource = isValidBibSubjectSource
    })
    it("returns false when varfield source bib and subject source is invalid", () => {
      const isValidBibSubjectSource = Varfield.prototype.isValidBibSubjectSource
      Varfield.prototype.isValidBibSubjectSource = () => false
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
      Varfield.prototype.isValidBibSubjectSource = isValidBibSubjectSource
    })
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
