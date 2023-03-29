module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: [".dist"],
  testMatch: ["<rootDir>/tests/integration/**/*.spec.ts"],
  rootDir: "../../../.",
  verbose: true,
};
