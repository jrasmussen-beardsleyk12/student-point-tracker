// Check that our application is healthy

const http = require("node:http");
const config = require("../src/config.js")();

doRequest().then((data) => {
  let allHealthy = true;

  for (let item in data) {
    if (data[item] !== "healthy") {
      allHealthy = false;
    }
  }

  console.log(data);

  if (allHealthy) {
    process.exit(0);
  } else {
    process.exit(1);
  }

}).catch((err) => {
  console.error(err);
  process.exit(1);
});

function doRequest() {
  const opts = {
    host: "localhost",
    port: config.PORT,
    path: "/api/health",
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  };

  return new Promise((resolve, reject) => {
    let data = "";

    const req = http.request(opts, (res) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        // No more data in response
        resolve(JSON.parse(data));
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
}
