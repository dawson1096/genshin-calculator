import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Button, Container, Grid, Card, Modal, Backdrop, Fade } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import CharacterCard from './CharacterCard';
import { addChar } from '../../actions/userActions';

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
    height: '321.5px',
    width: '143.58px',
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
    maxWidth: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
});

class Characters extends Component {
  constructor() {
    super();
    this.state = {
      genCharList: null,
      charList: null,
      materials: null,
      raised: false,
      maxChar: false,
      addModalOpen: false,
      charModalOpen: false,
      addChar: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Change to only run on props change
    if (props.userData.isLoaded && props.genData.isLoaded) {
      let genCharList = props.genData.genCharList.filter((item) => {
        for (let i = 0; i < props.userData.charList.length; i++) {
          if (item.name === props.userData.charList[i].name) {
            return false;
          }
        }
        return true;
      });
      return {
        genCharList: genCharList,
        charList: props.userData.charList,
        materials: props.userData.materials,
        maxChar: props.userData.charList.length === props.genData.genCharList.length ? true : false,
      };
    }
    return null;
  }

  handleAddOpen = () => {
    this.setState({
      addModalOpen: true,
    });
  };

  handleAddClose = () => {
    this.setState({
      addModalOpen: false,
      addChar: [],
    });
  };

  isSelected = (name) => {
    for (let i = 0; i < this.state.addChar.length; i++) {
      if (name === this.state.addChar[i].name) {
        return true;
      }
    }
    return false;
  };

  addChar = (char) => {
    let addChar = this.state.addChar;
    let flag = true;
    for (let i = 0; i < addChar.length; i++) {
      if (char.name === addChar[i].name) {
        flag = false;
        addChar.splice(i, 1);
        break;
      }
    }
    if (flag) {
      let insert = {
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
      addChar.push(insert);
    }
    this.setState({
      addChar: addChar,
    });
  };

  toggleRaised = () => this.setState({ raised: !this.state.raised });

  render() {
    if (!this.state.charList) {
      return <div />;
    }
    const { classes } = this.props;
    return (
      <Container maxWidth="md">
        <div className={classes.root}>
          <Typography variant="h5">Characters</Typography>
          <Grid className={classes.cards} container spacing={3}>
            {this.state.charList.map((char) => (
              <Grid key={char.name} item>
                <CharacterCard char={char} />
              </Grid>
            ))}
            {!this.state.maxChar && (
              <Grid item>
                <Card
                  component={Button}
                  className={classes.addCard}
                  onMouseOver={this.toggleRaised}
                  onMouseOut={this.toggleRaised}
                  raised={this.state.raised}
                  onClick={this.handleAddOpen}
                >
                  <AddCircle fontSize="large" />
                </Card>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={this.state.addModalOpen}
                  onClose={this.handleAddClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.addModalOpen}>
                    <Grid container className={classes.paper}>
                      {this.state.genCharList.map((char) => (
                        <Grid key={char.name} onClick={() => this.addChar(char)} item>
                          <div className={this.isSelected(char.name) ? classes.imgCardSelected : classes.imgCard}>
                            <div className={classes.imgBack}>
                              <img className={classes.media} src={char.imgPath} alt={char.name} />
                            </div>
                            <Typography className={classes.name}>{char.name}</Typography>
                          </div>
                        </Grid>
                      ))}
                      <Grid className={classes.button} item xs={12}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            this.props.addChar(this.state.addChar);
                            this.handleAddClose();
                          }}
                        >
                          Ok
                        </Button>
                      </Grid>
                    </Grid>
                  </Fade>
                </Modal>
              </Grid>
            )}
          </Grid>
          <Button variant="contained">Calculate</Button>
        </div>
      </Container>
    );
  }
}

Characters.propTypes = {
  userData: PropTypes.object.isRequired,
  genData: PropTypes.object.isRequired,
  addChar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userData: state.userData,
  genData: state.genData,
});

export default connect(mapStateToProps, { addChar })(withStyles(styles, { withTheme: true })(Characters));
