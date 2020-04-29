import { APIURL } from "config.js"
import { post } from "axios"
import { prop, identity } from "ramda";
export default async data => {
    const url = `${APIURL}/push/transaction`
    const transaction = await post(url, {data})
        .then(prop('data'))
        .catch(identity)
    return transaction
}
