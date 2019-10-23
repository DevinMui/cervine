const fs = require('fs').promises

module.exports = {
    setDark: function(mainWindow) {
        if (!mainWindow || !mainWindow.webContents) return

        fs.readFile(__dirname + '/styles/dark/messages.css', 'utf-8')
            .then(style => {
                style = style.replace(/\s{2,10}/g, ' ').trim()
                mainWindow.webContents.insertCSS(style)
                return fs.readFile(__dirname + '/styles/dark/home.css', 'utf-8')
            })
            .then(style => {
                style = style.replace(/\s{2,10}/g, ' ').trim()
                mainWindow.webContents.insertCSS(style)
            })
            .catch(err => {
                console.log(err)
            })
    }
}
