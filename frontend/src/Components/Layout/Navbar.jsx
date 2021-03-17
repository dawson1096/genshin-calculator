import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Button, ButtonGroup, AppBar, Toolbar } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { logoutUser } from '../../actions/authActions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: theme.spacing(2),
  },
});

function Navbar({ classes, auth, logoutUserConnect }) {
  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.root}>
          <ButtonGroup variant="text">
            <Button component={RouterLink} to="/characters">
              Characters
            </Button>
            <Button component={RouterLink} to="/weapons">
              Weapons
            </Button>
            {auth.isAuthenticated && (
              <Button component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
            )}
          </ButtonGroup>
          {auth.isAuthenticated ? (
            // <IconButton component={RouterLink} to="/profile">
            //   <AccountCircle fontSize="large" />
            // </IconButton>
            <Button className={classes.button} variant="outlined" onClick={logoutUserConnect}>
              Logout
            </Button>
          ) : (
            <div>
              <Button
                className={classes.button}
                component={RouterLink}
                to="/login"
                variant="outlined"
              >
                Login
              </Button>
              <Button
                className={classes.button}
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
              >
                Register
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

/* eslint-disable react/forbid-prop-types */
Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUserConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUserConnect: logoutUser })(
  withStyles(styles, { withTheme: true })(Navbar)
);
