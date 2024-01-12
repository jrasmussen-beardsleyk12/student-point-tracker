const postgres = require("postgres");
const logger = require("./logger.js");
const config = require("./config.js")();

let sqlStorage;

function getSqlStorageObject() {
  return sqlStorage;
}

function setSqlStorageObject(setter) {
  sqlStorage = setter;
}

function setupSQL() {
  if (process.env.PROD_STATUS === "dev") {
    return postgres({
      host: config.DB_HOST,
      username: config.DB_USER,
      database: config.DB_DB,
      port: config.DB_PORT
    });
  } else {
    return postgres({
      host: config.DB_HOST,
      username: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_DB,
      port: config.DB_PORT
    })
  }
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
      WHERE student_id = ${id}
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

async function disableStudentByID(id) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      UPDATE students
      SET enabled = TRUE
      WHERE student_id = ${id}
      RETURNING student_id;
    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : { ok: false, content: command, short: "server_error" };

  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "server_error"
    };
  }
}

async function getAllStudentIDs() {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      SELECT *
      FROM students
      WHERE enabled = TRUE
    `;

    return command.count !== 0
      ? { ok: true, content: command }
      : {
          ok: false,
          content: `student ${id} not found.`,
          short: "not_found"
        }
  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "server_error"
    };
  }
}

async function getBadgesByStudentID(id) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`

    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : {
          ok: false,
          content: `No badges found for Student ${id}.`,
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

async function getPointsByStudentID(id) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      SELECT *
      FROM points
      WHERE student = ${id}
      ORDER BY created DESC
    `;

    return command.count !== 0
      ? { ok: true, content: command }
      : {
          ok: false,
          content: `Student ${id} not found. Or points not found.`,
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

async function getPointsByStudentIDByDate(id, date) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      SELECT *
      FROM points
      WHERE student = ${id} AND WHERE created >= ${date}
      ORDER BY created DESC
    `;

    return command.count !== 0
      ? { ok: true, content: command }
      : {
          ok: false,
          content: `Student ${id} not found. Or points not found.`,
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

async function addStudent(obj) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      INSERT INTO students (student_id, first_name, last_name)
      VALUES (${obj.student_id}, ${obj.first_name}, ${obj.last_name})
      RETURNING student_id;
    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : { ok: false, content: command, short: "server_error" };

  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "server_error"
    };
  }
}

async function removeStudentByID(id) {
  try {
    sqlStorage ??= setupSQL();

    return await sqlStorage
      .begin(async (sqlTrans) => {

        const removePoints = await sqlTrans`
          DELETE FROM points
          WHERE student = ${id}
          RETURNING point_id;
        `;

        if (removePoints.count === 0) {
          throw `Failed to remove points for ${id}`;
        }

        const removeStudent = await sqlTrans`
          DELETE FROM students
          WHERE student_id = ${id}
          RETURNING student_id;
        `;

        if (removeStudent.count === 0) {
          throw `Failed to remove student ${id}`;
        }

        return {
          ok: true,
          content: `Successfully deleted student '${id}'`
        };

      })
      .catch((err) => {
        return typeof err === "string"
          ? { ok: false, content: err, short: "server_error" }
          : { ok: false, content: `A generic error occurred while removing student '${id}'.`, short: "server_error", error: err };
      });
  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "server_error"
    };
  }
}

async function setDuckToStudent(id, duck) {
  sqlStorage ??= setupSQL();

  let student = await getStudentByID(id);

  if (!student.ok) {
    return student;
  }

  const command = await sqlStorage`
    UPDATE students
    SET duck_string = ${duck}
    WHERE student_id = ${id} AND enabled = TRUE
    RETURNING student_id;
  `;

  return command.count !== 0
    ? { ok: true, content: command[0] }
    : { ok: false, content: command, short: "server_error" };
}

async function addPointsToStudent(id, points, reason) {
  sqlStorage ??= setupSQL();

  let student = await getStudentByID(id);

  if (!student.ok) {
    return student;
  }

  const newPointsAmount = parseInt(student.content.points, 10) + parseInt(points, 10);

  return await sqlStorage
    .begin(async (sqlTrans) => {

      let insertNewPoints = {};
      try {
        insertNewPoints = await sqlTrans`
          INSERT INTO points (student, points_modified, points_action, points_before, points_after, reason)
          VALUES (${id}, ${points}, 'added', ${student.content.points}, ${newPointsAmount}, ${reason})
          RETURNING point_id;
        `;
      } catch(e) {
        throw `A constraint has been violated while inserting ${id}'s new points! ${e.toString()}`;
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
          WHERE student_id = ${id} AND enabled = TRUE
          RETURNING student_id;
        `;
      } catch(e) {
        throw `A constraint has been violated while inserting ${id}'s new points! ${e.toString()}`
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

async function removePointsFromStudent(id, points, reason) {
  sqlStorage ??= setupSQL();

  let student = await getStudentByID(id);

  if (!student.ok) {
    return student;
  }

  let newPointsAmount = parseInt(student.content.points, 10) - parseInt(points, 10);

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
          RETURNING point_id;
        `;
      } catch(e) {
        throw `A constraint has been violated while removing ${id}'s new negative points! ${e.toString()}`;
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
          WHERE student_id = ${id} AND enabled = TRUE
          RETURNING student_id;
        `;
      } catch(e) {
        throw `A constraint has been violated while removing ${id}'s new negaitve points! ${e.toString()}`
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
    const searchTerm = "%" + query.toLowerCase().replace(wordSeparators, "%") + "%";

    const command = await sqlStorage`
      SELECT *
      FROM students
      WHERE
      (
        LOWER(first_name) LIKE ${searchTerm}
        OR LOWER(last_name) LIKE ${searchTerm}
        OR CAST(student_id AS TEXT) LIKE ${searchTerm}
      ) AND enabled = TRUE
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const resultCount = command.length ?? 0;
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
  getSqlStorageObject,
  setSqlStorageObject,
  setupSQL,
  shutdownSQL,
  getStudentByID,
  getAllStudentIDs,
  addStudent,
  removeStudentByID,
  addPointsToStudent,
  removePointsFromStudent,
  searchStudent,
  getPointsByStudentID,
  setDuckToStudent,
  getPointsByStudentIDByDate
};
