// process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
};
app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");
  createWindow();
});
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // Use loadFile method to load the HTML file
  const filePath = path.join(__dirname, "./src/renderer/index.html");
  mainWindow.loadURL(`file://${filePath}`);
}

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
