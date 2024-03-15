const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Add events
  ipcMain.on('get-captcha', () => {
    invisibleWindow((url) => {mainWindow.webContents.send('captcha', url)})
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function invisibleWindow(callback) {
  //console.log(`MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: ${MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY}\nINVISIBLE_WINDOW_WEBPACK_ENTRY: ${INVISIBLE_WINDOW_WEBPACK_ENTRY}\nINVISIBLE_WINDOW_WEBPACK_PRELOAD_ENTRY: ${INVISIBLE_WINDOW_PRELOAD_WEBPACK_ENTRY}`)
  let pathAgenziaDelleEntrate = 'https://telematici.agenziaentrate.gov.it/VerificaCF/Scegli.do?parameter=verificaCfPf'
  
  let win = new BrowserWindow({ width: 400, height: 400, show: false, webPreferences: {
    preload: INVISIBLE_WINDOW_PRELOAD_WEBPACK_ENTRY,
  }})

  win.loadURL(pathAgenziaDelleEntrate)
  //win.webContents.openDevTools()

  ipcMain.on('start::screenshot', (event) => {
    win.webContents.capturePage({x: 0, y: 0, width:150, height: 75}, {stayHidden: false}).then(img => {
      win.webContents.send('restore')
      callback(img.toDataURL())
    })
  })

}


