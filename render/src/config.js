const bitcoin = require('bitcoinjs-lib')
const test = true

export const NET = test ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
export const APIURL = test ?
    'https://api.blockchair.com/bitcoin/testnet' :
    'https://api.blockchair.com/bitcoin'
export const testnet = test