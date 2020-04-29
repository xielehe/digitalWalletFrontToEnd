import axios from "axios";
import { prop, identity } from "ramda";

export default async () => {
    const url = 'https://bitcoinfees.earn.com/api/v1/fees/recommended'
    const fees = await axios.get(url).then(prop('data')).catch(identity)
    return fees
}

