"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  loadNestPage: (channel, data) => ipcRenderer.send(channel, data),
  getSystemInfo: () =>
    new Promise((resolve, reject) => {
      ipcRenderer.send("reqSystemInfo"); // requests system information from main process
      ipcRenderer.once("respSystemInfo", (e, { error, systemInfo }) =>
        error ? reject(error) : resolve(systemInfo)
      ); // listen for the response from the main process
    }),
  getMemoryInfo: () =>
    new Promise((resolve, reject) => {
      ipcRenderer.send("reqMemInfo");
      ipcRenderer.once("respMemInfo", (e, { error, memInfo }) =>
        error ? reject(error) : resolve(memInfo)
      );
    }),
  getDevices: () => {
    ipcRenderer.send("reqConnDevice");
    ipcRenderer.once("respConnDevice", (e, { error, networkInfo }) => {
      if (error) console.error(error);
      console.log(networkInfo);
    });
  },
  getData: async () =>
    new Promise((resolve, reject) => {
      ipcRenderer.send("reqUserData");
      ipcRenderer.once("respUserData", (e, data) =>
        data.error ? reject(data.error) : resolve(data)
      );
    }),
  updateCSV: async (newData) =>
    new Promise((resolve, reject) => {
      ipcRenderer.send("updateCSV", newData);
      ipcRenderer.on("updateCSVResponse", (e, { success, error }) =>
        error ? reject(error) : resolve(success)
      );
    }),
});
