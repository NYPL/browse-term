const { describe, it } = require("node:test")
const assert = require("node:assert")
const ContributorVarfield = require("../src/models/ContributorVarfield.js")

describe("ContributorVarfield", () => {
  const testVarfield = new ContributorVarfield({
    marcTag: "711",
    subfields: [{ content: 'spaghetti', tag: 'a' }]
  })
  describe('portionMap', () => {
    it('correctly assigns portionMap based on varfield marcTag', () => {
      assert.deepStrictEqual(testVarfield.portionMap.role, ['j', '4'])
      assert.deepStrictEqual(testVarfield.portionMap, ContributorVarfield.portionMapMap['11'])
    })
  })
  describe('literalFromSubfieldArray', () => {
    it('does the thing', () => {
      testVarfield.literalFromSubfieldArray
    })
  })
})