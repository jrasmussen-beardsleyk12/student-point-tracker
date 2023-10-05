const duckGen = require("duckgen");

module.exports = {
  docs: {
    summary: "Return an SVG Duck via a valid Duck String"
  },
  endpoint: {
    endpointKind: "raw",
    method: "GET",
    paths: [ "/duck/:duckString" ],
    rateLimit: "generic",
    successStatus: 200,
    options: {
      Allow: "GET",
      "X-Content-Type-Options": "nosniff"
    }
  },
  params: {
    duckString: (context, req) => { return context.query.duckString(req); }
  },

  async logic(req, res, context) {

    const params = {
      duckString: this.params.duckString(context, req)
    };

    let duckData = context.globalCache.find(`duck-svg__${params.duckString}`, () => {
      // Inspired by: https://github.com/fairfield-programming/backend-server/blob/master/src/controllers/Duck/getDuckById.js
      const duckSVG = duckGen.parseV1String(params.duckString);

      return context.globalCache.add(`duck-svg__${params.duckString}`, duckSVG);
    });


    if (!duckData.data) {
      res.status(400).send({ message: "Invalid Duck String" });
      return;
    }

    res.set("Cache-Control", `must-revalidate, public, max-age=${context.config.MAX_AGE_DUCKS}`);
    res.set("Age", duckData.Age);
    res.set("Content-Type", "image/svg+xml");
    res.status(200).send(duckGen.formatSVG(duckGen.generateDuck(duckData)));
    return;
  }
};
