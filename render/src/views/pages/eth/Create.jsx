import React, { useState } from 'react'
import Button from '@material-ui/core/Button'

import createEthAccount from "eth/create"

import Dialog from "views/pages/create/Alert";
export default () => {
    const [pair, setPair] = useState(null)
    const gen = async () =>{
        const pair = await createEthAccount()
        setPair({privatekey: pair.privateKey, address: pair.address})
    }
    return <>
    <Button
    variant="outlined"
    onClick = {gen}
    size='large'
    disableFocusRipple
    fullWidth
    >
            Create key pair
    </Button>
        {pair === null ? '' : <Dialog pair={pair} setPair={setPair} />}
    </>
}
