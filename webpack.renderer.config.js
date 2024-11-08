const path = require('path');
const rules = require('./webpack.rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  },
  {
    test: /\.scss$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      { loader: 'sass-loader' },
    ],
  },
);

module.exports = {
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.wasm', '.svg'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@model': path.resolve(__dirname, 'src/model/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@src': path.resolve(__dirname, 'src/'),
      '@theme': path.resolve(__dirname, 'src/theme/'),
      '@context': path.resolve(__dirname, 'src/context/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@filters': path.resolve(__dirname, 'src/utils/filters/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html', // Usa il template HTML per la finestra principale
    }),
  ],
  output: {
    // Modifica l'output per posizionarlo nella cartella .webpack/renderer
    filename: 'renderer.bundle.js',
    path: path.resolve(__dirname, '.webpack/renderer'),
  },
};
