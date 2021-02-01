import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  Button,
  Container,
  Grid,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
  FormControlLabel,
} from '@material-ui/core';
import isEqual from 'lodash.isequal';

import CharacterCard from './CharacterCard';
import { addChar } from '../../actions/userActions';
import { getAllCharReq } from '../../actions/calcActions';
import Materials from '../materials/Materials';
import Switch from './Switch';
import AddCharCard from './AddCharCard';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: theme.spacing(4),
  },
  cardCont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(4),
  },
  cards: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCard: {
    height: '320.66px',
    width: '154px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
    '&:hover': {
      backgroundColor: '#e8e8e8 !important',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#ebeeff',
    outline: 0,
    borderRadius: theme.spacing(4),
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 4, 3),
    width: '75%',
    height: '75%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  addCharList: {
    backgroundColor: 'white',
    borderRadius: theme.spacing(2),
    height: '80%',
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 4),
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(4, 0, 2),
  },
  spinner: {
    height: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    margin: theme.spacing(2, 0, 2),
  },
  addButton: {
    marginRight: theme.spacing(2),
  },
  switchLabel: {
    marginLeft: theme.spacing(2),
  },
  switch: {
    marginRight: theme.spacing(2),
  },
});

class Characters extends Component {
  constructor() {
    super();
    this.state = {
      genCharList: null,
      charList: null,
      maxChar: false,
      modalOpen: false,
      addCharList: [],
      showLevels: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Change to only run on props change
    const genCharList = props.genData.genCharList.filter((item) => {
      for (let i = 0; i < props.userData.charList.length; i++) {
        if (item.name === props.userData.charList[i].name) {
          return false;
        }
      }
      return true;
    });
    if (
      (!isEqual(props.userData.charList, state.charList) && !props.userData.loading) ||
      (!isEqual(genCharList, state.genCharList) && !props.genData.loading)
    ) {
      props.getAllCharReqConnect();
      return {
        genCharList,
        charList: props.userData.charList,
        maxChar: props.userData.charList.length === props.genData.genCharList.length,
      };
    }
    return null;
  }

  handleAddOpen = () => {
    this.setState({
      modalOpen: true,
    });
  };

  handleAddClose = () => {
    this.setState({
      modalOpen: false,
      addCharList: [],
    });
  };

  isSelected = (name) => {
    const { addCharList } = this.state;
    for (let i = 0; i < addCharList.length; i++) {
      if (name === addCharList[i].name) {
        return true;
      }
    }
    return false;
  };

  toggleLevel = () => {
    const { showLevels } = this.state;
    this.setState({
      showLevels: !showLevels,
    });
  };

  addCharButton = (char) => {
    const { addCharList } = this.state;
    let flag = true;
    for (let i = 0; i < addCharList.length; i++) {
      if (char.name === addCharList[i].name) {
        flag = false;
        addCharList.splice(i, 1);
        break;
      }
    }
    if (flag) {
      const insert = {
        name: char.name,
        hidden: false,
        inventory: true,
        talentTotal: true,
        stars: char.stars,
        curLvl: 1,
        reqLvl: 90,
        autoAttack: {
          name: char.talents.autoAttack,
          curLvl: 1,
          reqLvl: 10,
          imgPath: char.talents.aaImgPath,
        },
        eleSkill: {
          name: char.talents.eleSkill,
          curLvl: 1,
          reqLvl: 10,
          imgPath: char.talents.esImgPath,
        },
        eleBurst: {
          name: char.talents.eleBurst,
          curLvl: 1,
          reqLvl: 10,
          imgPath: char.talents.ebImgPath,
        },
        imgPath: char.imgPath,
      };
      addCharList.push(insert);
    }
    this.setState({
      addCharList,
    });
  };

  render() {
    const { classes, addCharConnect, reqMat, userData, genData } = this.props;
    const { charList, maxChar, modalOpen, genCharList, addCharList, showLevels } = this.state;

    return (
      <Container maxWidth="md">
        <div className={classes.root}>
          <Typography className={classes.title} variant="h4">
            Characters
          </Typography>
          <div className={classes.buttons}>
            <Button
              disabled={maxChar}
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={this.handleAddOpen}
            >
              Add Character
            </Button>
            {/* eslint-disable */}
            <FormControlLabel
              className={classes.switchLabel}
              control={
                <Switch
                  className={classes.switch}
                  onChange={this.toggleLevel}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label={<span style={{ fontSize: '0.9rem' }}>Show Levels</span>}
            />
          </div>
          {userData.loading ? (
            <div className={classes.spinner}>
              <CircularProgress size={80} />
            </div>
          ) : (
            <>
              <div className={classes.cardCont}>
                <Grid className={classes.cards} container spacing={3}>
                  {charList.map((char) => (
                    <Grid className={classes.card} key={char.name} item>
                      <CharacterCard showLevels={showLevels} char={char} />
                    </Grid>
                  ))}
                </Grid>
              </div>
              {!maxChar && (
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={modalOpen}
                  onClose={this.handleAddClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={modalOpen}>
                    <div className={classes.paper}>
                      <Typography variant="h5">Select Characters</Typography>
                      <Grid container className={classes.addCharList} spacing={2}>
                        {genData.loading ? (
                          <div className={classes.modalSpinner}>
                            <CircularProgress size={60} />
                          </div>
                        ) : (
                          genCharList.map((char) => (
                            <Grid key={char.name} onClick={() => this.addCharButton(char)} item>
                              <AddCharCard char={char} isSelected={this.isSelected(char.name)} />
                            </Grid>
                          ))
                        )}
                      </Grid>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          addCharConnect(addCharList);
                          this.handleAddClose();
                        }}
                      >
                        Ok
                      </Button>
                    </div>
                  </Fade>
                </Modal>
              )}
              <Materials mat={reqMat.allCharReq.mat} loading={reqMat.allCharReq.loading} />
            </>
          )}
        </div>
      </Container>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Characters.propTypes = {
  userData: PropTypes.object.isRequired,
  reqMat: PropTypes.object.isRequired,
  genData: PropTypes.object.isRequired,
  addCharConnect: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  getAllCharReqConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userData: state.userData,
  genData: state.genData,
  reqMat: state.reqMat,
});

export default connect(mapStateToProps, {
  addCharConnect: addChar,
  getAllCharReqConnect: getAllCharReq,
})(withStyles(styles, { withTheme: true })(Characters));
