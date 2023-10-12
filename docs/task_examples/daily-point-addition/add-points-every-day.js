const POINT_COUNT = 1;
const POINT_REASON = "Daily Bonus";

module.exports =
async function main(context) {
  const allStudents = await context.database.getAllStudentIDs();

  if (!allStudents.ok) {
    console.error("We failed to get all students!");
    throw allStudents;
  }

  for (let i = 0; i < allStudents.content.length; i++) {
    const addPoints = await context.database.addPointsToStudent(allStudents.content[i].student_id, POINT_COUNT, POINT_REASON);


    if (!addPoints.ok) {
      console.error(`Failed to add points to ${allStudents.content[i].student_id}! Will keep trying the others`);
      console.error(addPoints);
      // Then we don't throw here, because we want to keep trying the other users.
    }
  }

  console.log("Done adding the daily bonus of points.");
}
