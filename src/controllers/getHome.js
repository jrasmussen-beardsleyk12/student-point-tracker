const ejs = require("ejs");
const path = require("node:path");

module.exports = {
  docs: {
    summary: "Home Webpage of the application."
  },
  endpoint: {
    endpointKind: "raw",
    method: "GET",
    paths: [ "/" ],
    rateLimit: "generic",
    successStatus: 200,
    options: {
      Allow: "GET",
      "X-Content-Type-Options": "nosniff"
    }
  },

  async logic(req, res, context) {
    const template = await ejs.renderFile("./views/pages/home.ejs",
      {
        name: context.config.SITE_NAME
      },
      {
        views: [ path.resolve("./views") ]
      }
    );
    console.log(req.user);

    res.set("Content-Type", "text/html");
    res.status(200).send(template);
    return;
  }
};
