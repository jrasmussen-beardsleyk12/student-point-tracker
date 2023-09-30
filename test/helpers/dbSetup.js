const dbUrl = process.env.DATABASE_URL;
// this gives us something like postgres://test-user@localhost:5432/test-db
// We then need to map these values to where the API server expects,
const dbUrlReg = /postgres:\/\/([\/\S]+)@([\/\S]+):(\d+)\/([\/\S]+)/;
const dbUrlParsed = dbUrlReg.exec(dbUrl);

// set the parsed URL as proper env
process.env.DB_HOST = dbUrlParsed[2];
process.env.DB_USER = dbUrlParsed[1];
process.env.DB_DB = dbUrlParsed[4];
process.env.DB_PORT = dbUrlParsed[3];

// Then since we want to make sure we don't initialize the config module, before we have set our values,
// we will define our own port to use here.
process.env.PORT = 8080;
