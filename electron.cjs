const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const si = require("systeminformation");



// CREATE JARVIS WINDOW


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

    win.loadURL("http://localhost:5173/");

    win.webContents.session.setPermissionRequestHandler(
        (webContents, permission, callback) => {

            if (permission === "media") {
                console.log("Microphone permission granted");
                callback(true);
            } else {
                callback(false);
            }
        }
    );

    // Debug ke liye
    win.webContents.openDevTools();
}



// ELECTRON READY

app.whenReady().then(() => {

    createWindow();

});


// OPEN DESKTOP APPS


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


// RAM INFORMATION

ipcMain.handle("get-ram-info", async () => {

    const mem = await si.mem();

    return {

        totalRam:
            (mem.total / 1024 / 1024 / 1024).toFixed(1),

        usedRam:
            (mem.used / 1024 / 1024 / 1024).toFixed(1),

        ramPercent:
            ((mem.used / mem.total) * 100).toFixed(1)

    };

});



// DISK INFORMATION

ipcMain.handle("get-disk-info", async () => {

    const disks = await si.fsSize();

    const disk = disks[0];

    return {

        totalDisk:
            (disk.size / 1024 / 1024 / 1024).toFixed(1),

        usedDisk:
            (disk.used / 1024 / 1024 / 1024).toFixed(1),

        diskPercent:
            disk.use.toFixed(1)

    };

});


// PHONE AGENT - ANDROID ADB CONTROL


ipcMain.handle("phone-command", async (event, action) => {

    console.log("Phone command received:", action);

    const adbPath = path.join(
        process.env.LOCALAPPDATA,
        "Android",
        "Sdk",
        "platform-tools",
        "adb.exe"
    );

    let adbCommand;

    switch (action) {

        case "open_youtube":

            adbCommand =
                `"${adbPath}" shell am start ` +
                `-a android.intent.action.VIEW ` +
                `-d "https://www.youtube.com"`;

            break;


        case "open_google":

            adbCommand =
                `"${adbPath}" shell am start ` +
                `-a android.intent.action.VIEW ` +
                `-d "https://www.google.com"`;

            break;

        case "open_gallery":

            adbCommand =
                `"${adbPath}" shell am start ` +
                `-a android.intent.action.VIEW ` +
                `-t "image/*"`;

            break;
        case "open_camera":

            adbCommand =
                `"${adbPath}" shell am start ` +
                `-a android.media.action.IMAGE_CAPTURE`;

            break;
        case "open_instagram":

            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.instagram.android ` +
                `-c android.intent.category.LAUNCHER 1`;

            break;


        case "open_whatsapp":

            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.whatsapp ` +
                `-c android.intent.category.LAUNCHER 1`;

            break;


        default:

            console.log(
                "Unknown phone action:",
                action
            );

            return {

                success: false,

                message:
                    "Unknown phone command"

            };
    }


    return new Promise((resolve) => {

        exec(
            adbCommand,
            (error, stdout, stderr) => {

                if (error) {

                    console.error(
                        "ADB Error:",
                        error
                    );

                    resolve({

                        success: false,

                        message:
                            error.message

                    });

                    return;
                }


                console.log(
                    "ADB Output:",
                    stdout
                );


                resolve({

                    success: true,

                    message:
                        `${action} executed successfully`

                });

            }
        );

    });

});

// CLOSE ELECTRON


app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !== "darwin"
        ) {

            app.quit();

        }

    }
);