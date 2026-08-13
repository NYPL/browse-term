const { describe, it } = require("node:test");
const assert = require("node:assert");
const SeriesVarfield = require("../src/models/SeriesVarfield.js");
const mappings = require("../src/data/mappings.json");

describe("SeriesVarfield", () => {
  const testVarfield = new SeriesVarfield({
    marcTag: "811",
    subfields: [{ content: "spaghetti", tag: "a" }],
  });

  describe("label", () => {
    const withMultiRole = new SeriesVarfield({
      ind1: "1",
      ind2: " ",
      content: null,
      marcTag: "800",
      fieldTag: "b",
      subfields: [
        { tag: "a", content: "Sondheim, Stephen." },
        { tag: "4", content: "lyr" },
        { tag: "4", content: "cmp" },
        { tag: "4", content: "period." },
        { tag: "4", content: "comma," },
        { tag: "4", content: "http://id.loc.gov/vocabulary/relators/edt" },
        { tag: "4", content: "edt" },
        { tag: "4", content: "editor" },
        { tag: "4", content: "lee" },
      ],
    });
    it("formats multiple roles correctly", () => {
      assert.equal(
        withMultiRole.label,
        "Sondheim, Stephen, lyricist, composer, period, comma, editor, libelee-appellee"
      );
    });
    it("accounts for unmatched values", () => {
      const ed = new SeriesVarfield({
        marcTag: "800",
        subfields: [
          { tag: "a", content: "Ginosar, Sh." },
          { tag: "q", content: "(Shaleṿ)," },
          { tag: "d", content: "1902-" },
          { tag: "e", content: "ed." },
        ],
      });
      assert.equal(ed.label, "Ginosar, Sh. (Shaleṿ), 1902-, editor");
    });
    it("accounts for encompassing quotes on punctuation", () => {
      const ed = new SeriesVarfield({
        marcTag: "800",
        subfields: [
          { tag: "a", content: 'Народна библиотека "Стефан Првовенчани,"' },
          { tag: "e", content: "issuing body." },
        ],
      });
      assert.equal(
        ed.browseTermValue.name,
        'Народна библиотека "Стефан Првовенчани"'
      );
      assert.equal(
        ed.browseTermValue.label,
        'Народна библиотека "Стефан Првовенчани", issuing body'
      );
    });
    it("accounts for initials", () => {
      const ed = new SeriesVarfield({
        marcTag: "800",
        subfields: [
          { tag: "a", content: "Martin, George R.R." },
          { tag: "4", content: "aut" },
        ],
      });
      assert.equal(ed.browseTermValue.name, "Martin, George R.R.");
      assert.equal(ed.browseTermValue.label, "Martin, George R.R., author");
    });
  });

  describe("nameRoles", () => {
    const withMultiRole = new SeriesVarfield({
      ind1: "1",
      ind2: " ",
      content: null,
      marcTag: "800",
      fieldTag: "b",
      subfields: [
        { tag: "a", content: "Sondheim, Stephen." },
        { tag: "4", content: "lyr" },
        { tag: "4", content: "cmp" },
        { tag: "4", content: "lee" },
      ],
    });
    assert.deepEqual(withMultiRole.browseTermValue.nameRoles, [
      "Sondheim, Stephen||lyricist",
      "Sondheim, Stephen||composer",
      "Sondheim, Stephen||libelee-appellee",
    ]);
  });

  describe("portion concatenating", () => {
    it("no roles", () => {
      const noRole = new SeriesVarfield({
        marcTag: "800",
        subfields: [{ tag: "a", content: "Sondheim, Stephen. " }],
      });
      assert.equal(noRole.label, "Sondheim, Stephen");
    });
    it("concatenates name and role", () => {
      const withRole = new SeriesVarfield({
        marcTag: "800",
        subfields: [
          { tag: "a", content: "Sondheim, Stephen." },
          { tag: "4", content: "lyr" },
        ],
      });
      assert.equal(withRole.label, "Sondheim, Stephen, lyricist");
    });
  });

  describe("parallel varfields", () => {
    it("resolves portionMap from subfield 6", () => {
      const parallel = new SeriesVarfield({
        ind1: "1",
        ind2: "0",
        content: null,
        marcTag: "880",
        fieldTag: "y",
        subfields: [
          { tag: "6", content: "800-01/$1" },
          { tag: "a", content: "吴承恩," },
          { tag: "d", content: "approximately 1500-approximately 1582." },
        ],
      });
      assert.equal(
        parallel.label,
        "吴承恩, approximately 1500-approximately 1582"
      );
    });
  });

  describe("portionMap", () => {
    it("defaults to 00 for unrecognized marcTag", () => {
      const _830 = new SeriesVarfield({
        marcTag: "830",
        subfields: [{ tag: "a", content: "spaghetti," }],
      });
      assert.deepEqual(_830.portionMap, mappings.seriesAddedEntry["00"]);
    });
    it("correctly assigns portionMap based on varfield marcTag", () => {
      assert.deepStrictEqual(testVarfield.portionMap.role, ["j", "4"]);
      assert.deepStrictEqual(
        testVarfield.portionMap,
        mappings.seriesAddedEntry["11"]
      );
    });
  });

  describe("parsedSubfields", () => {
    it("simple name title (800)", () => {
      const simpleNameTitle = new SeriesVarfield({
        marcTag: "800",
        subfields: [
          { tag: "a", content: "Tolkien, J. R. R." },
          { tag: "t", content: "Lord of the rings." },
        ],
      });
      assert.equal(simpleNameTitle.parsedSubfields.name, "Tolkien, J. R. R.");
      assert.deepEqual(simpleNameTitle.parsedSubfields.title, [
        "Lord of the rings.",
      ]);
    });
    it("does not include v and x in title", () => {
      const simpleNameTitle = new SeriesVarfield({
        marcTag: "800",
        subfields: [
          { tag: "a", content: "Tolkien, J. R. R." },
          { tag: "t", content: "Lord of the rings." },
          { tag: "v", content: "Vol 1" },
          { tag: "x", content: "issn" },
        ],
      });
      assert.equal(simpleNameTitle.parsedSubfields.name, "Tolkien, J. R. R.");
      assert.deepEqual(simpleNameTitle.parsedSubfields.title, [
        "Lord of the rings.",
      ]);
    });
    it("floaters stay in current portion (810)", () => {
      // d, g, n are floaters for 810
      const floatersInName = new SeriesVarfield({
        marcTag: "810",
        subfields: [
          { tag: "a", content: "United Nations." },
          { tag: "b", content: "Secretariat." },
          { tag: "n", content: "Part 1." },
          { tag: "t", content: "United Nations treaty series." },
        ],
      });
      assert.deepEqual(floatersInName.parsedSubfields.name, [
        "United Nations.",
        "Secretariat.",
        "Part 1.",
      ]);
      assert.deepEqual(floatersInName.parsedSubfields.title, [
        "United Nations treaty series.",
      ]);
    });
    it("floaters in title (810)", () => {
      const floaterInTitle = new SeriesVarfield({
        marcTag: "810",
        subfields: [
          { tag: "a", content: "France." },
          { tag: "t", content: "Treaties, etc." },
          { tag: "g", content: "Senegal," },
          { tag: "d", content: "May 3, 1965." },
        ],
      });
      assert.deepEqual(floaterInTitle.parsedSubfields.title, [
        "Treaties, etc.",
        "Senegal,",
        "May 3, 1965.",
      ]);
      assert.deepEqual(floaterInTitle.parsedSubfields.name, ["France."]);
    });
    it("prefix name title (800)", () => {
      // i is a title subfield, but stays in prefix until a name subfield is seen
      const prefixNameTitle = new SeriesVarfield({
        marcTag: "800",
        subfields: [
          { tag: "i", content: "Container of (work):" },
          { tag: "a", content: "Beethoven, Ludwig van " },
          { tag: "d", content: "1770-1827." },
          { tag: "t", content: "Sonatas " },
          { tag: "m", content: "piano" },
          { tag: "n", content: "no. 10, op. 14, no. 2" },
          { tag: "r", content: "G major." },
        ],
      });
      assert.equal(
        prefixNameTitle.parsedSubfields.prefix,
        "Container of (work):"
      );
      assert.deepEqual(prefixNameTitle.parsedSubfields.name, [
        "Beethoven, Ludwig van ",
        "1770-1827.",
      ]);
      assert.deepEqual(prefixNameTitle.parsedSubfields.title, [
        "Sonatas ",
        "piano",
        "no. 10, op. 14, no. 2",
        "G major.",
      ]);
    });
  });
});
