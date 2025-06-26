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
    // TODO: A tack we've taken elsewhere is to have a single "suppressed" value
    // that evaluates to true if the record is suppressed, deleted, or meets some
    // other fiddly business criteria - since usually we don't care _why_ as
    // much as _whether. Is 'skip' synonymous with this "is suppressed" idea?
    // "Skip" suggests knowledge of an outside process that should be "skipped",
    // which ideally this module is unaware of. I think I'd just expose the
    // suppressed/deleted status and let the outside process decide what to do
    this.skip = this.getSkip(authorityRecord.suppressed);
    // TODO This will be null for a bib-only subject?
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
    // TODO use .find?
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
      preferredTermMarc = this.fieldTag('d')
      // If we failed to find a fieldTag d, use any 6xx
      // TODO: Use getXXFields for this?
      if (!preferredTermMarc) preferredTermMarc = this.varfields.find((varfield) => varfield.marcTag[0] === "6")
      return new Varfield(preferredTermMarc);
    } catch (e) {
      throw new InvalidSubjectDataError(`Invalid subject data: \n ${e.message}`)
    }
  }
  
  // TODO Would love to see more documentation like:
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
    return xxFields.map((field) => {
      // TODO Instead of mapping to null and then filtering out nulls, maybe
      // .filter out elements without subfields and then map to instances?
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
