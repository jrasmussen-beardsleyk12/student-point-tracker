module.exports = {
  docs: {
    summary: "Search for a specific user."
  },
  endpoint: {
    method: "GET",
    paths: [ "/api/student" ],
    rateLimit: "generic",
    successStatus: 200,
    options: {
      Allow: "GET",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {
    query: (context, req) => { return context.query.query(req); }
  },

  async logic(params, context) {

  }
};
