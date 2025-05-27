import { describe, it } from "node:test";
import horrorTalesAuthorityRecord from "./fixtures/horror-tales.json" with { type: "json" };
import deprecatedLocal from "./fixtures/deprecated-local-authority.json" with { type: "json" };
import Subject from "../models/Subject.ts";
import { expect } from "chai";
import type { VarfieldMarc } from "../types.ts";

describe("Subject", () => {
  const horrorSubject = new Subject(
    horrorTalesAuthorityRecord.varFields as VarfieldMarc[]
  );
  const deprecatedLocalAuthorityRecord = new Subject(
    deprecatedLocal.varFields as VarfieldMarc[]
  );
  describe("fourXXfields", () => {
    it("returns 400s", () => {
      expect(horrorSubject.fourXXFields.length).to.eq(12);
      expect(horrorSubject.fourXXFields[0].label).to.eq("Horror -- Fiction");
    });
  });
  describe("broaderTerms", () => {
    it("returns specific 500 fields", () => {
      expect(horrorSubject.broaderTerms.length).to.eq(1);
      expect(horrorSubject.broaderTerms[0].label).to.eq("Fiction");
    });
  });
  describe("seeAlso", () => {
    it("returns specific 500 fields", () => {
      expect(horrorSubject.seeAlso.length).to.eq(1);
      expect(horrorSubject.seeAlso[0].label).to.eq("Ghost stories");
    });
  });
  describe("preferredTerm", () => {
    it("returns field tag d varfield for authority varfields", () => {
      expect(horrorSubject.preferredTerm.label).to.eq("Horror tales");
    });
    it("returns field tag d varfield for bib varfields", () => {
      const bibSubject = new Subject([
        {
          marcTag: "600",
          fieldTag: "d",
          subfields: [{ content: "Spaghetti", tag: "a" }],
        },
      ]);
      expect(bibSubject.preferredTerm.label).to.eq("Spaghetti");
    });
  });
  describe("isDeprecatedLocalAuthority", () => {
    it("returns false when 667 field present with NO nypl local authority content", () => {
      expect(horrorSubject.isDeprecatedLocalAuthority()).to.be.false;
    });
    it("returns true when 667 field present with nypl local authority content", () => {
      expect(deprecatedLocalAuthorityRecord.isDeprecatedLocalAuthority()).to.be
        .true;
    });
  });
  describe("skip", () => {
    it("is true when record is deprecated local authority", () => {
      expect(deprecatedLocalAuthorityRecord.skip).to.be.true;
    });
    it("is false when bib subject is from a valid source", () => {
      const bibSubject = new Subject([
        {
          marcTag: "600",
          fieldTag: "d",
          subfields: [
            { content: "Spaghetti", tag: "a" },
            { content: "BookOps", tag: "2" },
          ],
        },
      ]);
      expect(bibSubject.skip).to.be.false;
    });
    it("is true when bib subject is not from a valid source", () => {
      const bibSubject = new Subject([
        {
          marcTag: "600",
          fieldTag: "d",
          subfields: [
            { content: "Spaghetti", tag: "a" },
            { content: "Dollywood", tag: "2" },
          ],
        },
      ]);
      expect(bibSubject.skip).to.be.true;
    });
  });
});
