module.exports = {
  testRegex: '/src/.*\\.test\\.js|ts',
  transform: {
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        "preprocess": true
      }
    ],
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest"
  },
  "moduleFileExtensions": [
    "js",
    "ts",
    "svelte"
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!@sapper)'],
  moduleDirectories: ['node_modules', 'src/node_modules'],
  coverageReporters: ['html', 'text-summary'],
  bail: true,
  verbose: false,
};
