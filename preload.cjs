const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload Loaded");

contextBridge.exposeInMainWorld("electronAPI", {
    openApp: (appName) => ipcRenderer.invoke("open-app", appName),
});