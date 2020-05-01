import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { path, map, prop, values, sum } from "ramda";

import utxo from "btc/utxo";
import { useInit } from 'context/init'

export default function () {
    const [balance, setBalance] = useState(0)
    const [{ addresses, btcPrice }] = useInit()
    useEffect(() => {
        utxo(addresses)
            .then(path(['data', 'addresses']))
            .then(map(prop('balance')))
            .then(values)
            .then(sum)
            .then(setBalance)
    }, [addresses])
    
    return <Typography variant="h6" noWrap>
        {(balance / 100000).toFixed(2)} <span style={{ paddingRight: 5, fontSize: 'smaller' }}>mBTC</span>
        (¥{btcPrice ? (balance * btcPrice / 100000000).toFixed(0) : 0})
    </Typography>
}