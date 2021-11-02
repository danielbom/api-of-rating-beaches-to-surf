/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const path = require("path");
const root = path.resolve(__dirname, "..");
const rootConfig = require(`${root}/jest.config`);

module.exports = {
  ...rootConfig,
  displayName: "end2end-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  testMatch: ["<rootDir>/test/**/*.test.ts"],
};
