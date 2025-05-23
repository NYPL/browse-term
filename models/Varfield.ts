import { valuesByKeys } from "../utils.ts";
import { headings, firstSubfields } from "../constants.js";
import type { VarfieldMarc, Subfield } from "../types.ts";

class Varfield {
  varfield: VarfieldMarc;
  marcTag: string;
  display: boolean;
  label: string;
  type: string;
  source: string;
  bibOnly: boolean;
  constructor(varfield: VarfieldMarc) {
    this.varfield = varfield;
    this.display = this.getDisplay();
    this.label = this.getLabel();
    this.type = this.getType();
    this.source = this.getSource();
    this.bibOnly = this.getBibOnly();
  }

  getSource() {
    return this.varfield.marcTag[0] !== "6" ? "authority" : "bib";
  }

  hasValidBibSubjectSource() {
    const cataloggedSource = this.getSubfieldContent("2")?.toLocaleLowerCase();
    return this.isBibOnly() || cataloggedSource?.includes("lcsh");
  }

  isBibOnly() {
    const cataloggedSource = this.getSubfieldContent("2")?.toLocaleLowerCase();
    return !(
      cataloggedSource?.includes("bookops") ||
      cataloggedSource?.includes("local")
    );
  }

  getBibOnly() {
    if (this.source !== "bib") return false;
    return this.varfield.marcTag === "690" || this.isBibOnly();
  }

  getDisplay() {
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

  getLabel(): string {
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

  getType(): string {
    const marcTag = this.varfield.marcTag;
    const digits = parseInt(marcTag, 10) % 100;
    return (headings as Record<number, string>)[digits];
  }
}

export default Varfield;
