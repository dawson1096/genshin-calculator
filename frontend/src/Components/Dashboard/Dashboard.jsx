import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: theme.spacing(2),
  },
}));

function Dashboard() {
  const classes = useStyles();

  return <div className={classes.root}>DASHBOARD</div>;
}

export default Dashboard;
