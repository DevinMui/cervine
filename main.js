const { app, BrowserWindow, Menu, systemPreferences } = require('electron')
const template = require(__dirname + '/menu.js')
const theme = require(__dirname + '/theme.js')
const store = require(__dirname + '/store.js')
const fs = require('fs')

let mainWindow
let menu

const BASE_URL = 'https://www.instagram.com'

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800
    })

    menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    mainWindow.webContents.on('did-navigate-in-page', function(event, url) {
        if (
            store.get('theme') === 'dark' ||
            (store.get('theme') === 'system' && systemPreferences.isDarkMode())
        )
            theme.setDark(mainWindow)

        // intercept ENTER keypress to press Send button in chat
        if (url.startsWith(BASE_URL + '/direct/t')) {
            fs.readFile(__dirname + '/js/enter.js', 'utf-8', function(err, js) {
                mainWindow.webContents.executeJavaScript(js)
            })
        }
    })

    // force instagram to be in mobile
    let userAgent =
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like G    ecko) Chrome/77.0.3865.120 Mobile Safari/537.36'
    mainWindow.loadURL(BASE_URL + '/direct/inbox', { userAgent: userAgent })

    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })

    // autoupdate on system change
    // from experimentation, isDarkMode() does not work on windows
    if (process.platform === 'darwin') {
        systemPreferences.subscribeNotification(
            'AppleInterfaceThemeChangedNotification',
            () => {
                if (
                    store.get('theme') === 'dark' ||
                    (store.get('theme') === 'system' &&
                        systemPreferences.isDarkMode())
                )
                    theme.setDark(mainWindow)
                else mainWindow.webContents.reload()
            }
        )
    }
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    if (mainWindow === null) createWindow()
})
