# StandupSync Frontend

This is the frontend for the StandupSync application, a tool that helps developers log, reflect, and recall their daily standups.

## Live Demo

Experience StandupSync in action at [https://fe-devmemo.onrender.com](https://fe-devmemo.onrender.com)

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **React Router v7** - Navigation
- **Styled Components** - Styling
- **Vite** - Build tool and development server
- **Vitest** - Testing framework
- **Recharts** - Data visualization
- **Google Gemini AI** - Natural language processing and AI-powered insights

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository (if not already done):
   ```bash
   git clone https://github.com/yourusername/StandupSync.git
   cd StandupSync/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000

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
├── tsconfig.json          # TypeScript configuration
└── vite.config.js         # Vite configuration
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Features

- **Daily Standup Entry** - Log what you did yesterday, what you plan to do today, and any blockers
- **Standup History** - View and search past standup entries
- **Tagging System** - Categorize entries with tags (e.g., #frontend, #backend)
- **Mood & Productivity Tracking** - Track your mood and productivity over time
- **Natural Language Queries** - Search your entries using natural language
  - **AI-Powered Analysis** - Get insights from Gemini AI-powered analysis of your standups
  - **Smart Visualization** - See your data displayed in intuitive, context-aware formats
  - **Enhanced UI** - Modern, Gemini AI-styled interface for query results with responsive animations
  - **Suggestion System** - Get helpful query suggestions and examples
  - **Type-specific Rendering** - Specialized display formats for different response types (summaries, blockers, etc.)
- **Highlight Important Entries** - Mark important entries for quick reference
- **Weekly & Monthly Summaries** - Get insights into your work patterns
- **Blocker Analysis** - Track and analyze blockers over time
- **Tag Insights** - Visual representation of most-used tags and patterns

## Environment Variables

The application uses Vite's environment variable system. Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:4000/api  # For development
```

For production, the API URL is automatically set to `https://be-devmemo.onrender.com/api`.

## Testing

The frontend uses Vitest for testing. See [TESTING.md](../memory-bank/TESTING.md) for more details on testing strategy and guidelines.

## Deployment

The application is configured for deployment on Render.com. See [RENDER-INSTRUCTIONS.md](./RENDER-INSTRUCTIONS.md) for detailed deployment instructions.

## Contributing

If you'd like to contribute to the frontend:

1. Create a new branch for your feature
2. Make your changes
3. Write tests for your changes
4. Submit a pull request

## Related

- [Backend README](https://github.com/emrekardaslar/be-devmemo/blob/main/README.md) - Information about the backend