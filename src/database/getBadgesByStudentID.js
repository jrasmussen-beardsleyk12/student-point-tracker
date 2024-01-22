module.exports = {
  safe: true,
  exec: async (sql, id) => {

    const command = await sql`

    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : {
          ok: false,
          content: `No badges found for Student ${id}.`,
          short: "not_found",
        };

  }
};
