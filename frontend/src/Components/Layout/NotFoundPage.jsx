import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: theme.spacing(4),
  },
}));

function NotFoundPage() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h4">
        404 Page Not Found
      </Typography>
    </div>
  );
}

export default NotFoundPage;
