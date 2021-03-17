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

import WeaponCard from './WeaponCard';
import { addWeapon } from '../../actions/userActions';
import { getAllWeaponReq } from '../../actions/calcActions';
import Materials from '../materials/Materials';
import Switch from './Switch';
import AddWeaponCard from './AddWeaponCard';

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
  addWeaponList: {
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

class Weapons extends Component {
  constructor() {
    super();
    this.state = {
      genWeaponList: null,
      weaponList: null,
      maxWeapon: false,
      modalOpen: false,
      addWeaponList: [],
      showLevels: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Change to only run on props change
    const genWeaponList = props.genData.genWeaponList.filter((item) => {
      for (let i = 0; i < props.userData.weaponList.length; i++) {
        if (item.name === props.userData.weaponList[i].name) {
          return false;
        }
      }
      return true;
    });
    if (
      (!isEqual(props.userData.weaponList, state.weaponList) && !props.userData.loading) ||
      (!isEqual(genWeaponList, state.genWeaponList) && !props.genData.loading)
    ) {
      props.getAllWeaponReqConnect();
      return {
        genWeaponList,
        weaponList: props.userData.weaponList,
        maxWeapon: props.userData.weaponList.length === props.genData.genWeaponList.length,
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
      addWeaponList: [],
    });
  };

  isSelected = (name) => {
    const { addWeaponList } = this.state;
    for (let i = 0; i < addWeaponList.length; i++) {
      if (name === addWeaponList[i].name) {
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

  addWeaponButton = (weapon) => {
    const { addWeaponList } = this.state;
    let flag = true;
    for (let i = 0; i < addWeaponList.length; i++) {
      if (weapon.name === addWeaponList[i].name) {
        flag = false;
        addWeaponList.splice(i, 1);
        break;
      }
    }
    if (flag) {
      const insert = {
        name: weapon.name,
        hidden: false,
        inventory: true,
        number: 1,
        stars: weapon.stars,
        curLvl: 1,
        reqLvl: weapon.stars === 2 || weapon.stars === 1 ? 70 : 90,
        imgPath: weapon.imgPath,
      };
      addWeaponList.push(insert);
    }
    this.setState({
      addWeaponList,
    });
  };

  render() {
    const { classes, addWeaponConnect, reqMat, userData, genData } = this.props;
    const {
      weaponList,
      maxWeapon,
      modalOpen,
      genWeaponList,
      addWeaponList,
      showLevels,
    } = this.state;

    return (
      <Container maxWidth="md">
        <div className={classes.root}>
          <Typography className={classes.title} variant="h4">
            Weapons
          </Typography>
          <div className={classes.buttons}>
            <Button
              disabled={maxWeapon}
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={this.handleAddOpen}
            >
              Add Weapon
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
                  {weaponList.map((weapon) => (
                    <Grid className={classes.card} key={weapon.name} item>
                      <WeaponCard showLevels={showLevels} weapon={weapon} />
                    </Grid>
                  ))}
                </Grid>
              </div>
              {!maxWeapon && (
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
                      <Grid container className={classes.addWeaponList} spacing={2}>
                        {genData.loading ? (
                          <div className={classes.modalSpinner}>
                            <CircularProgress size={60} />
                          </div>
                        ) : (
                          genWeaponList.map((weapon) => (
                            <Grid
                              key={weapon.name}
                              onClick={() => this.addWeaponButton(weapon)}
                              item
                            >
                              <AddWeaponCard
                                weapon={weapon}
                                isSelected={this.isSelected(weapon.name)}
                              />
                            </Grid>
                          ))
                        )}
                      </Grid>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          addWeaponConnect(addWeaponList);
                          this.handleAddClose();
                        }}
                      >
                        Ok
                      </Button>
                    </div>
                  </Fade>
                </Modal>
              )}
              <Materials mat={reqMat.allWeaponReq.mat} loading={reqMat.allWeaponReq.loading} />
            </>
          )}
        </div>
      </Container>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Weapons.propTypes = {
  userData: PropTypes.object.isRequired,
  reqMat: PropTypes.object.isRequired,
  genData: PropTypes.object.isRequired,
  addWeaponConnect: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  getAllWeaponReqConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userData: state.userData,
  genData: state.genData,
  reqMat: state.reqMat,
});

export default connect(mapStateToProps, {
  addWeaponConnect: addWeapon,
  getAllWeaponReqConnect: getAllWeaponReq,
})(withStyles(styles, { withTheme: true })(Weapons));
