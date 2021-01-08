import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import {
    Container,
    Grid,
    Link,
    Typography,
    TextField,
    Button,
    withStyles,
} from "@material-ui/core";
import {
    Alert,
} from "@material-ui/lab";
import {
    ArrowBack,
} from "@material-ui/icons";

const styles = (theme) => ({
    root: {
        marginTop: theme.spacing(16),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        flexWrap: "wrap",
    }
});

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPass: "",
            errors: {},
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    };
    
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
        let error;
        let map = {
            email: "Email",
            username: "Username",
            password: "Password",
            confirmPass: "Confirm password",
        }
        if (!e.target.value) {
            error = `${map[e.target.id]} is required`;
        } else {
            switch(e.target.id) {
                case "email":
                    if (!e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                        error = "Invalid email";
                    }
                    break;
                case "password":
                    if (e.target.value.length < 6) {
                        error = "Password must be at least 6 characters";
                    }
                    break;
                case "confirmPass":
                    if (this.state.password !== e.target.value) {
                        error = "Passwords must match"
                    }
                    break;
                default:
                    break;
            }
        }
        this.setState( prevState => ({ errors: {
            ...prevState.errors,
            [e.target.id]: error,
        }}));
    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            "username": this.state.username,
            "email": this.state.email,
            "password": this.state.password,
            "confirmPass": this.state.confirmPass
        };
        let errors = {};
        let valid = true;
        if (this.state.email === "") {
            errors.email = "Email is required";
            valid = false;
        } else if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            errors.email = "Invalid email";
            valid = false;
        } else if (this.state.username === "") {
            errors.username = "Username is required";
            valid = false;
        } else if (this.state.password === "") {
            errors.password = "Password is required";
            valid = false;
        } else if (this.state.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            valid = false;
        } else if (this.state.confirmPass === "") {
            errors.confirmPass = "Confirm password is required";
            valid = false;
        } else if (this.state.password !== this.state.confirmPass) {
            errors.confirmPass = "Passwords must match";
            valid = false;
        }
        this.setState({ errors: errors });
        if (valid) {
            this.props.registerUser(newUser, this.props.history);
        }
    };

    render() {
        const { errors } = this.state;
        const { classes } = this.props;
        return (
            <Container maxWidth="xs">
                <div className={ classes.root }>
                    <Grid container >
                        <Link
                            component={ RouterLink }
                            to="/"
                        >
                            <Grid container alignItems="center">
                                <ArrowBack />
                                Back to home
                            </Grid>
                        </Link>
                    </Grid>
                    <Typography variant="h3">
                        Register
                    </Typography>
                    <form noValidate className={ classes.form } onSubmit={this.onSubmit}>
                        { errors.existingAcc &&
                            <Alert severity="warning">{ errors.existingAcc }</Alert>
                        }
                        {
                            errors.email ? 
                            <TextField
                                error
                                helperText={ errors.email }
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={ this.state.email }
                                onChange={ this.onChange }
                            /> :
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
                                value={ this.state.email }
                                onChange={ this.onChange }
                            />
                        }
                        {
                            errors.username ? 
                            <TextField
                                error
                                helperText={ errors.username }
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={ this.state.username }
                                onChange={ this.onChange }
                            /> :
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={ this.state.username }
                                onChange={ this.onChange }
                            />
                        }
                        {
                            errors.password ? 
                            <TextField
                                error
                                helperText={ errors.password }
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={ this.state.password }
                                onChange={ this.onChange }
                            /> :
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={ this.state.password }
                                onChange={ this.onChange }
                            />
                        }
                        {
                            errors.confirmPass ? 
                            <TextField
                                error
                                helperText={ errors.confirmPass }
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPass"
                                label="Confirm Password"
                                type="password"
                                id="confirmPass"
                                value={ this.state.confirmPass }
                                onChange={ this.onChange }
                            /> :
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPass"
                                label="Confirm Password"
                                type="password"
                                id="confirmPass"
                                value={ this.state.confirmPass }
                                onChange={ this.onChange }
                            />
                        }
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={ classes.submit }
                            fullWidth
                        >
                            Register
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link component={ RouterLink } to="/login" variant="body2">
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

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(withStyles(styles, { withTheme: true })(Register)));