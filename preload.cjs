

// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
    openApp: (appName) =>
        ipcRenderer.invoke("open-app", appName),

    getRamInfo: () =>
        ipcRenderer.invoke("get-ram-info"),

    getDiskInfo: () =>
        ipcRenderer.invoke("get-disk-info"),
});