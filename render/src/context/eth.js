import React from 'react'
import { defaultTo, identity, path } from 'ramda'
import { get } from "axios"

import { EthereumPairs } from "constants.js"

const GlobalContext = React.createContext()
const Store = window.require('electron-store')

const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
const config = {
    params: { symbol: 'ETH', convert: 'CNY', },
    headers: { 'X-CMC_PRO_API_KEY': '749fcd9a-8adf-4044-886d-ea1d82aeb039' },
}
function VetherProvider(props) {
    const [vether, setVether] = React.useState({
        ethers: defaultTo([], (new Store()).get(EthereumPairs)),
    })
    React.useEffect(() => {
        get(API_URL, config)
        .then(path(['data', 'data']))
        .then(path(['ETH', 'quote', 'CNY', 'price']))
        .then(price=>setVether(o =>({...o, price})))
        .catch(identity)
    }, [])
    const value = React.useMemo(() => [vether, setVether], [vether])
    return <GlobalContext.Provider value={value} {...props} />
}

function useVether() {
    const context = React.useContext(GlobalContext)
    if (!context) throw new Error('useVether must be used within a VetherProvider')
    return context
}
export { VetherProvider, useVether}
