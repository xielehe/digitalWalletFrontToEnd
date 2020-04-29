const fs = require('fs')
const yaml = require('js-yaml')
const builder = require('electron-builder')
try {
    const config = yaml.safeLoad(fs.readFileSync('./electron-builder.yml', 'utf8'))
    builder.build().then(console.log).catch(console.error)
} catch (e) { console.log(e) }
