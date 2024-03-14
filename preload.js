"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  loadNestPage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  getSystemInfo: () =>
    new Promise((resolve, reject) => {
      // requests system information from main process
      ipcRenderer.send("requestSystemInfo");

      // listen for the response from the main process
      ipcRenderer.once("responseSystemInfo", (event, data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }

        return data.error ? reject(data.error) : resolve(data.systemInfo);
      });
    }),
  getMemoryInfo: () =>
    new Promise((resolve, reject) => {
      ipcRenderer.send("requestMemoryInfo");
      ipcRenderer.once("responseMemoryInfo", (event, data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }

        return data.error ? reject(data.error) : resolve(data.networkInfo);
      });
    }),
  getDevices: () => {
    ipcRenderer.send("requestConnDevice");
    ipcRenderer.once("responseConnDevice", (event, data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }

      console.log(data.networkInfo);
    });
  },
  getData: async () =>
    new Promise((res, rej) => {
      ipcRenderer.send("requestUserData");
      ipcRenderer.once("responseUserData", (event, data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }

        return data.error ? rej(data.error) : res(data);
      });
    }),
  updateCSV: async (newData) =>
    new Promise((res, rej) => {
      ipcRenderer.send("updateCSV", newData);
      ipcRenderer.on("updateCSVResponse", (event, { success, er }) => {
        if (er) rej(er);
        res(success);
      });
    }),
});
