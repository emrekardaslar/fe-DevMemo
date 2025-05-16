// Simple script to copy files needed for Render deployment
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('Created dist directory');
}

// Copy _redirects file
const redirectsSource = path.join(__dirname, 'public', '_redirects');
const redirectsDest = path.join(distDir, '_redirects');
if (fs.existsSync(redirectsSource)) {
  fs.copyFileSync(redirectsSource, redirectsDest);
  console.log('Copied _redirects file to dist');
} else {
  console.error('_redirects file not found in public directory');
}

// Copy _headers file
const headersSource = path.join(__dirname, 'public', '_headers');
const headersDest = path.join(distDir, '_headers');
if (fs.existsSync(headersSource)) {
  fs.copyFileSync(headersSource, headersDest);
  console.log('Copied _headers file to dist');
} else {
  console.error('_headers file not found in public directory');
}

// Create a 200.html file (copy of index.html) for SPA routing
const indexSource = path.join(distDir, 'index.html');
const indexDest = path.join(distDir, '200.html');
if (fs.existsSync(indexSource)) {
  fs.copyFileSync(indexSource, indexDest);
  console.log('Created 200.html from index.html');
} else {
  console.error('index.html not found in dist directory');
}

console.log('Render deployment files prepared successfully'); 