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

  }
};
