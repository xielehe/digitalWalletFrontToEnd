import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSnackbar } from 'notistack';

import wifToAddress from "btc/wiftoaddress";
import encryptKey from "btc/encryptKey";

export default function FormDialog({ open, setOpen, savePair}) {
    const [key, setKey] = useState('')
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const handleClose = () => {
        setOpen(false)
    }
    const confirmAddr = () =>{
        try {
            const address = wifToAddress(key)
            const encryptPrivateKey = encryptKey({key, pass})
            savePair({ name, address, encryptPrivateKey})
        } catch (e) {
            return enqueueSnackbar('Invalid key!', { variant: "error" })
        }
    }
    const keyPress = e =>{
        if (e.key === 'Enter'){
            confirmAddr()
        } 
    }
    return (
        <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Import Private Key WIF</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your WIF Key here.
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
                        label="key"
                        onChange={event => setKey(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Pass"
                        type='password'
                        onKeyPress={keyPress}
                        onChange={event => setPass(event.target.value)}
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
