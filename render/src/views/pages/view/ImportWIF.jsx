import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { defaultTo } from 'ramda';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Slider from '@material-ui/core/Slider';
import BigNumber from 'bignumber.js'

import decryptedKey from "btc/decryptedKey";

const marks = [
    {
        value: 100,
        label: 'fastest',
    },
    {
        value: 50,
        label: 'halfHour',
    },
    {
        value: 0,
        label: 'hour',
    },
];
const BNOf = n => new BigNumber(n)


export default function FormDialog({ open, setOpen, init, callback, address}) {
    const [k, setk] = useState('')
    const [currentFee, setCurrentFee] = useState(defaultTo({}, open).fee)
    const [encryptKey, setEncryptKey] = useState(null)
    const { enqueueSnackbar } = useSnackbar()
    const handleClose = () => {
        setOpen(false)
        setk(null)
    }
    useEffect(() => { 
        setEncryptKey(localStorage.getItem(address))
    }, [address])
    useEffect(() => { 
        setCurrentFee(defaultTo({}, open).fee)
    }, [open])
    const changeFee = (_, newValue) =>{
        const { fastestFee, halfHourFee, hourFee } = open.fees
        const { byteCounts } = open
        const stepfees = {
            0: BNOf(hourFee).multipliedBy(byteCounts).toNumber(),
            50: BNOf(halfHourFee).multipliedBy(byteCounts).toNumber(),
            100: BNOf(fastestFee).multipliedBy(byteCounts).toNumber(),
        }
        setCurrentFee(stepfees[newValue])
    }
    const confirm = ()=>{
        const key = k
        const {output} = open
        setOpen(false)
        setk(null)
        callback({ key, fee: currentFee, output})
    }
    const confirm2 = ()=>{
        const key = decryptedKey({ key: encryptKey, pass: k})
        if (key.err) return enqueueSnackbar('Invalid pass!', { variant: "error" })
        const {output} = open
        setOpen(false)
        setk(null)
        callback({ key, fee: currentFee, output})
    }

    return encryptKey ? 
        <Dialog open={open !== false} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Please enter your Password here.fee: {open ?
                        (defaultTo(0)(open.fee))
                        : ' '} ({open ? '¥' + 
                    (defaultTo(0)(open.fee * defaultTo({}, init).btcPrice / 100000000)).toFixed(2)
                    : ''}）
          </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Pass"
                        type='password'
                        onChange={event=>setk(event.target.value)}
                        fullWidth
                    />
                <Typography id="discrete-slider-custom" style={{ marginTop: 20 }} gutterBottom>
                    fees
                </Typography>
                <Slider
                    defaultValue={100}
                    aria-labelledby="discrete-slider-custom"
                    step={50}
                    onChange={changeFee}
                    getAriaValueText={id => id}
                    valueLabelDisplay="off"
                    marks={marks}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={confirm2} color="primary">
                        Confirm
          </Button>
                </DialogActions>
            </Dialog>
            :
        <Dialog open={open !== false} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">KEY</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter your key here.fee: {open ?
                        (defaultTo(0)(currentFee))
                        : ' '} ({open ? '¥' +
                        (defaultTo(0)(currentFee * defaultTo({}, init).btcPrice / 100000000)).toFixed(2)
                            : ''}）
          </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="WIF"
                    type='password'
                    onChange={event => setk(event.target.value)}
                    fullWidth
                />
                <Typography id="discrete-slider-custom" style={{marginTop: 20}}  gutterBottom>
                    fees
                </Typography>
                <Slider
                    defaultValue={100}
                    aria-labelledby="discrete-slider-custom"
                    step={50}
                    onChange={changeFee}
                    getAriaValueText={id=>id}
                    valueLabelDisplay="off"
                    marks={marks}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
          </Button>
                <Button onClick={confirm} color="primary">
                    Confirm
          </Button>
            </DialogActions>
        </Dialog>
}
