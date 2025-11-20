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
  describe('parsedSubfields', () => {
    it('simple name title', () => {
      const simpleNameTitle = new ContributorVarfield({
        marcTag: "100", subfields: [
          { tag: "a", content: "Komitee zur Förderung der Klassischen Studien in den Sozialistischen Ländern." }, { tag: "t", content: "Tagung " }, { tag: "n", content: " (1st:" }, { tag: "d", content: "1958:" }, { tag: "c", content: "Erfurt)" }
        ]
      })
      assert.equal(simpleNameTitle.parsedSubfields.name, "Komitee zur Förderung der Klassischen Studien in den Sozialistischen Ländern.")
      assert.deepEqual(simpleNameTitle.parsedSubfields.title, ['Tagung ', ' (1st:', '1958:', 'Erfurt)'])
    })
    it('prefix name title', () => {
      const prefixNameTitle = new ContributorVarfield({
        marcTag: "100", subfields: [{ tag: "i", content: "Container of (work):" }, { tag: "a", content: "Beethoven, Ludwig van " }, { tag: "d", content: "1770-1827." }, { tag: "t", content: "Sonatas " }, { tag: "m", content: "piano", }, { tag: "n", content: "no. 10, op. 14, no. 2" }, { tag: "r", content: "G major." }]
      })
      assert.equal(prefixNameTitle.parsedSubfields.prefix, "Container of (work):")
      assert.deepEqual(prefixNameTitle.parsedSubfields.name, ['Beethoven, Ludwig van ', '1770-1827.'])
      assert.deepEqual(prefixNameTitle.parsedSubfields.title, ['Sonatas ', 'piano', 'no. 10, op. 14, no. 2', 'G major.'])
    })
    it('floaters in title', () => {
      const floaterInTitle = new ContributorVarfield({
        marcTag: "111", subfields: [
          { tag: 'a', content: 'France.' }, { tag: 't', content: 'Treaties, etc.' }, { tag: 'g', content: 'Senegal,' }, { tag: 'd', content: 'May 3, 1965.' }
        ]
      })
      assert.deepEqual(floaterInTitle.parsedSubfields.title, ['Treaties, etc.', 'Senegal,', 'May 3, 1965.'])
      assert.deepEqual(floaterInTitle.parsedSubfields.name, ['France.'])
    })
  })
})