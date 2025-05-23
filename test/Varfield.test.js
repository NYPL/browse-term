const Varfield = require("../models/Varfield.ts");

describe("Varfield", () => {
  beforeAll(() => {
    process.env.FIRST_SUBFIELDS_TO_INDEX = "a,b,c";
  });
  describe("label", () => {
    it("puts together a label with only one subfield", () => {
      console.log(Varfield)
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
  });
});
