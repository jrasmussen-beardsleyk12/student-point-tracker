const fs = require("fs");
const yaml = require("js-yaml");

function getConfigFile() {
  try {
    let data = null;

    let fileContent = fs.readFileSync("./app.yaml", "utf8");
    data = yaml.load(fileContent);
  } catch(err) {
    if (process.env.PROD_STATUS === "dev") {
      console.error(`Failed to load app.yaml in non-production env! ${err.toString()}`);
      data = {
        env_variables: {}
      };

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
    PORT: process.env.PORT ?? data.env_variables.PORT,
    SERVER_URL: process.env.SERVER_URL ?? data.env_variables.SERVER_URL,
    DB_HOST: process.env.DB_HOST ?? data.env_variables.DB_HOST,
    DB_USER: process.env.DB_USER ?? data.env_variables.DB_USER,
    DB_PASS: process.env.DB_PASS ? data.env_variables.DB_PASS,
    DB_DB: process.env.DB_DB ?? data.env_variables.DB_DB,
    DB_PORT: process.env.DB_PORT ?? data.env_variables.DB_PORT,
    RATE_LIMIT_GENERIC: process.env.RATE_LIMIT_GENERIC ?? data.env_variables.RATE_LIMIT_GENERIC
  };
}

module.exports = getConfig;
