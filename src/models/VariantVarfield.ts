import Varfield from "./Varfield.ts";
import type { VarfieldMarc } from "../types.ts";

class VariantVarfield extends Varfield {
  subfieldW: string;
  isBroaderTerm: boolean;
  constructor(varfield: VarfieldMarc) {
    super(varfield);
    this.subfieldW = this.getSubfieldW();
    this.display = this.getDisplay();
    this.isBroaderTerm = this.getIsBroaderTerm();
  }

  getSubfieldW() {
    return this.getSubfieldContent("w");
  }

  getDisplay() {
    const referenceDisplay = this.subfieldW?.[3];
    // if there are only 2 characters, or has placeholder n
    if (!referenceDisplay || referenceDisplay === "n") {
      return true;
      // if specific do not display codes are present
    } else if (["a", "b", "c", "d"].includes(this.subfieldW?.[3])) {
      return false;
    }
  }

  getIsBroaderTerm() {
    const relationshipToPreferredTerm = this.subfieldW?.[0];
    if (relationshipToPreferredTerm === "g") return true;
    else return false;
  }
}

export default VariantVarfield;
