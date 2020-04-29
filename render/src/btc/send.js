import { NET } from "config.js"
import BigNumber from 'bignumber.js'
import { prop } from "ramda";

import broadcast from "btc/broadcast";
import { addrType } from "btc/addressType";

const bitcoin = require('bitcoinjs-lib')

export default async ({ payTo, amount, address, wifkey, fee, output }) => {   
    if (addrType(address) !== 'Segwit') return { err: 'wrong address type', msg: 'wrong address type'}

    const total = output.map(prop('value'))

    let alice = null
    try { alice = bitcoin.ECPair.fromWIF(wifkey, NET) } 
    catch (err) { return {err, msg: 'wrong with wif'} }
    
    const p2shObj = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ network: NET, pubkey: alice.publicKey }),
    });
    const redeemScript = p2shObj.redeem.output;
    
    const psbt = new bitcoin.Psbt({ network: NET })

    output.forEach(out => psbt.addInput({
        hash: out.transaction_hash,
        index: out.index,
        witnessUtxo: {
            script: Buffer.from(out.script_hex, 'hex'),
            value: out.value,
        },
        redeemScript
    }))

    psbt.addOutput({
        address: payTo,
        value: amount.toNumber(),
    })
    
    if (BigNumber.sum.apply(null, total).minus(amount).minus(fee).gt(0)){
        psbt.addOutput({
            address,
            value: BigNumber.sum.apply(null, total).minus(amount).minus(fee).toNumber(),
        })
    }
    output.forEach((_, i) => psbt.signInput(i, alice))
    output.forEach((_, i) => psbt.validateSignaturesOfInput(i))
    
    psbt.finalizeAllInputs()

    const hxx = psbt.extractTransaction().toHex()
    const tx_hash = await broadcast(hxx)
    return tx_hash
    
    
}
