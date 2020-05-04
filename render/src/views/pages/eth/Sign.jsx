import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { defaultTo } from 'ramda';
import { useEffect } from 'react';
import BigNumber from 'bignumber.js'
import { useSnackbar } from 'notistack';

import signTX  from "eth/signTX"
const BNOf = n => new BigNumber(n)

export default function FormDialog({ open, setOpen, price, callback}) {
    const [k, setk] = useState('')
    const [currentFee, setCurrentFee] = useState(defaultTo({}, open).transactionFee)
    const [rawHex, setRawHex] = useState(null)
    const { enqueueSnackbar } = useSnackbar()
    const handleClose = () => {
        setOpen(false)
        setk(null)
        setRawHex(null)
    }
    useEffect(() => {
        setCurrentFee(defaultTo({}, open).transactionFee)
    }, [open])

    const confirm =async ()=>{
        if(rawHex){
            callback(rawHex)
        }else{
            const raw = await signTX({privateKey: k, txObj: open.txObj})
            if(raw.err) return enqueueSnackbar(raw.err.message, { variant: "error", })
            callback(raw.data)
        }
        setOpen(false)
        setk(null)
        setRawHex(null)
    }
    const showHex = async () =>{
        const raw = await signTX({privateKey: k, txObj: open.txObj})
        if(raw.err) return enqueueSnackbar(raw.err.message, { variant: "error", })
        setRawHex(raw.data)
    }
    return <Dialog open={open !== false} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">KEY</DialogTitle>
            <DialogContent  style={{minWidth: 600}}>
                <DialogContentText> Please enter your key here. </DialogContentText>
                <DialogContentText>
                    {open ?
                        (defaultTo(0)(
                            BNOf(currentFee).dividedBy('1000000000000000000').toFixed()
                        ))
                        : ' '}ETH
                        {`  (¥${BNOf(currentFee).dividedBy('1000000000000000000')
                        .multipliedBy(price.ethPrice).toFixed(2)
                    })`}
          </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="WIF"
                    type='password'
                    onChange={event => setk(event.target.value)}
                    fullWidth
                />
                { rawHex ?<p style={{wordWrap:'break-word'}}> {rawHex} </p> : ''}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={showHex} color="primary">
                    Sign
                </Button>
                <Button onClick={confirm} color="primary">
                    Send
          </Button>
            </DialogActions>
        </Dialog>
}
