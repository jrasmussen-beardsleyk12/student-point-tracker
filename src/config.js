const fs = require("fs");
const yaml = require("js-yaml");

function getConfigFile() {
  try {
    let data = null;

    let fileContent = fs.readFileSync("./app.yaml", "utf8");
    data = yaml.load(fileContent);

    return data;
  } catch(err) {
    if (process.env.PROD_STATUS === "dev") {
      console.error(`Failed to load app.yaml in non-production env! ${err.toString()}`);
      data = {};

      return data;
    } else {
      console.error("Failed to load app.yaml!");
      console.error(err);
      process.exit(1);
    }
  }
}

function getConfig() {
  let data = getConfigFile();

  // Now our config is a JavaScript Object
  // And we will now use a custom object here to return all values
  return {
    PORT: process.env.PORT ?? data.PORT,
    SERVER_URL: process.env.SERVER_URL ?? data.SERVER_URL,
    DB_HOST: process.env.DB_HOST ?? data.DB_HOST,
    DB_USER: process.env.DB_USER ?? data.DB_USER,
    DB_PASS: process.env.DB_PASS ?? data.DB_PASS,
    DB_DB: process.env.DB_DB ?? data.DB_DB,
    DB_PORT: process.env.DB_PORT ?? data.DB_PORT,
    RATE_LIMIT_GENERIC: process.env.RATE_LIMIT_GENERIC ?? data.RATE_LIMIT_GENERIC,
    PAGINATION_LIMIT: process.env.PAGINATION_LIMIT ?? data.PAGINATION_LIMIT,
    SITE_NAME: process.env.SITE_NAME ?? data.SITE_NAME,
    CSV_DELIMITER: process.env.CSV_DELIMITER ?? data.CSV_DELIMITER,
    POINT_CHIPS: data.POINT_CHIPS ?? [],
    TASKS: data.TASKS
  };
}

module.exports = getConfig;
