# Browse term

## Purpose

This npm package was created as a central location for the logic around generating browseable terms. It also is the source of truth for what subfields are used to index Authoritys, and potentially other browse terms in the future. Currently, it is pretty hardcoded for Authority string generation. The model is based on MARC21 [authority records](https://www.loc.gov/marc/authority/).

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

### Publishing

`npm run build-publish` will bump to the next patch version and publish to npm.
If you intend to bump a minor or major version:

1. Update the version manually in `package.json`
2. run `npm i`
3. commit
4. run `npm publish`

### Record parsing

There are two classes exposed from `index.js` file of this repo: `Authority` and `Varfield`. `Authority` uses the `Varfield` class under the hood, and organizes those varfields.

#### Authority record parsing

The `Authority` class is intended to transform an entire authority record into a browseable term model with a single preferred term, and any number of variant (4xx) and broader terms (5xx), and seeAlso terms (5xx fields not covered by broader terms). For this use, instantiate a Authority with a Authority authority marc record.

For example:

```
import Authority from "@nypl/browse-term"

const Authority = new Authority({
  "id": 11838157,
  "updatedDate": "2011-06-21T15:30:35Z",
  "createdDate": "2009-03-06T01:12:39Z",
  "deleted": false,
  "suppressed": false,
  "varFields": [
    {
      "fieldTag": "d",
      "marcTag": "150",
      "ind1": " ",
      "ind2": " ",
      "subfields": [
        {
          "tag": "a",
          "content": "Horror tales"
        },
        {
          "tag": "b",
          "content": "spooky"
        }
      ]
    },
    {
      "fieldTag": "e",
      "marcTag": "450",
      "ind1": " ",
      "ind2": " ",
      "subfields": [
        {
          "tag": "a",
          "content": "Horror"
        },
        {
          "tag": "v",
          "content": "Fiction"
        }
      ]
    }]})

console.log(Authority.preferredTerm) // "Horror tales spooky"
console.log(Authority.variants.map(v=> v.label) // ["Horror -- Fiction"]
```

#### Bib field parsing

This module should also be used to build any bib data that is used to link to a browse index. To build that bib data, the `Varfield` class should be instantiated with a single bib varfield.

Example:

```
import Varfield from "@nypl/browse-term"
const subjectLiteral = new Varfield({
      "fieldTag": "d",
      "marcTag": "450",
      "ind1": " ",
      "ind2": " ",
      "subfields": [
        {
          "tag": "a",
          "content": "Horror"
        },
        {
          "tag": "v",
          "content": "Fiction"
        }
      ]
    })

console.log(subjectLiteral.label) // "Horror -- Fiction"
```
