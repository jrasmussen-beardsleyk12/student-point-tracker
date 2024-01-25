// Contains small helper utilities for EJS templates

const path = require("path");

function findAssetPath(assetName) {
  const assetNameParts = path.parse(assetName);

  // Then we know that all of our assets are available at the root of the webserver
  // so we just need to modify the extension based on what's needed
  let ext = "";

  if (assetNameParts.ext === ".js") {
    ext = ".min.js";
  }

  return `/${assetNameParts.name}${ext}`;
}

module.exports = {
  findAssetPath
};
