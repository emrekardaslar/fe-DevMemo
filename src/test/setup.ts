import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock global fetch
global.fetch = vi.fn();

// Add TextEncoder and TextDecoder for tests
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

// Extend expect matchers
expect.extend({
  // Add any custom matchers here if needed
}); 