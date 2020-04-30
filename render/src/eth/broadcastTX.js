import Web3 from "web3"

import { ETH_APIURL } from "config.js"

export default async raw => {
    const web3 = new Web3(ETH_APIURL)
    const res = await web3.eth.sendSignedTransaction(raw)
    return res
}
