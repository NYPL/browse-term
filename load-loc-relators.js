const fs = require('fs')

const theThing = async () => {
  let relators
  const relatorsDomain = 'id.loc.gov/vocabulary/relators'
  try {
    relators = await fetch(`https://${relatorsDomain}.json`)
    relators = await relators.json()
  } catch (e) {
    console.error('error loading loc relators')
    return
  }
  relators = relators.reduce((map, relatorEntity) => {
    if (relatorEntity['@id'].startsWith(`http://${relatorsDomain}`)) {
      const abbreviated = relatorEntity['http://www.loc.gov/mads/rdf/v1#code']?.[0]?.['@value']
      const label = relatorEntity['http://www.loc.gov/mads/rdf/v1#authoritativeLabel']?.[0]?.['@value']
      if (abbreviated && label)
        map[abbreviated] = label
    }
    return map
  }, {})
  fs.writeFileSync('./src/data/relators.json', JSON.stringify(relators))
}

theThing()