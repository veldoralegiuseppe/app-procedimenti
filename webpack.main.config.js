const path = require('path');

module.exports = {
  // Entry point per il processo main
  entry: './src/main.js',

  output: {
    // Genera il bundle nella cartella attesa da Electron Forge
    path: path.resolve(__dirname, '.webpack/main'),
    filename: 'main.bundle.js',
  },

  module: {
    rules: require('./webpack.rules'),
  },

  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@preload': path.resolve(__dirname, 'src/'),
    },
  },

  target: 'electron-main',
};
