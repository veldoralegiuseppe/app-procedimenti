const path = require('path');

module.exports = {
  entry: './src/preload/preload.js',
  target: 'electron-preload',
  resolve: {
    extensions: ['.js', '.json'],
  },
  output: {
    path: path.resolve(__dirname, '.webpack/preload'),
    filename: 'preload.bundle.js',
  },
};
