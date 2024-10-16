const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');

module.exports = (on, config) => {
  const options = {
    // Usa path.resolve per costruire un percorso assoluto dal file plugins/index.js alla root
    webpackOptions: require('../../webpack.renderer.config.js'), 
    watchOptions: {}
  };

  on('file:preprocessor', webpack(options));

  // Restituisci la configurazione aggiornata
  return config;
};
