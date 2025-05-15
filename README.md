# StandupSync Frontend

This is the frontend for the StandupSync application, a tool that helps developers log, reflect, and recall their daily standups.

## Live Demo

Experience StandupSync in action at [https://fe-devmemo.onrender.com](https://fe-devmemo.onrender.com)

## Technologies Used

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Redux** - State management
- **React Router** - Navigation
- **Styled Components** - Styling
- **Jest/React Testing Library** - Testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository (if not already done):
   ```
   git clone https://github.com/yourusername/StandupSync.git
   cd StandupSync/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at http://localhost:8080

## Project Structure

```
frontend/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   └── standups/       # Standup-specific components
│   ├── pages/              # Page components
│   ├── redux/              # Redux state management
│   │   └── standups/       # Standup-related redux files
│   ├── services/           # API and service functions
│   ├── styles/             # Global styles and theme
│   ├── tests/              # Test files
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Root App component
│   └── index.tsx           # Entry point
├── public/                 # Public assets
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── webpack.config.js       # Webpack configuration
```

## Available Scripts

- `npm start` - Start the development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm test:watch` - Run tests in watch mode
- `npm test:coverage` - Generate test coverage report

## Features

- **Daily Standup Entry** - Log what you did yesterday, what you plan to do today, and any blockers
- **Standup History** - View and search past standup entries
- **Tagging System** - Categorize entries with tags (e.g., #frontend, #backend)
- **Mood & Productivity Tracking** - Track your mood and productivity over time
- **Natural Language Queries** - Search your entries using natural language
- **Highlight Important Entries** - Mark important entries for quick reference

## Testing

The frontend has comprehensive tests for components, Redux state management, and utilities. See [TESTING.md](../memory-bank/TESTING.md) for more details on testing.

## Connecting to Backend

The live demo connects to the backend API at [https://be-devmemo.onrender.com/api](https://be-devmemo.onrender.com/api).

For local development, the frontend expects the backend to be running at `http://localhost:4000`. You can modify the API base URL in `src/services/api.ts` if needed.

## Contributing

If you'd like to contribute to the frontend:

1. Create a new branch for your feature
2. Make your changes
3. Write tests for your changes
4. Submit a pull request

## Related

- [Backend README](https://github.com/emrekardaslar/be-devmemo/blob/main/README.md) - Information about the backend