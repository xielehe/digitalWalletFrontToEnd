import React, { useState, useEffect } from 'react';
import { CardContent, TextField, InputAdornment, Button } from '@material-ui/core'

import BigNumber from 'bignumber.js'
import SyncAltIcon from '@material-ui/icons/SyncAlt';


import isAddress  from "eth/isAddress"
import buildTX from "eth/buildTX"
import broadcastTX from "eth/broadcastTX"

import { path, defaultTo, not } from 'ramda';
import { useSnackbar } from 'notistack';
import DialogSignTx from "views/pages/eth/Sign";

const BNOf = n => new BigNumber(n)

const toCNY = (amount, init) => '¥' + (BNOf(amount === '' ? 0 : amount).multipliedBy(defaultTo(1, init.price.btcPrice)).dividedBy(1000).toFixed(2))
const toBTC = (amount, init) =>
    BNOf(amount).multipliedBy(1000).dividedBy(init.price.btcPrice).toFixed(5)
+ '  mBTC'

export default function ({ address, utxos, fees, balance, init, setPageLoading }) {
    const [payTo, setPayTo] = useState('')
    const [amount, setAmount] = useState('')
    const [txh, setTxh] = useState(null)
    const [open, setOpen] = useState(false)
    const [cunit, setCunit] = useState(true)
    const [maxBalance, setMax] = useState(0)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

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
        const res = await broadcastTX(raw)
        setPageLoading(false)
        const {err} = res
        if (err) return enqueueSnackbar(res.msg, { variant: "error", })
        setTxh(path(['transactionHash'], res))
        enqueueSnackbar('broadcast successful!', { variant: "success", })
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
                    label={`Amount${cunit ? '(ETH)': '(CNY)'}`}
                    type='number'
                    onChange={event => setAmount(event.target.value)}
                    value={amount}
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
                <DialogSignTx open={open} address={address} setOpen={setOpen} callback={signAndSend} />
        </CardContent>
    }
