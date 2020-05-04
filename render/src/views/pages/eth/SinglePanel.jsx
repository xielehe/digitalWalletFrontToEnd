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

import { not } from 'ramda';
import getBalance from "eth/balance"
import Send from "views/pages/eth/Send";
import { useInit } from 'context/init'

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

export default function OutlinedCard({ ethereum, setPageLoading, delAddr}) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar()
    const [balance, setBalance] = useState(0)
    const [loading, setLoading] = useState(true)
    const [openSend, setOpenSend] = useState(false)
    const [{price}] = useInit()
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text)
        enqueueSnackbar('copy successful!', { variant: "info", anchorOrigin: { horizontal: 'center', vertical: 'bottom', }, })
    }


    useEffect(() => {
        getBalance(ethereum.address).then(setBalance).then(() =>setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum])

    const del = addr => {
        if (window.confirm('Are you sure to delete?')) delAddr(ethereum)
    }
    const refreshAccount = () =>{
        setLoading(true)
        getBalance(ethereum.address).then(setBalance).then(() =>setLoading(false))
    }

    return <Grid item xs={6}>
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <div className={classes.list}>
                    <Typography variant="body2" component="span" color="textSecondary" gutterBottom>Name</Typography>
                    <span style={{ float: 'right', }}>{ethereum.name} </span>
                </div>

                <div className={classes.list}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>Address</Typography>
                <Typography variant="body2" component="span">{ethereum.address}
                <FileCopyIcon
                fontSize= 'small'
                onClick={() => copyToClipboard(ethereum.address)}
                style = {{float: 'right', cursor: 'pointer'}}
                /></Typography>
                </div>

                <div className={classes.list}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>Account Balance</Typography>
                <Typography variant="body2" component="span">{
                loading ?<CircularProgress size={16} />:
                parseFloat(BNOf(balance).dividedBy('1000000000000000000').toFixed(5).toString() )
            } <span style={{paddingLeft: 10, paddingRight: 5}}>eth</span>
                (¥{balance && price && price.ethPrice ?
                            BNOf(balance)
                            .dividedBy('1000000000000000000')
                            .multipliedBy(price.ethPrice).toFixed(2)
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
                            onClick={() => del(ethereum.address)}
                            style={{ float: 'right', cursor: 'pointer' }}
                        />
                    </Grid>
                </Grid>
            </CardActions>
            {openSend ? <Send classes={classes}
            address={ethereum.address}
            balance={balance}
            price={price}
            setPageLoading={setPageLoading} />: ''}
        </Card>
    </Grid>
}
