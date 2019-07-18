import React from 'react'
import PropTypes from 'prop-types'

// start of material imports
import { Container, CssBaseline, Grid } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Toolbar from '@material-ui/core/Toolbar'
// end of material imports

// start of sensenet imports
import snLogo from './assets/sensenet_logo_transparent.png'
// end of materiasensenet imports

// start of component imports
import HeaderPanel from './components/header'
import TodoListPanel from './components/todo-list'
// end of component imports

interface Props {
  window?: () => Window
  children: React.ReactElement
}
/**
 * somithing
 */
function ElevationScroll(props: Props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

ElevationScroll.propTypes = {
  children: PropTypes.node.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  window: PropTypes.func,
}

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = (props: Props) => {
  // const usr = useCurrentUser()
  // const repo = useRepository()
  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <HeaderPanel />
      </ElevationScroll>
      <Toolbar />
      <Container
        maxWidth="lg"
        style={{
          minHeight: '90vh',
          display: 'flex',
          verticalAlign: 'middle',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          flexDirection: 'column',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${snLogo})`,
          backgroundSize: 'auto',
        }}>
        <Grid container>
          <Grid item xs={12}>
            <TodoListPanel />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
