let path = require('path')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    entry:  {
        bundle: [path.resolve(__dirname, './main.js')],
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'main.js',
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src'),
        }
    },
    target: 'electron-main',
    externals: [nodeExternals()],
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true,
        path: true
    },
    optimization: {
        minimizer: [new TerserPlugin()]
    }
}
