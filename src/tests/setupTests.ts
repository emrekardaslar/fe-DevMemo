import '@testing-library/jest-dom';

// Mock global fetch
global.fetch = jest.fn();

// Add TextEncoder and TextDecoder for tests
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Reset mocks after each test
afterEach(() => {
  jest.resetAllMocks();
}); 