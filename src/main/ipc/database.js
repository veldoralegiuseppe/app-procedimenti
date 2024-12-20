const { ipcMain } = require('electron');

ipcMain.handle('database-create', async (event, Model, data) => {
  return await new Model(data).save();
});
