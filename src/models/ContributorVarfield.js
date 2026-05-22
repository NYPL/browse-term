const Varfield = require('./Varfield')
const logger = require('../logger')
const relatorMap = require('../data/relators.json')
const mappings = require('../data/mappings.json')
const { capitalize } = require('../utils')

class ContributorVarfield extends Varfield {
  constructor (varfield, stripPeriods = true) {
    if (!varfield.subfields?.length) {
      logger.warn(`Contributor varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    super(varfield, stripPeriods)
    this.varfield = this.varfield
    this.marcTag = parseInt(this.varfield.marcTag, 10)
    const portionMapMapKey = (this.marcTag === 880 ? this.getSubfieldContent('6').substr(1, 2) : this.varfield.marcTag.substr(1))
    this.portionMap = mappings.contributors[portionMapMapKey] || mappings.contributors['00']
    this.suppress = false
    this.roles = this.getRoles() // used in several functions building the browseTermValue, build this list just once
    this.browseTermValue = {
      nameRoles: this.getNameRoles(),
      name: this.getPortion('name'),
      title: this.getPortion('title'),
      role: this.roles,
      prefix: this.getPortion('prefix'),
      // this.label is a getter defined on the parent class
      label: this.label
    }
  }

  getRole (value) {
    value = value
      .trim()
      .replace(/^.*\/|[.,]$/gu, '') // remove trailing periods, commas or url paths, some recap records begin with http://id.loc.gov/vocabulary/relators/
      .toLowerCase()
    return relatorMap[value] || value
  }

  getRoles () {
    return [...new Set(this.parsedSubfields.role.map((role) => this.getRole(role)))]
  }

  getNameRoles () {
    return this.roles.map((role) => {
      return `${this.getPortion('name')}||${role}`
    })
  }

  joinPortions ({
    portions = ['prefix', 'name', 'title', 'role'], portionJoiner = ' '
    , portionValueTransform = (x) => x
  }) {
    return Object.entries(this.parsedSubfields)
      .filter(([portionKey, portionValue]) => portions.includes(portionKey) && portionValue.length)
      .map(([_, portion]) =>
        portion.map(portionValueTransform).join(portionJoiner))
      .join(' ')
      .trim()
      .replace(/[.,]\"$/, '"') // removes final commas and periods within quotes
      .replace(/(,$|(?<!\b[A-Z])\.)+$/, '') // removes trailing commas and periods except where a period is expected, i.e. an initial
  }

  labelContentBuilder () {
    const prefixNameTitle = this.joinPortions({ portions: ['prefix', 'name', 'title'] })
    return [prefixNameTitle, this.roles.join(', ')].filter(Boolean).join(', ')
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
    role: null,
    title: 'title'
  }
}

module.exports = ContributorVarfield
