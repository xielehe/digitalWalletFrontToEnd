import wif from "wif";
import bip38 from "bip38";

export default ({key, pass}) => {
    const decoded = wif.decode(key)
    const encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, pass)
    return encryptedKey
}


