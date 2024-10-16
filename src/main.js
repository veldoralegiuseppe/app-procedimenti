const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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
    invisibleWindow((url) => {
      mainWindow.webContents.send('captcha', url);
    });
  });

  // Open the DevTools, but only if not in test mode.
  if (process.env.ELECTRON_IS_TEST !== 'true') {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Crea la finestra solo se non siamo in modalità test
  if (process.env.ELECTRON_IS_TEST !== 'true') {
    createWindow();
  }
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (
    BrowserWindow.getAllWindows().length === 0 &&
    process.env.ELECTRON_IS_TEST !== 'true'
  ) {
    createWindow();
  }
});
