const { subjectLiteralFromSubfieldMap } = require("../utils.js")
const { headings } = require("../constants.js")
const logger = require("../logger.js")

class Varfield {
  constructor (varfield) {
    if (!varfield.subfields?.length) {
      logger.error(`Varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    this.varfield = varfield;
    this.suppress = this.isSuppressed();
    this.label = this.getLabel();
    this.type = this.getType();
  }

  isSuppressed () {
    return false
  }

  getSubfieldContent (tag) {
    const subfield = this.varfield.subfields?.find((sf) => sf.tag === tag);
    return subfield?.content;
  }

  buildSubfieldMap () {
    return this.varfield.subfields.reduce((hash, sub) => {
      // If there are multiple values for this tag, convert it into an array:
      if (hash[sub.tag]) {
        if (typeof hash[sub.tag] === 'string') {
          hash[sub.tag] = [hash[sub.tag]]
        }
        hash[sub.tag].push(sub.content)
      } else {
        hash[sub.tag] = sub.content
      }
      return hash
    }, {})
  }

  parseDirection () {
    const subfield6 = this.getSubfieldContent("6")
    if (!subfield6) return ''
    // Subfield 6 has form "[varfield]-[number]..."
    // In 880 fields, it may include language and direction suffixes,
    //   e.g. "245-01/(2/r", "100-01/(3/r"
    // In primary field (e.g. 245 $u) it will be for ex. "245-01"
    const [tagAndNumber, _, dir] = subfield6.split('/')

    // This should never happen, but if $6 is malformed, return null:
    if (!tagAndNumber) return null

    let [tag, number] = tagAndNumber.split('-')

    // This should never happen, but if $6 is malformed, return null:
    if (!tag || !number) return null

    const direction = dir === 'r' ? 'rtl' : 'ltr'
    return direction
  }

  getLabel () {
    const label = subjectLiteralFromSubfieldMap(this.buildSubfieldMap());
    const directionPrefix = this.parseDirection() === 'rtl' ? '\u200F' : ''
    return directionPrefix + label
  }

  getType () {
    const marcTag = this.varfield.marcTag;
    const digits = parseInt(marcTag, 10) % 100;
    return headings[digits];
  }
}

module.exports = Varfield;
