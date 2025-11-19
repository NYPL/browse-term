const { describe, it } = require("node:test")
const assert = require("node:assert")
const ContributorVarfield = require("../src/models/ContributorVarfield.js")

describe("ContributorVarfield", () => {
  describe('portionMap', () => {
    it('correctly assigns portionMap based on varfield marcTag', () => {
      const varfield = new ContributorVarfield({
        marcTag: "711",
        subfields: [{ content: 'spaghetti', tag: 'a' }]
      })
      assert.deepStrictEqual(varfield.portionMap.role, ['j', '4'])
      assert.deepStrictEqual(varfield.portionMap, ContributorVarfield.portionMapMap['11'])
    })
  })
})