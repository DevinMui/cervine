// Modules to control application life and create native browser window
const { app, BrowserWindow, systemPreferences } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow
const BASE_URL = 'https://www.instagram.com'

function changeTheme() {
    if (!mainWindow || !mainWindow.webContents) return

    if (systemPreferences.isDarkMode()) {
        fs.readFile(__dirname + '/styles/dark.css', 'utf-8', function(
            err,
            style
        ) {
            if (err) {
                console.log(err)
            }

            style = style.replace(/\s{2,10}/g, ' ').trim()
            mainWindow.webContents.insertCSS(style)
        })
    } else {
        // refresh once
        // mainWindow.webContents.reload()
    }
}

function changeThemeJs() {
    if (!mainWindow || !mainWindow.webContents) return

    if (systemPreferences.isDarkMode()) {
        fs.readFile(__dirname + '/js/dark.js', 'utf-8', function(err, js) {
            if (err) console.log(err)
            mainWindow.webContents.executeJavaScript(js)
        })
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.webContents.on('did-navigate-in-page', function(event, url) {
        changeTheme()
        changeThemeJs()
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
    // systemPreferences.subscribeNotification(
    //     'AppleInterfaceThemeChangedNotification',
    //     () => {
    //         changeTheme()
    //         changeThemeJs()
    //     }
    // )
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    if (mainWindow === null) createWindow()
})
