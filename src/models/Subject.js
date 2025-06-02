const Varfield = require("./Varfield.js")
const VariantVarfield = require("./VariantVarfield.js")

class Subject {
  constructor (authorityRecord, preferredTermSubfield = "d") {
    this.varfields = authorityRecord.varFields;
    this.broaderTerms = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => isBroaderTerm
    );
    this.seeAlso = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => !isBroaderTerm
    );
    this.preferredTerm = this.getPreferredTerm(preferredTermSubfield);
    this.skip = this.getSkip(authorityRecord.suppressed);
    this.uri = authorityRecord.id;
    this.deleted = authorityRecord.deleted;
  }

  getSkip (suppressed = false) {
    let skipCriteria = [];
    skipCriteria.push(suppressed);
    skipCriteria.push(this.isDeprecatedLocalAuthority());
    skipCriteria.push(this.skipBibSubject());
    return skipCriteria.some((criteria) => criteria);
  }

  skipBibSubject () {
    return (
      this.preferredTerm.source === "bib" &&
      !this.preferredTerm.hasValidBibSubjectSource()
    );
  }

  // This method is inspecting a 6xx field on an authority record, not
  // a 6xx field coming from a bib subject.
  isDeprecatedLocalAuthority () {
    const sixSixSeven = this.getVarfieldByMarcTag("667");
    if (!sixSixSeven) return false;
    const sixSixSevenVarfield = new Varfield(sixSixSeven);
    const subfieldA = sixSixSevenVarfield.getSubfieldContent("a");
    return subfieldA?.includes("NYPL LOCAL AUTHORITY RECORD (SUBJECT)");
  }

  getVarfieldByMarcTag (marcTagToMatch) {
    return this.varfields.filter(
      ({ marcTag }) => marcTag === marcTagToMatch
    )[0];
  }

  fieldTag (tag) {
    const fieldTag = this.varfields.find(
      (f) => f.fieldTag === tag
    );
    return fieldTag;
  }

  getPreferredTerm (tag) {
    return new Varfield(this.fieldTag(tag));
  }

  getXXFields (number) {
    const xxFields = this.varfields.filter((field) => {
      const tag = parseInt(field.marcTag, 10);
      return tag >= number && tag < number + 100;
    });
    return xxFields.map((field) => new VariantVarfield(field));
  }

  get sixXXfields () {
    return this.getXXFields(600);
  }
  get fiveXXFields () {
    return this.getXXFields(500);
  }

  get fourXXFields () {
    return this.getXXFields(400);
  }
}

module.exports = Subject;
