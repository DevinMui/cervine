const fs = require('fs')

module.exports = {
    setDark: function(mainWindow) {
        if (!mainWindow || !mainWindow.webContents) return

        fs.readFile(__dirname + '/styles/dark.css', 'utf-8', function(
            err,
            style
        ) {
            if (err) {
                console.log(err)
            }

            fs.readFile(__dirname + '/js/dark.js', 'utf-8', function(err, js) {
                if (err) console.log(err)

                style = style.replace(/\s{2,10}/g, ' ').trim()
                mainWindow.webContents.insertCSS(style)
                mainWindow.webContents.executeJavaScript(js)
            })
        })
    }
}
