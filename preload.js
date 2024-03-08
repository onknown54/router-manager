const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  loadNestPage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  si: () => {
    console.log("System Information:");

    // Receive the system information from the main process
    ipcRenderer.on("systemInfo", (event, data) => {
      console.log(data);
    });
  },
});
