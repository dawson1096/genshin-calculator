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
import { removeChar } from '../../actions/userActions';

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
    width: theme.spacing(30),
    textAlign: 'center',
  },
  imgBack: {
    backgroundColor: 'purple',
  },
  media: {
    width: theme.spacing(30),
    height: 'auto',
  },
  talentImg: {
    width: theme.spacing(8),
    height: 'auto',
    marginRight: theme.spacing(2),
  },
  levels: {
    margin: theme.spacing(2, 0, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    margin: theme.spacing(2),
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
    margin: theme.spacing(2),
  },
  checkbox: {
    color: theme.palette.secondary.main,
  },
  buttonCheck: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  errors: {
    position: 'absolute',
    bottom: -1,
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
      errors: {},
      charLevels: {
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

  componentDidMount() {
    let {
      char: { curLvl, reqLvl },
    } = this.props;
    if (curLvl % 1 !== 0) {
      curLvl = `${Math.floor(curLvl)}+`;
    }
    if (reqLvl % 1 !== 0) {
      reqLvl = `${Math.floor(reqLvl)}+`;
    }
    this.setState({
      curLvl,
      reqLvl,
    });
  }

  handleOpen = () => {
    this.setState({
      modalOpen: true,
    });
  };

  handleClose = () => {
    this.setState({
      modalOpen: false,
    });
  };

  setLevel = (value, type, lvl, talent = null) => {
    const { charLevels, errors } = this.state;
    const newLvl = value === '' ? '' : parseInt(value, 10);
    // eslint-disable-next-line
    const talentLvl = charLevels[talent];
    switch (type) {
      case 'level':
        if ((newLvl >= 0 && newLvl <= 90) || newLvl === '') {
          if (lvl === 'curLvl' && newLvl > charLevels.reqLvl) {
            this.setState({
              charLevels: {
                ...charLevels,
                reqLvl: newLvl,
                curLvl: newLvl,
              },
              errors: {
                ...errors,
                curLvl: undefined,
              },
            });
          } else {
            this.setState(
              {
                charLevels: {
                  ...charLevels,
                  [lvl]: newLvl,
                },
              },
              () => {
                if (newLvl === '') {
                  const map = {
                    curLvl: 'Current Level',
                    reqLvl: 'Required Level',
                  };
                  this.setState((prevState) => ({
                    errors: {
                      ...prevState.errors,
                      [lvl]: `${map[lvl]} is required`,
                    },
                  }));
                } else if (lvl === 'reqLvl' && newLvl < charLevels.curLvl) {
                  this.setState(() => ({
                    errors: {
                      reqLvl: 'Required Level cannot be lower than Current Level',
                    },
                  }));
                } else {
                  this.setState((prevState) => ({
                    errors: {
                      ...prevState.errors,
                      [lvl]: undefined,
                    },
                  }));
                }
              }
            );
          }
        }
        break;
      case 'talent':
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
    const { charLevels } = this.state;
    const newLvl = charLevels[lvl] % 1 === 0 ? charLevels[lvl] + 0.5 : charLevels[lvl] - 0.5;
    this.setState({
      charLevels: {
        ...charLevels,
        [lvl]: newLvl,
      },
    });
  };

  render() {
    const { char, classes, removeCharConnect } = this.props;
    const { charLevels, errors, raised, curLvl, reqLvl, modalOpen } = this.state;
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
              <div className={classes.levels}>
                <CardMedia
                  className={classes.talentImg}
                  component="img"
                  image={char.autoAttack.imgPath}
                />
                {/* eslint-disable */}
                <Typography>
                  Lv. <span className={classes.lvlNumber}>{char.autoAttack.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.autoAttack.reqLvl}</span>
                </Typography>
                {/* eslint-enable */}
              </div>
              <div className={classes.levels}>
                <CardMedia
                  className={classes.talentImg}
                  component="img"
                  image={char.eleSkill.imgPath}
                />
                {/* eslint-disable */}
                <Typography>
                  Lv. <span className={classes.lvlNumber}>{char.eleSkill.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.eleSkill.reqLvl}</span>
                </Typography>
                {/* eslint-enable */}
              </div>
              <div className={classes.levels}>
                <CardMedia
                  className={classes.talentImg}
                  component="img"
                  image={char.eleBurst.imgPath}
                />
                {/* eslint-disable */}
                <Typography>
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
                            error={errors.curLvl}
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
                          checked={charLevels.curLvl % 1 !== 0}
                          className={classes.checkbox}
                          icon={<StarBorder />}
                          checkedIcon={<Star />}
                        />
                        <div className={classes.errors}>{errors.curLvl}</div>
                      </div>
                    </div>
                    <div className={classes.modalLevels}>
                      <Typography className={classes.modalText}>Required Level</Typography>
                      <div className={classes.buttonCheck}>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.onClick(-1, 'level', 'reqLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            error={errors.reqLvl}
                            helperText={errors.reqLvl}
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
                            onClick={() => this.onClick(1, 'level', 'reqLvl')}
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                        <Checkbox
                          onClick={() => this.toggleCheck('reqLvl')}
                          disabled={!this.ascIsValid(charLevels.reqLvl)}
                          checked={charLevels.reqLvl % 1 !== 0}
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
                    <div className={classes.talentLevels}>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Current Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.onClick(-1, 'autoAttack', 'curLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="autoAttack-curLvl"
                            value={charLevels.autoAttack.curLvl}
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.onClick(1, 'autoAttack', 'curLvl')}
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Required Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.onClick(-1, 'autoAttack', 'reqLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={charLevels.autoAttack.reqLvl}
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.onClick(1, 'autoAttack', 'reqLvl')}
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
                        <Typography align="center">Current Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.onClick(-1, 'eleSkil', 'curLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleSkill.curLvl}
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.onClick(1, 'eleSkill', 'curLvl')}
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Required Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.onClick(-1, 'eleSkill', 'reqLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleSkill.reqLvl}
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.onClick(1, 'eleSkill', 'reqLvl')}
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
                        <Typography align="center">Current Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.onClick(-1, 'eleBurst', 'curLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleBurst.curLvl}
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.onClick(1, 'eleBurst', 'curLvl')}
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Required Level</Typography>
                        <div className={classes.buttonGroup}>
                          <IconButton
                            onClick={() => this.onClick(-1, 'eleBurst', 'reqLvl')}
                            className={classes.buttonLeft}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleBurst.reqLvl}
                            variant="outlined"
                          />
                          <IconButton
                            onClick={() => this.onClick(1, 'eleBurst', 'reqLvl')}
                            className={classes.buttonRight}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="contained" color="secondary" onClick={this.handleClose}>
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
  char: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(null, { removeCharConnect: removeChar })(
  withStyles(styles, { withTheme: true })(CharacterCard)
);
