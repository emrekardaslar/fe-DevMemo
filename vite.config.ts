import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'fe-devmemo.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    // Enable CORS for development
    cors: true
  },
  // Build configuration
  build: {
    // Generate source maps for better debugging
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
}); 