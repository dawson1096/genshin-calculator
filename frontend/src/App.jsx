import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadUser } from './actions/userActions';
import { loadGenData } from './actions/genActions';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/private-route/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import Characters from './components/characters/Characters';

class App extends Component {
  componentDidMount() {
    const { loadUser, loadGenData } = this.props;
    loadUser();
    loadGenData();
  }

  render() {
    return (
      <Router>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/characters" component={Characters} />
        <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

App.propTypes = {
  loadUser: PropTypes.func.isRequired,
  loadGenData: PropTypes.func.isRequired,
};

export default connect(null, { loadUser, loadGenData })(App);
