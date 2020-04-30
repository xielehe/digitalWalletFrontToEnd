import Web3 from "web3"

export default address => {
    const web3 = new Web3()
    return web3.utils.isAddress(address)
}
