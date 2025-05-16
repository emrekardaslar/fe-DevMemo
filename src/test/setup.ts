import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';

// Mock global fetch
global.fetch = vi.fn();

// Add TextEncoder and TextDecoder for tests
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Reset mocks after each test
afterEach(() => {
  vi.resetAllMocks();
}); 