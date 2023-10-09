module.exports = {
  docs: {
    summary: "Get the health status across all services."
  },
  endpoint: {
    method: "GET",
    paths: [ "/api/health" ],
    rateLimit: "generic",
    successStatus: 200,
    options: {
      Allow: "GET",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {},
  async logic(params, context) {
    let healthObj = {
      database: "unknown",
      httpServer: "healthy", // TODO Currently we assume that if this endpoint resolves
      // then expressJS must be healthy. But this is not always correct
    };

    if (context.database.getSqlStorageObject() == undefined) {
      healthObj.database = "unhealthy";
    } else {
      healthObj.database = "healthy";
    }

    const sso = new context.sso();

    return sso.isOk().addContent(healthObj);
  }
};
