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

  // handles naviation
  ipcMain.on("load-next-page", (event, data) => {
    mainWindow.loadURL(path.join(__dirname, `./src/renderer/${data}.html`));
  });
}

app.whenReady().then(() => {
  createWindow();

  // gets system information
  ipcMain.on("requestSystemInfo", async (event) => {
    try {
      const { arch, distro, hostname, kernel, platform, release, build } =
        await si.osInfo();

      event.sender.send("responseSystemInfo", {
        systemInfo: {
          arch,
          distro,
          hostname,
          kernel,
          platform,
          release,
          build,
        },
      });
    } catch (error) {
      event.sender.send("responseSystemInfo", { error: error.message });
    }
  });

  // gets network information
  ipcMain.on("requestNetworkInfo", async (event) => {
    try {
      const { ssid, bssid, security, wpaFlags, signalLevel, frequency, mode } =
        await si.wifiNetworks();

      event.sender.send("responseNetworkInfo", {
        networkInfo: {
          ssid,
          bssid,
          security,
          wpaFlags,
          signalLevel,
          frequency,
          mode,
        },
      });
    } catch (error) {
      event.sender.send("responseSystemInfo", { error: error.message });
    }
  });
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
