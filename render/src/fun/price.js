import { get } from "axios"
import { path } from 'ramda'

const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
const config = {
    params: { symbol: 'ETH,BTC', convert: 'CNY', },
    headers: { 'X-CMC_PRO_API_KEY': '749fcd9a-8adf-4044-886d-ea1d82aeb039' },
}
export default () => get(API_URL, config)
    .then(path(['data', 'data']))