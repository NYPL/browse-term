import { describe, it } from "node:test";
import horrorTalesAuthorityRecord from "./fixtures/horror-tales.json"
import Subject from "../models/Subject"
import { expect } from "chai";

describe("Subject", () => {
  describe("fourXXfields", () => {
    it("returns 400s", () => {
      const horrorSubject = new Subject([horrorTalesAuthorityRecord])
      expect(horrorSubject.fourXXFields).to.eq()
    })
  })
})