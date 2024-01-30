#!/usr/bin/env node

// Set resourcePath
// We should first be more liberal determining it's location, but for now
let resourcePath;

if (process.argv.length > 2) {
  resourcePath = process.argv[3];
} else if (typeof process.env.STP_RESOURCE_PATH === "string") {
  resourcePath = process.env.STP_RESOURCE_PATH;
} else {
  resourcePath = process.cwd();
}

process.resourcePath = resourcePath;

console.log(`STP Resource Path: ${process.resourcePath}`);
process.exit(0);

// Do any setup needed
require("../src/server.js");
