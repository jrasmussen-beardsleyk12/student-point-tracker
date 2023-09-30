module.exports = {
  docs: {
    summary: "Remove points of a specific user."
  },
  endpoint: {
    method: "DELETE",
    paths: [ "/api/student/:id/points" ],
    rateLimit: "generic",
    successStatus: 204,
    options: {
      Allow: "GET, DELETE",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {
    id: (context, req) => { return context.query.id(req); },
    points: (context, req) => { return context.query.points(req); }
  },

  async logic(params, context) {
    let action = await context.database.removePointsFromStudent(params.id, params.points);

    if (!action.ok) {
      const sso = new context.sso();

      return sso.noOk().addContent(action)
                .addCalls("db.removePointsFromStudent", action);
    }

    const sso = new context.sso();

    return sso.isOk().addContent(false);
  }
};
