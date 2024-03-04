process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Use loadFile method to load the HTML file
  const filePath = path.join(__dirname, "./src/renderer/index.html");
  mainWindow.loadURL(`file://${filePath}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
