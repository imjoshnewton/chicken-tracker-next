module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    // "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/local/**/*", // Ignore scripts for running locally.
    "/src/surveys-controllers/v2-results-processor.ts",
    "/src/surveys-controllers/v2-results-processor.js",
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    // "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-var": "off",
  },
};
