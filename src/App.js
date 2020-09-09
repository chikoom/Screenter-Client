import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import { inject, observer } from 'mobx-react'
import Loading from './components/Loading'
import NavBar from './components/NavBar'
import NavbarPage from './components/Navbar/Navbar'
import Paypal from './components/Paypal/PaypalBtn'
import Footer from './components/Footer'
import Creators from './views/Creators'
import Homepage from './views/Homepage'
import EventPage from './views/EventPage'
import About from './views/About'
import Profile from './views/Profile'
import ExternalApi from './views/ExternalApi'
import { useAuth0 } from '@auth0/auth0-react'
import history from './utils/history'
import Creator from './views/Creator'
import User from './views/User'

// stylesconst { isLoading, error, user } = useAuth0()
import './App.css'

// fontawesome
import initFontAwesome from './utils/initFontAwesome'
import BroadcastRoom from './views/BroadcastRoom'
initFontAwesome()

const App = inject('generalStore')(
  observer(props => {
    const { isLoading, error, user } = useAuth0()

    if (error) {
      return <div>Oops... {error.message}</div>
    }

    if (isLoading) {
      return <Loading />
    }
    if (user) {
      console.log(user)
      props.generalStore.checkUserInDataBase(user)
    } else {
      console.log('no user')
    }

    return (
      <Router history={history}>
        <div id='app' className='d-flex flex-column h-100'>
          <NavbarPage />
          <Switch>
            <Route exact path='/' exact render={() => <Homepage />} />
            <Route
              exact
              path='/broadcast-room/:roomId'
              render={({ match }) => <BroadcastRoom match={match} />}
            />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/creators' exact render={() => <Creators />} />
            <Route exact path='/about' component={About} />
            <Route exact path='/external-api' component={ExternalApi} />
            <Route
              exact
              path='/event/:id'
              render={({ match }) => <EventPage match={match} />}
            />
            <Route
              path='/creator/:id'
              component={({ match, history }) => (
                <Creator match={match} history={history} />
              )}
            />
            <Route
              path='/user/:id'
              component={({ match }) => <User match={match} />}
            />
            <Route path='/paypal' render={() => <Paypal />} />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  })
)
export default App
