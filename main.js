// process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    maxWidth: 750,
    maxHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // Use loadFile method to load the HTML file
  mainWindow.loadURL(path.join(__dirname, "./src/renderer/index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "yes my man, pink to the puke to the pong!!!");
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
