import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  CardMedia,
  Typography,
  TextField,
  Checkbox,
  Modal,
  Backdrop,
  Fade,
  ButtonGroup,
  Button,
  IconButton,
  FormControlLabel,
} from '@material-ui/core';
import { Remove, Add, Star, StarBorder, Block, Delete } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line
import { removeWeapon, editWeaponLvl, toggleWeaponBool } from '../../actions/userActions';
import { getAllWeaponReq, getWeaponReq } from '../../actions/calcActions';
import Switch from './Switch';
import Materials from '../materials/Materials';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    outline: 0,
    backgroundColor: '#ebeeff',
    borderRadius: theme.spacing(4),
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    width: '60%',
    height: '75%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  contnet: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCard: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(2),
    width: 100,
    overflow: 'hidden',
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
  name: {
    backgroundColor: 'white',
    textAlign: 'center',
    width: theme.spacing(25),
    height: theme.spacing(10),
    fontSize: theme.spacing(3.5),
    padding: theme.spacing(0.1, 1),
  },
  nameSmall: {
    backgroundColor: 'white',
    textAlign: 'center',
    width: theme.spacing(25),
    height: theme.spacing(10),
    fontSize: theme.spacing(3),
    padding: theme.spacing(0.1, 1),
  },
  media: {
    width: theme.spacing(25),
    height: 'auto',
  },
  delete: {
    padding: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  switchLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(0, 2, 0),
  },
  switch: {
    marginRight: theme.spacing(2),
  },
  text: {
    fontSize: theme.spacing(4),
    fontWeight: 'bold',
  },
  textDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(2),
    '& fieldset': {
      borderColor: theme.palette.primary.main,
      borderRadius: 0,
    },
  },
  input: {
    height: theme.spacing(2),
    width: theme.spacing(8),
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
  levels: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: theme.spacing(2),
    margin: theme.spacing(2),
    padding: theme.spacing(3),
    height: 104,
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
  checkbox: {
    color: theme.palette.secondary.main,
    padding: theme.spacing(1),
  },
  talentLvls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1),
  },
  talentLvlsSmall: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: theme.spacing(1),
  },
  talentLvl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: theme.spacing(2),
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  talentImg: {
    width: theme.spacing(7),
    height: 'auto',
  },
  lvlsGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lvlGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: theme.spacing(2),
  },
  lvlText: {
    fontWeight: 'bold',
    fontSize: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  materials: {
    margin: theme.spacing(2),
    backgroundColor: 'white',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(2),
  },
  talentTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  talentText: {
    marginLeft: theme.spacing(2),
  },
  talentMaterials: {
    padding: theme.spacing(2),
  },
}));

function WeaponModal({ weapon, modalOpen, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const reqMat = useSelector((state) => state.reqMat);
  const [weaponLevels, setWeaponLevels] = useState(() => ({
    inventory: weapon.inventory,
    hidden: weapon.hidden,
    name: weapon.name,
    curLvl: weapon.curLvl,
    reqLvl: weapon.reqLvl,
    number: weapon.number,
  }));
  const [errors, setErrors] = useState(() => ({
    curLvl: undefined,
    reqLvl: undefined,
  }));
  const [checked, setChecked] = useState(() => ({
    curLvl: weapon.curLvl % 1 !== 0,
    reqLvl: weapon.reqLvl % 1 !== 0,
  }));
  const [weaponMat, setWeaponMat] = useState(() => ({
    ...reqMat.weaponReq,
  }));

  useEffect(() => {
    if (modalOpen && !errors.curLvl && !errors.reqLvl) {
      dispatch(getWeaponReq(weaponLevels));
    }
  }, [
    modalOpen,
    weaponLevels.curLvl,
    weaponLevels.reqLvl,
    weaponLevels.inventory,
    weaponLevels.number,
  ]);

  useEffect(() => {
    setWeaponMat(reqMat.weaponReq);
  }, [reqMat.weaponReq]);

  const handleClose = () => {
    onClose();
    if (errors.curLvl || errors.reqLvl) {
      setWeaponLevels({
        ...weaponLevels,
        name: weapon.name,
        curLvl: weapon.curLvl,
        reqLvl: weapon.reqLvl,
        number: weapon.number,
      });
      setErrors({
        curLvl: undefined,
        reqLvl: undefined,
      });
    } else {
      dispatch(editWeaponLvl(weaponLevels));
      dispatch(getAllWeaponReq());
    }
  };

  const handleToggle = (field) => {
    setWeaponLevels({
      ...weaponLevels,
      [field]: !weaponLevels[field],
    });
    dispatch(toggleWeaponBool(weaponLevels.name, field));
    switch (field) {
      case 'hidden':
        dispatch(getAllWeaponReq());
        break;
      case 'inventory':
        break;
      default:
        break;
    }
  };

  const ascIsValid = (lvl) => {
    const arr = [20, 40, 50, 60, 70, 80];
    return arr.includes(Math.floor(lvl));
  };

  const toggleCheck = (lvl) => {
    setChecked({
      ...checked,
      [lvl]: !checked[lvl],
    });
    setWeaponLevels({
      ...weaponLevels,
      [lvl]: checked[lvl] ? weaponLevels[lvl] - 0.5 : weaponLevels[lvl] + 0.5,
    });
  };

  const deleteWeapon = () => {
    dispatch(removeWeapon(weaponLevels.name));
    dispatch(getAllWeaponReq());
    onClose();
  };

  const setLevel = (value, type, lvl) => {
    let newLvl = value === '' ? '' : parseInt(value, 10);
    switch (type) {
      case 'level':
        if (ascIsValid(newLvl) && checked[lvl]) {
          newLvl += 0.5;
        }
        if (
          weapon.stars === 1 || weapon.stars === 2
            ? newLvl >= 1 && newLvl <= 70
            : newLvl >= 1 && newLvl <= 90
        ) {
          const newWeaponLevels = { ...weaponLevels };
          newWeaponLevels[lvl] = newLvl;
          const newErrors = {
            ...errors,
            [lvl]: undefined,
          };
          if (lvl === 'curLvl' && newLvl > weaponLevels.reqLvl) {
            newWeaponLevels.reqLvl = newLvl;
            newErrors.reqLvl = undefined;
          } else if (lvl === 'reqLvl' && newLvl < weaponLevels.curLvl) {
            newWeaponLevels.reqLvl = newLvl;
            newErrors.reqLvl = 'Required Level is too low';
          }
          setWeaponLevels(newWeaponLevels);
          setErrors(newErrors);
        } else if (newLvl === 0 && typeof value === 'string') {
          setWeaponLevels({
            ...weaponLevels,
            [lvl]: newLvl,
          });

          setErrors({
            ...errors,
            [lvl]: 'Level cannot be 0',
          });
        } else if (newLvl === '') {
          setWeaponLevels({
            ...weaponLevels,
            [lvl]: newLvl,
          });
          setErrors({
            ...errors,
            [lvl]: 'Field cannot be empty',
          });
        }
        break;
      case 'copy':
        if (value > 0) {
          const newWeaponLevels = { ...weaponLevels };
          newWeaponLevels[lvl] = newLvl;
          const newErrors = {
            ...errors,
            [lvl]: undefined,
          };
          setWeaponLevels(newWeaponLevels);
          setErrors(newErrors);
        }
        break;
      default:
        break;
    }
  };

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
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={modalOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <div className={classes.content}>
            <div>
              <div className={classes.imgCard}>
                <div className={rarity()}>
                  <CardMedia
                    className={classes.media}
                    component="img"
                    image={weapon.imgPath}
                    title={weapon.name}
                  />
                </div>
                <Typography className={weapon.name.length > 23 ? classes.nameSmall : classes.name}>
                  {weapon.name}
                </Typography>
              </div>
            </div>
            <div className={classes.buttonGroup}>
              <Checkbox
                onChange={() => handleToggle('hidden')}
                checked={weaponLevels.hidden}
                color="primary"
                icon={<Block />}
                checkedIcon={<Block />}
              />
              <IconButton className={classes.delete} onClick={deleteWeapon}>
                <Delete />
              </IconButton>
              {/* eslint-disable */}
              <FormControlLabel
                className={classes.switchLabel}
                control={
                  <Switch
                    className={classes.switch}
                    checked={weaponLevels.inventory}
                    onChange={() => handleToggle('inventory')}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                }
                label={<span style={{ fontSize: '0.9rem' }}>Include Inventory</span>}
              />
            </div>
            <div className={classes.levels}>
              <div className={classes.level}>
                <Typography className={classes.text}>Current Level</Typography>
                <div className={classes.textDiv}>
                  <span className={classes.text}>Lv. </span>
                  <TextField
                    error={!!errors.curLvl}
                    className={classes.textField}
                    InputProps={{ classes: { input: classes.input } }}
                    id="curLvl"
                    name="curLvl"
                    onChange={(e) => setLevel(e.target.value, 'level', e.target.id)}
                    value={
                      weaponLevels.curLvl !== ''
                        ? Math.floor(weaponLevels.curLvl)
                        : weaponLevels.curLvl
                    }
                    variant="outlined"
                  />
                </div>
                <div className={classes.buttonCheck}>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() => setLevel(weaponLevels.curLvl - 1, 'level', 'curLvl')}
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() => setLevel(weaponLevels.curLvl + 1, 'level', 'curLvl')}
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                  <Checkbox
                    onClick={() => toggleCheck('curLvl')}
                    disabled={!ascIsValid(weaponLevels.curLvl)}
                    checked={checked.curLvl}
                    className={classes.checkbox}
                    icon={<StarBorder />}
                    checkedIcon={<Star />}
                  />
                </div>
              </div>
              <div className={classes.level}>
                <Typography className={classes.text}>Required Level</Typography>
                <div className={classes.textDiv}>
                  <span className={classes.text}>Lv. </span>
                  <TextField
                    error={!!errors.reqLvl}
                    className={classes.textField}
                    InputProps={{ classes: { input: classes.input } }}
                    id="reqLvl"
                    name="reqLvl"
                    onChange={(e) => setLevel(e.target.value, 'level', e.target.id)}
                    value={
                      weaponLevels.reqLvl !== ''
                        ? Math.floor(weaponLevels.reqLvl)
                        : weaponLevels.reqLvl
                    }
                    variant="outlined"
                  />
                </div>
                <div className={classes.buttonCheck}>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() => setLevel(weaponLevels.reqLvl - 1, 'level', 'reqLvl')}
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>

                    <Button
                      onClick={() => setLevel(weaponLevels.reqLvl + 1, 'level', 'reqLvl')}
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                  <Checkbox
                    onClick={() => toggleCheck('reqLvl')}
                    disabled={!ascIsValid(weaponLevels.reqLvl)}
                    checked={checked.reqLvl}
                    className={classes.checkbox}
                    icon={<StarBorder />}
                    checkedIcon={<Star />}
                  />
                </div>
              </div>
              <div className={classes.level}>
                <Typography className={classes.text}>Copies</Typography>
                <div className={classes.textDiv}>
                  <span className={classes.text}>x {weaponLevels.number}</span>
                </div>
                <div className={classes.buttonCheck}>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() => setLevel(weaponLevels.number - 1, 'copy', 'number')}
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() => setLevel(weaponLevels.number + 1, 'copy', 'number')}
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
            <div className={classes.materials}>
              {!reqMat.loading && (
                <Materials total mat={weaponMat.mat} loading={weaponMat.loading} />
              )}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

/* eslint-disable react/forbid-prop-types */
WeaponModal.propTypes = {
  weapon: PropTypes.object.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WeaponModal;
