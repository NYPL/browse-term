import Varfield from "./Varfield";
import type { VarfieldMarc } from "../types";

class VariantVarfield extends Varfield {
  constructor(varfield: VarfieldMarc) {
    super(varfield);
  }

  get subfieldW() {
    return this.getSubfieldContent("w");
  }

  get display() {
    const referenceDisplay = this.subfieldW?.[3];
    if (!referenceDisplay || referenceDisplay === "n") {
      return true;
    } else if (["a", "b", "c", "d"].includes(this.subfieldW?.[3])) {
      return false;
    }
  }

  get isBroaderTerm() {
    const relationshipToPreferredTerm = this.subfieldW?.[0];
    if (relationshipToPreferredTerm === "g") return true;
    else return false;
  }
}

export default VariantVarfield;
