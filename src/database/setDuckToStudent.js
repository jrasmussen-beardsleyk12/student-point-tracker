const getStudentByID = require("./getStudentByID.js");

module.exports = {
  safe: false,
  exec: async (sql, id, duck) => {
    let student = await getStudentByID(sql, id);

    if (!student.ok) {
      return student;
    }

    const command = await sql`
      UPDATE students
      SET duck_string = ${duck}
      WHERE student_id = ${id} AND enabled = TRUE
      RETURNING student_id;
    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : { ok: false, content: command, short: "server_error" };
  }
};
