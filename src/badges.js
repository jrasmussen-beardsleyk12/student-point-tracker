const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

const { CacheCollection } = require("./cache.js");

const badgeCache = new CacheCollection();

function registerBadges() {
  let badgeData = readBadgeFile();

  // Now with our badges we can go ahead and begin loading them one by one

  for (const badge of badgeData.badges) {
    // Lets now validate this badge
    if (!validateBadge(badge)) {
      console.error(`The badge '${badge.name || badge.id}' doesn't seem to be valid...`);
      continue;
    }

    if (badge.rule.endsWith("js")) {
      badge.__file = require(`./storage/${badge.rule}`)
    }

    badgeCache.add(badge.id, badge);
  }

  return badgeCache;
}

function validateBadge(badge) {
  if (typeof badge.id !== "string") {
    return false;
  } else if (typeof badge.name !== "string") {
    return false;
  } else if (typeof badge.icon !== "string") {
    return false;
  } else if (typeof badge.rule !== "string") {
    return false;
  }

  return true;
}

function readBadgeFile() {
  let data = null;
  let defaultData = { badges: [] };

  try {
    if (!fs.existsSync("./storage/badges.yaml")) {
      return defaultData;
    }

    let fileContent = fs.readFileSync("./storage/badges.yaml", "utf8");

    data = yaml.load(fileContent);

  } catch(err) {
    console.error(err);
  }

  if (data === null) {
    return defaultData;
  }

  return data;
}

module.exports = {
  registerBadges,
  validateBadge,
  readBadgeFile,
};
