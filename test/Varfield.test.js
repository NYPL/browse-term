import { describe } from "node:test";
import { expect } from "chai"
import Varfield from "../models/Varfield.ts";
import { headings } from "../utils.ts"

describe("Varfield", () => {
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
      }, ['a']);
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
      }, ['a', 'b', 'c']);
      expect(varfield.label).to.equal("a b c -- z -- x");
    });
    it("doesn't explode with no subfields", () => {
      expect(new Varfield({
        "fieldTag": "d",
        "marcTag": "150",
        "ind1": " ",
        "ind2": " ",
        "subfields": []
      }, ['a', 'b', 'c', 'x', 'z']).label).to.eq('')
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
