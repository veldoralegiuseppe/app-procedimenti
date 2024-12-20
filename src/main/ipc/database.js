const { ipcMain } = require('electron');

const setupDatabaseHandlers = () => {
  // Handler per 'database-create'
  ipcMain.handle('database-create', async (event, Model, data) => {
    console.log('database-create', Model, data);
    return null; // Puoi implementare la logica effettiva qui
    // return await new Model(data).save();
  });
};

// Esporta la funzione di setup
module.exports = setupDatabaseHandlers;
