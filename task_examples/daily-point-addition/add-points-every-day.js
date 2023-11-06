const POINT_COUNT = 1;
const POINT_REASON = "Daily Bonus";

module.exports =
async function main(context) {
  const todaysDate = new Date().toISOString(); // Using ISO string so it's format works with Postgresql
  const allStudents = await context.database.getAllStudentIDs();

  if (!allStudents.ok) {
    console.error("We failed to get all students!");
    throw allStudents;
  }

  for (let i = 0; i < allStudents.content.length; i++) {

    // Prior to adding points to the student, lets make sure they were not absent today.
    const studentHistory = await context.database.getPointsByStudentID(allStudentscontent[i].student_id, lastWeekDate);

    if (!studentHistory.ok) {
      console.error(`Failed to get previous point history for student!`);
      console.error(studentHistory);
      continue;
    }
    for (let y = 0; y < studentHistory.content.length; y++) {
      let reason = studentHistory.content[i].reason;
      if (reason.includes("Tardy") || reason.includes("Absent")) {
        continue;
      }
    }

    const addPoints = await context.database.addPointsToStudent(allStudents.content[i].student_id, POINT_COUNT, POINT_REASON);


    if (!addPoints.ok) {
      console.error(`Failed to add points to ${allStudents.content[i].student_id}! Will keep trying the others`);
      console.error(addPoints);
      // Then we don't throw here, because we want to keep trying the other users.
    }
  }

  console.log("Done adding the daily bonus of points.");
}
