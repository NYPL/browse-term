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
  it('can handle deleted authority data', () => {
    const deletedSubject = new Subject({
      "id": "10000001",
      "deletedDate": "2011-02-28",
      "deleted": true,
      "varFields": []
    })
    assert(deletedSubject.deleted)
  })
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
    it("returns field tag d varfield for authority records with multiple varfields", () => {
      assert.equal(horrorSubject.preferredTerm.label, "Horror tales");
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
  describe("suppressed", () => {
    it("is true when record is deprecated local authority", () => {
      assert.equal(deprecatedLocalAuthorityRecord.suppressed, true);
    });
  });
});
