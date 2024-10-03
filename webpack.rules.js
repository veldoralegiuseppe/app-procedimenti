module.exports = [
  // Supporto per i moduli nativi
  {
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react'],
      },
    },
  },
  // Regola per le immagini
  {
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]', // Mantieni il nome e l'estensione originale
          outputPath: 'assets/images/', // Salva le immagini nella cartella assets/images
          publicPath: 'assets/images/', // Assicura che gli asset vengano referenziati correttamente
        },
      },
    ],
  },
  // Regola per i font
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]', // Mantieni il nome e l'estensione originale
          outputPath: 'assets/fonts/', // Salva i font nella cartella assets/fonts
          publicPath: 'assets/fonts/', // Assicura che gli asset vengano referenziati correttamente
        },
      },
    ],
  },
];
