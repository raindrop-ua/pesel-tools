module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  transform: {
    "^.+\\.(ts|js|html)$": "jest-preset-angular",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "html", "js", "json"],
  transformIgnorePatterns: ["node_modules/(?!@angular|rxjs)"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text-summary"],
  collectCoverageFrom: ["src/app/**/*.ts", "!**/*.spec.ts"],
};
