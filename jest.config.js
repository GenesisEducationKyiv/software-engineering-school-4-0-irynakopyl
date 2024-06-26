/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', './src'],
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|pdfjs-dist))'],
};
