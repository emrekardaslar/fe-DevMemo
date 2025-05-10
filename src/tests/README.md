# StandupSync Frontend Testing Guide

This directory contains tests for the StandupSync frontend application. We use Jest and React Testing Library to test components, pages, and Redux functionality.

## Testing Structure

The tests directory is organized to mirror the src directory structure:

```
src/tests/
├── components/         # Tests for reusable components
│   ├── layout/         # Tests for layout components (Header, Sidebar)
│   └── standups/       # Tests for standup-related components
├── pages/              # Tests for page components
├── redux/              # Tests for Redux actions, reducers, and selectors
│   └── standups/       # Tests for standup-related Redux
└── utils/              # Test utilities and helpers
```

## Running Tests

To run the tests, use one of the following commands:

```bash
# Run tests in watch mode
npm test

# Run tests once with coverage report
npm test -- --coverage

# Run a specific test file
npm test -- StandupCard.test.tsx
```

## Testing Approach

We follow these key principles in our testing strategy:

1. **Component Isolation**: Each component is tested in isolation using mocks for dependencies.
2. **Behavior Testing**: We focus on testing component behavior rather than implementation details.
3. **Test Coverage**: We aim for good coverage of critical paths and edge cases.
4. **Redux Testing**: Redux actions, reducers, and selectors are tested separately.

## Mocking Strategies

Several mocking strategies are used in the tests:

1. **Redux Store Mocking**: Using `redux-mock-store` to test component interaction with Redux.
2. **API Service Mocking**: Mocking API services to test asynchronous actions.
3. **React Router Mocking**: Mocking router hooks like `useNavigate` and `useParams`.
4. **Component Mocking**: Creating simplified mock implementations of complex components.
5. **Hook Mocking**: Mocking React hooks like `useEffect` to control component lifecycle.

## Test Coverage

Current test coverage focuses on:

- Layout components (Header, Sidebar)
- StandupCard and TagSelector components
- Redux types, actions, and reducers
- Page components (StandupList, Dashboard, StandupForm)

## Testing Challenges and Solutions

1. **Async Redux Actions**: 
   - Challenge: Testing components that dispatch async Redux actions
   - Solution: Proper mocking of Redux store and action creators

2. **Component Lifecycle**: 
   - Challenge: Controlling component lifecycle hooks in tests
   - Solution: Mocking React hooks like useEffect

3. **Complex Components**: 
   - Challenge: Testing components with complex behavior
   - Solution: Creating simplified mock implementations

4. **Form Testing**: 
   - Challenge: Testing form submission and validation
   - Solution: Using fireEvent to simulate user input and form submission

## Patterns and Examples

### Testing a Component with Redux

```jsx
// Setup mock store
const mockStore = configureStore([]);
const store = mockStore({ standups: { loading: false, standups: [] } });

// Render with Provider
render(
  <Provider store={store}>
    <ComponentToTest />
  </Provider>
);

// Verify actions dispatched
expect(store.getActions()).toEqual([
  { type: 'SOME_ACTION' }
]);
```

### Testing User Interactions

```jsx
// Render component
render(<Component />);

// Simulate user interaction
fireEvent.click(screen.getByTestId('button-id'));

// Verify result
expect(screen.getByText('Expected Text')).toBeInTheDocument();
```

### Testing Async Behavior

```jsx
// Mock API response
jest.mock('../../services/api', () => ({
  someApiCall: jest.fn().mockResolvedValue({ data: 'result' })
}));

// Render component
render(<Component />);

// Wait for async operation to complete
await waitFor(() => {
  expect(screen.getByText('Loaded Data')).toBeInTheDocument();
});
``` 