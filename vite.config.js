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
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
} 