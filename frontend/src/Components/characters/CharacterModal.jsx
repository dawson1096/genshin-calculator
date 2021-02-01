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
  useMediaQuery,
} from '@material-ui/core';
import { Remove, Add, Star, StarBorder, ArrowForwardIos, Block, Delete } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line
import { removeChar, editLvl, toggleBool } from '../../actions/userActions';
import { getAllCharReq, getCharReq, getTalentReq } from '../../actions/calcActions';
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
    maxWidth: '75%',
    height: '75%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
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
  imgBack: {
    backgroundColor: 'purple',
  },
  name: {
    backgroundColor: 'white',
    textAlign: 'center',
    width: '100%',
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
    padding: theme.spacing(2),
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

function CharacterModal({ char, modalOpen, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const reqMat = useSelector((state) => state.reqMat);
  const wideScreen = useMediaQuery('(min-width:800px)');
  const [charLevels, setCharLevels] = useState(() => ({
    inventory: char.inventory,
    talentTotal: char.talentTotal,
    hidden: char.hidden,
    name: char.name,
    curLvl: char.curLvl,
    reqLvl: char.reqLvl,
    autoAttack: {
      curLvl: char.autoAttack.curLvl,
      reqLvl: char.autoAttack.reqLvl,
    },
    eleSkill: {
      curLvl: char.eleSkill.curLvl,
      reqLvl: char.eleSkill.reqLvl,
    },
    eleBurst: {
      curLvl: char.eleBurst.curLvl,
      reqLvl: char.eleBurst.reqLvl,
    },
  }));
  const [errors, setErrors] = useState(() => ({
    curLvl: undefined,
    reqLvl: undefined,
  }));
  const [checked, setChecked] = useState(() => ({
    curLvl: char.curLvl % 1 !== 0,
    reqLvl: char.reqLvl % 1 !== 0,
  }));
  const [charMat, setCharMat] = useState(() => ({
    ...reqMat.charReq,
  }));

  const [talentMat, setTalentMat] = useState(() => ({
    ...reqMat.talentReq,
  }));

  useEffect(() => {
    if (modalOpen && !errors.curLvl && !errors.reqLvl) {
      dispatch(getCharReq(charLevels));
    }
  }, [modalOpen, charLevels.curLvl, charLevels.reqLvl, charLevels.inventory]);

  useEffect(() => {
    if (modalOpen) {
      dispatch(getTalentReq(charLevels));
    }
  }, [
    modalOpen,
    charLevels.autoAttack.curLvl,
    charLevels.autoAttack.reqLvl,
    charLevels.eleSkill.curLvl,
    charLevels.eleSkill.reqLvl,
    charLevels.eleBurst.curLvl,
    charLevels.eleBurst.reqLvl,
    charLevels.inventory,
    charLevels.talentTotal,
  ]);

  useEffect(() => {
    setCharMat(reqMat.charReq);
  }, [reqMat.charReq]);

  useEffect(() => {
    setTalentMat(reqMat.talentReq);
  }, [reqMat.talentReq]);

  const handleClose = () => {
    onClose();
    if (errors.curLvl || errors.reqLvl) {
      setCharLevels({
        ...charLevels,
        name: char.name,
        curLvl: char.curLvl,
        reqLvl: char.reqLvl,
        autoAttack: {
          curLvl: char.autoAttack.curLvl,
          reqLvl: char.autoAttack.reqLvl,
        },
        eleSkill: {
          curLvl: char.eleSkill.curLvl,
          reqLvl: char.eleSkill.reqLvl,
        },
        eleBurst: {
          curLvl: char.eleBurst.curLvl,
          reqLvl: char.eleBurst.reqLvl,
        },
      });
      setErrors({
        curLvl: undefined,
        reqLvl: undefined,
      });
    } else {
      dispatch(editLvl(charLevels));
      dispatch(getAllCharReq());
    }
  };

  const handleToggle = (field) => {
    setCharLevels({
      ...charLevels,
      [field]: !charLevels[field],
    });
    dispatch(toggleBool(charLevels.name, field));
    switch (field) {
      case 'hidden':
        dispatch(getAllCharReq());
        break;
      case 'inventory':
        break;
      case 'talentTotal':
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
    setCharLevels({
      ...charLevels,
      [lvl]: checked[lvl] ? charLevels[lvl] - 0.5 : charLevels[lvl] + 0.5,
    });
  };

  const deleteChar = () => {
    dispatch(removeChar(charLevels.name));
    dispatch(getAllCharReq());
    onClose();
  };

  const setLevel = (value, type, lvl, talent = null) => {
    let newLvl = value === '' ? '' : parseInt(value, 10);
    switch (type) {
      case 'level':
        if (ascIsValid(newLvl) && checked[lvl]) {
          newLvl += 0.5;
        }
        if (newLvl >= 1 && newLvl <= 90) {
          const newCharLevels = { ...charLevels };
          newCharLevels[lvl] = newLvl;
          const newErrors = {
            ...errors,
            [lvl]: undefined,
          };
          if (lvl === 'curLvl' && newLvl > charLevels.reqLvl) {
            newCharLevels.reqLvl = newLvl;
            newErrors.reqLvl = undefined;
          } else if (lvl === 'reqLvl' && newLvl < charLevels.curLvl) {
            newCharLevels.reqLvl = newLvl;
            newErrors.reqLvl = 'Required Level is too low';
          }
          setCharLevels(newCharLevels);
          setErrors(newErrors);
        } else if (newLvl === 0 && typeof value === 'string') {
          setCharLevels({
            ...charLevels,
            [lvl]: newLvl,
          });

          setErrors({
            ...errors,
            [lvl]: 'Level cannot be 0',
          });
        } else if (newLvl === '') {
          setCharLevels({
            ...charLevels,
            [lvl]: newLvl,
          });
          setErrors({
            ...errors,
            [lvl]: 'Field cannot be empty',
          });
        }
        break;
      case 'talent':
        if (newLvl >= 1 && newLvl <= 10) {
          const newCharLevels = charLevels[talent];
          const temp = newCharLevels.reqLvl;
          newCharLevels[lvl] = newLvl;
          if (lvl === 'curLvl' && newLvl > charLevels[talent].reqLvl) {
            newCharLevels.reqLvl = newLvl;
          } else if (lvl === 'reqLvl' && newLvl < charLevels[talent].curLvl) {
            newCharLevels.reqLvl = temp;
          }
          setCharLevels({
            ...charLevels,
            [talent]: newCharLevels,
          });
        }
        break;
      default:
        break;
    }
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
          <div>
            <div className={classes.imgCard}>
              <div className={classes.imgBack}>
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={char.imgPath}
                  title={char.name}
                />
              </div>
              <Typography className={classes.name}>{char.name}</Typography>
            </div>
          </div>
          <div className={classes.buttonGroup}>
            <Checkbox
              onChange={() => handleToggle('hidden')}
              checked={charLevels.hidden}
              color="primary"
              icon={<Block />}
              checkedIcon={<Block />}
            />
            <IconButton className={classes.delete} onClick={deleteChar}>
              <Delete />
            </IconButton>
            {/* eslint-disable */}
            <FormControlLabel
              className={classes.switchLabel}
              control={
                <Switch
                  className={classes.switch}
                  checked={charLevels.inventory}
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
                    charLevels.curLvl !== '' ? Math.floor(charLevels.curLvl) : charLevels.curLvl
                  }
                  variant="outlined"
                />
              </div>
              <div className={classes.buttonCheck}>
                <ButtonGroup className={classes.buttonGroup}>
                  <Button
                    onClick={() => setLevel(charLevels.curLvl - 1, 'level', 'curLvl')}
                    className={classes.button}
                  >
                    <Remove fontSize="small" />
                  </Button>
                  <Button
                    onClick={() => setLevel(charLevels.curLvl + 1, 'level', 'curLvl')}
                    className={classes.button}
                  >
                    <Add fontSize="small" />
                  </Button>
                </ButtonGroup>
                <Checkbox
                  onClick={() => toggleCheck('curLvl')}
                  disabled={!ascIsValid(charLevels.curLvl)}
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
                    charLevels.reqLvl !== '' ? Math.floor(charLevels.reqLvl) : charLevels.reqLvl
                  }
                  variant="outlined"
                />
              </div>
              <div className={classes.buttonCheck}>
                <ButtonGroup className={classes.buttonGroup}>
                  <Button
                    onClick={() => setLevel(charLevels.reqLvl - 1, 'level', 'reqLvl')}
                    className={classes.button}
                  >
                    <Remove fontSize="small" />
                  </Button>

                  <Button
                    onClick={() => setLevel(charLevels.reqLvl + 1, 'level', 'reqLvl')}
                    className={classes.button}
                  >
                    <Add fontSize="small" />
                  </Button>
                </ButtonGroup>
                <Checkbox
                  onClick={() => toggleCheck('reqLvl')}
                  disabled={!ascIsValid(charLevels.reqLvl)}
                  checked={checked.reqLvl}
                  className={classes.checkbox}
                  icon={<StarBorder />}
                  checkedIcon={<Star />}
                />
              </div>
            </div>
          </div>
          <div className={classes.materials}>
            {!reqMat.loading && <Materials total mat={charMat.mat} loading={charMat.loading} />}
          </div>
          <div className={wideScreen ? classes.talentLvls : classes.talentLvlsSmall}>
            <div className={classes.talentLvl}>
              <CardMedia
                className={classes.talentImg}
                component="img"
                image={char.autoAttack.imgPath}
              />
              <div className={classes.lvlsGroup}>
                <div className={classes.lvlGroup}>
                  <div className={classes.lvlText}>
                    {'Lv. '}
                    {charLevels.autoAttack.curLvl}
                  </div>
                  <ButtonGroup className={classes.buttonGroup}>
                    {/* eslint-disable */}
                    <Button
                      onClick={() =>
                        setLevel(charLevels.autoAttack.curLvl - 1, 'talent', 'curLvl', 'autoAttack')
                      }
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.autoAttack.curLvl + 1, 'talent', 'curLvl', 'autoAttack')
                      }
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </div>
                <ArrowForwardIos fontSize="small" />
                <div className={classes.lvlGroup}>
                  <div className={classes.lvlText}>
                    {'Lv. '}
                    {charLevels.autoAttack.reqLvl}
                  </div>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.autoAttack.reqLvl - 1, 'talent', 'reqLvl', 'autoAttack')
                      }
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.autoAttack.reqLvl + 1, 'talent', 'reqLvl', 'autoAttack')
                      }
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
            <div className={classes.talentLvl}>
              <CardMedia
                className={classes.talentImg}
                component="img"
                image={char.eleSkill.imgPath}
              />
              <div className={classes.lvlsGroup}>
                <div className={classes.lvlGroup}>
                  <div className={classes.lvlText}>
                    {'Lv. '}
                    {charLevels.eleSkill.curLvl}
                  </div>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleSkill.curLvl - 1, 'talent', 'curLvl', 'eleSkill')
                      }
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleSkill.curLvl + 1, 'talent', 'curLvl', 'eleSkill')
                      }
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </div>
                <ArrowForwardIos fontSize="small" />
                <div className={classes.lvlGroup}>
                  <div className={classes.lvlText}>
                    {'Lv. '}
                    {charLevels.eleSkill.reqLvl}
                  </div>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleSkill.reqLvl - 1, 'talent', 'reqLvl', 'eleSkill')
                      }
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleSkill.reqLvl + 1, 'talent', 'reqLvl', 'eleSkill')
                      }
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
            <div className={classes.talentLvl}>
              <CardMedia
                className={classes.talentImg}
                component="img"
                image={char.eleBurst.imgPath}
              />
              <div className={classes.lvlsGroup}>
                <div className={classes.lvlGroup}>
                  <div className={classes.lvlText}>
                    {'Lv. '}
                    {charLevels.eleBurst.curLvl}
                  </div>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleBurst.curLvl - 1, 'talent', 'curLvl', 'eleBurst')
                      }
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleBurst.curLvl + 1, 'talent', 'curLvl', 'eleBurst')
                      }
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </div>
                <ArrowForwardIos fontSize="small" />
                <div className={classes.lvlGroup}>
                  <div className={classes.lvlText}>
                    {'Lv. '}
                    {charLevels.eleBurst.reqLvl}
                  </div>
                  <ButtonGroup className={classes.buttonGroup}>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleBurst.reqLvl - 1, 'talent', 'reqLvl', 'eleBurst')
                      }
                      className={classes.button}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        setLevel(charLevels.eleBurst.reqLvl + 1, 'talent', 'reqLvl', 'eleBurst')
                      }
                      className={classes.button}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>
          {/* eslint-disable */}
          <FormControlLabel
            className={classes.switchLabel}
            control={
              <Switch
                className={classes.switch}
                checked={charLevels.talentTotal}
                onChange={() => handleToggle('talentTotal')}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label={<span style={{ fontSize: '0.9rem' }}>Show Total</span>}
          />
          {!reqMat.loading && (
            <div className={classes.materials}>
              {charLevels.talentTotal ? (
                <Materials total mat={talentMat.mat.total} loading={talentMat.loading} />
              ) : (
                <>
                  <div className={classes.talentTitle}>
                    <CardMedia
                      className={classes.talentImg}
                      component="img"
                      image={char.autoAttack.imgPath}
                    />
                    <Typography className={classes.talentText}>{char.autoAttack.name}</Typography>
                  </div>
                  <div className={classes.talentMaterials}>
                    <Materials total mat={talentMat.mat.autoAttack} loading={talentMat.loading} />
                  </div>
                  <div className={classes.talentTitle}>
                    <CardMedia
                      className={classes.talentImg}
                      component="img"
                      image={char.eleSkill.imgPath}
                    />
                    <Typography className={classes.talentText}>{char.eleSkill.name}</Typography>
                  </div>
                  <div className={classes.talentMaterials}>
                    <Materials total mat={talentMat.mat.eleSkill} loading={talentMat.loading} />
                  </div>
                  <div className={classes.talentTitle}>
                    <CardMedia
                      className={classes.talentImg}
                      component="img"
                      image={char.eleBurst.imgPath}
                    />
                    <Typography className={classes.talentText}>{char.eleBurst.name}</Typography>
                  </div>
                  <div className={classes.talentMaterials}>
                    <Materials total mat={talentMat.mat.eleBurst} loading={talentMat.loading} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  );
}

/* eslint-disable react/forbid-prop-types */
CharacterModal.propTypes = {
  char: PropTypes.object.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CharacterModal;
