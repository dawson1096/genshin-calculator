import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    marginTop: theme.spacing(16),
  },
  text: {
    marginBottom: theme.spacing(4),
  },
});

function Landing({ classes }) {
  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.text}>
        Genshin Calculator
      </Typography>
      <Typography variant="h6" className={classes.text}>
        To get started choose a character or weapon from the navigation bar above
      </Typography>
    </div>
  );
}

/* eslint-disable react/forbid-prop-types */
Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Landing);
