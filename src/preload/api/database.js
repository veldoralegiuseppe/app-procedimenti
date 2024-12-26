const { ipcRenderer } = require('electron');

const databaseAPI = {
    create: async (data) => {
        return await ipcRenderer.invoke('database-create', data);
    },

    findAll: async (query, page, limit) => {
        return await ipcRenderer.invoke('database-find-all', query, page, limit);
    }
}

module.exports = databaseAPI;