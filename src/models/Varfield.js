const { firstSubfields, lastSubfields } = require("../constants.js")
const { headings } = require("../constants.js")
const logger = require("../logger.js")

class Varfield {
  allowedInd2Values = [0]
  allowedSubfield2Sources = ["bookops", "local", "lcsh"]
  constructor (varfield) {
    if (!varfield.subfields?.length) {
      logger.error(`Varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    this.varfield = varfield;
    this.marcTag = parseInt(this.varfield.marcTag, 10);
    this.suppress = this.isSuppressed();
    this.label = this.getLabel();
    this.type = this.getType();
  }

  static subjectLiteralFromSubfieldArray = (subfields) => {
    const subfieldsFor = (subfieldSection, joiner) => subfields
      .filter((sf) => subfieldSection.includes(sf.tag))
      .map(({ content }) => content)
      .join(joiner)
    return [
      subfieldsFor(firstSubfields, " "),
      subfieldsFor(lastSubfields, " -- ")].filter(Boolean).join(" -- ")
  }
  // Determine if a varfield is from a thesaurus we want to recognize, or has
  // a catalogged subfield 2 subject source we want to display
  hasValidBibSubjectSource (ind2) {
    if (this.allowedInd2Values.includes(ind2)) return true
    const subfield2Source = this.getSubfieldContent("2")?.toLocaleLowerCase();
    return this.allowedSubfield2Sources.includes(subfield2Source)
  }

  // This method is intended to determine whether or not to index a bib 6xx
  // subject field, not for use on authority records.
  isSuppressed () {
    const ind2 = parseInt(this.varfield.ind2, 10)
    if (this.hasValidBibSubjectSource(ind2)) return false
    // authority record 1xx fields have undefined ind2, so skip those. 
    // This method is not meant to be called on a 1xx field, but adding it for
    // accuracy's sake.
    if (!ind2 && this.marcTag > 99 && this.marcTag < 200) return false
    else return true;
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
    const label = Varfield.subjectLiteralFromSubfieldArray(this.varfield.subfields)
    const directionPrefix = this.parseDirection() === 'rtl' ? '\u200F' : ''
    return (directionPrefix + label).trim().replace(/(?<=[a-z0-9]{2})\.$/, '')
  }

  getType () {
    return headings[this.marcTag % 100];
  }
}

module.exports = Varfield;
