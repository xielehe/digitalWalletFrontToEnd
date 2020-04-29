import { APIURL } from "config.js"
import { get } from "axios"
import { prop, identity, is, join, isEmpty } from "ramda";
export default async address => {
    if (!address || isEmpty(address)) return
    if(is(Array, address)){
        const url = `${APIURL}/dashboards/addresses/${join(',', address)}?limit=1&offset=1`
        const fnus = await get(url).then(prop('data')).catch(identity)
        return fnus
    }
    else{
        const url = `${APIURL}/dashboards/address/${address}?limit=1,500&offset=0,0`
        const fnus = await get(url).then(prop('data')).catch(identity)
        return fnus
    }
}
