import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default ({update}) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(false)
    const [address, setAddress] = useState(false)
    const handleClose = () => {
        setOpen(false)
        setName('')
        setAddress('')
    }
    const confirmAddr = () => {
        setOpen(false)
        update({ name, address })
    }
    return <>
    <Button
    variant="outlined"
    onClick = {() => setOpen(true)}
    size='large'
    disableFocusRipple
    fullWidth
    >
            Import Address
    </Button>
    <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Import Ethereum Address</DialogTitle>
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
    </>
}
