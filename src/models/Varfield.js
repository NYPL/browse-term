const { headings } = require("../constants.js")
const logger = require("../logger.js")

class Varfield {
  constructor (varfield, stripPeriods = false) {
    if (!varfield.subfields?.length) {
      logger.error(`Varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    this.stripPeriods = stripPeriods
    this.varfield = varfield;
    this.marcTag = parseInt(this.varfield.marcTag, 10);
  }

  labelContentBuilder () {
    return this.varfield.subfields.map(({ content }) => content)
  }

  get label () {
    let label = this.labelContentBuilder(this.varfield.subfields)
    label = this.parseParallelActivity(label).trim()
    label = this.formatPunctuation(label)
    return label
  }

  parseParallelActivity (label) {
    const directionPrefix = this.parseDirection() === 'rtl' ? '\u200F' : ''
    return (directionPrefix + label)
  }

  formatPunctuation (label) {
    if (this.stripPeriods) {
      const finalAbbreviations = ["pub"]
      const matchTrailingPeriods = new RegExp(`${finalAbbreviations.map(abb => `(?<!${abb})`)}(?<=[a-z0-9]{2})\\.$`)
      label = label.replace(matchTrailingPeriods, '')
    } else {
      const endingsNotRequiringPeriod = '!?"-)>.]'.split('')
      if (!endingsNotRequiringPeriod.includes(label[label.length - 1])) { label += "." }
    }
    return label
  }

  getSubfieldContent (tag) {
    const subfield = this.varfield.subfields?.find((sf) => sf.tag === tag);
    return subfield?.content;
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

  get type () {
    return headings[this.marcTag % 100];
  }
}

module.exports = Varfield;
