const endpoint = require("../../src/controllers/getApiStudentId.js");
const context = require("../../src/context.js");
const db = require("../../src/database/_export.js");

describe("returns correct info", () => {
  test("returns not found if student doesn't exist", async () => {
    const sso = await endpoint.logic(
      {
        id: "1",
      },
      context,
    );

    expect(sso.ok).toBe(false);
    expect(sso.content.short).toBe("not_found");
  });

  test("returns the user if they do exist", async () => {
    await db.addStudent({
      student_id: "1",
      first_name: "John",
      last_name: "Doe",
    });

    const sso = await endpoint.logic(
      {
        id: "1",
      },
      context,
    );

    expect(sso.ok).toBe(true);
    expect(sso.content.student_id).toBe("1");
    expect(sso.content.first_name).toBe("John");
    expect(sso.content.last_name).toBe("Doe");

    await db.removeStudentByID("1");
  });
});
