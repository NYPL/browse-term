const ContributorVarfield = require("./ContributorVarfield");
const mappings = require("../data/mappings.json");

class SeriesVarfield extends ContributorVarfield {
  get mappingGroup() {
    return mappings.seriesAddedEntry;
  }
}

module.exports = SeriesVarfield;
