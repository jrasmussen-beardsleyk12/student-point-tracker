/*
 * This task will read an attendance export from PowerSchool.
 * Which seems to be a transactional log of attendance events.
 * So this will only include students who have had some change in attendance
 * for the day.
 */

const fs = require("fs");
const yaml = require("js-yaml");

const POINT_REMOVE_COUNT = 1;
const POINT_REASON = "Student marked"; // + The item they were marked

module.exports = async function main(context) {
  let fileContent = fs.readFileSync("./att.csv", "utf8");
  let fileData = yaml.load(fileContent);

  // By default the 'att.csv' contains zero headers or any other helpful formatting.
  // So lets define the following and parse manually:
  // - Student ID,First Name,Last Name,Period of Event,Event Type,Date of Event

  let rows = fileData.split("\n");

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i].split(",");
    if (row.length < 6) {
      console.log(`The student attendance data: '${rows[i]}' seems invalid.`);
      continue;
    }

    let data = {
      student_id: row[0],
      first: row[1],
      last: row[2],
      period: row[3],
      event: row[4],
      date: row[5],
    };

    // Event Types: (For each specified period)
    // - A: Absent
    // - L: Late
    // - T: Tardy
    // - S:
    // - I:
    // - X:
    // - '':

    if (data.event === "A") {
      // This means they were missing for this period
      await removePoints(data.student_id, context, "Absent");
    } else if (data.event === "T") {
      await removePoints(data.student_id, context, "Tardy");
    }
  }

  console.log("Done calculating any point losses due to absences");
};

async function removePoints(studentID, context, shortReason) {
  const act = await context.database.removePointsFromStudent(
    studentID,
    POINT_COUNT,
    `${POINT_REASON} ${shortReason}`,
  );

  if (!act.ok) {
    console.error(
      `Failed to remove points from '${studentID}'! Will continue to attempt others.`,
    );
    console.error(act);
  }
  return;
}
