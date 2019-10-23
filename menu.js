const { app, systemPreferences } = require('electron')
const store = require(__dirname + '/store.js')
const theme = require(__dirname + '/theme.js')

let isMac = process.platform === 'darwin'
const template = [
    ...(isMac
        ? [
              {
                  label: app.getName(),
                  submenu: [
                      { role: 'about' },
                      { type: 'separator' },
                      { role: 'services' },
                      { type: 'separator' },
                      { role: 'hide' },
                      { role: 'hideothers' },
                      { role: 'unhide' },
                      { type: 'separator' },
                      { role: 'quit' }
                  ]
              }
          ]
        : []),
    {
        label: 'File',
        submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac
                ? [
                      { role: 'pasteAndMatchStyle' },
                      { role: 'delete' },
                      { role: 'selectAll' },
                      { type: 'separator' },
                      {
                          label: 'Speech',
                          submenu: [
                              { role: 'startspeaking' },
                              { role: 'stopspeaking' }
                          ]
                      }
                  ]
                : [
                      { role: 'delete' },
                      { type: 'separator' },
                      { role: 'selectAll' }
                  ])
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Dark Mode',
                submenu: [
                    {
                        label: 'System',
                        type: 'radio',
                        checked: store.get('theme') === 'system',
                        click: async (item, window) => {
                            if (store.get('theme') === 'system') return
                            store.set('theme', 'system')
                            systemPreferences.isDarkMode()
                                ? theme.setDark(window)
                                : window.webContents.reload()
                        }
                    },
                    {
                        label: 'Light',
                        type: 'radio',
                        checked: store.get('theme') === 'light',
                        click: async (item, window) => {
                            if (store.get('theme') === 'light') return
                            store.set('theme', 'light')
                            window.webContents.reload()
                        }
                    },
                    {
                        label: 'Dark',
                        type: 'radio',
                        checked: store.get('theme') === 'dark',
                        click: async (item, window) => {
                            if (store.get('theme') === 'dark') return
                            store.set('theme', 'dark')
                            theme.setDark(window)
                        }
                    }
                ]
            },
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac
                ? [
                      { type: 'separator' },
                      { role: 'front' },
                      { type: 'separator' },
                      { role: 'window' }
                  ]
                : [{ role: 'close' }])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal(
                        'https://github.com/DevinMui/cervine'
                    )
                }
            }
        ]
    }
]

module.exports = template
