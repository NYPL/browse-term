const ContributorVarfield = require("./ContributorVarfield.js");
class ContributorVariantVarfield extends ContributorVarfield {
  constructor (varfield) {
    super(varfield);
    this.subfieldW = this.getSubfieldW();
    this.suppressed = this.isSuppressed();
    this.isBroaderTerm = this.getIsBroaderTerm();
  }

  getSubfieldW () {
    return this.getSubfieldContent("w");
  }

  isSuppressed () {
    const referenceDisplay = this.subfieldW?.[3];
    // if there are only 2 characters, or has placeholder n
    if (!referenceDisplay || referenceDisplay === "n") {
      return false;
      // if specific do not display codes are present
    } else if (["a", "b", "c", "d"].includes(this.subfieldW?.[3])) {
      return true;
    }
  }

  getIsBroaderTerm () {
    const relationshipToPreferredTerm = this.subfieldW?.[0];
    if (relationshipToPreferredTerm === "g") return true;
    else return false;
  }
}

module.exports = ContributorVariantVarfield;
