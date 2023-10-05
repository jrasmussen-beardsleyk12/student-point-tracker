const express = require("express");
const rateLimit = require("express-rate-limit");
const { MemoryStore } = require("express-rate-limit");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");

const session = require("express-session");
const SessionMemoryStore = require("session-memory-store")(session);

const endpoints = require("./controllers/endpoints.js");
const context = require("./context.js");

const app = express();

// Define our Rate Limiters
const genericLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // Limit each IP per window
  limit: context.config.RATE_LIMIT_GENERIC,
  validate: process.env.PROD_STATUS === "dev", // Setting true or false; disables or enables all validations
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: true, // Legacy rate limit info in headers
  store: new MemoryStore(), // use default memory store
  message: "Too many requests, please try again later.", // Message once limit is reached
  statusCode: 429, // HTTP Status code once limit is reached
  handler: (request, response, next, options) => {
    response.status(options.statusCode).json({ message: options.message });
    context.logger.httpLog(request, response);
  }
});

// --- Authentication Setup ---

app.use(session({
  secret: "test",
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true },
  //store: new SessionMemoryStore()
}));

app.use(passport.authenticate("session"));

passport.serializeUser(function(user, cb) {
  console.log("Deserialize user");
  process.nextTick(function() {
    cb(null, user);
    // This will allow the user object being passed to be available via
    // req.session.passport.user
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use("google", new GoogleStrategy({
  clientID: context.config.GOOGLE_CLIENT_ID,
  clientSecret: context.config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/oauth2/redirect",
  scope: [ "profile", "email", "openid" ]
}, (issuer, profile, cb) => {
  console.log("Stuff has happened!");
  console.log("Issuer:");
  console.log(issuer);
  console.log("Profile:");
  console.log(profile);
  console.log("CB:");
  console.log(cb);

  if (profile.emails[0].value.endsWith(context.config.DOMAIN)) {
    const usrObj = {
      issuer: issuer,
      id: profile.id,
      displayName: profile.displayName,
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      email: profile.emails[0].value
    };

    return cb(null, usrObj);
  } else {
    console.error(profile);
    return cb(`Bad email domain attempted to be used during login! '${profiles.emails[0].value}'`);
  }
}));

app.get("/login", passport.authenticate("google"));

app.get("/oauth2/redirect", passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

const endpointHandler = async function(node, req, res) {
  let params = {};

  for (const param in node.params) {
    params[param] = node.params[param](context, req);
  }

  if (typeof node.preLogic === "function") {
    await node.preLogic(req, res, context);
  }

  let obj;

  if (node.endpoint.endpointKind === "raw") {
    await node.logic(req, res, context);
    // If it's a raw endpoint, they must handle all other steps manually
    return;
  } else {
    obj = await node.logic(params, context);
  }

  if (typeof node.postLogic === "function") {
    await node.postLogic(req, res, context);
  }

  obj.addGoodStatus(node.endpoint.successStatus);

  obj.handleReturnHTTP(req, res, context);

  if (typeof node.postReturnHTTP === "function") {
    await node.postReturnHTTP(req, res, context, obj);
  }

  return;
};

// Setup all endpoints

app.use((req, res, next) => {
  req.start = Date.now();
  next();
});

app.use(express.static("./static"));

const pathOptions = [];

for (const node of endpoints) {
  for (const path of node.endpoint.paths) {

    let limiter = genericLimit;

    if (node.endpoint.rateLimit === "generic") {
      limiter = genericLimit;
    }

    if (!pathOptions.includes(path)) {
      app.options(path, genericLimit, async (req, res) => {
        res.header(node.endpoint.options);
        res.sendStatus(204);
        return;
      });
      pathOptions.push(path);
    }

    switch(node.endpoint.method) {
      case "GET":
        app.get(path, limiter, async (req, res) => {
          await endpointHandler(node, req, res);
        });
        break;
      case "POST":
        app.post(path, limiter, async (req, res) => {
          await endpointHandler(node, req, res);
        });
        break;
      case "DELETE":
        app.delete(path, limiter, async (req, res) => {
          await endpointHandler(node, req, res);
        });
        break;
      default:
        context.logger.generic(`Unsupported method: ${node.endpoint.method} for ${path}`, "warn");
    }
  }
}

app.use(async (err, req, res, next) => {
  // Having this as last positional route, ensures it will handle all other unknown routes.
  // This can also handle unhandled errors passed from another endpoint
  if (err) {
    context.logger.generic(
      `An error was encountered handling the request: ${err.toString()}`,
      "error"
    );
    const sso = new context.sso();
    return sso.notOk().addShort("server_error")
              .addContent(`An error was encountered handling the request: ${err.toString()}`);
    return;
  }
  const sso = new context.sso();
  return sso.notOk().addShort("not_found");
});

module.exports = app;
