const { defineConfig } = require("cypress");
const path = require('path');  // Importa path per risolvere percorsi
const webpackConfig = require(path.resolve(__dirname, 'webpack.renderer.config.js'));  // Usa il percorso assoluto

module.exports = defineConfig({
  e2e: {
    specPattern: 'src/test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.js',
   
   
    setupNodeEvents(on, config) {
      // Rimuovi l'uso di 'dev-server:start' per E2E test
      return require(path.resolve(__dirname, './cypress/plugins/index.js'))(on, config);  // Risolvi il percorso del plugin
    },
  },

  component: {
    specPattern: 'src/test/cypress/component/**/*.cy.{js,jsx,ts,tsx}', 
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig, // Usa la configurazione Webpack
    },
    supportFile: 'cypress/support/index.js',
    
    setupNodeEvents(on, config) {
      // Rimuovi l'uso di 'dev-server:start' per i test di componenti
      return require(path.resolve(__dirname, './cypress/plugins/index.js'))(on, config);  // Risolvi il percorso del plugin
    },
  },
});
