import { NET } from "config.js"
const bitcoin = require('bitcoinjs-lib')

export default wif => {
    const keyPair = bitcoin.ECPair.fromWIF(wif, NET)
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: NET }),
    })
    return address
}