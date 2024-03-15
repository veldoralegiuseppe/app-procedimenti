import { contextBridge, ipcRenderer } from 'electron';

window.addEventListener("DOMContentLoaded", () => {
  // Creo l'HTML personalizzato
  const rendererScript = document.createElement("script");
  rendererScript.text = `var prevBody; prevBody=document.body.innerHTML; window.AgenziaEntrateAPI.onRestore(() => {document.body.innerHTML = prevBody;})`
  document.head.appendChild(rendererScript);
  let captcha = document.getElementById('imgCaptcha')
  document.body.innerHTML = ''
  document.body.appendChild(captcha)
  setTimeout(() => {ipcRenderer.send('start::screenshot')}, 1000)
});

contextBridge.exposeInMainWorld('AgenziaEntrateAPI', {
  onRestore: (callback) => ipcRenderer.on('restore', (_event) => callback()),
})

