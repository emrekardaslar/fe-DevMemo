# StandupSync Test Suite

This directory contains tests for the StandupSync application, organized by component type and functionality.

## Test Structure

- `components/` - Tests for individual React components
- `pages/` - Tests for page components
- `redux/` - Tests for Redux store, actions, and reducers
- `utils/` - Test utilities and mock implementations

## Known TypeScript Linter Issues

There are some TypeScript linter errors in the test files related to component props typing. These errors occur because:

1. When mocking React components in tests, TypeScript can't properly infer the props interface
2. The mocked components in test files receive props that aren't part of the original component's interface
3. The `dispatch` prop is passed directly to mocked components but isn't defined in the component's props interface

These errors don't affect the test functionality or runtime behavior, but they do appear in the editor. The tests will pass despite these warnings.

### Solutions for TypeScript Errors

If you need to fix these TypeScript errors, here are a few approaches:

1. **Use React.FC with Props Interface**:
   ```typescript
   interface MockComponentProps {
     dispatch: any;
     // other props
   }

   const MockComponent: React.FC<MockComponentProps> = (props) => {
     // component implementation
   };
   ```

2. **Create a HOC for mocked components**:
   ```typescript
   const withMockProps = (Component) => {
     return (props) => <Component {...props} />;
   };
   
   const MockComponent = withMockProps((props) => {
     // component implementation
   });
   ```

3. **Type augmentation for test components**:
   Add a declaration file in the tests directory that augments React's IntrinsicAttributes to include your test props.

## Recent Test Fixes

We've addressed several test issues across the application:

### 1. Action Creator Mocking

Fixed in `mock-tests.test.ts`:
- Replaced string literals with the `StandupActionTypes` enum constants
- Used direct action creators in test files rather than importing them
- Created consistent action creators to avoid type mismatches

### 2. Component Mocking Improvements

Fixed in page component tests:
- Added proper interfaces for mock component props
- Implemented event handlers in mock components to simulate real behavior
- Added proper `useEffect` cleanup to test component unmounting
- Used `toContainEqual` instead of exact matching for action verification

### 3. Navigation Handling

Fixed in form tests:
- Properly mocked React Router's `useNavigate` hook
- Implemented cancel button behavior with correct navigation
- Added proper verification for navigation after form actions

### 4. Redux Store Integration

Fixed in all component tests:
- Used `configureStore` consistently to create mock stores
- Separated action creation from action dispatching
- Properly mocked store dispatch for action verification

## Test Guidelines

- Use mock implementations rather than spying on real components when possible
- Keep test files focused on a single component or functionality
- Use direct action creators in tests to avoid issues with async action creators
- Verify actions are dispatched rather than focusing on implementation details
- Use `toContainEqual` instead of `toEqual` when checking actions in the store

## Running Tests

```bash
# Run all tests
npm test

# Run a specific test file
npm test -- src/tests/components/ComponentName.test.tsx

# Run with coverage
npm test -- --coverage
```

For more information about the testing strategy, see the implementation plan in `memory-bank/implementation-plan.md`. 