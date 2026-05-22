const mappings = require('./data/mappings.json')

exports.headings = {
  0: 'Personal Name',
  10: 'Corporate Name',
  11: 'Meeting Name',
  30: 'Uniform Title',
  47: 'Named Event',
  48: 'Chronological Term',
  50: 'Topical Term',
  51: 'Geographic Name',
  55: 'Genre/Form Term',
  62: 'Medium of Performance Term',
  80: 'General Subdivision',
  81: 'Geographic Subdivision',
  82: 'Chronological Subdivision',
  85: 'Form Subdivision'
}

exports.firstSubfields = mappings.subjects.first

exports.lastSubfields = mappings.subjects.last
