function httpLog(req, res) {
  let date = new Date();
  let duration = Date.now() - (req.start ?? Date.now());
  console.log(
    `HTTP:: ${req.ip ?? "NO_IP"} [${date.toISOString() ?? "NO_DATE"}] "${
      req.method ?? "NO_METHOD"
    } ${sanitizeLogs(req.url) ?? "NO_URL"} ${req.protocol ?? "NO_PROT"}" ${
      res.statusCode ?? "NO_STATUS"
    } ${duration}ms`
  );
}

function generic(data, level) {
  switch(level) {
    "info":
      console.info(data);
      break;
    "debug":
      console.debug(data);
      break;
    "warn":
      console.warn(data);
      break;
    "error":
      console.error(data);
      break;
    default:
      console.log(data);
      break;
  }
}

function sanitizeLogs(val) {
  // Removes New Line, Carriage Return, Tabs,
  // TODO: Should probably also defend against links within this.
  val ??= "";

  if (typeof val !== "string") {
    val = val.toString();
  }

  return val.replace(/\n|\r/g, "").replace(/\t/g, "");
}

module.exports = {
  httpLog,
  generic
};
