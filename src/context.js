// The CONST Context - Enables access to all other modules within the system
// By passing this object to everywhere needed allows not only easy access but
// greater control in mocking these later on.

module.exports = {
  config: require("./config.js")(),
  query: require("./query.js"),
  database: require("./database.js"),
  logger: require("./logger.js"),
  getPresets: require("./getPresets.js"),
  sso: require("./models/sso.js"),
  ssoPaginate: require("./models/ssoPaginate.js"),
  studentObject: require("./models/studentObject.js"),
  studentObjectArray: require("./models/studentObjectArray.js"),
  pointsObjectArray: require("./models/pointsObjectArray.js")
};
