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

    let studentPoints = await context.database.getPointsByStudentID(params.id);

    if (!studentPoints.ok && studentPoints.short !== "not_found") {
      // TODO: Render a fail EJS template
    }

    if (studentPoints.short === "not_found") {
      // Ensure to set to an empty array
      studentPoints.content = [];
    }

    console.log(studentPoints);
    // TODO: This would be a good time to generate any cool facts about the current users points

    const template = await ejs.renderFile("./views/pages/student.ejs",
      {
        name: context.config.SITE_NAME,
        student: student.content,
        points: studentPoints.content,
        slider: {
          defaultValue: 50,
          min: 0,
          max: 100,
          ticks: 11,
          steps: 10
        }
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
