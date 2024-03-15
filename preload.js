"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  loadNestPage: (channel, data) => ipcRenderer.send(channel, data),
  getSystemInfo: () =>
    new Promise((resolve, reject) => {
      ipcRenderer.send("requestSystemInfo"); // requests system information from main process
      ipcRenderer.once("responseSystemInfo", (e, { error, systemInfo }) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        resolve(systemInfo);
      }); // listen for the response from the main process
    }),
  getMemoryInfo: () =>
    new Promise((resolve, reject) => {
      ipcRenderer.send("requestMemoryInfo");
      ipcRenderer.once("responseMemoryInfo", (e, { error, networkInfo }) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        resolve(networkInfo);
      });
    }),
  getDevices: () => {
    ipcRenderer.send("requestConnDevice");
    ipcRenderer.once("responseConnDevice", (e, { error, networkInfo }) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log(networkInfo);
    });
  },
  getData: async () =>
    new Promise((res, rej) => {
      ipcRenderer.send("requestUserData");
      ipcRenderer.once("responseUserData", (e, data) => {
        if (data.error) {
          console.error(data.error);
          rej(data.error);
        }

        res(data);
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
