import React, { useState } from 'react'
import Button from '@material-ui/core/Button'

import generateAddress from "btc/generateAddress";
import Dialog from "views/pages/create/Alert";
export default () => {
    const [pair, setPair] = useState(null)
    const gen = () =>{
        const { keyPair, address } = generateAddress()
        setPair({privatekey: keyPair, address})
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