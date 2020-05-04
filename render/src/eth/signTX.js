import { testnet } from "config.js"
const Tx = require('ethereumjs-tx').Transaction

export default async ({privateKey, txObj}) => {
    try {
        const tx = new Tx(txObj, { 'chain': testnet ? 'ropsten' : 'mainnet'})
        tx.sign(Buffer.from(privateKey, 'hex'))
        const serializedTransaction = tx.serialize()
        const raw = '0x' + serializedTransaction.toString('hex')
        return {data: raw}
    } catch (e) {
        return {err: e}
    }
}
