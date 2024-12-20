import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('AgenziaEntrateAPI', {
    onCaptcha: (callback) => ipcRenderer.once('captcha', (_event, url) => callback(url)),
    getCaptcha: () => ipcRenderer.send('get-captcha')
})