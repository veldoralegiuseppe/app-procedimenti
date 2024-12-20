const { contextBridge } = require('electron');
const databaseAPI = require('./api/database'); 

contextBridge.exposeInMainWorld('databaseAPI', databaseAPI);
