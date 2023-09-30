const dbSetup = require("../node_modules/@databases/pg-test/jest/globalSetup");
const dbTeardown = require("../node_modules/@databases/pg-test/jest/globalTeardown");

async function test() {

  console.log("Setting up Local Database");
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

  // Then since we want to make sure we don't initialize the config module, before
  // we have set our values, we will define our own port to use here
  process.env.PORT = 8080;

  const app = require("./main.js");
  const database = require("./database.js");

  const serve = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });

  process.on("SIGTERM", async () => {
    await exterminate("SIGTERM", serve, database);
  });

  process.on("SIGINT", async () => {
    await exterminate("SIGINT", serve, database);
  });
}

async function exterminate(callee, serve, db) {
  console.log(`${callee} signal received: closing HTTP server.`);
  await db.shutdownSQL();
  await dbTeardown();
  console.log("Exiting...");
  serve.close(() => {
    console.log("HTTP Server Closed.");
  });
}

test();
