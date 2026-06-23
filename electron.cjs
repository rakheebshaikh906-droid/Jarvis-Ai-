const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");

const si = require("systeminformation");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadURL("http://localhost:5173");

    // Debug ke liye
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
});

ipcMain.handle("open-app", async (event, appName) => {
    console.log("Received:", appName);

    switch (appName) {
        case "calculator":
            console.log("Open Calculator");
            exec("calc");
            break;

        case "notepad":
            console.log("Open Notepad");
            exec("notepad");
            break;

        case "vscode":
            console.log("Open VS Code");
            exec("code");
            break;
        case "chrome":
            exec("start chrome");
            break;

        case "explorer":
            exec("explorer");
            break;

        case "spotify":
            exec("start spotify");
            break;

        default:
            console.log("Unknown App:", appName);
    }
});

ipcMain.handle("get-ram-info", async () => {

    const mem = await si.mem();

    return {
        totalRam: (mem.total / 1024 / 1024 / 1024).toFixed(1),
        usedRam: (mem.used / 1024 / 1024 / 1024).toFixed(1),
        ramPercent: ((mem.used / mem.total) * 100).toFixed(1)
    };

});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});