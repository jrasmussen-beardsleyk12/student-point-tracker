module.exports = {
  docs: {
    summary: "Retrieve Students points history."
  },
  endpoint: {
    method: "GET",
    paths: [ "/api/student/:id/points" ],
    rateLimit: "generic",
    successStatus: 200,
    options: {
      Allow: "GET, DELETE, POST",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {
    id: (context, req) => { return context.query.id(req); }
  },

  async logic(params, context) {
    let action = await context.database.getPointsByStudentID(params.id);

    if (!action.ok) {
      const sso = new context.sso();

      return sso.notOk().addContent(action)
                .addCalls("db.getPointsByStudentID", action);
    }

    const points = context.pointsObjectArray(action.content);

    const sso = new context.sso();

    return sso.isOk().addContent(points);
  }
};
