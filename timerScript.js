const electron = require("electron");
const { ipcRenderer } = electron;
const timerDiv = document.getElementById("timer");
const text = document.getElementById("text");

const timer = new Timer();
timerDiv.innerHTML = timer.toString();
setInterval(() => {
    timer.update();
    timerDiv.innerHTML = timer.toString();
}, 100);

const querystring = require("querystring");
let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);
if (data.timer.seconds > 0) {
    timer.setStartSeconds(data.timer.seconds, true);
}
timerDiv.style.fontSize = data.timer.size + "vmax";
timerDiv.style.fontFamily = data.timer.font;
document.getElementById("container1").style.backgroundColor =
    data.colors.background;
document.getElementById("container2").style.backgroundColor =
    data.colors.backgroundText;
timerDiv.style.color = data.colors.font;
text.style.color = data.colors.text;
text.innerHTML = data.text.content;
text.style.fontFamily = data.text.font;
text.style.fontSize = data.text.size;

ipcRenderer.on("changeOrientation", (e, rowOrientation) => {
    document.getElementById("mainContainer").style.flexFlow = rowOrientation ?
        "column" :
        "row";
    if (rowOrientation) {
        document.getElementById("container1").classList.add("row-align");
        document.getElementById("container1").classList.remove("column-align");
        document.getElementById("container2").classList.add("row-align");
        document.getElementById("container2").classList.remove("column-align");
    } else {
        document.getElementById("container1").classList.remove("row-align");
        document.getElementById("container1").classList.add("column-align");
        document.getElementById("container2").classList.remove("row-align");
        document.getElementById("container2").classList.add("column-align");
    }
});

ipcRenderer.on("toggleStart", () => {
    timer.toggleStart();
});
ipcRenderer.on("changeSize", (e, size) => {
    timerDiv.style.fontSize = size + "vmax";
});
ipcRenderer.on("changeFont", (e, font) => {
    timerDiv.style.fontFamily = font;
});
ipcRenderer.on("changeTextFont", (e, font) => {
    text.style.fontFamily = font;
});
ipcRenderer.on("reset", () => {
    timer.reset();
    timerDiv.innerHTML = timer.toString();
});
ipcRenderer.on("setStartSeconds", (e, values) => {
    timer.setStartSeconds(values[0], values[1]);
    timerDiv.innerHTML = timer.toString();
});
ipcRenderer.on("changeBackground", (e, value) => {
    document.getElementById("container1").style.backgroundColor = value;
});
ipcRenderer.on("changeTextBackground", (e, value) => {
    document.getElementById("container2").style.backgroundColor = value;
});
ipcRenderer.on("changeFontColor", (e, value) => {
    timerDiv.style.color = value;
});
ipcRenderer.on("changeTextColor", (e, value) => {
    text.style.color = value;
});

ipcRenderer.on("changeText", (e, value) => {
    text.innerHTML = value;
});
ipcRenderer.on("changeTextSize", (e, value) => {
    text.style.fontSize = value + "vmax";
});