import React, { useState, useEffect } from 'react';
import { CardContent, TextField, InputAdornment, Button } from '@material-ui/core'

import BigNumber from 'bignumber.js'

import isAddress  from "eth/isAddress"
import buildTX from "eth/buildTX"
import broadcastTX from "eth/broadcastTX"

import { path, defaultTo, prop } from 'ramda';
import { useSnackbar } from 'notistack';
import DialogSignTx from "views/pages/eth/Sign"

const BNOf = n => new BigNumber(n)

export default function ({ address, balance, price, setPageLoading }) {
    const [payTo, setPayTo] = useState('')
    const [amount, setAmount] = useState('')
    const [txh, setTxh] = useState(null)
    const [open, setOpen] = useState(false)
    const [maxBalance, setMax] = useState(0)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        buildTX({ address, to: address, value: '10' })
        .then(prop('transactionFee'))
        .then(fee =>{
            setMax(BNOf(balance)
            .minus(fee)
            .dividedBy('1000000000000000000')
            .toFixed()
            )
        })
    }, [balance, address])
    const toCNY = () =>{
        return amount ? BNOf(amount)
        .multipliedBy(defaultTo(1, path(['ethPrice'], price)))
            .toFixed(2): 0
    }
    const verify = async () => {
        if (!isAddress(payTo)) return enqueueSnackbar('Address is invalid.', { variant: "error", })
        const ethAmount = amount

        if (
            BigNumber(ethAmount).gte(BNOf(balance).dividedBy('1000000000000000000'))
            || ethAmount <= 0) return enqueueSnackbar('Insufficient balance.', { variant: "error", })
        setPageLoading(true)
        const output = await buildTX({address: address, to: payTo, value: ethAmount})
        setPageLoading(false)
        setOpen(output)
    }
    const signAndSend = async raw =>{
        setPageLoading(true)
        try {
            const res = await broadcastTX(raw)
            setPageLoading(false)
            const { err } = res
            if (err) return enqueueSnackbar(res.msg, { variant: "error", })
            setTxh(path(['transactionHash'], res))
            enqueueSnackbar('broadcast successful!', { variant: "success", })
        } catch (error) {
            setPageLoading(false)
            console.log(error);

            return enqueueSnackbar(error.message, { variant: "error", })
        }
    }
    return <CardContent>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Pay to"
                    onChange={event => setPayTo(event.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label={'Amount(ETH)'}
                    type='number'
                    onChange={event => setAmount(event.target.value)}
                    value={amount}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <span style={{ cursor: 'pointer' }}
                            onClick={() => setAmount(maxBalance)} >max</span>
                        </InputAdornment>,
                    }}
                    helperText={`¥ ${toCNY()}`}
                />
            {txh ?
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="TXH"
                    disabled
                    value={txh}
                />
            : ''}
                <div style={{ float: "right"}}>
                <Button
                    color="secondary"
                    onClick={verify}
                    size='large'
                    disableFocusRipple
                    >
                    Send
                    </Button>
                </div>
        <DialogSignTx open={open} price={price} address={address} setOpen={setOpen} callback={signAndSend} />
        </CardContent>
    }
