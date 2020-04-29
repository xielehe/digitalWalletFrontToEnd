import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useSnackbar } from 'notistack';

export default function AlertDialog({ pair, setPair }) {
    const { enqueueSnackbar } = useSnackbar()
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text)
        enqueueSnackbar('copy successful!', { variant: "info",
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        })
    };
  return (
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"private key and address"}</DialogTitle>
                  <List>
                        <ListItem>
                            <ListItemText primary={`key: *******************************************************`} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="comments" onClick={() => copyToClipboard(pair.privatekey) }>
                                  <FileCopyIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`addr: ${pair.address}`} />
                            <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments" onClick={() => copyToClipboard(pair.address) }>
                                  <FileCopyIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                  </List>
        <DialogActions>
            <Button onClick={() => setPair(null)} color="primary" > dismiss </Button>
        </DialogActions>
      </Dialog>
  );
}
