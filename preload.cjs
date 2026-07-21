const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

    openApp: (appName) =>
        ipcRenderer.invoke("open-app", appName),

    getRamInfo: () =>
        ipcRenderer.invoke("get-ram-info"),

    getDiskInfo: () =>
        ipcRenderer.invoke("get-disk-info"),

    // preload.cjs
    sendPhoneCommand: (command) =>
        ipcRenderer.invoke(
            "phone-command",
            command
        ),

    // NEW - send recorded audio to Electron
    sendAudioForTranscription: (audioBuffer, mimeType) =>
        ipcRenderer.invoke(
            "transcribe-audio",
            audioBuffer,
            mimeType
        ),

});