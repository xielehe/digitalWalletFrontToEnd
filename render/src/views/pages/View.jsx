import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useInit } from 'context/init'
import DialogImportAddr from "views/pages/view/ImportAddr";
import Pannel from "views/pages/view/Pannel";
import Createpiar from "views/pages/Create";
import { BitcoinPairs } from "constants.js"
import { uniqBy, prop} from 'ramda';

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
const Store = window.require('electron-store')

export default function CenteredGrid() {
    const [open1, setOpen1] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [{ btcs }, setInit] = useInit()
    const classes = useStyles()
    const importAddr = () => setOpen1(true)
    const saveAddress = (address, name) =>{
        const newBtcs = uniqBy(prop('address'), [{ name, address }, ...btcs])
        setInit({ btcs: newBtcs})
        const store = new Store()
        store.set(BitcoinPairs, newBtcs)
        setOpen1(false)
    }
    const deleteAddress = addr =>{
        const newBtcs = btcs.filter(({ address }) => address !== addr)
        setInit({ btcs: newBtcs })
        const store = new Store()
        store.set(BitcoinPairs, newBtcs)
    }

    return ( 
        <div className={classes.root}>
            <Backdrop className={classes.backdrop} open={pageLoading}> <CircularProgress color="inherit" /> </Backdrop>
            <DialogImportAddr open={open1} setOpen={setOpen1} saveAddr={saveAddress}/>
            <Grid container spacing={3} className={classes.btn}>
                <Grid item xs={6}>
                    <Createpiar />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        onClick={importAddr}
                        size='large'
                        disableFocusRipple 
                        fullWidth >
                            import address
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {btcs.map(btc => <Pannel 
                setPageLoading={setPageLoading} 
                btc={btc} 
                key={btc.address} 
                delAddr={deleteAddress} />)}
            </Grid>
        </div>
    );
}
