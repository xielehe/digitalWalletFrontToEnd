import { NET } from "config.js"    
const bitcoin = require('bitcoinjs-lib')

export default address => {
    try {
        bitcoin.address.toOutputScript(address, NET)
        return true
    } catch (e) {
        return false
    }
}