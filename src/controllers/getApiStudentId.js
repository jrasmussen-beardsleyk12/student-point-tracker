module.exports = {
  docs: {
    summary: "Get the details of a specific student, via the ID."
  },
  endpoint: {
    method: "GET",
    paths: [ "/api/student/:id" ],
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

  async logic(params, context) {
    let student = await context.database.getStudentByID(params.id);

    if (!student.ok) {
      const sso = new context.sso();

      return sso.notOk().addContent(student)
                        .addCalls("db.getStudentByID", student);
    }

    student = context.studentObject(student.content);

    const sso = new context.sso();

    return sso.isOk().addContent(student);
  }
};
