const electron = require("electron");
const { ipcRenderer } = electron;
const fs = require("fs");
const timer = new Timer();
const timerDiv = document.getElementById("timerMini");
var rowOrientation = true;
timerDiv.innerHTML = timer.toString();
setInterval(() => {
    timer.update();
    timerDiv.innerHTML = timer.toString();
}, 100);

const querystring = require("querystring");
let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);
if (data.timer.seconds > 0) {
    document.getElementById("descendingRadio").checked = true;
    document.getElementById("numberField").classList.remove("hidden");
    document.getElementById("seconds").value = data.timer.seconds % 60;
    document.getElementById("minutes").value = data.timer.seconds / 60;
    timer.setStartSeconds(data.timer.seconds, true);
}
document.getElementById("fontSelector").value = data.timer.font;
document.getElementById("textFontSelector").value = data.text.font;
timerDiv.style.fontFamily = data.timer.font;
document.getElementById("sizeSlider").value = data.timer.size;

document.getElementById("backgroundColor").value = data.colors.background;
document.getElementById("backgroundTextColor").value =
    data.colors.backgroundText;
document.getElementById("fontColor").value = data.colors.font;
document.getElementById("textColor").value = data.colors.text;

document.getElementById("textContent").value = data.text.content;
document.getElementById("textSizeSlider").value = data.text.size;

var textSize = document.getElementById("sizeSlider").value;
const pauseButton = document.getElementById("pauseButton");
setInterval(() => {
    var newVal = document.getElementById("sizeSlider").value;
    if (textSize != newVal) {
        textSize = newVal;
        ipcRenderer.send("changeSize", textSize);
        saveSettings();
    }
}, 100);
setInterval(() => {
    var newVal = document.getElementById("textSizeSlider").value;
    if (textSize != newVal) {
        textSize = newVal;
        ipcRenderer.send("changeTextSize", textSize);
        saveSettings();
    }
}, 100);

const editPlayButton = (type) => {
    switch (type) {
        case "play":
            pauseButton.src = "assets/fontawesome/play.svg";
            break;
        case "pause":
            pauseButton.src = "assets/fontawesome/pause.svg";
            break;
        case "switch":
            if (pauseButton.src.includes("pause")) {
                pauseButton.src = "assets/fontawesome/play.svg";
            } else {
                pauseButton.src = "assets/fontawesome/pause.svg";
            }
    }
};

const toggleStart = () => {
    timer.toggleStart();
    timerDiv.innerHTML = timer.toString();
    editPlayButton("switch");
    ipcRenderer.send("toggleStart");
};

const reset = () => {
    timer.reset();
    timerDiv.innerHTML = timer.toString();
    editPlayButton("play");
    ipcRenderer.send("reset");
};

const toggleTimerType = () => {
    if (document.getElementById("ascendingRadio").checked) {
        timer.setStartSeconds(0, false);
        ipcRenderer.send("setStartSeconds", [0, false]);
        editPlayButton("play");
        document.getElementById("numberField").classList.add("hidden");
    } else {
        editPlayButton("play");
        document.getElementById("numberField").classList.remove("hidden");
        var minutes = parseInt(document.getElementById("minutes").value);
        var seconds = parseInt(document.getElementById("seconds").value);

        if (seconds == -1) {
            minutes -= minutes > 0 ? 1 : 0;
            document.getElementById("seconds").value = 59;
            document.getElementById("minutes").value = minutes;
            seconds = 59;
        } else if (seconds == 60) {
            minutes += 1;
            document.getElementById("seconds").value = 0;
            document.getElementById("minutes").value = minutes;
            seconds = 0;
        } else if (minutes + seconds == 0) {
            document.getElementById("seconds").value = 1;
            seconds = 1;
        }
        timer.setStartSeconds(minutes * 60 + seconds, true);
        ipcRenderer.send("setStartSeconds", [minutes * 60 + seconds, true]);
    }
    timerDiv.innerHTML = timer.toString();
    saveSettings();
};

const toggleOrientation = () => {
    rowOrientation = !rowOrientation;
    document.getElementById("orientation").innerHTML = rowOrientation ?
        "Afficher en colonne" :
        "Afficher en ligne";
    ipcRenderer.send("changeOrientation", rowOrientation);
};

const changeText = (div) => {
    ipcRenderer.send("changeText", div.value);
    saveSettings();
};

const changeBackground = (div) => {
    ipcRenderer.send("changeBackground", div.value);
    saveSettings();
};
const changeTextBackground = (div) => {
    ipcRenderer.send("changeTextBackground", div.value);
    saveSettings();
};

const changeFontColor = (div) => {
    ipcRenderer.send("changeFontColor", div.value);
    saveSettings();
};
const changeTextColor = (div) => {
    ipcRenderer.send("changeTextColor", div.value);
    saveSettings();
};

const changeFont = (div) => {
    timerDiv.style.fontFamily = div.value;
    timerDiv.innerHTML = timer.toString();
    ipcRenderer.send("changeFont", div.value);
    saveSettings();
};
const changeTextFont = (div) => {
    ipcRenderer.send("changeTextFont", div.value);
    saveSettings();
};

const saveSettings = () => {
    var data = {
        timer: {
            size: document.getElementById("sizeSlider").value,
            font: document.getElementById("fontSelector").value,
            seconds: timer.startSeconds / 1000,
        },
        text: {
            size: document.getElementById("textSizeSlider").value,
            content: document.getElementById("textContent").value,
            font: document.getElementById("textFontSelector").value,
        },
        colors: {
            background: document.getElementById("backgroundColor").value,
            font: document.getElementById("fontColor").value,
            text: document.getElementById("textColor").value,
            backgroundText: document.getElementById("backgroundTextColor").value,
        },
    };
    ipcRenderer.send("saveSettings", data);
};

const resetColors = () => {};

// toggleTimerType();
// changeFont({ value: data.timer.font });