// The CONST Context - Enables access to all other modules within the system
// By passing this object to everywhere needed allows not only easy access but
// greater control in mocking these later on.

module.exports = {
  config: require("./config.js")()
};
