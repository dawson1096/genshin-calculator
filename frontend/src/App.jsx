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
import Weapons from './components/weapons/Weapons';
import NotFoundPage from './components/layout/NotFoundPage';

class App extends Component {
  componentDidMount() {
    const { loadUserConnect, loadGenDataConnect } = this.props;
    loadUserConnect();
    loadGenDataConnect();
  }

  render() {
    return (
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/characters" component={Characters} />
          <Route exact path="/weapons" component={Weapons} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

App.propTypes = {
  loadUserConnect: PropTypes.func.isRequired,
  loadGenDataConnect: PropTypes.func.isRequired,
};

export default connect(null, { loadUserConnect: loadUser, loadGenDataConnect: loadGenData })(App);
