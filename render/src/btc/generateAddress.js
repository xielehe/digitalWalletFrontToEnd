import { NET } from "config.js"    
const bitcoin = require('bitcoinjs-lib')

export default () => {
    const keyPair = bitcoin.ECPair.makeRandom({ network: NET })
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: NET }),
    });
    return { keyPair: keyPair.toWIF(), address }
}
