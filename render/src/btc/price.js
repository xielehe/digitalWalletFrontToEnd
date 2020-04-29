import { get } from "axios"
import { prop, identity, path } from "ramda"

export default async () => {
    const url = 'https://blockchain.info/ticker'
    const rates = await get(url).then(prop('data')).catch(identity)
    return path(['CNY', 'sell'], rates)
}

