import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { withOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js'
import Api from './Api';
import NavBar from "./NavBar";
import TicTacToe from './game/TicTacToe'

const AuthWrapper = withOktaAuth(class WrappedRoutes extends Component {

  constructor(props) {
    super(props);
    this.state = {authenticated: null, user: null, api: new Api()};
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.authState.isAuthenticated;
    if (authenticated !== this.state.authenticated) {
      if (authenticated) {
        const user = await this.props.oktaAuth.getUser();
        let accessToken = this.props.oktaAuth.getAccessToken();
        this.setState({authenticated, user, api: new Api(accessToken)});
      } else {
        this.setState({authenticated, user: null, api: new Api()});
      }
    }
  }

  async componentDidMount() {
    await this.checkAuthentication();
  }

  async componentDidUpdate() {
    await this.checkAuthentication();
  }

  async signInWithRedirect() {
    if (this.state.authenticated === null) return; // do nothing if auth isn't loaded yet
    await this.props.oktaAuth.signInWithRedirect();
  }

  async signOut() {
    await this.props.oktaAuth.signOut();
  }

  render() {
    let {authenticated, user, api} = this.state;

    if (authenticated === null) {
      return null;
    }

    const navbar = <NavBar
      isAuthenticated={authenticated}
      signInWithRedirect={this.signInWithRedirect.bind(this)}
      signOut={this.signOut.bind(this)}
    />;

    return (
      <Switch>
        <Route
          path='/'
          exact={true}
          render={(props) => <Home {...props} authenticated={authenticated} user={user} api={api} navbar={navbar}/>}
        />
        <SecureRoute
          path='/game'
          exact={true}
          render={(props) => <TicTacToe {...props} authenticated={authenticated} user={user} api={api}
                                              navbar={navbar}/>}
        />
      </Switch>
    )
  }
});

const oktaAuth = new OktaAuth({
  url: 'https://{yourOktaDomain}',
  issuer: 'https://dev-04822654.okta.com/oauth2/default',
  pkce: true,
  clientId: '0oab8y2laamgwx1t15d6',
  redirectUri: window.location.origin + '/callback'
});

class App extends Component {

  render() {
    return (
      <Router>
        <Security oktaAuth={oktaAuth}>
          <Route path='/callback' component={LoginCallback}/>
          <AuthWrapper/>
        </Security>
      </Router>
    )
  }
}

export default App;