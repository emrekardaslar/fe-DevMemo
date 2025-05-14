const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables
const env = dotenv.config().parsed || {};

// Environment determination - use webpack's mode to determine environment
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--mode=production');
const API_URL = isProduction 
  ? 'https://be-devmemo.onrender.com/api' 
  : 'http://localhost:4000/api';

console.log(`Using API URL for ${isProduction ? 'production' : 'development'}: ${API_URL}`);

// Custom plugin to inject API URL script tag
class InjectApiUrlPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('InjectApiUrlPlugin', (compilation) => {
      // HtmlWebpackPlugin hooks changed in v4
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InjectApiUrlPlugin',
        (data, cb) => {
          // Inject script tag just before closing body tag
          data.html = data.html.replace(
            '</body>',
            `<script>window.__REACT_APP_API_URL = "${API_URL}";</script></body>`
          );
          cb(null, data);
        }
      );
    });
  }
}

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3000,
    allowedHosts: 'all'
  },
  plugins: [
    // Use the standard HTML template
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // Inject the API URL script
    new InjectApiUrlPlugin()
  ]
}; 