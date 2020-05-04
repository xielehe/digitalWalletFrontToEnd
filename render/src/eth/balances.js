
import Web3 from "web3"
import { ETH_APIURL } from "config.js"

export default async accounts => {
    const web3 = new Web3(ETH_APIURL)
    return Promise.all(accounts.map(account => web3.eth.getBalance(account)))
}
