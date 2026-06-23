

// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getRamInfo: () => ipcRenderer.invoke('get-ram-info'),
});