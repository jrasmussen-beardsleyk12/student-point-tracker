const studentObject = require("./studentObject.js");

module.exports =
function studentObjectArray(data) {
  if (Array.isArray(data)) {
    const retArray = [];

    for (let i = 0; i < data.length; i++) {
      retArray.push(studentObject(data[i]));
    }

    return retArray;
  } else if (Object.keys(data).length < 1) {
    return [];
  } else {
    return [ studentObject(data) ];
  }
}
