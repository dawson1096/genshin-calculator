import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import isEqual from 'lodash.isequal';

import CharacterCard from './CharacterCard';
import { addChar } from '../../actions/userActions';
import { getAllCharReq } from '../../actions/calcActions';
import Materials from '../materials/Materials';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cards: {
    margin: theme.spacing(2, 0, 2),
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
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 4, 3),
    maxHeight: '80%',
    maxWidth: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  addCharList: {
    backgroundColor: 'white',
    borderRadius: theme.spacing(2),
    maxHeight: '80%',
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 4),
  },
  imgCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1),
    border: 'solid white',
    borderRadius: theme.spacing(1),
    width: 'auto',
    '&:hover': {
      border: 'solid grey',
      borderRadius: theme.spacing(1),
    },
  },
  imgCardSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1),
    border: 'solid blue',
    borderRadius: theme.spacing(1),
    width: 'auto',
    '&:hover': {
      border: 'solid grey',
      borderRadius: theme.spacing(1),
    },
  },
  name: {
    backgroundColor: 'white',
    width: theme.spacing(25),
    textAlign: 'center',
    fontSize: theme.spacing(3.5),
  },
  imgBack: {
    backgroundColor: 'purple',
  },
  media: {
    width: theme.spacing(25),
    height: 'auto',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(4, 0, 2),
  },
  spinner: {
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Characters extends Component {
  constructor() {
    super();
    this.state = {
      genCharList: null,
      charList: null,
      raised: false,
      maxChar: false,
      modalOpen: false,
      addCharList: [],
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
      (!isEqual(props.userData.charList, state.charList) && props.userData.isLoaded) ||
      (!isEqual(genCharList, state.genCharList) && props.genData.isLoaded)
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

  toggleRaised = () => {
    const { raised } = this.state;
    this.setState({ raised: !raised });
  };

  render() {
    const { classes, addCharConnect, reqMat } = this.props;
    const { charList, maxChar, raised, modalOpen, genCharList, addCharList } = this.state;

    if (!charList) {
      return (
        <div className={classes.spinner}>
          <CircularProgress size={80} />
        </div>
      );
    }

    return (
      <Container maxWidth="md">
        <div className={classes.root}>
          <Typography variant="h5">Characters</Typography>
          <Grid className={classes.cards} container spacing={3}>
            {charList.map((char) => (
              <Grid key={char.name} item>
                <CharacterCard char={char} />
              </Grid>
            ))}
            {!maxChar && (
              <Grid item>
                <Card
                  component={Button}
                  className={classes.addCard}
                  onMouseOver={this.toggleRaised}
                  onMouseOut={this.toggleRaised}
                  raised={raised}
                  onClick={this.handleAddOpen}
                >
                  <AddCircle fontSize="large" />
                </Card>
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
                      <Grid container className={classes.addCharList}>
                        {genCharList.map((char) => (
                          <Grid key={char.name} onClick={() => this.addCharButton(char)} item>
                            <div
                              className={
                                this.isSelected(char.name)
                                  ? classes.imgCardSelected
                                  : classes.imgCard
                              }
                            >
                              <div className={classes.imgBack}>
                                <img className={classes.media} src={char.imgPath} alt={char.name} />
                              </div>
                              <Typography className={classes.name}>{char.name}</Typography>
                            </div>
                          </Grid>
                        ))}
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
              </Grid>
            )}
          </Grid>
          <Typography variant="h5">Required Materials</Typography>
          <Materials mat={reqMat.allCharReq} />
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
