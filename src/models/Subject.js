const Varfield = require("./Varfield.js")
const VariantVarfield = require("./VariantVarfield.js")
const { InvalidSubjectDataError } = require("../errors.js")
class Subject {
  constructor (authorityRecord) {
    this.varfields = authorityRecord.varFields;
    this.broaderTerms = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => isBroaderTerm
    );
    this.seeAlso = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => !isBroaderTerm
    );
    this.preferredTerm = this.getPreferredTerm();
    this.skip = this.getSkip(authorityRecord.suppressed);
    this.uri = authorityRecord.id;
    this.deleted = authorityRecord.deleted;
    this.bibOnly = this.preferredTerm.getBibOnly();
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
    if (!sixSixSeven || !sixSixSeven.subfields) return false;
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

  getPreferredTerm () {
    try {
      let preferredTermMarc
      if (this.varfields.length === 1) preferredTermMarc = this.varfields[0]
      else preferredTermMarc = this.fieldTag('d')
      return new Varfield(preferredTermMarc);
    } catch (e) {
      throw new InvalidSubjectDataError(`Invalid subject data: \n ${e.message}`)
    }
  }

  getXXFields (number) {
    const xxFields = this.varfields.filter((field) => {
      const tag = parseInt(field.marcTag, 10);
      return tag >= number && tag < number + 100;
    });
    return xxFields.map((field) => {
      if (!field?.subfields?.length) return
      return new VariantVarfield(field)
    }).filter(x => x);
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
