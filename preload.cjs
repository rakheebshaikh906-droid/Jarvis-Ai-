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

    onWakeWordDetected: (callback) => {
        ipcRenderer.removeAllListeners("wake-word-detected"); // prevent duplicates
        ipcRenderer.on("wake-word-detected", callback);
    },
    onStartBrowserMic: (callback) => {
        ipcRenderer.removeAllListeners("start-browser-mic");
        ipcRenderer.on("start-browser-mic", callback);
    },

    onStartElectronMic: (callback) => {
        ipcRenderer.removeAllListeners("start-electron-mic");
        ipcRenderer.on("start-electron-mic", callback);
    },

    restartWakeWord: () => {

        return ipcRenderer.invoke(
            "restart-wake-word"
        ); onWake
    }


});