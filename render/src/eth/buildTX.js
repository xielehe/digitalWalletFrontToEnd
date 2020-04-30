
import Web3 from "web3"
import BigNumber from 'bignumber.js'

import { ETH_APIURL } from "config.js"

export default async ({address, to, value }) => {
    const BNOf = n => new BigNumber(n)
    const web3 = new Web3(ETH_APIURL)
    const gasPrice = await web3.eth.getGasPrice()
    const txCount = await web3.eth.getTransactionCount(address)
    const transactionObject = {
        nonce: web3.utils.toHex(txCount),
        to,
        value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
        gasPrice: web3.utils.toHex(gasPrice),
    }
    const gasLimit = await web3.eth.estimateGas(transactionObject)
    transactionObject.gas = web3.utils.toHex(gasLimit)
    const transactionFee =BNOf(gasPrice).multipliedBy(gasLimit).toFixed(0)
    return {txObj: transactionObject, transactionFee}
}
