// Optional: setup file for Jest
// Add any global test setup here

// For example, if we were testing React components:
// import '@testing-library/jest-dom';

// Mock console.error in tests to avoid noisy logs
// But keep track of errors for debugging
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    // Still log errors but in a format that indicates they're from tests
    console.log('[TEST ERROR]', ...args);
  });
});

// Clean up mocks after tests
afterAll(() => {
  jest.restoreAllMocks();
});