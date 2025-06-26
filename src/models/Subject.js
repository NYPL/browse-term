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
    ).filter(({ display }) => display);
    this.variants = this.fourXXFields.filter(({ display }) => display)
    this.preferredTerm = this.getPreferredTerm();
    this.suppressed = this.suppressed(authorityRecord.suppressed);
    this.uri = authorityRecord.id;
    this.deleted = authorityRecord.deleted;
  }

  suppressed () {
    let suppressCriteria = [];
    suppressCriteria.push(this.isDeprecatedLocalAuthority());
    return suppressCriteria.some((criteria) => criteria);
  }

  /**
   * Determine if a given authority record has metadata which indicates
   * it is an outdated record. Note this method is inspecting an expected
   * 667 field on a Sierra authority record, not a 667 field coming from a bib
   * subject.
   * @returns boolean
   */
  isDeprecatedLocalAuthority () {
    const sixSixSeven = this.getVarfieldByMarcTag("667");
    if (!sixSixSeven || !sixSixSeven.subfields) return false;
    const sixSixSevenVarfield = new Varfield(sixSixSeven);
    const subfieldA = sixSixSevenVarfield.getSubfieldContent("a");
    return subfieldA?.includes("NYPL LOCAL AUTHORITY RECORD (SUBJECT)");
  }

  getVarfieldByMarcTag (marcTagToMatch) {
    return this.varfields.find(
      ({ marcTag }) => marcTag === marcTagToMatch
    );
  }

  fieldTag (tag) {
    const fieldTag = this.varfields.find(
      (f) => f.fieldTag === tag
    );
    return fieldTag;
  }
  /**
   * Builds Varfield instance for the varfield with field tag 'd'. 
   * @returns Varfield
   */
  getPreferredTerm () {
    try {
      let preferredTermMarc
      // sierra subject marc and authority marc
      preferredTermMarc = this.fieldTag('d')
      return new Varfield(preferredTermMarc);
    } catch (e) {
      throw new InvalidSubjectDataError(`Invalid subject data: \n ${e.message}`)
    }
  }

  /**
  * Get varfields by matching hundreds digit
  *
  * @param {number} number - The hundreds range. E.g. 400, 500, 700
  */
  getXXFields (number) {
    // Match fields in range number to number+99
    const xxFields = this.varfields.filter((field) => {
      const tag = parseInt(field.marcTag, 10);
      return tag >= number && tag < number + 100;
    });
    return xxFields
      .filter((field) => field.subfields?.length)
      .map((field) => {
        return new VariantVarfield(field)
      })
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
