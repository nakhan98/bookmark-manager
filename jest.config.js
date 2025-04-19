module.exports = {
  testEnvironment: 'jsdom', // Changed from 'node' to 'jsdom' for UI tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/'
  ],
  moduleNameMapper: {
    // Handle CSS/SASS imports
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  collectCoverageFrom: [
    'lib/**/*.js',
    'pages/api/**/*.js'
  ],
  coverageThreshold: {
    './lib/**/*.js': {
      statements: 80,
      branches: 50, // The bookmarks.js file has some branches we can't easily test
      functions: 80,
      lines: 80
    }
  },
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
};