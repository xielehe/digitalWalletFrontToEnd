import React from 'react'
import { defaultTo, path} from 'ramda'

import { EthereumPairs, BitcoinPairs } from "constants.js"
import getPrices from "fun/price"
import setIState from "fun/setIState";

const Store = window.require('electron-store')
const GlobalContext = React.createContext()

function InitProvider(props) {
    const [init, setInit] = React.useState({ 
        btcs: defaultTo([], (new Store()).get(BitcoinPairs)),
        ethers: defaultTo([], (new Store()).get(EthereumPairs)),
    })
    React.useEffect(() => {
        getPrices()
            .then(a => setInit(
                setIState({price: {
                    ethPrice: path(['ETH', 'quote', 'CNY', 'price'], a),
                    btcPrice: path(['BTC', 'quote', 'CNY', 'price'], a),
                }})
            ))
            .catch(e=>alert('get price error'))
    }, [])
    const value = React.useMemo(() => [init, o => setInit(setIState(o))], [init])
    return <GlobalContext.Provider value={value} {...props} />
}

function useInit() {
    const context = React.useContext(GlobalContext)
    if (!context) throw new Error('useInit must be used within a InitProvider')
    return context
}
export { InitProvider, useInit}
