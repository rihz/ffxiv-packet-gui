const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const machina = require('./ffxiv-machina');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

const BASE_APP_PATH = path.join(__dirname, '../ffxiv-packet-gui/dist/ffxiv-packet-gui');

/**
 * @type { BrowserWindow }
 */
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 900,
        backgroundColor: '#ffffff',
        frame: true,
        title: 'FFXIV Packet GUI', 
        webPreferences: {
            nodeIntegration: true
        }
    });

    machina.addFirewallRule();

    machina.start(win, null, null, null, null);
    
    win.loadURL(`file://${BASE_APP_PATH}/index.html`);

    //win.webContents.openDevTools();

    win.on('closed', function() {
        win = null;
    });

    win.on('close', (event) => {
        machina.stop();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if(win === null) {
        createWindow();
    }
});