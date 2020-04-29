import BigNumber from 'bignumber.js'
import { flatten, compose, sort, map, prop, includes, filter, isEmpty, path, values, take, splitEvery } from "ramda";
import getTransaction from "btc/transaction";
import getByteCount from "btc/getByteCount";

const BNOf = n => new BigNumber(n)

const minmal = (a, fees) => list => {
    for (let i = 1; i <= list.length; i++) {
        const m = take(i, list)
        const all = BigNumber.sum.apply(null, m) 
        const byteCounts = getByteCount({ 'P2SH-P2WPKH': i }, { 'P2WSH': 2 })
        const fee = BNOf(fees.fastestFee).multipliedBy(byteCounts).toNumber()
        if ((BNOf(all).minus(fee)).gte(BNOf(a))) return { fee, mintxs: m, byteCounts, fees }
        if (i === list.length){
            const byteCounts = getByteCount({ 'P2SH-P2WPKH': i }, { 'P2WSH': 1 })
            const fee = BNOf(fees.fastestFee).multipliedBy(byteCounts)
            if ((BNOf(all).minus(fee)).isEqualTo(a)) return { fee, mintxs: m, byteCounts }   
        }
    }
    return { fee: 0, mintxs: []}
}

export default async ({ amount, address, utxos , fees}) => {
    const txsALL = path(['data', address, 'utxo'], utxos)
    const { fee, mintxs, byteCounts} = compose(
        minmal(amount, fees),
        sort((a, b) => BNOf(b).minus(a)),
        map(prop('value'))
    )(txsALL)

    if(isEmpty(mintxs)) return {err: 'no utxo'}
    const txs = txsALL.filter(({ value }) => includes(value)(mintxs))
    
    let transactions = {}
    const tx10s = splitEvery(10, txs)
    for (const tx of tx10s) {
        const transaction = await getTransaction(tx.map(prop('transaction_hash')))
        transactions = { ...transactions, ...transaction} 
    }

    const output = compose(
        flatten,
        values,
        filter(v => !isEmpty(v)),
        map(filter(({ recipient }) => recipient === address)),
        map(prop('outputs'))
    )(transactions)
    
    if (!output) return { err: true, msg: 'no available utxo' }
    return { fee: BNOf(fee).toNumber(), output, byteCounts,fees }
}