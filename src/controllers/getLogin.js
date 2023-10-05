const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");

module.exports = {
  docs: {
    summary: "Maybe a test endpoint to look at how to handle auth"
  },
  endpoint: {
    endpointKind: "raw",
    method: "GET",
    paths: [ "/oauth2/redirect" ],
    rateLimit: "generic",
    successStatus: 200,
    options: {
      Allow: "GET",
      "X-Content-Type-Options": "nosniff"
    }
  },

  async logic(req, res, context) {
    //const auth = context.passport.authenticate("google", {
    //  successRedirect: "/",
    //  failureRedirect: "/login"
    //});
    //console.log(auth);
    //console.log(req);
    console.log("AHHHHH");
    res.status(200).send();
    return;
  }
};
