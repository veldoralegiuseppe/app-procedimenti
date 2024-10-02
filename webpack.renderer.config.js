const path = require('path');
const rules = require('./webpack.rules');

rules.push(
  { test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },
  { test: /\.scss$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }] }
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    // Risolve automaticamente .js, .jsx, .json e .wasm senza specificare l'estensione
    extensions: ['.js', '.jsx', '.json', '.wasm'],

    // Aggiunge un alias per risolvere i percorsi più facilmente
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'), // Alias per components
      '@pages': path.resolve(__dirname, 'src/pages/'), // Alias per page
      '@model': path.resolve(__dirname, 'src/model/'), // Alias per model
      '@assets': path.resolve(__dirname, 'src/assets/'), // Alias per assets
      '@src': path.resolve(__dirname, 'src/'), // Alias per src
      '@theme': path.resolve(__dirname, 'src/theme/'), // Alias per theme
      '@context': path.resolve(__dirname, 'src/context/'), // Alias per theme
    },
  },
};