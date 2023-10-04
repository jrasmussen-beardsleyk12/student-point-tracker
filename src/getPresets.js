const fs = require("fs");
const yaml = require("js-yaml");

module.exports =
function getPresets() {
  let data = null;
  let defaultData = { add: [], remove: [] };

  try {

    if (!fs.existsSync("./storage/point_presets.yaml")) {
      return defaultData;
    }

    let fileContent = fs.readFileSync("./storage/point_presets.yaml", "utf8");

    data = yaml.load(fileContent);

  } catch(err) {
    console.error(err);
  }

  if (data === null) {
    return defaultData;
  }

  return data;
}
