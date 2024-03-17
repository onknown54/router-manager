"use strict";

const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const si = require("systeminformation");
const { exec } = require("child_process");
const fs = require("fs");
const csv = require("csv-parser");

// creates csv data storage
(() => {
  try {
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

    fs.access("./data/data.csv", fs.constants.F_OK, async (err) => {
      if (err) {
        // Convert data array to CSV string
        const csvData = data
          .map(
            (itm) =>
              `${itm.firstname},${itm.lastname},${itm.username},${itm.password},${itm.email},${itm.phone}`
          )
          .join("\n");

        // Write CSV string to file
        await new Promise((resolve, reject) =>
          fs.writeFile("./data/data.csv", csvData, (err) => {
            if (err) reject(err);
            else {
              console.log("CSV file has been saved.");
              resolve(1);
            }
          })
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
})();

app.whenReady().then(() => {
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

  // updates user's profile
  ipcMain.on("updateCSV", async (e, newData) => {
    // Write CSV string to file
    const csvData = newData
      .map(
        (itm) =>
          `${itm.firstname},${itm.lastname},${itm.username},${itm.password},${itm.email},${itm.phone}`
      )
      .join("\n");

    const resp = await new Promise((resolve, reject) =>
      fs.writeFile("./data/data.csv", csvData, (er) => {
        if (er)
          reject({
            success: false,
            error: er.message,
          });
        else {
          console.log("CSV file has been updated.");
          resolve({ success: true });
        }
      })
    );
    e.sender.send("updateCSVResponse", resp);
  });

  // gets user's data
  ipcMain.on("reqUserData", async (e) => {
    const data = [];
    const resp = await new Promise((resolve, reject) =>
      fs
        .createReadStream("./data/data.csv")
        .pipe(csv())
        .on("data", (e) => data.push(e))
        .on("end", () => resolve(data))
        .on("error", (er) => reject({ error: er }))
    );
    e.sender.send("respUserData", resp);
  });

  // gets system information
  ipcMain.on("reqSystemInfo", async (e) => {
    const resp = await si
      .osInfo()
      .then(({ arch, distro, hostname, kernel, platform, release, build }) => ({
        systemInfo: {
          arch,
          distro,
          hostname,
          kernel,
          platform,
          release,
          build,
        },
      }))
      .catch((er) => ({ error: er.message }));
    e.sender.send("respSystemInfo", resp);
  });

  // gets memory information
  ipcMain.on("reqMemInfo", async (e) => {
    const resp = await si
      .mem()
      .then(({ total, free, used, active, available, buffers, cached }) => ({
        memInfo: {
          total,
          free,
          used,
          active,
          available,
          buffers,
          cached,
        },
      }))
      .catch((er) => ({ error: er.message }));
    e.sender.send("respMemInfo", resp);
  });

  // gets graphics information
  ipcMain.on("reqGraphicsInfo", async (e) => {
    const resp = await si
      .graphics()
      .then(
        ({
          displays: [
            {
              model,
              connection,
              resolutionX,
              resolutionY,
              currentResX,
              currentResY,
              vendor,
            },
          ],
        }) => ({
          graphicsInfo: {
            model,
            connection,
            resolutionX,
            resolutionY,
            currentResX,
            currentResY,
            vendor,
          },
        })
      )
      .catch((er) => ({ error: er.message }));
    e.sender.send("respGraphicsInfo", resp);
  });

  // gets CPU information
  ipcMain.on("reqCPUInfo", async (e) => {
    const resp = await si
      .cpu()
      .then(
        ({
          manufacturer,
          brand,
          vendor,
          family,
          speed,
          cores,
          processors,
        }) => ({
          prosInfo: {
            manufacturer,
            brand,
            vendor,
            family,
            speed,
            cores,
            processors,
          },
        })
      )
      .catch((er) => ({ error: er.message }));
    e.sender.send("respCPUInfo", resp);
  });

  // gets connected devices
  ipcMain.on("reqConnDevice", async (event) => {
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

        event.sender.send("respConnDevice", {
          networkInfo: data,
        });
      } catch (er) {
        event.sender.send("respConnDevice", { error: { er, stderr } });
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
