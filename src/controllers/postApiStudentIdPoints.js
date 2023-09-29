module.exports = {
  docs: {
    summary: "Add new points to a specific student."
  },
  endpoint: {
    method: "POST",
    paths: [ "/api/student/:id/points" ],
    rateLimit: "generic",
    successStatus: 204,
    options: {
      Allow: "GET",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {

  },

  async logic(params, context) {

  }
};
