const electron = require('electron');
const url = require('url');
const path =  require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
// process.env.NODE_ENV =  'production';

let mainWindow;
let windowWidth = 350;

// listen for the app to be ready
app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: 400,
        resizable: false,
        maximizable: false,
        alwaysOnTop: true,
        // frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // quit app when closed
    mainWindow.on('close', function(){
        app.quit();
    });

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // insert menu
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('resize_window', (e, vertSize) => {
    // console.log(vertSize);
    mainWindow.setMinimumSize(windowWidth,vertSize)
    mainWindow.setSize(windowWidth,vertSize, true)
  })


// create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Always on Top',
                accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
                click(){
                    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop());
                }
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// if mac add empty obejct to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// add dev tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Dev tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}