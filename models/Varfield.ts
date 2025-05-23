import { valuesByKeys } from "../utils.ts";
import { headings, firstSubfields } from "../constants.js";
import type { VarfieldMarc, Subfield } from "../types.ts";

class Varfield {
  varfield: VarfieldMarc;
  constructor(varfield: VarfieldMarc) {
    this.varfield = varfield;
  }
  get display() {
    return true;
  }

  getSubfieldContent(tag: string): string | undefined {
    const subfield = this.varfield.subfields?.find((sf) => sf.tag === tag);
    return subfield?.content;
  }

  buildSubfieldMap(): Record<string, string> {
    return this.varfield.subfields.reduce(
      (subFieldMap: Record<string, string>, field: Subfield) => {
        subFieldMap[field.tag] = field.content;
        return subFieldMap;
      },
      {}
    );
  }

  get label(): string {
    return (
      [
        valuesByKeys(this.buildSubfieldMap(), firstSubfields)
          .map((v: string) => (Array.isArray(v) ? v.join(" ") : v))
          .join(" "),
        valuesByKeys(this.buildSubfieldMap(), ["v", "x", "y", "z"])
          .map((v: string | string[]) =>
            Array.isArray(v) ? v.join(" -- ") : v
          )
          .join(" -- "),
      ]
        // If either set of values matched nothing, drop it:
        .filter((v) => v)
        // Join sets together with ' -- ':
        .join(" -- ")
    );
  }

  get type(): string {
    const marcTag = this.varfield.marcTag;
    const digits = parseInt(marcTag, 10) % 100;
    return (headings as Record<number, string>)[digits];
  }
}

export default Varfield;
