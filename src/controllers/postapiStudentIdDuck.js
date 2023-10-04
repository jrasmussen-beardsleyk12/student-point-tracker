module.exports = {
  docs: {
    summary: "Modify a users duck."
  },
  endpoint: {
    method: "POST",
    paths: [ "/api/student/:id/duck" ],
    rateLimit: "generic",
    successStatus: 201,
    options: {
      Allow: "POST",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {
    id: (context, req) => { return context.query.id(req); },
    duckStringQuery: (context, req) => { return context.query.duckStringQuery(req); }
  },

  async logic(params, context) {
    let action = await context.database.setDuckToStudent(params.id, params.duckStringQuery);

    if (!action.ok) {
      const sso = new context.sso();

      return sso.notOk().addContent(action)
                .addCalls("db.setDuckToStudent", action);
    }

    const sso = new context.sso();

    return sso.isOk().addContent(false);
  }
};
