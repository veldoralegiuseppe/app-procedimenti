const { ipcMain } = require('electron');
const { ModelTypes } = require('@shared/metadata');
const { DAOFactory } = require('@database/dao');
const {
  Procedimento,
  PersonaFisica,
  PersonaGiuridica,
  Transazione,
} = require('@database/models');
const mongoose = require('mongoose');
const { mapErrorToMessage } = require('@database/errorHandler');

// Funzione per ottenere il modello in base al tipo
const getModel = (version, type) => {
  // Mappa dei nomi dei modelli in base al tipo
  const modelNameMap = {
    [ModelTypes.PERSONA_FISICA]: `PersonaFisicaV${version.replace('.', '_')}`,
    [ModelTypes.PERSONA_GIURIDICA]: `PersonaGiuridicaV${version.replace(
      '.',
      '_'
    )}`,
    [ModelTypes.PROCEDIMENTO]: `ProcedimentoV${version.replace('.', '_')}`,
    [ModelTypes.TRANSAZIONE]: `TransazioneV${version.replace('.', '_')}`,
  };

  const modelName = modelNameMap[type];
  if (!modelName) {
    throw new Error(`Modello non trovato per il tipo: ${type}`);
  }

  // Controlla se il modello è già definito
  console.log('models:', modelName, mongoose.models[modelName]);
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  // Mappa delle factory per creare i modelli
  const modelFactoryMap = {
    [ModelTypes.PERSONA_FISICA]: () => PersonaFisica(version),
    [ModelTypes.PERSONA_GIURIDICA]: () => PersonaGiuridica(version),
    [ModelTypes.PROCEDIMENTO]: () => Procedimento(version),
    [ModelTypes.TRANSAZIONE]: () => Transazione(version),
  };

  const modelFactory = modelFactoryMap[type];
  if (!modelFactory) {
    throw new Error(`Factory non trovata per il tipo: ${type}`);
  }

  // Crea e restituisce il modello
  return modelFactory();
};

// Configura gli handler IPC
const setupDatabaseHandlers = () => {
  ipcMain.handle('database-create', async (event, data) => {
    const { version, type } = data;
    try {
      // Ottieni il modello in base ai dati forniti
      const Model = getModel(version, type);

      // Ottieni il DAO in base al tipo
      const Dao = DAOFactory.getDAO(type);
      const result = await new Dao(Model).create(data);

      // Restituisce il risultato della creazione
      return { success: true, data: result.toJSON() };
    } catch (error) {
      console.error('Errore in database-create:', error);
      let errorMessage = mapErrorToMessage(error, type);

      return { success: false, error: errorMessage };
    }
  });

  ipcMain.handle('database-find-all', async (event, query, page, limit) => {
    const { version, type } = query;
    try {
      // Ottieni il modello in base ai dati forniti
      const Model = getModel(version, type);

      // Ottieni il DAO in base al tipo
      const Dao = DAOFactory.getDAO(type);
      const result = await new Dao(Model).findAll(query, page, limit);

      // Restituisce il risultato della ricerca
      return { success: true, data: result };
    } catch (error) {
      console.error('Errore in database-find-all:', error);
      let errorMessage = mapErrorToMessage(error, type);

      return { success: false, error: errorMessage };
    }
  });
};

module.exports = setupDatabaseHandlers;
