import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { path, prop } from "ramda";
import BigNumber from 'bignumber.js'

import { useInit } from 'context/init'
import getBalances from "eth/balances";

const BNOf = n => new BigNumber(n)
export default function () {
    const [balance, setBalance] = useState(0)
    const [{ ethers, price }] = useInit()

    useEffect(() => {
        getBalances(ethers.map(prop('address'))).then(bls =>{
            const b = BigNumber.sum.apply(null, bls)
                .dividedBy('1000000000000000000')
                .toFixed(6)
            setBalance(b)
        })
    }, [ethers])
    
    return <Typography variant="h6" noWrap>
        {balance} <span style={{ paddingRight: 5, fontSize: 'smaller' }}>ETH</span>
        (¥{price && balance ? 
        BNOf(balance)
        .multipliedBy(path(['ethPrice'], price))
            .toFixed(0)
        : 0})
    </Typography>
}
