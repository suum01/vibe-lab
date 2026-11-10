const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("timerApp", {
  command: (command, payload) =>
    ipcRenderer.invoke("command", command, payload),
  onState: (callback) => {
    const handler = (_event, state) => callback(state);
    ipcRenderer.on("state", handler);
    return () => ipcRenderer.removeListener("state", handler);
  },
});
