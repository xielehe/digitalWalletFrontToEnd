import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Grid, CircularProgress,} from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import SyncIcon from '@material-ui/icons/Sync';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js'

import { useInit } from 'context/init'
import utxo from "btc/utxo";
import getFees from "btc/fees";
import { path, not } from 'ramda';
import Send from "views/pages/view/Send";

const useStyles = makeStyles(theme =>({
    root: {
        minWidth: 275,
        zIndex: theme.zIndex.drawer + 2,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    list:{
        marginTop: theme.spacing(1),
    },
    action:{
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    }
}));
const BNOf = n => new BigNumber(n)

export default function OutlinedCard({ delAddr, btc, setPageLoading}) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar()
    const [init] = useInit()
    const [balance, setBalance] = useState(0)
    const [loading, setLoading] = useState(true)
    const [openSend, setOpenSend] = useState(false)
    const [utxos, setUtxos] = useState(null)
    const [fees, setFees] = useState({})
    const {address} = btc
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text)
        enqueueSnackbar('copy successful!', { variant: "info", anchorOrigin: { horizontal: 'center', vertical: 'bottom', }, })
    }

    const getUTXO = async addr => {
        const u = await utxo(address)
        setBalance(path(['data', address, 'address', 'balance'], u))
        setLoading(false)
        setUtxos(u)
    }

    useEffect(() => {
        getUTXO(address)
        getFees().then(setFees)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])
    const refreshAccount = () =>{
        setLoading(true)
        getUTXO(address)
    }
    const del = addr =>{
        if (window.confirm('Are you sure to delete?')) delAddr(addr)
    }

    return <Grid item xs={6}>
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <div className={classes.list}>
                    <Typography variant="body2" component="span" color="textSecondary" gutterBottom>Name</Typography>
                    <span style={{ float: 'right', }}>{btc.name} </span>
                </div>

                <div className={classes.list}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>Address</Typography>
                <Typography variant="body2" component="span">{address} 
                <FileCopyIcon 
                fontSize= 'small'
                onClick={() => copyToClipboard(address)}
                style = {{float: 'right', cursor: 'pointer'}}
                /></Typography>
                </div>

                <div className={classes.list}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>Account Balance</Typography>
                <Typography variant="body2" component="span">{
                loading ?<CircularProgress size={16} />:
                BNOf(balance).dividedBy(100000).toFixed(5)
                } <span style={{paddingLeft: 10, paddingRight: 5}}>mBTC</span> 
                                (¥{balance && init.price.btcPrice ? 
                                BNOf(balance).multipliedBy(init.price.btcPrice).dividedBy(100000000).toFixed(2)
                : 0})
                <SyncIcon 
                fontSize= 'small'
                onClick={refreshAccount}
                style = {{float: 'right', cursor: 'pointer'}}
                /></Typography>
                </div>
            </CardContent>
            <CardActions>
                <Grid container spacing={3} className={classes.action}>
                    <Grid item xs={6}>
                        <SendIcon
                            fontSize='small'
                            onClick={() => setOpenSend(not)}
                            style={{ cursor: 'pointer' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DeleteIcon
                            fontSize='small'
                            onClick={() => del(address)}
                            style={{ float: 'right', cursor: 'pointer' }}
                        />
                    </Grid>
                </Grid>
            </CardActions>
         
            {openSend ? <Send classes={classes} fees={fees} utxos={utxos} address={address} init={init} balance={balance} setPageLoading={setPageLoading} />: ''} 
        </Card>         
    </Grid>
}
