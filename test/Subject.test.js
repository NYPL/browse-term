const { describe, it } = require("node:test")
const horrorTalesAuthorityRecord = require("./fixtures/horror-tales.js")
const deprecatedLocal = require("./fixtures/deprecated-local-authority.js")
const Subject = require("../src/models/Subject.js")
const assert = require("node:assert")
const { InvalidSubjectDataError } = require("../src/errors.js")

describe("Subject", () => {
  const horrorSubject = new Subject(
    horrorTalesAuthorityRecord
  );
  const deprecatedLocalAuthorityRecord = new Subject(
    deprecatedLocal
  );
  describe("fourXXfields", () => {
    it("returns 400s", () => {
      assert.equal(horrorSubject.fourXXFields.length, 12);
      assert.equal(horrorSubject.fourXXFields[0].label, "Horror -- Fiction");
    });
  });
  describe("broaderTerms", () => {
    it("returns specific 500 fields", () => {
      assert.equal(horrorSubject.broaderTerms.length, 1);
      assert.equal(horrorSubject.broaderTerms[0].label, "Fiction");
    });
  });
  describe("seeAlso", () => {
    it("returns specific 500 fields", () => {
      assert.equal(horrorSubject.seeAlso.length, 1);
      assert.equal(horrorSubject.seeAlso[0].label, "Ghost stories");
    });
  });
  describe("preferredTerm", () => {
    it("throws an error when preferred term with no subfields", () => {
      const subject = () => new Subject({ varFields: [{ "fieldTag": "d" }] })
      assert.throws(subject, (error) => {
        assert(error instanceof InvalidSubjectDataError);
        assert(/Varfield missing subfields./.test(error))
        return true
      })
    })
    it("returns 600 varfield as preferred term when there is no field tag d", () => {
      const subject = new Subject({
        varFields: [{
          fieldTag: "y",
          marcTag: "680",
          subfields: [{ tag: "6", content: "245-01/(2/r" }, { tag: "a", content: "spaghetti" }]
        }],
      })
      assert.equal(subject.preferredTerm.label, "\u200Fspaghetti")
    })
    it("returns field tag d varfield for authority records with multiple varfields", () => {
      assert.equal(horrorSubject.preferredTerm.label, "Horror tales");
    });
    it("returns single varfield for bib varfields with fieldTag null", () => {
      // this case is for partner records
      const bibSubject = new Subject({
        varFields: [
          {
            fieldTag: null,
            marcTag: "600",
            subfields: [{ content: "Spaghetti", tag: "a" }],
          },
        ],
      });
      assert.equal(bibSubject.preferredTerm.label, "Spaghetti");
    });
  });
  describe("isDeprecatedLocalAuthority", () => {
    it("returns false when 667 field present with NO nypl local authority content", () => {
      assert.equal(horrorSubject.isDeprecatedLocalAuthority(), false);
    });
    it("returns true when 667 field present with nypl local authority content", () => {
      assert.equal(deprecatedLocalAuthorityRecord.isDeprecatedLocalAuthority(), true);
    });
  });
  describe("skip", () => {
    it("is true when record is deprecated local authority", () => {
      assert.equal(deprecatedLocalAuthorityRecord.skip, true);
    });
    it("is false when bib subject is from a valid source", () => {
      const bibSubject = new Subject({
        varFields: [
          {
            ind1: "",
            ind2: "",
            marcTag: "600",
            fieldTag: "d",
            subfields: [
              { content: "Spaghetti", tag: "a" },
              { content: "BookOps", tag: "2" },
            ],
          },
        ],
      });
      assert.equal(bibSubject.skip, false);
    });
    it("is true when bib subject is not from a valid source", () => {
      const bibSubject = new Subject({
        varFields: [
          {
            ind1: "",
            ind2: "",
            marcTag: "600",
            fieldTag: "d",
            subfields: [
              { content: "Spaghetti", tag: "a" },
              { content: "Dollywood", tag: "2" },
            ],
          },
        ],
      });
      assert.equal(bibSubject.skip, true);
    });
  });
});
