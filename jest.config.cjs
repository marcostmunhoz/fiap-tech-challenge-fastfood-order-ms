/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  rootDir: 'src',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  transform: { '^.+\\.ts$': 'ts-jest' },
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/app.module.ts',
    '<rootDir>/main.config.ts',
    '<rootDir>/main.ts',
    '<rootDir>/health',
    '<rootDir>/order/order.module.ts',
    '<rootDir>/order/infrastructure/migrations',
  ],
};
