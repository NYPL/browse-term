const logger = require("../logger.js")
const SubjectVarfield = require("./SubjectVarfield.js")
const VariantVarfield = require("./VariantVarfield.js")
const ContributorVarfield = require("./ContributorVarfield.js")

class Authority {
  constructor ({ VarfieldModel, VariantModel, authorityRecord, fieldTagValue, stripPeriods = false }) {
    this.sourceId = authorityRecord.id;
    this.VarfieldModel = VarfieldModel
    this.VariantModel = VariantModel
    this.fieldTagValue = fieldTagValue
    this.stripPeriods = stripPeriods
    this.deleted = authorityRecord.deleted;
    this.varfields = authorityRecord.varFields;

    this.broaderTerms = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => isBroaderTerm
    );
    this.seeAlso = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => !isBroaderTerm
    ).filter(({ suppressed }) => !suppressed);
    this.variants = this.fourXXFields.filter(({ suppressed }) => !suppressed)
    this.preferredTerm = this.getPreferredTerm();
    this.suppressed = this.suppressed();
  }

  newVarfield (args) {
    return new this.VarfieldModel(args, this.stripPeriods)
  }

  newVariantVarfield (args) {
    return new this.VariantModel(args, this.stripPeriods)
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
   * Authority.
   * @returns boolean
   */
  isDeprecatedLocalAuthority () {
    const sixSixSeven = this.getVarfieldByMarcTag("667");
    if (!sixSixSeven || !sixSixSeven.subfields) return false;
    const sixSixSevenVarfield = this.newVarfield(sixSixSeven);
    const subfieldA = sixSixSevenVarfield.getSubfieldContent("a");
    return subfieldA?.includes("NYPL LOCAL AUTHORITY RECORD (Authority)");
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
      // sierra Authority marc and authority marc
      preferredTermMarc = this.fieldTag(this.fieldTagValue)
      return this.newVarfield(preferredTermMarc);
    } catch (e) {
      if (this.deleted) return
      logger.error(`Invalid Authority data: \n ${e.message}`)
    }
  }


  /**
  * Get varfields by matching hundreds digit
  *
  * @param {number} number - The hundreds range. E.g. 400, 500, 700
  */
  getXXFields (number) {
    const xxFields = this.varfields.filter((field) => {
      const tag = parseInt(field.marcTag, 10);
      return tag >= number && tag < number + 100;
    });
    return xxFields
      .filter((field) => field.subfields?.length)
      .map((field) => {
        return this.newVariantVarfield(field)
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

Authority.subjectFactory = (authorityRecord, stripPeriods = false) => {
  return new Authority({ authorityRecord, stripPeriods, fieldTagValue: 'd', VarfieldModel: SubjectVarfield, VariantModel: VariantVarfield })
}

Authority.contributorFactory = (authorityRecord, stripPeriods = false) => {
  return new Authority({ authorityRecord, stripPeriods, fieldTagValue: 'a', VarfieldModel: ContributorVarfield, VariantModel: VariantVarfield })
}

module.exports = Authority
