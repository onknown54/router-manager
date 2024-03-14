"use strict";

const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const si = require("systeminformation");
const { exec } = require("child_process");
const fs = require("fs");
const csv = require("csv-parser");

app.whenReady().then(() => {
  // creates csv data storage
  (() => {
    try {
      fs.access(
        `${path.join(__dirname, "./data/data.csv")}`,
        fs.constants.F_OK,
        async (err) => {
          if (err) {
            const data = [
              {
                firstname: "firstname",
                lastname: "lastname",
                username: "username",
                password: "password",
                email: "email",
                phone: "phone",
              },
              {
                firstname: "John",
                lastname: "Doe",
                username: "Admin",
                password: "Admin",
                email: "john.doe@gmail.com",
                phone: "+234 456 342 323234",
              },
            ];

            // Convert data array to CSV string
            const csvData = data
              .map(
                (entry) =>
                  `${entry.firstname},${entry.lastname},${entry.username},${entry.password},${entry.email},${entry.phone}`
              )
              .join("\n");

            // Write CSV string to file
            await new Promise((resolve, reject) => {
              fs.writeFile(
                `${path.join(__dirname, "./data/data.csv")}`,
                csvData,
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
            console.log("CSV file has been saved.");
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  })();

  // creates browser window
  (() => {
    const mainWindow = new BrowserWindow({
      width: 750,
      height: 500,
      autoHideMenuBar: true,
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

  // gets saved data - main.js
  ipcMain.on("requestUserData", async (event) => {
    try {
      const userData = [];
      await new Promise((resolve, reject) =>
        fs
          .createReadStream("./data/data.csv")
          .pipe(csv())
          .on("data", (data) => userData.push(data))
          .on("end", () => resolve(userData))
          .on("error", (err) => {
            console.error("Error reading CSV file:", err);
            reject(err);
          })
      );

      event.sender.send("responseUserData", userData);
    } catch (err) {
      event.sender.send("responseUserData", { error: err.message });
    }
  });

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
    exec("arp -a", (er, stdout, stderr) => {
      try {
        if (er) throw er;

        const lines = stdout.split("\n").map((line) => line.trim());

        const data = [];
        lines.slice(2).forEach((line) => {
          const [IPAddress, physicalAddress, type] = line.split(/\s+/);

          if (type?.toLowerCase() === "dynamic")
            data.push({
              IPAddress,
              physicalAddress,
              type,
            });
        });

        event.sender.send("responseConnDevice", {
          networkInfo: data,
        });
      } catch (er) {
        event.sender.send("responseConnDevice", { error: { er, stderr } });
      }
    });
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
