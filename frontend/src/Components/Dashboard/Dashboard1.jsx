import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';

import { logoutUser } from '../../actions/authActions';

class Dashboard extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    const { logoutUserConnect } = this.props;
    logoutUserConnect();
  };

  render() {
    const {
      auth: { user },
    } = this.props;
    return (
      <div style={{ height: '75vh' }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b>
              {user.username.split(' ')[0]}
              <p className="flow-text grey-text text-darken-1">
                You are logged into a full-stack
                <span style={{ fontFamily: 'monospace' }}>MERN</span>
              </p>
            </h4>
            <Button onClick={this.onLogoutClick}>Logout</Button>
          </div>
        </div>
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Dashboard.propTypes = {
  logoutUserConnect: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUserConnect: logoutUser })(Dashboard);
