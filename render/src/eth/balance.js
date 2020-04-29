
import Web3 from "web3"
import { ETH_APIURL } from "config.js"

export default async account => {
    const web3 = new Web3(ETH_APIURL)
    const balance = await web3.eth.getBalance(account)
    return balance
}
