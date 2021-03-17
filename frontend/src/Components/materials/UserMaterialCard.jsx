import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Card, Tooltip, TextField, ButtonGroup, Button } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { editMatNum } from '../../actions/userActions';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ebeeff',
    borderColor: 'black',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  matImg: {
    width: 'auto',
    height: theme.spacing(10),
  },
  imgBackFive: {
    backgroundImage: theme.palette.stars.five,
    height: theme.spacing(12),
    width: theme.spacing(14),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBackFour: {
    backgroundImage: theme.palette.stars.four,
    height: theme.spacing(12),
    width: theme.spacing(14),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBackThree: {
    backgroundImage: theme.palette.stars.three,
    height: theme.spacing(12),
    width: theme.spacing(14),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBackTwo: {
    backgroundImage: theme.palette.stars.two,
    height: theme.spacing(12),
    width: theme.spacing(14),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBackOne: {
    backgroundImage: theme.palette.stars.one,
    height: theme.spacing(12),
    width: theme.spacing(14),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    color: 'white',
    fontSize: theme.spacing(2.5),
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  textField: {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
      borderRadius: 0,
    },
  },
  input: {
    height: theme.spacing(2),
    width: theme.spacing(15),
    fontSize: theme.spacing(4),
    padding: theme.spacing(2),
    textAlign: 'center',
    '&[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  buttonCheck: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    color: 'white',
    borderColor: 'transparent',
    padding: 0,
    backgroundColor: theme.palette.primary.main,
    maxWidth: theme.spacing(7),
    minWidth: theme.spacing(7),
  },
}));

function toolTip(curMat) {
  const num = curMat.number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  return (
    <div style={{ textAlign: 'center' }}>
      <div>{curMat.name}</div>
      {curMat.number >= 1000 && <div>{num}</div>}
    </div>
  );
}

function UserMaterialCard({ curMat, matInfo }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [mat, setMat] = useState(() => ({
    ...curMat,
  }));
  const [error, setError] = useState('');

  const setLevel = (value) => {
    const newNum = value === '' ? '' : parseInt(value, 10);
    if (newNum === '') {
      setMat({
        ...mat,
        number: newNum,
      });
      setError('Field cannot be empty');
    } else if (newNum >= 0) {
      const newMat = { ...mat };
      newMat.number = newNum;
      setMat(newMat);
      setError('');
    }
  };

  useEffect(() => {
    setMat(curMat);
  }, [curMat]);

  useEffect(() => {
    if (error === '') {
      dispatch(editMatNum(mat, matInfo));
    }
  }, [mat]);

  const rarity = () => {
    switch (curMat.type) {
      case 'white':
        return classes.imgBackOne;
      case 'green':
        return classes.imgBackTwo;
      case 'blue':
        return classes.imgBackThree;
      case 'purple':
        return classes.imgBackFour;
      case 'gold':
        return classes.imgBackFive;
      default:
        break;
    }
    return classes.imgBackThree;
  };

  return (
    <Card className={classes.root}>
      <Tooltip title={toolTip(curMat, classes)} arrow>
        <Card>
          <div className={rarity()}>
            <img className={classes.matImg} src={curMat.imgPath} alt={curMat.name} />
          </div>
        </Card>
      </Tooltip>
      <div className={classes.textDiv}>
        <TextField
          error={!!error}
          className={classes.textField}
          InputProps={{ classes: { input: classes.input } }}
          onChange={(e) => setLevel(e.target.value)}
          value={mat.number}
          variant="outlined"
        />
      </div>
      <div className={classes.buttonCheck}>
        <ButtonGroup className={classes.buttonGroup}>
          <Button onClick={() => setLevel(mat.number - 1)} className={classes.button}>
            <Remove fontSize="small" />
          </Button>
          <Button onClick={() => setLevel(mat.number + 1)} className={classes.button}>
            <Add fontSize="small" />
          </Button>
        </ButtonGroup>
      </div>
    </Card>
  );
}

/* eslint-disable react/forbid-prop-types */
UserMaterialCard.propTypes = {
  curMat: PropTypes.object.isRequired,
  matInfo: PropTypes.object.isRequired,
};

export default UserMaterialCard;
