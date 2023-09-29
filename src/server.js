const app = require("./main.js");
const { PORT } = require("./config.js")();
const database = require("./database.js");

if (process.env.PROD_STATUS === "dev") {
  console.log("Server is in Development Mode!");
}

const serve = app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  await exterminate("SIGTERM");
});

process.on("SIGINT", async () => {
  await exterminate("SIGINT");
});

async function exterminate(callee) {
  console.log(`${callee} signal received: closing HTTP server.`);
  await database.shutdownSQL();
  console.log("Exiting...");
  serve.close(() => {
    console.log("HTTP Server Closed");
  });
}
