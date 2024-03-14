const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('AgenziaEntrateAPI', {
  onVerificaCodiceFiscale: (callback) => ipcRenderer.on('verifica-codice-fiscale', (_event, value) => callback(value))
})
