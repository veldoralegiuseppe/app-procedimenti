const { ipcMain } = require('electron');
// const { FieldTypes } = require('@ui-shared/metadata');
// const {
//   Procedimento,
//   PersonaFisica,
//   PersonaGiuridica,
//   Transazione,
// } = require('@models');

// Funzione per ottenere il modello in base al tipo
const getModel = (data) => {
  const { version, type } = data;

  // Mappa dei modelli in base al tipo
  const modelMap = {
    // [FieldTypes.PERSONA_FISICA]: () => PersonaFisica(version),
    // [FieldTypes.PERSONA_GIURIDICA]: () => PersonaGiuridica(version),
    // [FieldTypes.PROCEDIMENTO]: () => Procedimento(version),
    // [FieldTypes.TRANSAZIONE]: () => Transazione(version),
  };

  // Restituisce il modello corrispondente o null se non esiste
  const modelFactory = modelMap[type];
  if (!modelFactory) {
    throw new Error(`Modello non trovato per il tipo: ${type}`);
  }

  return modelFactory();
};

// Configura gli handler IPC
const setupDatabaseHandlers = () => {
  ipcMain.handle('database-create', async (event, data) => {
    try {
      // Ottieni il modello in base ai dati forniti
      const Model = getModel(data);

      // Log del modello per debugging
      console.log('Model:', Model, 'Data:', data);

      // Simula il salvataggio nel database
      // Sostituire con la logica di salvataggio effettiva
      const result = await new Model(data).save();

      // Restituisce il risultato della creazione
      return { success: true, data: result };
    } catch (error) {
      console.error('Errore in database-create:', error.message);
      return { success: false, error: error.message };
    }
  });
};

module.exports = setupDatabaseHandlers;
