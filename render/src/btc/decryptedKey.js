import wif from "wif";
import bip38 from "bip38";
import { testnet } from "config.js"

export default ({key, pass}) => {
    try {
        const decryptedKey = bip38.decrypt(key, pass)
        return wif.encode(testnet ? 239: 128, decryptedKey.privateKey, decryptedKey.compressed)
    } catch (error) {
        return {err: error}
    }

}


