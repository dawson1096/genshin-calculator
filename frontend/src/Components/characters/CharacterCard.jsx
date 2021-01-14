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
  Grid,
  Button,
  TextField,
  ButtonGroup,
  Checkbox,
} from '@material-ui/core';
import { Clear, StarBorder, Star } from '@material-ui/icons';
import { removeChar } from '../../actions/userActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    height: theme.spacing(6),
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
    this.state = {
      raised: false,
      curLvl: null,
      reqLvl: null,
      modalOpen: false,
      errors: {},
      charLevels: {
        curLvl: this.props.char.curLvl,
        reqLvl: this.props.char.reqLvl,
        autoAttack: {
          curLvl: this.props.char.autoAttack.curLvl,
          reqLvl: this.props.char.autoAttack.reqLvl,
        },
        eleSkill: {
          curLvl: this.props.char.eleSkill.curLvl,
          reqLvl: this.props.char.eleSkill.reqLvl,
        },
        eleBurst: {
          curLvl: this.props.char.eleBurst.curLvl,
          reqLvl: this.props.char.eleBurst.reqLvl,
        },
      },
    };
  }

  componentDidMount() {
    let curLvl = this.props.char.curLvl;
    let reqLvl = this.props.char.reqLvl;
    if (curLvl % 1 !== 0) {
      curLvl = `${Math.floor(curLvl)}+`;
    }
    if (reqLvl % 1 !== 0) {
      reqLvl = `${Math.floor(reqLvl)}+`;
    }
    this.setState({
      curLvl: curLvl,
      reqLvl: reqLvl,
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

  handleChange = (e, type) => {
    let value = e.target.value === '' ? '' : parseInt(e.target.value);
    switch (type) {
      case 'level':
        if ((value >= 0 && value <= 90) || value === '') {
          if (e.target.id === 'curLvl' && value > this.state.charLevels.reqLvl) {
            this.setState({
              charLevels: {
                ...this.state.charLevels,
                reqLvl: value,
                curLvl: value,
              },
              errors: {
                ...this.state.errors,
                curLvl: undefined,
              },
            });
          } else {
            this.setState(
              {
                charLevels: {
                  ...this.state.charLevels,
                  [e.target.id]: value,
                },
              },
              () => {
                if (value === '') {
                  let map = {
                    curLvl: 'Current Level',
                    reqLvl: 'Required Level',
                  };
                  this.setState((prevState) => ({
                    errors: {
                      ...prevState.errors,
                      [e.target.id]: `${map[e.target.id]} is required`,
                    },
                  }));
                } else if (value < this.state.charLevels.curLvl) {
                  this.setState((prevState) => ({
                    errors: {
                      reqLvl: 'Required Level cannot be lower than Current Level',
                    },
                  }));
                } else {
                  this.setState((prevState) => ({
                    errors: {
                      ...prevState.errors,
                      [e.target.id]: undefined,
                    },
                  }));
                }
              }
            );
          }
        }
        break;
      default:
        break;
    }
  };

  ascIsValid = (lvl) => {
    let arr = [20, 40, 50, 60, 70, 80];
    return arr.includes(Math.floor(lvl));
  };

  toggleRaised = () => this.setState({ raised: !this.state.raised });

  render() {
    const { char, classes } = this.props;
    const { charLevels, errors } = this.state;
    return (
      <>
        <Card onMouseOver={this.toggleRaised} onMouseOut={this.toggleRaised} raised={this.state.raised} className={classes.root}>
          <ButtonBase onClick={this.handleOpen} className={classes.buttonBase}>
            <div className={classes.imgCard}>
              <div className={classes.imgBack}>
                <CardMedia className={classes.media} component="img" image={char.imgPath} title={char.name} />
              </div>
              <Typography className={classes.name}>{char.name}</Typography>
            </div>
            <div>
              <div className={classes.levels}>
                <Typography className={classes.mainLvl}>
                  Lv. <span className={classes.lvlNumber}>{this.state.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{this.state.reqLvl}</span>
                </Typography>
              </div>
              <div className={classes.levels}>
                <CardMedia className={classes.talentImg} component="img" image={char.autoAttack.imgPath} />
                <Typography>
                  Lv. <span className={classes.lvlNumber}>{char.autoAttack.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.autoAttack.reqLvl}</span>
                </Typography>
              </div>
              <div className={classes.levels}>
                <CardMedia className={classes.talentImg} component="img" image={char.eleSkill.imgPath} />
                <Typography>
                  Lv. <span className={classes.lvlNumber}>{char.eleSkill.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.eleSkill.reqLvl}</span>
                </Typography>
              </div>
              <div className={classes.levels}>
                <CardMedia className={classes.talentImg} component="img" image={char.eleBurst.imgPath} />
                <Typography>
                  Lv. <span className={classes.lvlNumber}>{char.eleBurst.curLvl}</span> to Lv.{' '}
                  <span className={classes.lvlNumber}>{char.eleBurst.reqLvl}</span>
                </Typography>
              </div>
            </div>
            <div className={classes.delete}>
              <IconButton onClick={() => this.props.removeChar(char.name)} size="small">
                <Clear className={classes.deleteSize} />
              </IconButton>
            </div>
          </ButtonBase>
        </Card>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.modalOpen}>
            <div className={classes.paper}>
              <div className={classes.imgCard}>
                <div className={classes.imgBack}>
                  <CardMedia className={classes.media} component="img" image={char.imgPath} title={char.name} />
                </div>
                <Typography className={classes.name}>{char.name}</Typography>
              </div>
              <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                <div className={classes.levelGroup}>
                  <div className={classes.levelSpacing}>
                    <div className={classes.modalLevels}>
                      <Typography className={classes.modalText}>Current Level</Typography>
                      <div className={classes.buttonCheck}>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            error={errors.curLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            name="curLvl"
                            onChange={(e) => this.handleChange(e, 'level')}
                            value={charLevels.curLvl !== '' ? Math.floor(charLevels.curLvl) : charLevels.curLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
                        {this.ascIsValid(charLevels.curLvl) ? (
                          charLevels.curLvl % 1 !== 0 ? (
                            <Checkbox checked className={classes.checkbox} icon={<StarBorder />} checkedIcon={<Star />} />
                          ) : (
                            <Checkbox className={classes.checkbox} icon={<StarBorder />} checkedIcon={<Star />} />
                          )
                        ) : (
                          <Checkbox disabled className={classes.checkbox} icon={<StarBorder />} checkedIcon={<Star />} />
                        )}
                        <div className={classes.errors}>{errors.curLvl}</div>
                      </div>
                    </div>
                    <div className={classes.modalLevels}>
                      <Typography className={classes.modalText}>Required Level</Typography>
                      <div className={classes.buttonCheck}>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            error={errors.reqLvl}
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="reqLvl"
                            name="reqLvl"
                            onChange={(e) => this.handleChange(e, 'level')}
                            value={charLevels.reqLvl !== '' ? Math.floor(charLevels.reqLvl) : charLevels.reqLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
                        {this.ascIsValid(charLevels.reqLvl) ? (
                          charLevels.reqLvl % 1 !== 0 ? (
                            <Checkbox checked className={classes.checkbox} icon={<StarBorder />} checkedIcon={<Star />} />
                          ) : (
                            <Checkbox className={classes.checkbox} icon={<StarBorder />} checkedIcon={<Star />} />
                          )
                        ) : (
                          <Checkbox disabled className={classes.checkbox} icon={<StarBorder />} checkedIcon={<Star />} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalTalents}>
                    <div className={classes.talentTitle}>
                      <CardMedia className={classes.talentImg} component="img" image={char.autoAttack.imgPath} />
                      <Typography className={classes.modalText}>{char.autoAttack.name}</Typography>
                    </div>
                    <div className={classes.talentLevels}>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Current Level</Typography>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.autoAttack.curLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
                      </div>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Required Level</Typography>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.autoAttack.reqLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalTalents}>
                    <div className={classes.talentTitle}>
                      <CardMedia className={classes.talentImg} component="img" image={char.eleSkill.imgPath} />
                      <Typography className={classes.modalText}>{char.eleSkill.name}</Typography>
                    </div>
                    <div className={classes.talentLevels}>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Current Level</Typography>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleSkill.curLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
                      </div>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Required Level</Typography>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleSkill.reqLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalTalents}>
                    <div className={classes.talentTitle}>
                      <CardMedia className={classes.talentImg} component="img" image={char.eleBurst.imgPath} />
                      <Typography className={classes.modalText}>{char.eleBurst.name}</Typography>
                    </div>
                    <div className={classes.talentLevels}>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Current Level</Typography>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleBurst.curLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
                      </div>
                      <div className={classes.talentLevel}>
                        <Typography align="center">Required Level</Typography>
                        <ButtonGroup className={classes.buttonGroup}>
                          <Button>-</Button>
                          <TextField
                            className={classes.textField}
                            InputProps={{ classes: { input: classes.input } }}
                            id="curLvl"
                            value={char.eleBurst.reqLvl}
                            variant="outlined"
                          />
                          <Button>+</Button>
                        </ButtonGroup>
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

CharacterCard.propTypes = {
  removeChar: PropTypes.func.isRequired,
};

export default connect(null, { removeChar })(withStyles(styles, { withTheme: true })(CharacterCard));
