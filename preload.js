const { contextBridge, ipcRenderer } = require("electron");
const si = require("systeminformation");

contextBridge.exposeInMainWorld("versions", {
  loadNestPage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  si,
});
