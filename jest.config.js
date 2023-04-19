/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // projects: ["<rootDir>/src/__tests__/*"],
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1",
  },
};
