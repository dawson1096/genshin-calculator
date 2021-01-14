import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  IconButton,
  Button,
  ButtonGroup,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: theme.spacing(2),
  },
});

class Navbar extends Component {
  render() {
    const { classes, auth } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar className={classes.root}>
            <ButtonGroup variant='text'>
              <Button component={RouterLink} to='/characters'>
                Characters
              </Button>
              <Button component={RouterLink} to='/weapons'>
                Weapons
              </Button>
              {auth.isAuthenticated && (
                <Button component={RouterLink} to='/dashboard'>
                  Dashboard
                </Button>
              )}
            </ButtonGroup>
            {auth.isAuthenticated ? (
              <IconButton component={RouterLink} to='/profile'>
                <AccountCircle fontSize='large' />
              </IconButton>
            ) : (
              <div>
                <Button
                  className={classes.button}
                  component={RouterLink}
                  to='/login'
                  variant='outlined'
                >
                  Login
                </Button>
                <Button
                  className={classes.button}
                  component={RouterLink}
                  to='/register'
                  variant='contained'
                  color='secondary'
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
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Navbar));
