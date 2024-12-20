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
  }
);

module.exports = {
  module: {
    rules,
  },
  entry: './src/renderer/renderer.js',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.wasm', '.svg'],
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
    },
    alias: {
      '@pages': path.resolve(__dirname, 'src/renderer/pages/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@utils': path.resolve(__dirname, 'src/renderer/shared/utils/'),
      '@ui-shared': path.resolve(__dirname, 'src/renderer/shared/'),
      '@features': path.resolve(__dirname, 'src/renderer/features/'),
      '@shared': path.resolve(__dirname, 'src/shared/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html', // Usa il template HTML per la finestra principale
    }),
  ],
  output: {
    // Modifica l'output per posizionarlo nella cartella .webpack/renderer
    filename: 'renderer.bundle.js',
    path: path.resolve(__dirname, '.webpack/renderer'),
  },
};
