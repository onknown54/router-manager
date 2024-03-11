"use strict";
const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const si = require("systeminformation");
const find = require("local-devices");

app.whenReady().then(() => {
  // creates browser window
  (() => {
    const mainWindow = new BrowserWindow({
      width: 750,
      height: 500,
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
  })();

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
    } catch (er) {
      event.sender.send("responseSystemInfo", { error: er.message });
    }
  });

  // gets memory information
  ipcMain.on("requestMemoryInfo", async (event) => {
    try {
      const { total, free, used, active, available, buffers, cached } =
        await si.mem();

      event.sender.send("responseMemoryInfo", {
        networkInfo: {
          total,
          free,
          used,
          active,
          available,
          buffers,
          cached,
        },
      });
    } catch (er) {
      event.sender.send("responseMemoryInfo", { error: er.message });
    }
  });

  // gets connected devices
  ipcMain.on("requestConnDevice", async (event) => {
    try {
      const devices = await find().then((dev) => dev);

      event.sender.send("responseConnDevice", {
        connDevices: devices,
      });
    } catch (er) {
      event.sender.send("responseConnDevice", { error: er.message });
    }
  });
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
