import Web3 from "web3"

export default async () => {
    const web3 = new Web3()
    return web3.eth.accounts.create()
}
