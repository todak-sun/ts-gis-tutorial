/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__test__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['node_modules'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  setupFiles: ['<rootDir>/dotevn.test.config.js'],
  moduleNameMapper:{
    '@/(.*)': '<rootDir>/src/$1',
  },
  verbose: true,
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}