import { APIURL } from "config.js"
import { get } from "axios"
import { prop, identity, join } from "ramda";
export default async tx => {
    const url = `${APIURL}/dashboards/transactions/${join(',', tx)}`
    const transaction = await get(url)
    .then(prop('data'))
    .then(prop('data'))
    .catch(identity)
    return transaction
}
