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
        },
        presets: context.getPresets(),
        duck_items: [
          // TODO: Make duck item parser function
          // Takes the string of duck_unlocked from the student in the DB
          // and decodes it into this object.
          // Where the string looks like:
          // ITEM_KIND:code,code,code;ITEM_KIND:code,code;
          // eg. hat:00,01;beak:00;
          {
            item_name: "Beaks",
            item_kind: "beak",
            items: [
              { code: "00", index: 5, name: "Default", active: true }
            ]
          },
          {
            item_name: "Hats",
            item_kind: "hat",
            items: [
              { code: "00", index: false, name: "None", active: true },
              { code: "01", index: 1, name: "Baseball", active: false }
            ]
          }
        ]
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
