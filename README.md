# Browse term

## Purpose

This npm package was created as a central location for the logic around generating browseable terms. Currently, it is pretty hardcoded for Subject string generation. The model is based on MARC21 [authority records](https://www.loc.gov/marc/authority/).

## Authority model

Authority records have a 1xx varfield, which contains the subfields that create the preferred term for that authority record. There are also 4xx and 5xx varfields, which are used to represent "See from" and "See also" terms. "See from", aka variant terms in LSP parlance, represent alternate forms of the preferred term that do not connect to other authority records. These include outdated terminology and synonyms. "See also" terms encompass broader terms, and a variety of relationships to other authority records. These terms should exactly correspond to a 1xx in another authority recrod.

This module is not responsible for determining what kind of authority record is being passed to it. The consuming apps of this module rely on the field tag of the 1xx field to determine what kind of authority record we are dealing with.

## Usage

### Installation

```
nvm use
npm i
```

### Testing

This repo uses the native node testing library. To run tests:
`npm test`

### Authority record parsing

The Subject class is intended to transform an entire authority record into a browseable term model with a single preferred term, and any number of variant (4xx) and broader terms (5xx), and seeAlso terms (5xx fields not covered by broader terms). For this use, instantiate a Subject with a subject authority marc record.

### Bib field parsing

This module should also be used to build any bib data that is used to link to a browse index. To build that bib data, the Varfield class should be instantiated with a single bib varfield.
