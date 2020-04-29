import React, {
    useState
} from 'react';
import {
    makeStyles
} from '@material-ui/core/styles';
import {
    Button
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Createpiar from "views/pages/eth/Create";
import ImportAddress from "views/pages/eth/ImportAddress";

import {
    useInit
} from 'context/init'

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
    const [openkey, setOpenKey] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [{
        addresses
    }, setInit] = useInit()
    const classes = useStyles()
    const importKey = () => setOpenKey(true)
    const saveAddress = (addr, name) => {

    }
    const savePair = ({
        name,
        address,
        encryptPrivateKey
    }) => {

    }
    const deleteAddress = addr => {

    }

    return ( <div className = {classes.root} >
        <Backdrop className = {classes.backdrop} open = {pageLoading} >
            <CircularProgress color = "inherit" / >
        </Backdrop>
        <Grid container spacing = {3} className = { classes.btn } >
        <Grid item xs = { 4 } > < Createpiar / > </Grid>
        <Grid item xs = { 4 } > < ImportAddress / > </Grid>
        <Grid item xs = { 4 } >
        <Button variant = "outlined" onClick = { console.log } size = 'large' disableFocusRipple fullWidth >
        import privatekey
        </Button>
        </Grid>
        </Grid>
        </div>
    );
}