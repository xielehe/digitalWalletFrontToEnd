import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { uniqBy, prop } from 'ramda'
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Createpiar from "views/pages/eth/Create";
import ImportAddress from "views/pages/eth/ImportAddress";

import { EthereumPairs } from "constants.js"
import Pannel from "views/pages/eth/SinglePanel"
import { useInit } from 'context/init'

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
    const [pageLoading, setPageLoading] = useState(false)
    const [{ ethers }, setState] = useInit()
    const classes = useStyles()
    const deleteAddress = eth => {
        const newEths = ethers.filter(({address}) => address !== eth.address)
        setState({ ethers: newEths})
        const store = new Store()
        store.set(EthereumPairs, newEths)
    }
    const refetch = ({ name, address }) =>{
        const newEths = uniqBy(prop('address'), [{ name, address }, ...ethers])
        setState({ ethers: newEths})
        const store = new Store()
        store.set(EthereumPairs, newEths)

    }
    
    return ( <div className = {classes.root} >
        <Backdrop className = {classes.backdrop} open = {pageLoading} >
            <CircularProgress color = "inherit" / >
        </Backdrop>
        <Grid container spacing = {3} className = { classes.btn } >
        <Grid item xs = { 6 }> < Createpiar / > </Grid>
        <Grid item xs = { 6 }> < ImportAddress update={refetch} / > </Grid>
        </Grid>
        <Grid container spacing={3}>
            {ethers.map(ethereum => <Pannel key={ethereum.address} setPageLoading={setPageLoading} ethereum={ethereum} delAddr={deleteAddress} />)}
        </Grid>
        </div>
    );
}
