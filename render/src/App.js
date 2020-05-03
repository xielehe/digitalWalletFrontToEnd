import 'typeface-roboto'
import React from 'react'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

import Frame from "views/Sidebar"
import { InitProvider } from 'context/init'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
  }
})

const App = () => {
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
