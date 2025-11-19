const { describe, it } = require("node:test")
const horrorTalesAuthorityRecord = require("./fixtures/horror-tales.js")
const deprecatedLocal = require("./fixtures/deprecated-local-authority.js")
const Authority = require("../src/models/Authority.js")
const assert = require("node:assert")
const { InvalidAuthorityDataError } = require("../src/errors.js")

describe("Authority", () => {
  const horrorAuthority = Authority.subjectFactory(
    horrorTalesAuthorityRecord,
  );
  const deprecatedLocalAuthorityRecord = Authority.subjectFactory(
    deprecatedLocal
  );
  it('can handle deleted authority data', () => {
    const deletedAuthority = Authority.subjectFactory({
      "id": "10000001",
      "deletedDate": "2011-02-28",
      "deleted": true,
      "varFields": []
    })
    assert(deletedAuthority.deleted)
  })
  describe("fourXXfields", () => {
    it("returns 400s", () => {
      assert.equal(horrorAuthority.fourXXFields.length, 12);
      assert.equal(horrorAuthority.fourXXFields[0].label, "Horror -- Fiction.");
    });
  });
  describe("broaderTerms", () => {
    it("returns specific 500 fields", () => {
      assert.equal(horrorAuthority.broaderTerms.length, 1);
      assert.equal(horrorAuthority.broaderTerms[0].label, "Fiction.");
    });
  });
  describe("seeAlso", () => {
    it("returns specific 500 fields", () => {
      assert.equal(horrorAuthority.seeAlso.length, 1);
      assert.equal(horrorAuthority.seeAlso[0].label, "Ghost stories.");
    });
  });
  describe("preferredTerm", () => {
    it("returns field tag d varfield for authority records with multiple varfields", () => {
      assert.equal(horrorAuthority.preferredTerm.label, "Horror tales.");
    });
  });
  describe("isDeprecatedLocalAuthority", () => {
    it("returns false when 667 field present with NO nypl local authority content", () => {
      assert.equal(horrorAuthority.isDeprecatedLocalAuthority(), false);
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
