const fs = require("fs");
const compileStyleSheets = require("./compileStyleSheets.js");
let dbTeardown, database, serve;

(async () => {

  if (process.env.PROD_STATUS === "dev") {
    // We must complete dev setup steps prior to the rest of our requires
    const dbSetup = require("../node_modules/@databases/pg-test/jest/globalSetup");
    dbTeardown = require("../node_modules/@databases/pg-test/jest/globalTeardown");

    console.log("Server is in Development Mode!");

    await dbSetup();

    // lets take the value made by the test runner databse, and put it where the api server exects.
    const dbUrl = process.env.DATABASE_URL;
    // This gives us something like postgres://test-user@localhost:5432/test-db
    // We then need to map these values to where the API server expects
    const dbUrlReg = /postgres:\/\/([\/\S]+)@([\/\S]+):(\d+)\/([\/\S]+)/;
    const dbUrlParsed = dbUrlReg.exec(dbUrl);

    // set the parsed URl as proper env
    process.env.DB_HOST = dbUrlParsed[2];
    process.env.DB_USER = dbUrlParsed[1];
    process.env.DB_DB = dbUrlParsed[4];
    process.env.DB_PORT = dbUrlParsed[3];
  }

  const app = require("./main.js");
  const { PORT } = require("./config.js")();
  database = require("./database.js");
  const importer = require("./importer.js");

  serve = app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
  });

  await importer();

  compileStyleSheets();

})();

process.on("SIGTERM", async () => {
  await exterminate("SIGTERM");
});

process.on("SIGINT", async () => {
  await exterminate("SIGINT");
});

async function exterminate(callee) {
  console.log(`${callee} signal received: Shutting down Server.`);
  await database.shutdownSQL();

  if (process.env.PROD_STATUS === "dev") {
    await dbTeardown();
  }

  console.log("Exiting...");
  serve.close(() => {
    console.log("HTTP Server Closed");
  });

  process.exit(1);
}
