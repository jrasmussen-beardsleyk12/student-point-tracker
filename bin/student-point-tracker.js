#!/usr/bin/env node

// Set resourcePath
// We should first be more liberal determining it's location, but for now
process.resourcePath = process.cwd();

console.log(process.argv);
console.log(process.resourcePath);

// Do any setup needed
require("../src/server.js");
