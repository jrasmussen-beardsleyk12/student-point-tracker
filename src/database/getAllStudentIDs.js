module.exports = {
  safe: false,
  exec: async (sql) => {

    const command = await sql`
      SELECT *
      FROM students
      WHERE enabled = TRUE
    `;

    return command.count !== 0
      ? { ok: true, content: command }
      : {
          ok: false,
          content: `student ${id} not found.`,
          short: "not_found",
        };

  }
};
