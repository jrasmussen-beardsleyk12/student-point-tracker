// Module responsible for importing students from the `students.csv` file
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const config = require("./config.js")();
const database = require("./database.js");

module.exports =
async function importer() {
  if (fs.existsSync("./storage/students.csv")) {
    const studentFile = fs.readFileSync("./storage/students.csv", { encoding: "utf8" });

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

      console.log(record);
      if (
        typeof record.student_id !== "string" ||
        typeof record.first_name !== "string" ||
        typeof record.last_name !== "string"
      ) {
        console.error(`The import: ${record} is invalid!`);
        continue;
      }

      const action = await database.addStudent(record);

      if (!action.ok) {
        console.error("An error occuring during the import of new students!");
        console.error(action);
      }
      console.log(`Action: ${action}`);
      console.log(action);
      console.log(`Imported '${record.student_id}' without issue...`);
    }
  }
}
