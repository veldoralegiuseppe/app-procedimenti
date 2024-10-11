module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@model/(.*)$': '<rootDir>/src/model/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
};
