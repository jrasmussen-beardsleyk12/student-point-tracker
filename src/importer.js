// Module responsible for importing students from the `students.csv` file
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const config = require("./config.js")();
const database = require("./database.js");

module.exports =
async function importer(fileName) {
  if (fs.existsSync(fileName)) {
    const studentFile = fs.readFileSync(fileName, { encoding: "utf8" });

    const records = parse(studentFile, {
      delimiter: config.CSV_DELIMITER,
      columns: true,
      skip_empty_lines: true
    });

    for (const record of records) {
      // Lets normalize our values here
      for (const item in record) {
        record[item.trim()] = record[item].trim();
      }

      if (
        typeof record.student_id !== "string" ||
        typeof record.first_name !== "string" ||
        typeof record.last_name !== "string"
      ) {
        console.error(`The import: ${record} is invalid!`);
        continue;
      }

      // Check if student already exists
      const exists = await database.getStudentByID(record.student_id);

      if (exists.ok) {
        console.log(`Student '${record.student_id}' already exists in the DB. Skipping...`);
        continue;
      }

      const action = await database.addStudent(record);

      if (!action.ok) {
        console.error("An error occuring during the import of new students!");
        console.error(action);
      }

      if (typeof record.points === "string") {
        console.log(`Existing points found for ${record.student_id}! Importing...`);

        const pointAction = await database.addPointsToStudent(record.student_id, record.points, "Import");

        if (!pointAction.ok) {
          console.error("An error occuring during the import of a students existing points!");
          console.error(pointAction);
        }
      }

      console.log(`Imported '${record.student_id}' without issue...`);
    }
  } else {
    console.error(`File: '${fileName}' not found!`);
  }
}
