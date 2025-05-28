import { subjectLiteralFromSubfieldMap } from "../utils";
import { headings } from "../constants";
import type { VarfieldMarc, Subfield } from "../types";

class Varfield {
  varfield: VarfieldMarc;
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

  get cataloggedSource() {
    return this.getSubfieldContent("2")?.toLocaleLowerCase();
  }

  hasValidBibSubjectSource() {
    return (
      this.hasValidLocalSources() || this.cataloggedSource?.includes("lcsh")
    );
  }

  hasValidLocalSources() {
    return !!(
      this.cataloggedSource?.includes("bookops") ||
      this.cataloggedSource?.includes("local")
    );
  }

  getBibOnly() {
    if (this.source !== "bib") return false;
    return this.varfield.marcTag === "690" || this.hasValidLocalSources();
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
    return subjectLiteralFromSubfieldMap(this.buildSubfieldMap());
  }

  getType(): string {
    const marcTag = this.varfield.marcTag;
    const digits = parseInt(marcTag, 10) % 100;
    return headings[digits];
  }
}

export default Varfield;
