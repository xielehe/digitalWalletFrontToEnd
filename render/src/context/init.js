import React from 'react'
import { defaultTo } from 'ramda'

const GlobalContext = React.createContext()

function InitProvider(props) {
    const [init, setInit] = React.useState({ 
        addresses: defaultTo([], JSON.parse(localStorage.getItem('addresses'))),
    })
    const value = React.useMemo(() => [init, setInit], [init])
    return <GlobalContext.Provider value={value} {...props} />
}

function useInit() {
    const context = React.useContext(GlobalContext)
    if (!context) throw new Error('useInit must be used within a InitProvider')
    return context
}
export { InitProvider, useInit}
