const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,

        },
        icon: path.join(__dirname, 'app_icon.ico')
    });
    win.maximize()
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));
   // win.loadFile("index.html");

}


app.on("ready", createWindow);
var pathStore = path.join(__dirname,'DataStore')

app.setPath ('userData', pathStore);



