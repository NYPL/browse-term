# Browse Term

A module that parses "browsable terms" (subjects, contributor names) from NYPL marc data. This module centralizes decisions about how to display and relate data.

## Usage

```
const { Subject } = require('@nypl/browse-term')

const marcDoc = {
  varFields: [
    {
      fieldTag: 'd',
      marcTag: '600',
      subfields: [
        { tag: 'a', content: 'Lovelace, Ada King,' },
        { tag: 'c', content: 'Countess of,' },
        { tag: 'd', content: '1815-1852' },
        { tag: 'v', content: 'Fiction.' }
      ]
    }
  }
}

const subject = new Subject(marcDoc)

if (!subject.skip && subject.preferredTerm?.label) {
  // This outputs "Lovelace, Ada King, Countess of, 1815-1852 -- Fiction.'"
  console.log(subject.preferredTerm.label)
}
```

Note the `Subject` instance also exposes all of these helpful properties:
 - `preferredTerm` {VarField} - Single, preferred VarField found in the document, which should be used for primary display.
 - `skip` {boolean} - Whether integrator should pass on this one due to deletion, suppression, or other reasons
 - `broaderTerms` {VariantVarfield[]} - Collection of variant VarField instances representing "broader" terms
 - `seeAlso` {VariantVArfield[]} - Collection of variant VarField instances representing "see also" terms
 - `uri` {string} - A uniqe identifier in the domain
 - `deleted` {boolean} - True if the given marc document is marked deleted
 - `bibOnly` {boolean} - True if the given marc document appears to represent a non-authoriy, bib-only subject
