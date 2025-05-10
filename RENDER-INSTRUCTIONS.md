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

## Key Files for Render

These files are automatically copied to the `dist` directory during build:

1. **_redirects** - Handles client-side routing by directing all paths to index.html
2. **_headers** - Sets CORS headers to allow API requests
3. **200.html** - Copy of index.html used for handling direct navigation to routes

## Important

- The frontend is pre-configured to use the API at https://be-devmemo.onrender.com/api
- The API_URL is hardcoded in the `services/api.ts` file
- Render automatically serves static files - no need for additional packages

## Troubleshooting

If you still see "Invalid Host header" errors:
1. Make sure you don't have any custom webpack servers running on Render
2. In Render dashboard, go to Settings > Build & Deploy
3. Remove any "Start Command" if set
4. Try a manual redeploy with "Clear build cache" option checked 