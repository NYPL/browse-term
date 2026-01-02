const { firstSubfields, lastSubfields } = require("../constants.js")
const logger = require("../logger.js")
const Varfield = require("./Varfield.js")

class SubjectVarfield extends Varfield {
  allowedInd2Values = [0]
  allowedSubfield2Sources = ["bookops", "local", "lcsh", "homoit"]
  constructor (varfield, stripPeriods = false) {
    if (!varfield.subfields?.length) {
      logger.warn(`Subject varfield missing subfields. Varfield marc: \n ${JSON.stringify(varfield)}`)
    }
    super(varfield, stripPeriods)
    this.varfield = varfield;
    this.marcTag = parseInt(this.varfield.marcTag, 10);
    this.ind2 = parseInt(this.varfield.ind2, 10)
    this.suppress = this.isSuppressed();
    // this.label is a getter defined on the parent class
    this.browseTermValue = { label: this.label }
  }

  labelContentBuilder = () => {
    const subfieldsFor = (subfieldSection, joiner) => this.varfield.subfields
      .filter((sf) => subfieldSection.includes(sf.tag))
      .map(({ content }) => content)
      .join(joiner)
    return [
      subfieldsFor(firstSubfields, " "),
      subfieldsFor(lastSubfields, " -- ")].filter(Boolean).join(" -- ")
  }

  // Determine if a varfield is from a thesaurus we want to recognize, or has
  // a catalogged subfield 2 Authority source we want to display
  hasValidBibAuthoritySource () {
    const subfield2Source = this.getSubfieldContent("2")?.toLocaleLowerCase();
    const validCriteria = [
      this.allowedSubfield2Sources.includes(subfield2Source),
      this.allowedInd2Values.includes(this.ind2),
      this.marcTag === 690 && this.ind2 === 4
    ]
    if (this.marcTag === 690) console.log("***", validCriteria.some((x) => x))
    return validCriteria.some((x) => x)
  }

  // This method is intended to determine whether or not to index a bib 6xx
  // Authority field, not for use on authority records.
  isSuppressed () {
    // 653 is for uncontrolled Authoritys, which seem to never have ind2 values
    if (this.marcTag === 653) return false
    if (this.hasValidBibAuthoritySource()) return false
    // authority record 1xx fields have undefined ind2, so skip those.
    // This method is not meant to be called on a 1xx field, but adding it for
    // accuracy's sake.
    if (!this.ind2 && this.marcTag > 99 && this.marcTag < 200) return false
    else return true;
  }
}

module.exports = SubjectVarfield
