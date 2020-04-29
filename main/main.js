import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'

// import Config from '../config/default'
const Config = {
    mode: 'production'
}
let mainWindow

app.commandLine.appendSwitch('ignore-certificate-errors')
app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1200, height: 600, minWidth: 974, show: false, webPreferences: { webSecurity: false, nodeIntegration: true, }, })
    if (Config.mode === 'development'){
        mainWindow.loadURL('http://localhost:3000/#/')
        mainWindow.webContents.openDevTools()
    }
    else mainWindow.loadFile('./assets/index.html')
    mainWindow.setMenu(null)
    mainWindow.on('closed', function () { mainWindow = null })
    mainWindow.on('ready-to-show', mainWindow.show)
})
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() })
app.on('activate', function () { if (mainWindow === null) createWindow() })