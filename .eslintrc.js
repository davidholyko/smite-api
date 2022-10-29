module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    // for sorting class methods and properties
    "sort-class-members",
    // for import sort order
    "import",
  ],
  rules: {
    "valid-jsdoc": "error",

    "sort-class-members/sort-class-members": [
      2,
      {
        order: [
          "constructor",
          "[properties]",
          "[conventional-private-properties]",
          "[conventional-private-methods]",
          "[static-properties]",
          "[static-methods]",
          "[methods]",
        ],
        accessorPairPositioning: "getThenSet",
      },
    ],

    "import/order": [
      "error",
      {
        groups: [
          //
          "builtin",
          "internal",
          "external",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
