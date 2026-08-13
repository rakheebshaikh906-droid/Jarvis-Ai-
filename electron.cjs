

require("dotenv").config();

const { app, BrowserWindow, ipcMain } = require("electron");
const { execFile, exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const OpenAI = require("openai");
const si = require("systeminformation");

console.log(
    "OpenAI API Key loaded:",
    !!process.env.OPENAI_API_KEY
);

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });


let whisperProcess = null;
let whisperReady = false;
let pendingTranscription = null;
let wakeProcess = null;

function startWhisper() {

    if (whisperProcess) {
        return;
    }

    const scriptPath = path.join(
        __dirname,
        "transcribe.py"
    );
    const wakeWordScriptPath =
        path.join(__dirname, "wake_word.py");

    console.log(
        "Starting persistent Whisper..."
    );

    whisperProcess = spawn(
        "python",
        [
            "-u",
            scriptPath
        ]
    );


    whisperProcess.stdout.on(
        "data",
        (data) => {

            const output =
                data.toString().trim();

            console.log(
                "WHISPER:",
                output
            );


            if (
                output.includes(
                    "WHISPER_READY"
                )
            ) {

                whisperReady = true;

                console.log(
                    "LOCAL WHISPER READY ⚡"
                );

                return;
            }


            const transcriptLine =
                output
                    .split(/\r?\n/)
                    .find(
                        line =>
                            line.startsWith(
                                "TRANSCRIPT:"
                            )
                    );


            if (
                transcriptLine &&
                pendingTranscription
            ) {

                const transcript =
                    transcriptLine
                        .replace(
                            "TRANSCRIPT:",
                            ""
                        )
                        .trim();

                pendingTranscription.resolve(
                    transcript
                );

                pendingTranscription = null;
            }


            const errorLine =
                output
                    .split(/\r?\n/)
                    .find(
                        line =>
                            line.startsWith(
                                "ERROR:"
                            )
                    );


            if (
                errorLine &&
                pendingTranscription
            ) {

                pendingTranscription.reject(
                    new Error(errorLine)
                );

                pendingTranscription = null;
            }
        }
    );


    whisperProcess.stderr.on(
        "data",
        (data) => {

            console.log(
                "WHISPER INFO:",
                data.toString()
            );
        }
    );


    whisperProcess.on(
        "close",
        (code) => {

            console.log(
                "Whisper stopped:",
                code
            );

            whisperProcess = null;
            whisperReady = false;

            if (pendingTranscription) {

                pendingTranscription.reject(
                    new Error(
                        "Whisper process stopped"
                    )
                );

                pendingTranscription = null;
            }
        }
    );

    wakeProcess = spawn(
        "python",
        [
            "-u",
            wakeWordScriptPath
        ]
    );

    wakeProcess.stdout.on(
        "data",
        (data) => {

            const output =
                data.toString().trim();

            console.log(
                "WAKE:",
                output
            );

            if (
                output.includes(
                    "WAKE_DETECTED"
                )
            ) {

                console.log(
                    " HEY JARVIS DETECTED"
                );

                if (wakeProcess) {

                    wakeProcess.kill();

                    wakeProcess = null;
                }

                // IMPORTANT:
                // Yahan renderer ko signal bhejna hai.
            }
        }
    );

    wakeProcess.stderr.on(
        "data",
        (data) => {

            console.log(
                "WAKE INFO:",
                data.toString()
            );
        }
    );

    wakeProcess.on(
        "close",
        (code) => {

            console.log(
                "Wake process stopped:",
                code
            );

            wakeProcess = null;
        }
    );
}

function transcribeAudio(audioPath) {

    return new Promise((resolve, reject) => {

        if (!whisperProcess) {

            reject(
                new Error(
                    "Whisper process is not running"
                )
            );

            return;
        }

        if (!whisperReady) {

            reject(
                new Error(
                    "Whisper model is still loading"
                )
            );

            return;
        }

        if (pendingTranscription) {

            reject(
                new Error(
                    "Whisper is already processing audio"
                )
            );

            return;
        }

        pendingTranscription = {
            resolve,
            reject
        };

        console.log(
            "Sending audio to loaded Whisper..."
        );

        whisperProcess.stdin.write(
            audioPath + "\n"
        );
    });
}


// CREATE JARVIS WINDOW

let win = null;
function createWindow() {

    win = new BrowserWindow({
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
    startWhisper();

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


ipcMain.handle("phone-command", async (event, command) => {

    // command string bhi ho sakta hai ya object bhi
    const action =
        typeof command === "string"
            ? command
            : command?.action;

    const contactName =
        typeof command === "object" && command !== null
            ? command.contactName
            : null;

    const message =
        typeof command === "object" && command !== null
            ? command.message
            : null;

    console.log(
        "Phone command received:",
        action,
        contactName || "",
        message || ""
    );

    if (!action) {
        return {
            success: false,
            message: "Phone action missing"
        };
    }

    const adbPath = path.join(
        process.env.LOCALAPPDATA,
        "Android",
        "Sdk",
        "platform-tools",
        "adb.exe"
    );

    let adbCommand;
    let args;

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

        case "send_whatsapp": {

            const shellQuote = (value) =>
                "'" + String(value).replace(/'/g, "'\\''") + "'";

            args = [
                "shell",
                `am start ` +
                `-n com.example.jarvismobile/.MainActivity ` +
                `--es action send_whatsapp ` +
                `--es contactName ${shellQuote(contactName)} ` +
                `--es message ${shellQuote(message)}`
            ];

            break;
        }


        case "open_snapchat":

            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.snapchat.android ` +
                `-c android.intent.category.LAUNCHER 1`;

            break;

        case "open_facebook":

            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.facebook.katana ` +
                `-c android.intent.category.LAUNCHER 1`;
            break;
        case "open_twitter":

            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.twitter.android ` +
                `-c android.intent.category.LAUNCHER 1`;
            break;

        case "open_amazon":
            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.amazon.mShop.android.shopping ` +
                `-c android.intent.category.LAUNCHER 1`;
            break;


        case "open_flipkart":

            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.flipkart.android ` +
                `-c android.intent.category.LAUNCHER 1`;
            break;

        case "open_gmail":

            adbCommand =
                `"${adbPath}" shell monkey ` +
                `-p com.google.android.gm ` +
                `-c android.intent.category.LAUNCHER 1`;
            break;


        case "call_contact": {

            if (!contactName) {
                return {
                    success: false,
                    message: "Contact name missing"
                };
            }

            const safeContactName =
                contactName.replace(/"/g, '\\"');

            adbCommand =
                `"${adbPath}" shell am start ` +
                `-n com.example.jarvismobile/.MainActivity ` +
                `--es action call_contact ` +
                `--es contactName "${safeContactName}"`;

            break;
        }

        case "direct_call": {

            if (!contactName) {
                return {
                    success: false,
                    message: "Contact name missing"
                };
            }

            const safeContactName =
                contactName.replace(/"/g, '\\"');



            adbCommand =
                `"${adbPath}" shell am start ` +
                `-n com.example.jarvismobile/.MainActivity ` +
                `--es action direct_call ` +
                `--es contactName "${safeContactName}"`;

            break;
        }



        default:

            console.log(
                "Unknown phone action:",
                action
            );

            return {
                success: false,
                message: `Unknown phone command: ${action}`
            };
    }


    return new Promise((resolve) => {

        console.time("phone-command-time");

        if (action === "send_whatsapp") {

            console.log("ADB ARGS:");
            console.log(args);

            execFile(
                adbPath,
                args,
                (error, stdout, stderr) => {

                    console.timeEnd("phone-command-time");

                    if (error) {

                        console.error(
                            "ADB Error:",
                            error
                        );

                        console.error(
                            "ADB stderr:",
                            stderr
                        );

                        resolve({
                            success: false,
                            message: error.message
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

            return;
        }

        console.log("ADB COMMAND:");
        console.log(adbCommand);

        exec(
            adbCommand,
            (error, stdout, stderr) => {

                console.timeEnd("phone-command-time");

                if (error) {

                    console.error(
                        "ADB Error:",
                        error
                    );

                    resolve({
                        success: false,
                        message: error.message
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

ipcMain.handle(
    "transcribe-audio",
    async (event, audioBuffer, mimeType) => {

        let tempFilePath = null;

        try {

            console.log(
                "VOICE AUDIO RECEIVED"
            );

            const buffer =
                Buffer.from(audioBuffer);

            console.log(
                "Audio bytes:",
                buffer.length
            );


            // =====================================
            // TEMP AUDIO FILE
            // =====================================

            tempFilePath = path.join(
                os.tmpdir(),
                `jarvis-voice-${Date.now()}.webm`
            );

            fs.writeFileSync(
                tempFilePath,
                buffer
            );


            // =====================================
            // USE ALREADY-LOADED WHISPER
            // =====================================

            console.log(
                "Running Local Whisper..."
            );

            const transcript =
                await transcribeAudio(
                    tempFilePath
                );


            console.log(
                "LOCAL TRANSCRIPT:",
                transcript
            );


            return {

                success: true,

                transcript: transcript

            };


        } catch (error) {

            console.error(
                "LOCAL TRANSCRIPTION ERROR:",
                error
            );


            return {

                success: false,

                message:
                    error.message

            };


        } finally {

            // =====================================
            // DELETE TEMP RECORDING
            // =====================================

            if (
                tempFilePath &&
                fs.existsSync(tempFilePath)
            ) {

                try {

                    fs.unlinkSync(
                        tempFilePath
                    );

                } catch (error) {

                    console.error(
                        "Temp cleanup error:",
                        error
                    );

                }
            }
        }
    }
);

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