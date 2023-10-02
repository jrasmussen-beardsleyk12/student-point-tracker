const ejs = require("ejs");
const path = require("node:path");

module.exports = {
  docs: {
    summary: "Individual Student view."
  },
  endpoint: {
    endpointKind: "raw",
    method: "GET",
    paths: [ "/student/:id" ],
    rateLimit: "generic",
    successStatus: 200,
    options: {
      Allow: "GET",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {
    id: (context, req) => { return context.query.id(req); }
  },

  async logic(req, res, context) {

    const params = {
      id: context.query.id(req)
    };

    // Lets get our student data
    let student = await context.database.getStudentByID(params.id);

    if (!student.ok) {
      // TODO: Render a fail EJS template
    }
    console.log(student);
    // TODO: This would be a good time to generate any cool facts about the current users points

    const template = await ejs.renderFile("./views/pages/student.ejs",
      {
        name: context.config.SITE_NAME,
        student: student.content
      },
      {
        views: [ path.resolve("./views") ]
      }
    );

    res.set("Content-Type", "text/html");
    res.status(200).send(template);
    return;
  }
};
