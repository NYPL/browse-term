const Varfield = require("./Varfield");
const logger = require("../logger")

class ContributorVarfield extends Varfield {
  constructor (varfield, stripPeriods = false) {
    if (!varfield.subfields?.length) {
      logger.warn(`Contributor varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    super(varfield, stripPeriods)
    this.varfield = this.varfield
    this.marcTag = parseInt(this.varfield.marcTag, 10);
    this.suppress = false
    this.portionMap = ContributorVarfield.portionMapMap[this.varfield.marcTag.substr(1,)]
  }

  labelContentBuilder () {
    return Object.values(this.parsedSubfields)
      .filter((portion) => portion.length)
      .map((portion) => portion.join(" ")).join(" ")
  }

  get parsedSubfields () {
    const parsedSubfields = { prefix: [], name: [], title: [], role: [] }
    let addTo = 'prefix'
    this.varfield.subfields.forEach((sub) => {
      const portionForTag = this.getPortionForSubfieldTag(sub.tag)
      addTo = stateMachine[addTo][portionForTag] || addTo
      parsedSubfields[addTo].push(sub.content)
    })
    return parsedSubfields
  }

  getPortionForSubfieldTag (tag) {
    return Object.keys(this.portionMap)
      .find((portion) => this.portionMap[portion].includes(tag))
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

const stateMachine = {
  prefix: {
    name: 'name',
    title: null,
    floater: null,
    role: 'role'
  },
  name: {
    name: null,
    title: 'title',
    floater: null,
    role: 'role'
  },
  title: {
    name: null,
    title: null,
    floater: null,
    role: null
  }
}

module.exports = ContributorVarfield
