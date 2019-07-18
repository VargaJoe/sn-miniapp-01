import React from 'react'
import { Container, CssBaseline } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import snLogo from './assets/sensenet_logo_transparent.png'
// import { useCurrentUser } from './hooks/use-current-user'
// import { useRepository } from './hooks/use-repository'
import HeaderPanel from './components/header'
import TodoListPanel from './components/todo-list'

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
      <ElevationScroll {...props}>
        <HeaderPanel />
      </ElevationScroll>
      <Toolbar />
      <Container
        maxWidth="lg"
        style={{
          minHeight: '100vh',
          marginTop: '10px',
          display: 'flex',
          verticalAlign: 'middle',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${snLogo})`,
          backgroundSize: 'auto',
        }}>
        <CssBaseline />

        {/* <Typography variant="h3" gutterBottom>
        Hello, {usr.Name} 😎
      </Typography> */}
        <TodoListPanel />
        {/* <Tooltip title="Return to the Login screen and select another repository">
        <Button variant="outlined" color="primary" onClick={() => repo.authentication.logout()}>
          Log out 🚪
        </Button>
      </Tooltip> */}
      </Container>
    </React.Fragment>
  )
}
