const bitcoin = require('bitcoinjs-lib')
const test = false

export const NET = test ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
export const APIURL = test ?
    'https://api.blockchair.com/bitcoin/testnet' :
    'https://api.blockchair.com/bitcoin'

export const ETH_APIURL = test ?
    'https://ropsten.infura.io/v3/30020b1f733b44e09852ed81fa82a588' :
    'https://mainnet.infura.io/v3/30020b1f733b44e09852ed81fa82a588'

export const testnet = test
