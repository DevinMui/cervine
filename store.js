const Store = require('electron-store')

const schema = {
    theme: {
        type: 'string',
        default: 'system', // system, light, dark
    },
}

const store = new Store({ schema })
module.exports = store
