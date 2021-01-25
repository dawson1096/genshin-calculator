import React, { Component } from 'react';
import {
  withStyles,
  Typography,
  ButtonBase,
  Card,
  CardMedia,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Button,
  TextField,
  Checkbox,
} from '@material-ui/core';
import { Clear, StarBorder, Star, Add, Remove } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeChar, editLvl } from '../../actions/userActions';
import { getAllCharReq } from '../../actions/calcActions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ebeeff',
    borderColor: 'black',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBase: {
    display: 'block',
    textAlign: 'initial',
    margin: 0,
    padding: theme.spacing(2),
  },
  imgCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    backgroundColor: 'white',
    width: theme.spacing(33),
    textAlign: 'center',
  },
  imgBack: {
    backgroundColor: 'purple',
  },
  media: {
    width: theme.spacing(33),
    height: 'auto',
  },
  talentImg: {
    width: theme.spacing(7),
    height: 'auto',
    marginRight: theme.spacing(2),
  },
  levels: {
    margin: theme.spacing(2, 0, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTalentLevels: {
    margin: theme.spacing(2, 0, 2),
    marginLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    width: theme.spacing(32.5),
  },
  talentFont: {
    fontSize: theme.spacing(3.5),
  },
  delete: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: 'white',
    borderRadius: theme.spacing(25),
  },
  deleteSize: {
    fontSize: theme.spacing(3),
    color: 'red',
  },
  mainLvl: {
    fontWeight: 'bold',
  },
  lvlNumber: {
    color: theme.palette.textColor.main,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#ebeeff',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  levelGroup: {
    margin: theme.spacing(4, 0, 0),
  },
  modalText: {
    fontWeight: 'bold',
    marginRight: theme.spacing(4),
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  buttonLeft: {
    color: 'grey',
    borderStyle: 'solid',
    borderWidth: '1px 0 1px 1px',
    borderRadius: theme.spacing(1, 0, 0, 1),
    height: theme.spacing(6),
    maxWidth: theme.spacing(7),
    minWidth: theme.spacing(7),
    padding: 0,
  },
  buttonRight: {
    color: 'grey',
    borderStyle: 'solid',
    borderWidth: '1px 1px 1px 0',
    borderRadius: theme.spacing(0, 1, 1, 0),
    height: theme.spacing(6),
    maxWidth: theme.spacing(7),
    minWidth: theme.spacing(7),
    padding: 0,
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
  textField: {
    '& fieldset': {
      borderColor: 'grey',
      borderRadius: 0,
    },
  },
  levelSpacing: {
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    borderBottom: 'solid grey',
  },
  modalLevels: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: theme.spacing(12),
    position: 'relative',
  },
  modalTalents: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing(2),
  },
  talentTitle: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto',
  },
  talentLevels: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  talentLevel: {
    dispaly: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: theme.spacing(35),
    height: theme.spacing(18),
    marginTop: theme.spacing(2),
    position: 'relative',
  },
  checkbox: {
    color: theme.palette.secondary.main,
  },
  buttonCheck: {
    display: 'flex',
    alignItems: 'center',
  },
  errors: {
    fontSize: theme.spacing(3),
    position: 'absolute',
    textAlign: 'center',
    bottom: -7,
    left: 143,
    color: 'red',
  },
  talentErrors: {
    fontSize: theme.spacing(3),
    position: 'absolute',
    textAlign: 'center',
    bottom: -3,
    left: 17,
    color: 'red',
  },
});

class CharacterCard extends Component {
  constructor(props) {
    super(props);
    const { char } = props;
    this.state = {
      raised: false,
      curLvl: null,
      reqLvl: null,
      modalOpen: false,
      errors: {
        autoAttack: {},
        eleSkill: {},
        eleBurst: {},
      },
      checked: {
        curLvl: char.curLvl % 1 !== 0,
        reqLvl: char.reqLvl % 1 !== 0,
      },
      charLevels: {
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
      },
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Change to only run on props change
    const {
      char: { curLvl, reqLvl },
    } = props;
    let newCurLvl = curLvl;
    let newReqLvl = reqLvl;
    if (curLvl % 1 !== 0) {
      newCurLvl = `${Math.floor(curLvl)}+`;
    }
    if (reqLvl % 1 !== 0) {
      newReqLvl = `${Math.floor(reqLvl)}+`;
    }
    return {
      ...state,
      curLvl: newCurLvl,
      reqLvl: newReqLvl,
    };
  }

  handleOpen = () => {
    this.setState({
      modalOpen: true,
    });
  };

  handleClose = () => {
    const { char } = this.props;
    this.setState({
      modalOpen: false,
      charLevels: {
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
      },
      errors: {
        autoAttack: {},
        eleSkill: {},
        eleBurst: {},
      },
    });
  };

  setLevel = (value, type, lvl, talent = null) => {
    const { charLevels, errors, checked } = this.state;
    let newLvl = value === '' ? '' : parseInt(value, 10);
    switch (type) {
      case 'level':
        if (this.ascIsValid(newLvl) && checked[lvl]) {
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
          this.setState({
            charLevels: newCharLevels,
            errors: newErrors,
          });
        } else if (newLvl === 0 && typeof value === 'string') {
          this.setState({
            charLevels: {
              ...charLevels,
              [lvl]: newLvl,
            },
            errors: {
              ...errors,
              [lvl]: 'Level cannot be 0',
            },
          });
        } else if (newLvl === '') {
          this.setState({
            charLevels: {
              ...charLevels,
              [lvl]: newLvl,
            },
            errors: {
              ...errors,
              [lvl]: 'Field cannot be empty',
            },
          });
        }
        break;
      case 'talent':
        if (newLvl >= 1 && newLvl <= 10) {
          const newCharLevels = charLevels[talent];
          const temp = newCharLevels.reqLvl;
          newCharLevels[lvl] = newLvl;
          const newErrors = {
            ...errors[talent],
            [lvl]: undefined,
          };
          if (lvl === 'curLvl' && newLvl > charLevels[talent].reqLvl) {
            newCharLevels.reqLvl = newLvl;
            newErrors.reqLvl = undefined;
          } else if (lvl === 'reqLvl' && newLvl < charLevels[talent].curLvl) {
            newCharLevels.reqLvl = temp;
          }
          this.setState({
            charLevels: {
              ...charLevels,
              [talent]: newCharLevels,
            },
            errors: {
              ...errors,
              [talent]: newErrors,
            },
          });
        } else if (newLvl === '') {
          this.setState({
            charLevels: {
              ...charLevels,
              [talent]: {
                ...charLevels[talent],
                [lvl]: newLvl,
              },
            },
            errors: {
              ...errors,
              [talent]: {
                ...errors[talent],
                [lvl]: 'Field cannot be empty',
              },
            },
          });
        }
        break;
      default:
        break;
    }
  };

  ascIsValid = (lvl) => {
    const arr = [20, 40, 50, 60, 70, 80];
    return arr.includes(Math.floor(lvl));
  };

  toggleRaised = () => {
    const { raised } = this.state;
    this.setState({ raised: !raised });
  };

  toggleCheck = (lvl) => {
    const { charLevels, checked } = this.state;
    this.setState({
      checked: {
        ...checked,
        [lvl]: !checked[lvl],
      },
      charLevels: {
        ...charLevels,
        [lvl]: checked[lvl] ? charLevels[lvl] - 0.5 : charLevels[lvl] + 0.5,
      },
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { editLvlConnect, getAllCharReqConnect } = this.props;
    const { charLevels, errors } = this.state;
    if (
      !errors.curLvl &&
      !errors.reqLvl &&
      !errors.autoAttack.curLvl &&
      !errors.autoAttack.reqLvl &&
      !errors.eleSkill.curLvl &&
      !errors.eleSkill.reqLvl &&
      !errors.eleBurst.curLvl &&
      !errors.eleBurst.reqLvl
    ) {
      editLvlConnect(charLevels);
      getAllCharReqConnect();
      this.handleClose();
    }
  };

  render() {
    const { char, classes, removeCharConnect } = this.props;
    const { charLevels, errors, raised, curLvl, reqLvl, modalOpen, checked } = this.state;
    return (
      <>
        <Card
          onMouseOver={this.toggleRaised}
          onMouseOut={this.toggleRaised}
          raised={raised}
          className={classes.root}
        >
          <ButtonBase onClick={this.handleOpen} className={classes.buttonBase}>
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
            <div>
              <div className={classes.levels}>
                {/* eslint-disable */}
                <Typography className={classes.mainLvl}>
                  Lv. <span className={classes.lvlNumber}>{curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{reqLvl}</span>
                </Typography>
                {/* eslint-enable */}
              </div>
              <div className={classes.cardTalentLevels}>
                <CardMedia
                  className={classes.talentImg}
                  component="img"
                  image={char.autoAttack.imgPath}
                />
                {/* eslint-disable */}
                <Typography className={classes.talentFont}>
                  Lv. <span className={classes.lvlNumber}>{char.autoAttack.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.autoAttack.reqLvl}</span>
                </Typography>
                {/* eslint-enable */}
              </div>
              <div className={classes.cardTalentLevels}>
                <CardMedia
                  className={classes.talentImg}
                  component="img"
                  image={char.eleSkill.imgPath}
                />
                {/* eslint-disable */}
                <Typography className={classes.talentFont}>
                  Lv. <span className={classes.lvlNumber}>{char.eleSkill.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.eleSkill.reqLvl}</span>
                </Typography>
                {/* eslint-enable */}
              </div>
              <div className={classes.cardTalentLevels}>
                <CardMedia
                  className={classes.talentImg}
                  component="img"
                  image={char.eleBurst.imgPath}
                />
                {/* eslint-disable */}
                <Typography className={classes.talentFont}>
                  Lv. <span className={classes.lvlNumber}>{char.eleBurst.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.eleBurst.reqLvl}</span>
                </Typography>
                {/* eslint-enable */}
              </div>
            </div>
          </ButtonBase>
          <div className={classes.delete}>
            <IconButton onClick={() => removeCharConnect(char.name)} size="small">
              <Clear className={classes.deleteSize} />
            </IconButton>
          </div>
        </Card>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={modalOpen}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modalOpen}>
            <div className={classes.paper}>
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
              <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                <div className={classes.levelGroup}>
                  <div className={classes.levelSpacing}>
                    <div className={classes.modalLevels}>
                      <div className={classes.errors}>{errors.curLvl}</div>
                      <Typography className={classes.modalText}>Current Level</Typography>
                      <div className={classes.buttonCheck}>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.setLevel(charLevels.curLvl - 1, 'level', 'curLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.curLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            name="curLvl"
                            onChange={(e) => this.setLevel(e.target.value, 'level', e.target.id)}
                            value={
                              charLevels.curLvl !== ''
                                ? Math.floor(charLevels.curLvl)
                                : charLevels.curLvl
                            }
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.setLevel(charLevels.curLvl + 1, 'level', 'curLvl')}
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                        <Checkbox
                          onClick={() => this.toggleCheck('curLvl')}
                          disabled={!this.ascIsValid(charLevels.curLvl)}
                          checked={checked.curLvl}
                          className={classes.checkbox}
                          icon={<StarBorder />}
                          checkedIcon={<Star />}
                        />
                      </div>
                    </div>
                    <div className={classes.modalLevels}>
                      <div className={classes.errors}>{errors.reqLvl}</div>
                      <Typography className={classes.modalText}>Required Level</Typography>
                      <div className={classes.buttonCheck}>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.setLevel(charLevels.reqLvl - 1, 'level', 'reqLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.reqLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="reqLvl"
                            name="reqLvl"
                            onChange={(e) => this.setLevel(e.target.value, 'level', e.target.id)}
                            value={
                              charLevels.reqLvl !== ''
                                ? Math.floor(charLevels.reqLvl)
                                : charLevels.reqLvl
                            }
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.setLevel(charLevels.reqLvl + 1, 'level', 'reqLvl')}
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                        <Checkbox
                          onClick={() => this.toggleCheck('reqLvl')}
                          disabled={!this.ascIsValid(charLevels.reqLvl)}
                          checked={checked.reqLvl}
                          className={classes.checkbox}
                          icon={<StarBorder />}
                          checkedIcon={<Star />}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalTalents}>
                    <div className={classes.talentTitle}>
                      <CardMedia
                        className={classes.talentImg}
                        component="img"
                        image={char.autoAttack.imgPath}
                      />
                      <Typography className={classes.modalText}>{char.autoAttack.name}</Typography>
                    </div>
                    {/* eslint-disable */}
                    <div className={classes.talentLevels}>
                      <div className={classes.talentLevel}>
                        <div className={classes.talentErrors}>{errors.autoAttack.curLvl}</div>
                        <Typography align="center">Current Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.autoAttack.curLvl - 1,
                                'talent',
                                'curLvl',
                                'autoAttack'
                              )
                            }
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.autoAttack.curLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="autoAttack-curLvl"
                            value={charLevels.autoAttack.curLvl}
                            variant="outlined"
                            onChange={(e) =>
                              this.setLevel(e.target.value, 'talent', 'curLvl', 'autoAttack')
                            }
                          />
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.autoAttack.curLvl + 1,
                                'talent',
                                'curLvl',
                                'autoAttack'
                              )
                            }
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                      <div className={classes.talentLevel}>
                        <div className={classes.talentErrors}>{errors.autoAttack.reqLvl}</div>
                        <Typography align="center">Required Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.autoAttack.reqLvl - 1,
                                'talent',
                                'reqLvl',
                                'autoAttack'
                              )
                            }
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.autoAttack.reqLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="autoAttack-reqLvl"
                            value={charLevels.autoAttack.reqLvl}
                            variant="outlined"
                            onChange={(e) =>
                              this.setLevel(e.target.value, 'talent', 'reqLvl', 'autoAttack')
                            }
                          />
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.autoAttack.reqLvl + 1,
                                'talent',
                                'reqLvl',
                                'autoAttack'
                              )
                            }
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalTalents}>
                    <div className={classes.talentTitle}>
                      <CardMedia
                        className={classes.talentImg}
                        component="img"
                        image={char.eleSkill.imgPath}
                      />
                      <Typography className={classes.modalText}>{char.eleSkill.name}</Typography>
                    </div>
                    <div className={classes.talentLevels}>
                      <div className={classes.talentLevel}>
                        <div className={classes.talentErrors}>{errors.eleSkill.curLvl}</div>
                        <Typography align="center">Current Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleSkill.curLvl - 1,
                                'talent',
                                'curLvl',
                                'eleSkill'
                              )
                            }
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.eleSkill.curLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="eleSkill-curLvl"
                            value={charLevels.eleSkill.curLvl}
                            variant="outlined"
                            onChange={(e) =>
                              this.setLevel(e.target.value, 'talent', 'curLvl', 'eleSkill')
                            }
                          />
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleSkill.curLvl + 1,
                                'talent',
                                'curLvl',
                                'eleSkill'
                              )
                            }
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                      <div className={classes.talentLevel}>
                        <div className={classes.talentErrors}>{errors.eleSkill.reqLvl}</div>
                        <Typography align="center">Required Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleSkill.reqLvl - 1,
                                'talent',
                                'reqLvl',
                                'eleSkill'
                              )
                            }
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.eleSkill.reqLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="eleSkill-reqLvl"
                            value={charLevels.eleSkill.reqLvl}
                            variant="outlined"
                            onChange={(e) =>
                              this.setLevel(e.target.value, 'talent', 'reqLvl', 'eleSkill')
                            }
                          />
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleSkill.reqLvl + 1,
                                'talent',
                                'reqLvl',
                                'eleSkill'
                              )
                            }
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalTalents}>
                    <div className={classes.talentTitle}>
                      <CardMedia
                        className={classes.talentImg}
                        component="img"
                        image={char.eleBurst.imgPath}
                      />
                      <Typography className={classes.modalText}>{char.eleBurst.name}</Typography>
                    </div>
                    <div className={classes.talentLevels}>
                      <div className={classes.talentLevel}>
                        <div className={classes.talentErrors}>{errors.eleBurst.curLvl}</div>
                        <Typography align="center">Current Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleBurst.curLvl - 1,
                                'talent',
                                'curLvl',
                                'eleBurst'
                              )
                            }
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.eleBurst.curLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="eleBurst-curLvl"
                            value={charLevels.eleBurst.curLvl}
                            variant="outlined"
                            onChange={(e) =>
                              this.setLevel(e.target.value, 'talent', 'curLvl', 'eleBurst')
                            }
                          />
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleBurst.curLvl + 1,
                                'talent',
                                'curLvl',
                                'eleBurst'
                              )
                            }
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                      <div className={classes.talentLevel}>
                        <div className={classes.talentErrors}>{errors.eleBurst.reqLvl}</div>
                        <Typography align="center">Required Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleBurst.reqLvl - 1,
                                'talent',
                                'reqLvl',
                                'eleBurst'
                              )
                            }
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={!!errors.eleBurst.reqLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="eleBurst-reqLvl"
                            value={charLevels.eleBurst.reqLvl}
                            variant="outlined"
                            onChange={(e) =>
                              this.setLevel(e.target.value, 'talent', 'reqLvl', 'eleBurst')
                            }
                          />
                          <IconButton
                            onClick={() =>
                              this.setLevel(
                                charLevels.eleBurst.reqLvl + 1,
                                'talent',
                                'reqLvl',
                                'eleBurst'
                              )
                            }
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="contained" color="secondary" type="submit">
                  Ok
                </Button>
              </form>
            </div>
          </Fade>
        </Modal>
      </>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
CharacterCard.propTypes = {
  removeCharConnect: PropTypes.func.isRequired,
  editLvlConnect: PropTypes.func.isRequired,
  getAllCharReqConnect: PropTypes.func.isRequired,
  char: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(null, {
  removeCharConnect: removeChar,
  editLvlConnect: editLvl,
  getAllCharReqConnect: getAllCharReq,
})(withStyles(styles, { withTheme: true })(CharacterCard));
