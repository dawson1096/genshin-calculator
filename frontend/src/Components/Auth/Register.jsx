import React, { Component } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Grid,
  Link,
  Typography,
  TextField,
  Button,
  withStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowBack } from '@material-ui/icons';
import { registerUser } from '../../actions/authActions';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(3, 0, 2),
  },
  textDiv: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPass: '',
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    const {
      auth: { isAuthenticated },
      history,
    } = this.props;
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }

  static getDerivedStateFromProps(props, state) {
    const newState = state;
    if (props.errors.existingAcc) {
      newState.errors = props.errors;
      return newState;
    }
    return null;
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });

    let error;
    const map = {
      email: 'Email',
      username: 'Username',
      password: 'Password',
      confirmPass: 'Confirm password',
    };
    const { password } = this.state;
    if (!e.target.value && e.target.id !== 'confirmPass') {
      error = `${map[e.target.id]} is required`;
    } else {
      switch (e.target.id) {
        case 'email':
          if (!e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            error = 'Invalid email';
          }
          break;
        case 'password':
          if (e.target.value.length < 6) {
            error = 'Password must be at least 6 characters';
          }
          break;
        case 'confirmPass':
          if (password !== e.target.value) {
            error = 'Passwords must match';
          }
          break;
        default:
          break;
      }
    }
    this.setState((prevState) => ({
      errors: {
        ...prevState.errors,
        [e.target.id]: error,
      },
    }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, confirmPass } = this.state;
    const { registerUserConnect, history } = this.props;
    const newUser = {
      username,
      email,
      password,
      confirmPass,
    };
    const errors = {};
    let valid = true;

    if (email === '') {
      errors.email = 'Email is required';
      valid = false;
    } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      errors.email = 'Invalid email';
      valid = false;
    } else if (username === '') {
      errors.username = 'Username is required';
      valid = false;
    } else if (password === '') {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    } else if (password !== confirmPass) {
      errors.confirmPass = 'Passwords must match';
      valid = false;
    }
    this.setState({ errors });
    if (valid) {
      registerUserConnect(newUser, history);
    }
  };

  render() {
    const { errors, email, username, password, confirmPass } = this.state;
    const { classes } = this.props;
    return (
      <Container maxWidth="xs">
        <div className={classes.root}>
          <Grid container>
            <Link component={RouterLink} to="/">
              <Grid container alignItems="center">
                <ArrowBack />
                Back to home
              </Grid>
            </Link>
          </Grid>
          <Typography variant="h3">Register</Typography>
          <form noValidate className={classes.form} onSubmit={this.onSubmit}>
            {errors.existingAcc && <Alert severity="warning">{errors.existingAcc}</Alert>}
            <TextField
              error={errors.email}
              helperText={errors.email}
              variant="filled"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={this.onChange}
            />
            <TextField
              error={errors.username}
              helperText={errors.username}
              variant="filled"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={this.onChange}
            />
            <TextField
              error={errors.password}
              helperText={errors.password}
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={this.onChange}
            />
            <TextField
              error={errors.confirmPass}
              helperText={errors.confirmPass}
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="confirmPass"
              label="Confirm Password"
              type="password"
              id="confirmPass"
              value={confirmPass}
              onChange={this.onChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              fullWidth
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Register.propTypes = {
  registerUserConnect: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUserConnect: registerUser })(
  withRouter(withStyles(styles, { withTheme: true })(Register))
);
