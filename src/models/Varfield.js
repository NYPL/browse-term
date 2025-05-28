import { subjectLiteralFromSubfieldMap } from "../utils.js";
import { headings } from "../constants.js";

class Varfield {
  constructor (varfield) {
    this.varfield = varfield;
    this.display = this.getDisplay();
    this.label = this.getLabel();
    this.type = this.getType();
    this.source = this.getSource();
    this.bibOnly = this.getBibOnly();
  }

  getSource () {
    return this.varfield.marcTag[0] !== "6" ? "authority" : "bib";
  }

  get cataloggedSource () {
    return this.getSubfieldContent("2")?.toLocaleLowerCase();
  }

  hasValidBibSubjectSource () {
    return (
      this.hasValidLocalSources() || this.cataloggedSource?.includes("lcsh")
    );
  }

  hasValidLocalSources () {
    return !!(
      this.cataloggedSource?.includes("bookops") ||
      this.cataloggedSource?.includes("local")
    );
  }

  getBibOnly () {
    if (this.source !== "bib") return false;
    return this.varfield.marcTag === "690" || this.hasValidLocalSources();
  }

  getDisplay () {
    return true;
  }

  getSubfieldContent (tag) {
    const subfield = this.varfield.subfields?.find((sf) => sf.tag === tag);
    return subfield?.content;
  }

  buildSubfieldMap () {
    return this.varfield.subfields.reduce(
      (subFieldMap, field) => {
        subFieldMap[field.tag] = field.content;
        return subFieldMap;
      },
      {}
    );
  }

  getLabel () {
    return subjectLiteralFromSubfieldMap(this.buildSubfieldMap());
  }

  getType () {
    const marcTag = this.varfield.marcTag;
    const digits = parseInt(marcTag, 10) % 100;
    return headings[digits];
  }
}

export default Varfield;
