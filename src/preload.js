import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('AgenziaEntrateAPI', {
    onCaptcha: (callback) => ipcRenderer.on('captcha', (_event, url) => callback(url)),
    getCaptcha: () => ipcRenderer.send('get-captcha')
})