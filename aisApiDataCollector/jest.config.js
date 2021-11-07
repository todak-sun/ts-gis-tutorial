/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.(test).(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: ['node_modules'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  verbose: true,
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
