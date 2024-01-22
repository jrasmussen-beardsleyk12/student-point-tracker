module.exports = {
  schema: {},
  query: (req) => {
    // TODO: Follow validation tecnique from here: https://github.com/fairfield-programming/ducks/blob/master/src/DuckStringParser.js
    const prov = req.params.duckString;

    if (typeof prov !== "string") {
      return "";
    }

    return prov;
  }
}
