# Render Deployment Instructions

## Static Site Setup

1. On Render dashboard, click "New" and select "Static Site"

2. Connect your GitHub repository

3. Configure these settings:
   - **Name**: fe-devmemo (or your preferred name)
   - **Branch**: main (or your deployment branch)
   - **Root Directory**: frontend
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Publish Directory**: dist

4. Click "Create Static Site"

## Environment Configuration

The application is automatically configured to use different API URLs based on the environment:

- **Development**: API at http://localhost:4000/api (local development)
- **Production**: API at https://be-devmemo.onrender.com/api (Render deployment)

The webpack configuration in `webpack.config.js` detects the environment and injects the appropriate API URL via a custom plugin. This URL is then made available to the application through `window.__REACT_APP_API_URL`.

## Configuration Technical Details

- The environment determination happens in `webpack.config.js` based on NODE_ENV
- A custom InjectApiUrlPlugin adds a script tag to the HTML that sets `window.__REACT_APP_API_URL`
- The services/api.ts file reads from window.__REACT_APP_API_URL to configure axios

This approach avoids the "process is not defined" error that can occur when using process.env directly in client-side code.

## Key Files for Render

These files are automatically copied to the `dist` directory during build:

1. **_redirects** - Handles client-side routing by directing all paths to index.html
2. **_headers** - Sets CORS headers to allow API requests
3. **200.html** - Copy of index.html used for handling direct navigation to routes

## Important

- The frontend will automatically use https://be-devmemo.onrender.com/api when built for production
- The API_URL is now dynamically set based on the NODE_ENV environment variable
- No manual configuration is needed after deployment

## Troubleshooting

If you still see "Invalid Host header" errors:
1. Make sure you don't have any custom webpack servers running on Render
2. In Render dashboard, go to Settings > Build & Deploy
3. Remove any "Start Command" if set
4. Try a manual redeploy with "Clear build cache" option checked 