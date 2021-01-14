import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { withStyles, Link, Typography, TextField, Button, Container, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ArrowBack } from "@material-ui/icons";

const styles = (theme) => ({
    root: {
        marginTop: theme.spacing(16),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(3, 0, 2),
    },
    textDiv: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
    },
});

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {},
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.auth.isAuthenticated) {
            props.history.push("/dashboard"); // push user to dashboard when they login
        }
        if (props.errors) {
            state.errors = props.errors;
            return state;
        }
        return null;
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value }, () => {
            if (!e.target.value) {
                let map = {
                    email: "Email",
                    password: "Password",
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
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        let valid = true;
        let errors = {};
        if (this.state.email === "") {
            errors.email = "Email is required";
            valid = false;
        } else if (this.state.password === "") {
            errors.password = "Password is required";
            valid = false;
        } else if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            errors.invalidLogin = "Email or password is incorrect";
            valid = false;
        } else if (this.state.password.length < 6) {
            errors.invalidLogin = "Email or password is incorrect";
            valid = false;
        }
        this.setState({ errors: errors });
        if (valid) {
            this.props.loginUser(userData);
        }
    };

    render() {
        const { errors } = this.state;
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
                        {errors.email ? (
                            <TextField
                                error
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
                                value={this.state.email}
                                onChange={this.onChange}
                            />
                        ) : (
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={this.state.email}
                                onChange={this.onChange}
                            />
                        )}
                        {errors.password ? (
                            <TextField
                                error
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
                                value={this.state.password}
                                onChange={this.onChange}
                            />
                        ) : (
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={this.state.password}
                                onChange={this.onChange}
                            />
                        )}
                        <Button type="submit" variant="contained" color="primary" className={classes.submit} fullWidth>
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
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(withStyles(styles, { withTheme: true })(Login));
