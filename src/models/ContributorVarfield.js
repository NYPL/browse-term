const Varfield = require("./Varfield");

class ContributorVarfield extends Varfield {
  constructor (varfield, stripPeriods = false) {
    if (!varfield.subfields?.length) {
      logger.warn(`Contributor varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    super(varfield, ContributorVarfield.literalFromSubfieldArray, stripPeriods)
    this.varfield = this.varfield
    this.marcTag = parseInt(this.varfield.marcTag, 10);
    this.suppress = false
    this.portionMap = ContributorVarfield.portionMapMap[this.varfield.marcTag.substr(1,)]
  }
  static literalFromSubfieldArray () {
    const parsedSubfields = { prefix: [], name: [], title: [], role: [] }
    let titleMode = false
    return this.varfield.subfields.reduce((parsed, sub) => {
      const whichPortion = Object.keys(this.portionMap).find((portion) => this.portionMap[portion].subfields.includes(sub.tag))
      switch (whichPortion) {
        case 'name':
          logger.info('spaghetti name')
          break
        case 'role':
          break
        case 'title':
          break
        default:
          logger.info(`Skipping subfield ${sub.tag} because not included in portion map`)
      }
    }, parsedSubfields)
  }
}

ContributorVarfield.portionMapMap = {
  '00': {
    name: ['a', 'b', 'c', 'd', 'j', 'q', 'u'],
    role: ['e', '4'],
    title: ['f', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'v', 'x'],
    floater: ['g']
  },
  '10': {
    name: ['a', 'b', 'c', 'u'],
    role: ['e', '4'],
    title: ['f', 'h', 'i', 'k', 'l', 'm', 'o', 'p', 'r', 's', 't', 'v', 'x'],
    floater: ['d', 'g', 'n']
  },
  '11': {
    name: ['a', 'c', 'e', 'q', 'u'],
    role: ['j', '4'],
    title: ['f', 'h', 'i', 'k', 'l', 'p', 's', 't', 'v', 'x'],
    floater: ['d', 'g', 'n']
  }
}

module.exports = ContributorVarfield
