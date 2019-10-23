module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  globalSetup: './jest.globalSetup.js',
  globalTeardown: './jest.globalTeardown.js',
  verbose: false,
}