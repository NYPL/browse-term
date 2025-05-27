import type { VarfieldMarc } from "../types.ts";
import Varfield from "./Varfield.ts";
import VariantVarfield from "./VariantVarfield.ts";

class Subject {
  preferredTerm: Varfield;
  seeAlso: VariantVarfield[];
  broaderTerms: VariantVarfield[];
  varfields: VarfieldMarc[];
  bibOnly: boolean;
  source: string;
  skip: boolean;
  constructor(varfields: VarfieldMarc[]) {
    this.varfields = varfields;
    this.broaderTerms = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => isBroaderTerm
    );
    this.seeAlso = this.fiveXXFields.filter(
      ({ isBroaderTerm }) => !isBroaderTerm
    );
    this.preferredTerm = this.getPreferredTerm();
    this.bibOnly = this.preferredTerm.bibOnly;
    this.source = this.preferredTerm.source;
    this.skip = this.getSkip();
  }

  getSkip() {
    let skipCriteria = [];
    skipCriteria.push(this.isDeprecatedLocalAuthority());
    skipCriteria.push(this.skipBibSubject());
    return skipCriteria.some((criteria) => criteria);
  }

  skipBibSubject() {
    return (
      this.preferredTerm.source === "bib" &&
      !this.preferredTerm.hasValidBibSubjectSource()
    );
  }

  // This method is inspecting a 6xx field on an authority record, not
  // a 6xx field coming from a bib subject.
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

  getPreferredTerm() {
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

export default Subject;
