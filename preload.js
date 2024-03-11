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
        return data.error ? reject(data.error) : resolve(data.systemInfo);
      });
    }),
  getMemoryInfo: () =>
    new Promise((resolve, reject) => {
      // requests network information from main process
      ipcRenderer.send("requestMemoryInfo");

      // listen for the response from the main process
      ipcRenderer.once("responseMemoryInfo", (event, data) => {
        return data.error ? reject(data.error) : resolve(data.networkInfo);
      });
    }),
  getDevices: () => {
    ipcRenderer.send("requestConnDevice");

    ipcRenderer.once("responseConnDevice", (event, data) => {
      if (data.error) console.log(data.error);

      console.log(data.networkInfo);
      // return data.error ? reject(data.error) : resolve(data.networkInfo);
    });
  },
});
