const MachinaFFXIV = require('node-machina-ffxiv');
const MachinaModels = require('node-machina-ffxiv/models/_MachinaModels');
const path = require('path');
const { app } = require('electron');
const { exec } = require('child_process');
const isElevated = require('is-elevated');

const machinaExePath = path.join(app.getAppPath(), './node_modules/node-machina-ffxiv/MachinaWrapper/MachinaWrapper.exe');

let machina;

function sendPacket(win, packet) {
    win && win.webContents && win.webContents.send('packet', packet);
}

function addFirewallRule() {
    exec(`netsh advfirewall add rule name="FFXIV Packet GUI Machina" dir=in action=allow program="${machinaExePath}" enable=yes`);
}

function dataToString(data) {
    return MachinaModels.getString(data, 0);
}

function dataToUint16(data) {
    let newData = [];

    for(let i = 0; i < data.length; i++) {
        newData[i] = MachinaModels.getUint16(data, i);
    }

    return newData;
}

function dataToUint32(data) {
    let newData = [];

    for(let i = 0; i < data.length; i++) {
        newData[i] = MachinaModels.getUint32(data, i);
    }

    return newData;
}

function dataToInt16(data) {
    let newData = [];

    for(let i = 0; i < data.length; i++) {
        newData[i] = MachinaModels.getInt16(data, i);
    }

    return newData;
}

function dataToInt32(data) {
    let newData = [];

    for(let i = 0; i < data.length; i++) {
        newData[i] = MachinaModels.getInt32(data, i);
    }

    return newData;
}

module.exports.addFirewallRule = addFirewallRule;

module.exports.start = function(win, config, verbose, winpcap, pid) {
    let id = 1;
    console.log('started');
    isElevated().then(elevated => {

        if(elevated) {
            const appPath = app.getAppPath();
            const appVersion = /\d\.\d\.\d/.exec(appPath);
            
            //TODO: Fix ability to add to firewall automatically
            exec(`netsh advfirewall firewall show rule status=enabled name="FFXIV Packet GUI Machina" verbose`, (...output) => {
                if(output[1].indexOf(appVersion) === -1) {
                    exec('netsh advfirewall firewall delete rule name="FFXIV Packet GUI"', () => {
                        addFirewallRule();
                    });
                }
            });

            machina = new MachinaFFXIV();
            
            machina.start(() => {
                console.log('starting packet capture');
            });
            machina.setMaxListeners(0);
            machina.on('any', (packet) => {
                packet.dataUint16 = dataToUint16(packet.data);
                packet.dataUint32 = dataToUint32(packet.data);
                packet.dataInt16 = dataToInt16(packet.data);
                packet.dataInt32 = dataToInt32(packet.data);
                packet.dataString = dataToString(packet.data);
                
                sendPacket(win, {
                    id: id++,
                    packet
                });
            })
        } else {
            console.error('No permissions');
        }
    })
};

module.exports.stop = function() {
    if(machina) {
        machina.stop();
    }
}