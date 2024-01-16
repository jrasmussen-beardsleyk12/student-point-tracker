module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageReporters: ["text", "clover"],
  coveragePathIgnorePatterns: [
    "<rootDir>/test/**",
    "<rootDir>/node_modules/**",
  ],
  projects: [
    {
      displayName: "Unit",
      testMatch: ["<rootDir>/test/unit/*.test.js"],
    },
    {
      displayName: "Integration",
      globalSetup: "<rootDir>/node_modules/@databases/pg-test/jest/globalSetup",
      globalTeardown:
        "<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown",
      setupFilesAfterEnv: ["<rootDir>/test/helpers/dbSetup.js"],
      testMatch: ["<rootDir>/test/http/*.test.js"],
    },
  ],
};
