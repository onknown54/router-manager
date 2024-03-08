// process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const si = require("systeminformation");

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

  // Set a more permissive Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src *",
            "style-src *",
            "script-src *",
            "img-src *",
            "font-src *",
          ],
        },
      });
    }
  );

  ipcMain.on("load-next-page", (event, data) => {
    mainWindow.loadURL(path.join(__dirname, `./src/renderer/${data}.html`));
  });
}

app.whenReady().then(() => {
  createWindow();

  // Get system information and send it to the renderer process
  siosInfo()
    .then((data) => {
      mainWindow.webContents.send("systemInfo", data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
