const config = {
  collectCoverage: true,

  coverageReporters: ['json-summary', 'json', 'html'],

  setupFiles: ['./test/setup.ts'],

  // extend test timeout for integration tests
  // if Smite API is not responsive
  testTimeout: 30000,

  verbose: true,

  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

module.exports = config;
