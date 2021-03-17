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
    height: theme.spacing(10),
    fontSize: theme.spacing(3.5),
  },
  nameSelected: {
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    width: '100%',
    height: theme.spacing(10),
    fontSize: theme.spacing(3.5),
  },
  nameSmall: {
    textAlign: 'center',
    width: '100%',
    height: theme.spacing(10),
    fontSize: theme.spacing(3),
  },
  nameSelectedSmall: {
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    width: '100%',
    height: theme.spacing(10),
    fontSize: theme.spacing(3),
  },
  imgBackFive: {
    backgroundImage: theme.palette.stars.five,
    height: 100,
  },
  imgBackFour: {
    backgroundImage: theme.palette.stars.four,
    height: 100,
  },
  imgBackThree: {
    backgroundImage: theme.palette.stars.three,
    height: 100,
  },
  imgBackTwo: {
    backgroundImage: theme.palette.stars.two,
    height: 100,
  },
  imgBackOne: {
    backgroundImage: theme.palette.stars.one,
    height: 100,
  },
  media: {
    width: theme.spacing(25),
    height: 'auto',
  },
}));

function AddWeaponCard({ weapon, isSelected }) {
  const classes = useStyles();
  const [raised, setRaised] = useState(false);

  const rarity = () => {
    switch (weapon.stars) {
      case 1:
        return classes.imgBackOne;
      case 2:
        return classes.imgBackTwo;
      case 3:
        return classes.imgBackThree;
      case 4:
        return classes.imgBackFour;
      case 5:
        return classes.imgBackFive;
      default:
        break;
    }
    return classes.imgBackNone;
  };

  return (
    <div className={classes.parent}>
      <Card
        onMouseOver={() => setRaised(!raised)}
        onMouseOut={() => setRaised(!raised)}
        raised={raised}
        className={classes.imgCard}
      >
        <div className={rarity()}>
          <img className={classes.media} src={weapon.imgPath} alt={weapon.name} />
        </div>
        <Typography
          className={
            isSelected
              ? weapon.name.length > 23
                ? classes.nameSelectedSmall
                : classes.nameSelected
              : weapon.name.length > 23
              ? classes.nameSmall
              : classes.name
          }
        >
          {weapon.name}
        </Typography>
      </Card>
    </div>
  );
}

/* eslint-disable react/forbid-prop-types */
AddWeaponCard.propTypes = {
  weapon: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default AddWeaponCard;
