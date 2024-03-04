process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
const { app, BrowserWindow } = require("electron");
const path = require("path");

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
};

app.whenReady().then(() => {
  createMainWindow();
});
