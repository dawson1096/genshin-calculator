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
    height: 24,
  },
  nameSelected: {
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    width: '100%',
    height: 24,
  },
  nameSmall: {
    textAlign: 'center',
    width: '100%',
    fontSize: theme.spacing(3.5),
    height: 24,
  },
  nameSelectedSmall: {
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    width: '100%',
    fontSize: theme.spacing(3.5),
    height: 24,
  },
  imgBackFive: {
    backgroundImage: theme.palette.stars.five,
    height: 100,
  },
  imgBackFour: {
    backgroundImage: theme.palette.stars.four,
    height: 100,
  },
  media: {
    width: theme.spacing(25),
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
        <div className={char.stars === 5 ? classes.imgBackFive : classes.imgBackFour}>
          <img className={classes.media} src={char.imgPath} alt={char.name} />
        </div>
        <Typography
          className={
            isSelected
              ? char.name.length > 12
                ? classes.nameSelectedSmall
                : classes.nameSelected
              : char.name.length > 12
              ? classes.nameSmall
              : classes.name
          }
        >
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
