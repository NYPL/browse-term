import { valuesByKeys, headings } from '../utils'
import { subfieldsToIndex } from '../config.ts'

interface Subfield {
  content: string
  tag: string
}

interface Varfield {
  content: string
  fieldTag: string
  subfields: Subfield[]
  marcTag: string
}

class PreferredTermVarfield {
  varfield: Varfield
  label: string
  type: string
  display: boolean
  constructor (varfield: Varfield) {
    this.varfield = varfield
    this.label = this.getLabel()
    this.type = this.getType()
    this.display = true
  }

  getSubfieldContent (tag: string): string | undefined {
    const subfield = this.varfield.subfields?.find((sf) => sf.tag === tag)
    return subfield?.content
  }

  buildSubfieldMap (): Record<string, string> {
    return this.varfield.subfields.reduce(
      (subFieldMap: Record<string, string>, field: Subfield) => {
        subFieldMap[field.tag] = field.content
        return subFieldMap
      },
      {}
    )
  }

  getSubjectLiteral (): string {
    return (
      [
        valuesByKeys(
          this.buildSubfieldMap(),
          subfieldsToIndex.split(',')
        )
          .map((v: string) => (Array.isArray(v) ? v.join(' ') : v))
          .join(' '),
        valuesByKeys(this.buildSubfieldMap(), ['v', 'x', 'y', 'z'])
          .map((v: string | string[]) =>
            Array.isArray(v) ? v.join(' -- ') : v
          )
          .join(' -- ')
      ]
        // If either set of values matched nothing, drop it:
        .filter((v) => v)
        // Join sets together with ' -- ':
        .join(' -- ')
    )
  }

  getHeadingType (): string {
    const marcTag = this.varfield.marcTag
    const digits = parseInt(marcTag, 10) % 100
    return headings[digits]
  }
}

module.exports = {
  default: PreferredTermVarfield
}
