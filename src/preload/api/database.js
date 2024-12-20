const { ipcRenderer } = require('electron');

const databaseAPI = {
    create: async (data) => {
        return await ipcRenderer.invoke('database-create', data);
    }
}

module.exports = databaseAPI;