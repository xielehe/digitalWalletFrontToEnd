import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useInit } from 'context/init'
import DialogImportAddr from "views/pages/view/ImportAddr";
import DialogImportKey from "views/pages/view/ImportKey";
import Pannel from "views/pages/view/Pannel";
import Createpiar from "views/pages/Create";
import { without, uniq, defaultTo, dissoc} from 'ramda';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        marginTop: 40,
    },
    btn: {
        
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function CenteredGrid() {
    const [open1, setOpen1] = useState(false)
    const [openkey, setOpenKey] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [{ addresses }, setInit] = useInit()
    const classes = useStyles()
    const importAddr = () => setOpen1(true)
    const importKey = () => setOpenKey(true)
    const saveAddress = (addr, name) =>{
        const pairs = JSON.parse(localStorage.getItem('names'))
        localStorage.setItem('names', JSON.stringify({ ...defaultTo({}, pairs), [addr]: name} ))
        const newAddrs = uniq([...addresses, addr])
        localStorage.setItem('addresses', JSON.stringify(newAddrs))
        setInit({addresses: newAddrs})
        setOpen1(false)
    }
    const savePair = ({ name, address, encryptPrivateKey }) =>{
        const pairs = JSON.parse(localStorage.getItem('names'))
        localStorage.setItem('names', JSON.stringify({ ...defaultTo({}, pairs), [address]: name} ))
        localStorage.setItem(address, encryptPrivateKey)
        const newAddrs = uniq([...addresses, address])
        localStorage.setItem('addresses', JSON.stringify(newAddrs))
        setInit({addresses: newAddrs})
        setOpenKey(false)
    }
    const deleteAddress = addr =>{
        const newAddrs = without([addr], addresses)
        localStorage.setItem('addresses', JSON.stringify(newAddrs))
        localStorage.removeItem(addr)
        const pairs = defaultTo({}, JSON.parse(localStorage.getItem('names'))) 
        localStorage.setItem('names', JSON.stringify(dissoc(addr, pairs)))

        setInit({addresses: newAddrs})
    }

    return ( 
        <div className={classes.root}>
            <Backdrop className={classes.backdrop} open={pageLoading}> <CircularProgress color="inherit" /> </Backdrop>
            <DialogImportAddr open={open1} setOpen={setOpen1} saveAddr={saveAddress}/>
            <DialogImportKey open={openkey} setOpen={setOpenKey} savePair={savePair} />

            <Grid container spacing={3} className={classes.btn}>
                <Grid item xs={4}>
                    <Createpiar />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="outlined"
                        onClick={importAddr}
                        size='large'
                        disableFocusRipple 
                        fullWidth >
                            import address
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="outlined"
                        onClick={importKey}
                        size='large'
                        disableFocusRipple 
                        fullWidth >
                            import Private Key
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {addresses.map(address => <Pannel setPageLoading={setPageLoading} key={address} address={address} delAddr={deleteAddress} />)}
            </Grid>
        </div>
    );
}
