// vite.config.js
export default {
  // Determine API URL based on environment
  define: {
    '__REACT_APP_API_URL': JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://be-devmemo.onrender.com/api'
        : 'http://localhost:4000/api'
    )
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    allowedHosts: [
      'fe-devmemo.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    // Enable CORS for development
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Configure chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'recharts-vendor': ['recharts'],
          'styled-components': ['styled-components']
        }
      }
    }
  }
} 