import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";

const styles = (theme) => ({
    root: {
        textAlign: "center",
        marginTop: theme.spacing(16),
    },
    text: {
        marginBottom: theme.spacing(4),
    }
});

class Landing extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={ classes.root }>
                <Typography variant="h2" className={ classes.text }>
                    Genshin Calculator
                </Typography>
                <Typography variant="h6" className={ classes.text }>
                    To get started choose a character or weapon from the navigation bar above
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Landing);