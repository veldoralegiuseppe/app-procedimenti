const { app, BrowserWindow } = require('electron');
const installExtension = require('electron-devtools-installer').default;
const setupDatabaseHandlers = require('./ipc/database');
const connectDB = require('./database/connection');
const { REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Apri i DevTools solo in ambiente sviluppo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Connessione al database
  connectDB(); 
};

// Installa React Developer Tools solo in ambiente di sviluppo
// Gli eventuali errori in console sono dovuti all'estensione
const installReactDevTools = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await installExtension(REACT_DEVELOPER_TOOLS);
      console.log('React Developer Tools installed');
    } catch (err) {
      console.error('Failed to install React Developer Tools:', err);
    }
  }
};

// Evento ready di Electron
app.whenReady().then(async () => {
  await installReactDevTools(); // Installa l'estensione se necessario
  setupDatabaseHandlers();
  createWindow(); // Crea la finestra principale
});

// Chiudi l'app quando tutte le finestre sono chiuse, tranne su macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Riattiva l'app su macOS quando non ci sono finestre aperte
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
