module.exports = [
  // Supporto per i moduli nativi
  {
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
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
    test: /\.woff2?$/i,
    type: 'asset/resource',
    dependency: { not: ['url'] },
  }, 
];
