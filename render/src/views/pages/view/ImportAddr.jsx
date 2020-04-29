import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSnackbar } from 'notistack';


import { NET } from "config.js"    

const bitcoin = require('bitcoinjs-lib')

const validate = (address) => {
    try {
        bitcoin.address.toOutputScript(address, NET)
        return true
    } catch (e) {
        return false
    }
}


export default function FormDialog({ open, setOpen, saveAddr}) {
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const handleClose = () => {
        setOpen(false)
    }
    const confirmAddr = () =>{
        if (validate(address)){
            saveAddr(address, name)
        } else enqueueSnackbar('Invalid address!', { variant: "error"})
    }
    const keyPress = e =>{
        if (e.key === 'Enter'){
            confirmAddr()
        } 
    }
    return (
        <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Import Address</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your address here.(this will create a watching-only wallet.)
          </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        onChange= {event=>setName(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        onChange= {event=>setAddress(event.target.value)}
                        onKeyPress = {keyPress}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={confirmAddr} color="primary">
                        Import
          </Button>
                </DialogActions>
            </Dialog>
    );
}
