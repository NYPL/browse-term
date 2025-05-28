export interface Subfield {
  content: string;
  tag: string;
}

export interface VarfieldMarc {
  fieldTag: string;
  marcTag: string;
  ind1: string;
  ind2: string;
  subfields: { tag: string; content: string }[];
  content?: undefined;
}

export interface AuthorityRecord {
  varFields: VarfieldMarc[];
  id?: number;
  updatedDate?: string;
  createdDate?: string;
  deleted?: boolean;
  suppressed?: boolean;
}
