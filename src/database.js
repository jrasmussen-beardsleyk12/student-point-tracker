const postgres = require("postgres");
const logger = require("./logger.js");
const config = require("./config.js")();

let sqlStorage;

function setupSQL() {
  return postgres({
    host: config.DB_HOST,
    username: config.DB_USER,
    database: config.DB_DB,
    port: config.DB_PORT
  });
}

async function shutdownSQL() {
  if (sqlStorage !== undefined) {
    sqlStorage.end();
    logger.generic("SQL Server Shutdown!", "info");
  }
}

async function getStudentByID(id) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      SELECT *
      FROM students
      WHERE id = ${id}
    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : {
          ok: false,
          content: `Student ${id} not found.`,
          short: "not_found"
        };

  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "server_error"
    };
  }
}

async function addPointsToStudent(id, points, reason) {
  sqlStorage ??= setupSQL();

  let student = await getStudentByID(id);

  if (!student.ok) {
    return student;
  }

  const newPointsAmount = student.content.points + points;

  return await sqlStorage
    .begin(async (sqlTrans) => {

      let insertNewPoints = {};
      try {
        insertNewPoints = await sqlTrans`
          INSERT INTO points (student, points_modified, points_action, points_before, points_after, reason)
          VALUES (${id}, ${points}, 'added', ${student.content.points}, ${newPointsAmount}, ${reason})
          RETURNING id;
        `;
      } catch(e) {
        throw `A constraint has been violated while inserting ${id}'s new points!`;
      }

      if (!insertNewPoints.count) {
        throw `Cannot insert points to ${id}!`;
      }

      // Add the new total points
      let modifyPoints = {};
      try {
        modifyPoints = await sqlTrans`
          UPDATE students
          SET points = ${newPointsAmount}
          WHERE id = ${id}
          RETURNING id;
        `;
      } catch(e) {
        throw `A constraint has been violated while inserting ${id}'s new points!`
      };

      if (!modifyPoints.count) {
        throw `Cannot insert points to ${id}!`;
      }

      return { ok: true };
    })
    .catch((err) => {
      return {
        ok: false,
        content: err,
        short: "server_error"
      };
    });
}

async function removePointsFromStudent(id, points) {
  sqlStorage ??= setupSQL();

  let student = await getStudentByID(id);

  if (!student.ok) {
    return student;
  }

  let newPointsAmount = student.content.points - points;

  if (newPointsAmount < 0) {
    // Don't go into the negatives for points
    newPointsAmount = 0;
  }

  return await sqlStorage
    .begin(async (sqlTrans) => {

      let insertNewPoints = {};
      try {
        insertNewPoints = await sqlTrans`
          INSERT INTO points (student, points_modified, points_action, points_before, points_after, reason)
          VALUES (${id}, ${points}, 'removed', ${student.content.points}, ${newPointsAmount}, ${reason})
          RETURNING id;
        `;
      } catch(e) {
        throw `A constraint has been violated while removing ${id}'s new negative points!`;
      }

      if (!insertNewPoints.count) {
        throw `Cannot remove points from ${id}!`;
      }

      // Add the new total points
      let modifyPoints = {};
      try {
        modifyPoints = await sqlTrans`
          UPDATE students
          SET points = ${newPointsAmount}
          WHERE id = ${id}
          RETURNING id;
        `;
      } catch(e) {
        throw `A constraint has been violated while removing ${id}'s new negaitve points!`
      };

      if (!modifyPoints.count) {
        throw `Cannot remove points from ${id}!`;
      }

      return { ok: true };
    })
    .catch((err) => {
      return {
        ok: false,
        content: err,
        short: "server_error"
      };
    });
}

async function searchStudent(query, page) {
  try {
    sqlStorage ??= setupSQL();
    const limit = config.PAGINATION_LIMIT;
    const offset = page > 1 ? (page - 1) * limit : 0;

    const wordSeparators = /[-. ]/g; // Word Sperators: - . SPACE
    const searchTerm "%" + query.replace(wordSeparators, "_") + "%";

    const command = await sqlStorage`
      WITH search_query AS (
        SELECT DISTINCT ON (s.id) s.id, s.first_name, s.last_name, s.created, s.points
        FROM students AS s
        WHERE
        (
          first_name LIKE ${searchTerm}
          OR last_name LIKE ${searchTerm}
          OR id LIKE ${searchTerm}
        )
      )
      SELECT *, COUNT(*) OVER() AS query_result_count
      FROM search_query
      ORDER BY DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const resultCount = command[0]?.query_result_count ?? 0;
    const quotient = Math.trunc(resultCount / limit);
    const remainder = resultCount % limit;
    const totalPages = quotient + (remainder > 0 ? 1 : 0);

    return {
      ok: true,
      content: command,
      pagination: {
        count: resultCount,
        page: page < totalPages ? page : totalPages,
        total: totalPages,
        limit: limit
      }
    };
  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "server_error"
    };
  }
}

module.exports = {
  setupSQL,
  shutdownSQL,
  getStudentByID,
  addPointsToStudent,
  removePointsFromStudent,
  searchStudent,
};
