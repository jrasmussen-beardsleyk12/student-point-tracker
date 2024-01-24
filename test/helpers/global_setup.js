// Defines global functions for us in our tests

const crypto = require("crypto");

function genStudentID() {
  // While in tests we don't need unique student IDs since a test should clean up after itself.
  // In the event a test does not successfully clean up, such as during a failure
  // having unique IDs or semi unique avoids catastrophic cascades of failures
  const n = crypto.randomInt(0, 1000000);

  return `${n}`;
}

global.genStudentID = genStudentID;
