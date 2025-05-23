import type { VarfieldMarc } from "../types.ts";
import Varfield from "./Varfield.ts";
import VariantVarfield from "./VariantVarfield.ts";

class BrowseableTerm {
  seeAlso: VariantVarfield[];
  broaderTerms: VariantVarfield[];
  varfields: VarfieldMarc[];
  bibOnly: boolean;
  source: string;
  constructor(varfields: VarfieldMarc[]) {
    this.varfields = varfields;
    this.broaderTerms = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => isBroaderTerm
    );
    this.seeAlso = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => !isBroaderTerm
    );
    this.bibOnly = this.preferredTermVarfield.bibOnly;
    this.source = this.preferredTermVarfield.source;
  }

  get skip() {
    let skipCriteria = [];
    skipCriteria.push(this.isDeprecatedLocalAuthority());
    skipCriteria.push(this.skipBibSubject());
    return skipCriteria.some((criteria) => criteria);
  }

  skipBibSubject() {
    return (
      this.preferredTermVarfield.source === "bib" &&
      !this.preferredTermVarfield.isValidBibSubjectSource()
    );
  }

  isDeprecatedLocalAuthority() {
    const sixSixSeven = this.getVarfieldByMarcTag("667");
    if (!sixSixSeven) return false;
    const sixSixSevenVarfield = new Varfield(sixSixSeven);
    const subfieldA = sixSixSevenVarfield.getSubfieldContent("a");
    return subfieldA.includes("NYPL LOCAL AUTHORITY RECORD (SUBJECT)");
  }

  getVarfieldByMarcTag(marcTagToMatch: string) {
    return this.varfields.filter(
      ({ marcTag }) => marcTag === marcTagToMatch
    )[0];
  }

  get fieldTagD() {
    const fieldTagD = this.varfields.find(
      (f: VarfieldMarc) => f.fieldTag === "d"
    );
    return fieldTagD;
  }

  get preferredTermVarfield() {
    return new Varfield(this.fieldTagD);
  }

  getXXFields(number: 400 | 500 | 600) {
    const xxFields = this.varfields.filter((field: VarfieldMarc) => {
      const tag = parseInt(field.marcTag, 10);
      return tag >= number && tag < number + 100;
    });
    return xxFields.map((field) => new VariantVarfield(field));
  }

  get sixXXfields() {
    return this.getXXFields(600);
  }
  get fiveXXFields() {
    return this.getXXFields(500);
  }

  get fourXXFields() {
    return this.getXXFields(400);
  }
}

export default BrowseableTerm;
