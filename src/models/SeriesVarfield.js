const ContributorVarfield = require("./ContributorVarfield");
const mappings = require("../data/mappings.json");

class SeriesVarfield extends ContributorVarfield {
  get mappingGroup() {
    return Object.fromEntries(
      Object.entries(mappings.contributors).map(([key, portions]) => [
        key,
        Object.fromEntries(
          Object.entries(portions).map(([portion, tags]) => [
            portion,
            portion === "title"
              ? tags.filter((tag) => tag !== "v" && tag !== "x")
              : tags,
          ])
        ),
      ])
    );
  }
}

module.exports = SeriesVarfield;
