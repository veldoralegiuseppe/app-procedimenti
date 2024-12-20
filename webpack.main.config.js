const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main/main.js',

  devtool: 'cheap-module-source-map',

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
      '@models': path.resolve(__dirname, 'src/main/database/models/'),
    },
  },

  target: 'electron-main',

  plugins: [
    new webpack.DefinePlugin({
       // Percorso del Preload
       MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: JSON.stringify(
        path.resolve(__dirname, '.webpack/preload/preload.bundle.js')
      ),
      // Percorso del Renderer (HTML)
      MAIN_WINDOW_WEBPACK_ENTRY: JSON.stringify(
        `file://${path.resolve(__dirname, '.webpack/renderer/renderer.js')}`
      ),
    }),
  ],
};
