const Varfield = require("./Varfield");
const logger = require("../logger")
const relatorMap = require('../data/relators.json');
const { capitalize } = require("../utils");

class ContributorVarfield extends Varfield {
  constructor (varfield, stripPeriods = false) {
    if (!varfield.subfields?.length) {
      logger.warn(`Contributor varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    super(varfield, stripPeriods)
    this.varfield = this.varfield
    this.marcTag = parseInt(this.varfield.marcTag, 10);
    const portionMapMapKey = this.marcTag === 880 ? this.getSubfieldContent("6").substr(1, 2) : this.varfield.marcTag.substr(1,)
    this.portionMap = ContributorVarfield.portionMapMap[portionMapMapKey] || ContributorVarfield.portionMapMap['00']
    this.suppress = false
    this.browseTermValue = {
      nameRoles: this.getNameRoles(),
      name: this.getPortion('name'),
      title: this.getPortion('title'),
      role: this.parsedSubfields.role,
      prefix: this.getPortion('prefix'),
      // this.label is a getter defined on the parent class
      label: this.label
    }
  }

  getNameRoles () {
    return this.parsedSubfields.role.map((role) => {
      const mappedRole = relatorMap[role] || role
      return `${this.getPortion('name')}|${mappedRole}`
    })
  }

  joinPortions ({ portions = ['prefix', 'name', 'title', 'role'], portionJoiner = " "
    , portionValueTransform = (x, i) => x }) {
    return Object.entries(this.parsedSubfields)
      .filter(([portionKey, portionValue]) => portions.includes(portionKey) && portionValue.length)
      .map(([_, portion]) =>
        portion.map(portionValueTransform).join(portionJoiner))
      .join(" ")
  }

  labelContentBuilder () {
    return this.joinPortions({ portions: ['prefix', 'name', 'title'] }) + " " + this.joinPortions({
      portions: ['role'], portionJoiner: ', ', portionValueTransform: (value, idx) => {
        const mappedRole = relatorMap[value]
        if (!mappedRole) return value
        if (idx === 0) return capitalize(mappedRole)
        else return mappedRole
      }
    })
  }

  getPortion (portion) {
    return this.joinPortions({ portions: [portion] })
  }

  get parsedSubfields () {
    const parsedSubfields = { prefix: [], name: [], title: [], role: [] }
    let addTo = 'prefix'
    this.varfield.subfields.forEach((sub) => {
      const portionForTag = this.getPortionForSubfieldTag(sub.tag)
      if (!portionForTag) return
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

/**
 * State machine captures the following logic of how to parse marc data:
 *  Prefix (if it exists) is any non-name subfield before first name subfield. 
 *  Title portion (if it exists) begins at the first title-portion subfield 
 *  following the first name-portion subfield. 
 */
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
  },
  role: {
    role: null
  }
}

module.exports = ContributorVarfield
