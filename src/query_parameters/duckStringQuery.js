module.exports = {
  schema: {},
  query: (req) => {
    // TODO: Use the same logic as above (duckString)
    const prov = req.query.duckStringQuery;

    if (typeof prov !== "string") {
      return "";
      // Maybe return the default duck instead?
    }

    return prov;
  }
}
