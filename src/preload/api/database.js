const { ipcRenderer } = require('electron');

const databaseAPI = {
    create: async (data) => {
        return await ipcRenderer.invoke('database-create', data);
    },

    findAll: async (query, page, limit, ...rest) => {
        return await ipcRenderer.invoke('database-find-all', query, page, limit, ...rest);
    },

    calculateStatistics: async (query) => {
        return await ipcRenderer.invoke('database-calculate-statistics', query);
    }
}

module.exports = databaseAPI;