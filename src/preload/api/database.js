const { ipcRenderer } = require('electron');

const databaseAPI = {
    create: async (Model, data) => {
        return await ipcRenderer.invoke('database-create', Model, data);
    }
}

module.exports = databaseAPI;