/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
  // testMatch: ['<rootDir>/**/*.test.(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: ['node_modules'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  verbose: this.transform,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  rootDir: '.',
};
