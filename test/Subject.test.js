import { describe, it } from "node:test";
import horrorTalesAuthorityRecord from "./fixtures/horror-tales.json" with { type: 'json' }
import Subject from "../models/Subject.ts"
import { expect } from "chai";

describe("Subject", () => {
  describe("fourXXfields", () => {
    it("returns 400s", () => {
      const horrorSubject = new Subject(horrorTalesAuthorityRecord.varFields)
      expect(horrorSubject.fourXXFields.length).to.eq(12)
      expect(horrorSubject.fourXXFields[0].label).to.eq("Horror -- Fiction")

    })
  })
  describe("broaderTerms", () => {
    it("returns specific 500 fields", () => {
      const horrorSubject = new Subject(horrorTalesAuthorityRecord.varFields)
      expect(horrorSubject.broaderTerms.length).to.eq(1)
      expect(horrorSubject.broaderTerms[0].label).to.eq("Fiction")
    })
  })
  describe("seeAlso", () => {
    it("returns specific 500 fields", () => {
      const horrorSubject = new Subject(horrorTalesAuthorityRecord.varFields)
      expect(horrorSubject.seeAlso.length).to.eq(1)
      expect(horrorSubject.seeAlso[0].label).to.eq("Ghost stories")
    })
  })
})