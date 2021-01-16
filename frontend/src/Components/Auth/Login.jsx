import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Link,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowBack } from '@material-ui/icons';
import { loginUser } from '../../actions/authActions';

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

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
    };
  }

  componentDidMount() {
    const {
      auth: { isAuthenticated },
      history,
    } = this.state;
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }

  static getDerivedStateFromProps(props, state) {
    const newState = state;
    if (props.auth.isAuthenticated) {
      props.history.push('/dashboard'); // push user to dashboard when they login
    }
    if (props.errors) {
      newState.errors = props.errors;
      return newState;
    }
    return null;
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value }, () => {
      if (!e.target.value) {
        const map = {
          email: 'Email',
          password: 'Password',
        };
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            [e.target.id]: `${map[e.target.id]} is required`,
          },
        }));
      } else {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            [e.target.id]: undefined,
          },
        }));
      }
    });
  };

  onSubmit = (e) => {
    const { email, password } = this.state;
    const { loginUserConnect } = this.props;
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    let valid = true;
    const errors = {};
    if (email === '') {
      errors.email = 'Email is required';
      valid = false;
    } else if (password === '') {
      errors.password = 'Password is required';
      valid = false;
    } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      errors.invalidLogin = 'Email or password is incorrect';
      valid = false;
    } else if (password.length < 6) {
      errors.invalidLogin = 'Email or password is incorrect';
      valid = false;
    }
    this.setState({ errors });
    if (valid) {
      loginUserConnect(userData);
    }
  };

  render() {
    const { errors, email, password } = this.state;
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
          <Typography variant="h3">Log in</Typography>
          <form noValidate className={classes.form} onSubmit={this.onSubmit}>
            {errors.invalidLogin && <Alert severity="error">{errors.invalidLogin}</Alert>}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              fullWidth
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Don&apos;t have an account? Sign Up
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
Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loginUserConnect: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUserConnect: loginUser })(
  withStyles(styles, { withTheme: true })(Login)
);
