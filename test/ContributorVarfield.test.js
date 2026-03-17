const { describe, it } = require("node:test")
const assert = require("node:assert")
const ContributorVarfield = require("../src/models/ContributorVarfield.js")

describe("ContributorVarfield", () => {
  const testVarfield = new ContributorVarfield({
    marcTag: "711",
    subfields: [{ content: 'spaghetti', tag: 'a' }]
  })
  describe('label', () => {
    const withMultiRole = new ContributorVarfield({
      "ind1": "1",
      "ind2": " ",
      "content": null,
      "marcTag": "700",
      "fieldTag": "b",
      "subfields": [
        {
          "tag": "a",
          "content": "Sondheim, Stephen."
        },
        {
          "tag": "4",
          "content": "lyr"
        },
        {
          "tag": "4",
          "content": "cmp"
        },
        {
          "tag": "4",
          "content": "period."
        },
        {
          "tag": "4",
          "content": "comma,"
        },
        {
          "tag": "4",
          "content": "http://id.loc.gov/vocabulary/relators/edt"
        },
        {
          "tag": "4",
          "content": "lee"
        },
      ]
    })
    it('formats multiple roles correctly', () => {
      assert.equal(withMultiRole.label, "Sondheim, Stephen, lyricist, composer, period, comma, editor, libelee-appellee")
    })
    it('accounts for unmatched values', () => {
      const ed = new ContributorVarfield({
        "fieldTag": null,
        "marcTag": "700",
        "ind1": "1",
        "ind2": " ",
        "content": null,
        "subfields": [
          {
            "tag": "a",
            "content": "Ginosar, Sh."
          },
          {
            "tag": "q",
            "content": "(Shaleṿ),"
          },
          {
            "tag": "d",
            "content": "1902-"
          },
          {
            "tag": "e",
            "content": "ed."
          }
        ]
      })
      assert.equal(ed.label, 'Ginosar, Sh. (Shaleṿ), 1902-, ed')
    })
    it('accounts for initials', () => {
      const ed = new ContributorVarfield({
        "fieldTag": "b",
        "marcTag": "700",
        "ind1": "1",
        "ind2": " ",
        "content": null,
        "subfields": [
          {
            "tag": "a",
            "content": "Martin, George R.R."
          },
          {
            "tag": "4",
            "content": "aut"
          }
        ]
      })
      assert.equal(ed.browseTermValue.name, 'Martin, George R.R.')
      assert.equal(ed.browseTermValue.label, 'Martin, George R.R., author')
    })
  })
  describe('nameRoles', () => {
    const withMultiRole = new ContributorVarfield({
      "ind1": "1",
      "ind2": " ",
      "content": null,
      "marcTag": "700",
      "fieldTag": "b",
      "subfields": [
        {
          "tag": "a",
          "content": "Sondheim, Stephen."
        },
        {
          "tag": "4",
          "content": "lyr"
        },
        {
          "tag": "4",
          "content": "cmp"
        },
        {
          "tag": "4",
          "content": "lee"
        }
      ]
    })
    assert.deepEqual(withMultiRole.browseTermValue.nameRoles, ['Sondheim, Stephen||lyricist', 'Sondheim, Stephen||composer', 'Sondheim, Stephen||libelee-appellee'])
  })
  describe('portion concatenating', () => {
    it('no roles', () => {
      const noRole = new ContributorVarfield({
        "ind1": "1",
        "ind2": " ",
        "content": null,
        "marcTag": "700",
        "fieldTag": "b",
        "subfields": [
          {
            "tag": "a",
            "content": "Sondheim, Stephen. "
          }
        ]
      })
      assert.equal(noRole.label, "Sondheim, Stephen")
    })
    it('concatenates', () => {
      const withRole = new ContributorVarfield({
        "ind1": "1",
        "ind2": " ",
        "content": null,
        "marcTag": "700",
        "fieldTag": "b",
        "subfields": [
          {
            "tag": "a",
            "content": "Sondheim, Stephen."
          },
          {
            "tag": "4",
            "content": "lyr"
          }
        ]
      })
      assert.equal(withRole.label, 'Sondheim, Stephen, lyricist')
    })
  })
  describe('parallel varfields', () => {
    it('can do the thing', () => {
      const parallel = new ContributorVarfield({
        "ind1": "1",
        "ind2": "0",
        "content": null,
        "marcTag": "880",
        "fieldTag": "y",
        "subfields": [
          {
            "tag": "6",
            "content": "100-01/$1"
          },
          {
            "tag": "a",
            "content": "吴承恩,"
          },
          {
            "tag": "d",
            "content": "approximately 1500-approximately 1582."
          }
        ]
      })
      assert.equal(parallel.label, '吴承恩, approximately 1500-approximately 1582')
    })
  })
  describe('portionMap', () => {
    it('defaults to 00', () => {
      const _790 = new ContributorVarfield({
        "marcTag": "791",
        "ind1": "1",
        "ind2": "0",
        "content": null,
        "fieldTag": "y",
        "subfields": [
          {
            "tag": "a",
            "content": "spaghetti,"
          }
        ]
      })
      assert.deepEqual(_790.portionMap, ContributorVarfield.portionMapMap['00'])
    })
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
    it('n in title', () => {
      const nameInTitle = new ContributorVarfield({
        marcTag: "110", subfields: [
          { tag: "a", content: "Marais, Marin," }, { tag: "d", content: "1656-1728." }, { tag: "t", content: "Pièces de violes," }, { tag: "n", content: "2e-4e livre." }, { tag: "k", content: "Selections." }
        ]
      })
      assert.deepEqual(nameInTitle.parsedSubfields.title, ['Pièces de violes,', '2e-4e livre.', 'Selections.'])
      assert.deepEqual(nameInTitle.parsedSubfields.name, ['Marais, Marin,', '1656-1728.'])
    })
    it('floaters in name', () => {
      floatersInName = new ContributorVarfield({
        marcTag: "100", subfields: [
          { tag: "a", content: "Mahr (Family :" }, { tag: "g", content: "Mahr, Carl," }, { tag: "d", content: "1830-1899)" }
        ]
      })
      assert.deepEqual(floatersInName.parsedSubfields.name, ['Mahr (Family :', 'Mahr, Carl,', '1830-1899)'])
    })
  })
})
