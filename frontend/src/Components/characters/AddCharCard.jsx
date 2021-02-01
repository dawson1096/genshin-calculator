import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  parent: {
    position: 'relative',
  },
  imgCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(2),
    width: 100,
  },
  name: {
    textAlign: 'center',
    width: '100%',
  },
  nameSelected: {
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    width: '100%',
  },
  imgBack: {
    backgroundColor: 'purple',
  },
  media: {
    width: theme.spacing(25),
    height: 'auto',
  },
}));

function AddCharCard({ char, isSelected }) {
  const classes = useStyles();
  const [raised, setRaised] = useState(false);

  return (
    <div className={classes.parent}>
      <Card
        onMouseOver={() => setRaised(!raised)}
        onMouseOut={() => setRaised(!raised)}
        raised={raised}
        className={classes.imgCard}
      >
        <div className={classes.imgBack}>
          <img className={classes.media} src={char.imgPath} alt={char.name} />
        </div>
        <Typography className={isSelected ? classes.nameSelected : classes.name}>
          {char.name}
        </Typography>
      </Card>
    </div>
  );
}

/* eslint-disable react/forbid-prop-types */
AddCharCard.propTypes = {
  char: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default AddCharCard;
