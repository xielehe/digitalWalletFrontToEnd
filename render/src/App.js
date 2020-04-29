import 'typeface-roboto'
import React, { useEffect } from 'react'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

import Frame from "views/Sidebar"
import { useInit, InitProvider } from 'context/init'
import btcPrice from "btc/price"

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
  }
})

const App = () => {
  const [, setInit] = useInit()
  useEffect(() => {
    btcPrice()
      .then(a => setInit(r => ({ ...r, btcPrice: a })))
  }, [setInit])
    return (
      <ThemeProvider theme={theme}>
            <React.Fragment>
                  <CssBaseline />
                      <SnackbarProvider maxSnack={3} autoHideDuration = {2500} anchorOrigin={{ vertical: 'top', horizontal: 'center', }}>
                        <Frame />
                      </SnackbarProvider>
            </React.Fragment>
      </ThemeProvider>
    )
}

export default () => <InitProvider> <App /> </InitProvider>