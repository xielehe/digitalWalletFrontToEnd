import React, { useState, useEffect } from 'react';
import { CardContent, TextField, InputAdornment, Button } from '@material-ui/core'

import BigNumber from 'bignumber.js'
import SyncAltIcon from '@material-ui/icons/SyncAlt';

import sendBTc from "btc/send";
import outputFees from "btc/outAndFee";
import valiAddress  from "btc/valiAddr";
import maxPay  from "btc/maxPay";
import { path, defaultTo, not } from 'ramda';
import { useSnackbar } from 'notistack';
import DialogImportWIF from "views/pages/view/ImportWIF";

const BNOf = n => new BigNumber(n)

const toCNY = (amount, init) => '¥' + (BNOf(amount === '' ? 0 : amount).multipliedBy(defaultTo(1, init.btcPrice)).dividedBy(1000).toFixed(2))
const toBTC = (amount, init) => 
    BNOf(amount).multipliedBy(1000).dividedBy(init.btcPrice).toFixed(5)
+ '  mBTC'

export default function ({ address, utxos, fees, balance, init, setPageLoading }) {
    const [payTo, setPayTo] = useState('')
    const [amount, setAmount] = useState('')
    const [txh, setTxh] = useState(null)
    const [open, setOpen] = useState(false)
    const [cunit, setCunit] = useState(false)
    const [maxBalance, setMax] = useState(0)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        maxPay({ utxos, fees ,address, balance }).then(setMax)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

    const verify = async () => {
        if (!valiAddress(payTo)) return enqueueSnackbar('Address is invalid.', { variant: "error", })
        const mbtcAmount = cunit ? amount : BNOf(amount).multipliedBy(1000).dividedBy(init.btcPrice).toFixed(5)

        if (mbtcAmount >= (balance / 100000) || mbtcAmount <= 0) return enqueueSnackbar('Insufficient balance.', { variant: "error", })
        setPageLoading(true)
        const output = await outputFees({ fees, utxos, amount: BNOf(mbtcAmount).multipliedBy(100000), address})
        setPageLoading(false)

        if (output.err) return enqueueSnackbar(output.err, { variant: "error", })
        setOpen(output)
    }
    const send = async ({key, fee, output}) =>{
        setPageLoading(true)
        const mbtcAmount = cunit ? amount : BNOf(amount).multipliedBy(1000).dividedBy(init.btcPrice).toFixed(5)
        const res = await sendBTc({ payTo, amount: BNOf(mbtcAmount).multipliedBy(100000), address, wifkey: key, fee, output});
        setPageLoading(false)
        const {err} = res
        if (err) return enqueueSnackbar(res.msg, { variant: "error", })
        setTxh(path(['data', 'transaction_hash'], res))
        enqueueSnackbar('broadcast successful!', { variant: "success", })
    }
    const callback = k => send(k)
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
                    label={`Amount${cunit ? '(mBTC)': '(CNY)'}`}
                    type='number'
                    onChange={event => setAmount(event.target.value)}
                    value={amount}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <SyncAltIcon style={{ cursor: 'pointer'}} onClick={()=> setCunit(not)} />
                            <span style={{ cursor: 'pointer' }} onClick={() => setAmount(
                                cunit ? BNOf(maxBalance).dividedBy(100000): 
                                    (BNOf(maxBalance).multipliedBy(init.btcPrice).dividedBy(100000000).toFixed(4))
                            )} >max</span>
                        </InputAdornment>,
                    }}
                    helperText={cunit ? 
                        toCNY(amount, init):
                        toBTC(amount, init)
                    }
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
        <DialogImportWIF open={open} address={address} init={init} setOpen={setOpen} callback={callback} />
        </CardContent>
    }