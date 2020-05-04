
import Web3 from "web3"
import { ETH_APIURL } from "config.js"

export default async () => {
    const web3 = new Web3(ETH_APIURL)
    const gasPrice = await web3.eth.getGasPrice()
    return gasPrice
}
