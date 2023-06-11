const fs = require('fs');
const nextJest = require('next/jest');
const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = JSON.parse(fs.readFileSync('./tsconfig.json'));

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/config/',
    '<rootDir>/src/helpers/',
    '<rootDir>/src/redux/',
    '<rootDir>/src/pages/_app.tsx',
    '<rootDir>/src/pages/_document.tsx',
    '__tests__/',
    'constants/',
    'schemas/',
    'types/',
  ],
  coverageReporters: ['html', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: `<rootDir>/${compilerOptions.baseUrl}/`,
  }),
  rootDir: '.',
  testEnvironment: 'jest-environment-jsdom',
  testRegex: '.*\\.spec\\.tsx?$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
};

module.exports = createJestConfig(customJestConfig);
