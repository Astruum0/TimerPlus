const electron = require("electron");
const url = require("url");
const path = require("path");
const { app, BrowserWindow, ipcMain, Menu } = electron;
const Store = require("electron-store");
const store = new Store();

process.env.NODE_ENV = "production";

if (!store.get("settings")) {
    store.set("settings", {
        timer: {
            size: "30",
            font: "Digits",
            seconds: 120,
        },
        text: {
            size: "20",
            content: "Round 1",
            font: "Verdana",
        },
        colors: {
            background: "#343a40",
            font: "#ffffff",
            text: "#ffffff",
            backgroundText: "#343a40",
        },
    });
}
let data = store.get("settings");

let timerWindow;
let settingsWindow;

app.on("ready", () => {
    timerWindow = new BrowserWindow({
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: false,
    });
    timerWindow.loadFile("timer.html", { query: { data: JSON.stringify(data) } });
    timerWindow.maximize();

    const mainMenu = Menu.buildFromTemplate(MenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    settingsWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    settingsWindow.loadFile("settings.html", {
        query: { data: JSON.stringify(data) },
    });

    timerWindow.on("closed", () => {
        app.quit();
    });
    settingsWindow.on("closed", () => {
        app.quit();
    });

    ipcMain.on("toggleStart", () => {
        timerWindow.webContents.send("toggleStart");
    });
    ipcMain.on("changeSize", (e, size) => {
        timerWindow.webContents.send("changeSize", size);
    });
    ipcMain.on("changeFont", (e, font) => {
        timerWindow.webContents.send("changeFont", font);
    });
    ipcMain.on("changeTextFont", (e, font) => {
        timerWindow.webContents.send("changeTextFont", font);
    });
    ipcMain.on("reset", () => {
        timerWindow.webContents.send("reset");
    });
    ipcMain.on("setStartSeconds", (e, val) => {
        timerWindow.webContents.send("setStartSeconds", val);
    });
    ipcMain.on("changeBackground", (e, val) => {
        timerWindow.webContents.send("changeBackground", val);
    });
    ipcMain.on("changeTextBackground", (e, val) => {
        timerWindow.webContents.send("changeTextBackground", val);
    });
    ipcMain.on("changeFontColor", (e, val) => {
        timerWindow.webContents.send("changeFontColor", val);
    });
    ipcMain.on("changeTextColor", (e, val) => {
        timerWindow.webContents.send("changeTextColor", val);
    });
    ipcMain.on("saveSettings", (e, settings) => {
        store.set("settings", settings);
    });

    ipcMain.on("changeOrientation", (e, val) => {
        timerWindow.webContents.send("changeOrientation", val);
    });

    ipcMain.on("changeText", (e, val) => {
        timerWindow.webContents.send("changeText", val);
    });
    ipcMain.on("changeTextSize", (e, val) => {
        timerWindow.webContents.send("changeTextSize", val);
    });
});

const MenuTemplate = [{
    label: "Fenêtre",
    submenu: [{
            label: "Plein écran",
            accelerator: process.platform == "darwin" ? "Command+F" : "Ctrl+F",
            click() {
                if (timerWindow.isFullScreen()) {
                    timerWindow.setFullScreen(false);
                    timerWindow.autoHideMenuBar = false;
                } else {
                    timerWindow.setFullScreen(true);
                    timerWindow.autoHideMenuBar = true;
                }
            },
        },
        { type: "separator" },
        {
            label: "Quitter",
            accelerator: process.platform == "darwin" ? "Command+Q" : "Alt+F4",
            click() {
                app.quit();
            },
        },
    ],
},{
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]} ];

if (process.platform == "darwin") {
    MenuTemplate.unshift({
        label: app.name,
        submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
        ],
    });
}

if (process.env.NODE_ENV != "production") {
    MenuTemplate.push({
        label: "Developer Tools",
        submenu: [{
            label: "Toggle DevTools",
            accelerator: process.platform == "darwin" ? "Command+Alt+I" : "Ctrl+Alt+I",
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            },
        }, ],
    });
}