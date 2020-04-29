import BigNumber from 'bignumber.js'
import getByteCount from "btc/getByteCount";

import { path } from "ramda";

const BNOf = n => new BigNumber(n)

export default async ({ utxos, address, fees, balance }) => {
    const txsALL = (path(['data', address, 'utxo'], utxos))
    const byteCounts = getByteCount({ 'P2SH-P2WPKH': txsALL.length }, { 'P2WSH': 1 })
    const fee = BNOf(fees.fastestFee).multipliedBy(byteCounts)
    return BNOf(balance).minus(fee).toNumber()
}