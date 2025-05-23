export interface Subfield {
  content: string;
  tag: string;
}

export interface VarfieldMarc {
  fieldTag: string;
  subfields: Subfield[];
  marcTag: string;
}
