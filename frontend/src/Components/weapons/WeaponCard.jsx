import React, { Component } from 'react';
import { withStyles, Typography, ButtonBase, Card, CardMedia } from '@material-ui/core';
import PropTypes from 'prop-types';

import WeaponModal from './WeaponModal';

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#ebeeff',
    borderColor: 'black',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  levelRoot: {
    display: 'flex',
    backgroundColor: '#ebeeff',
    borderColor: 'black',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 224,
  },
  levelOverlay: {
    top: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'gray',
    opacity: 0.4,
    width: 242,
    height: 160,
  },
  buttonBase: {
    display: 'flex',
    textAlign: 'initial',
  },
  imgCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(2),
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
  media: {
    width: theme.spacing(25),
    height: 'auto',
  },
  talentImg: {
    width: theme.spacing(5),
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
    margin: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  talentFont: {
    fontSize: theme.spacing(3.3),
  },
  delete: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: 'white',
    borderRadius: theme.spacing(25),
  },
  deleteSize: {
    fontSize: theme.spacing(4),
  },
  mainLvl: {
    fontWeight: 'bold',
    fontSize: theme.spacing(3.3),
  },
  lvlNumber: {
    color: theme.palette.textColor.main,
  },
  levelBlock: {
    width: theme.spacing(31),
  },
});

class WeaponCard extends Component {
  constructor() {
    super();
    this.state = {
      raised: false,
      curLvl: null,
      reqLvl: null,
      modalOpen: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Change to only run on props change
    const {
      weapon: { curLvl, reqLvl },
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
    this.setState({
      modalOpen: false,
    });
  };

  toggleRaised = () => {
    const { raised } = this.state;
    this.setState({ raised: !raised });
  };

  render() {
    const { weapon, classes, showLevels } = this.props;
    const { raised, curLvl, reqLvl, modalOpen } = this.state;
    return (
      <>
        <Card
          onMouseOver={this.toggleRaised}
          onMouseOut={this.toggleRaised}
          raised={raised}
          className={showLevels ? classes.levelRoot : classes.root}
        >
          <ButtonBase onClick={this.handleOpen} className={classes.buttonBase}>
            <div className={classes.imgCard}>
              <div
                className={
                  weapon.stars === 5
                    ? classes.imgBackFive
                    : weapon.stars === 4
                    ? classes.imgBackFour
                    : weapon.stars === 3
                    ? classes.imgBackThree
                    : weapon.stars === 2
                    ? classes.imgBackTwo
                    : classes.imgBackOne
                }
              >
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
            {showLevels && (
              <div className={classes.levelBlock}>
                {weapon.curLvl === weapon.reqLvl ? (
                  <div className={classes.cardTalentLevels}>Goals Reached</div>
                ) : (
                  <>
                    {weapon.curLvl !== weapon.reqLvl && (
                      <div className={classes.levels}>
                        {/* eslint-disable */}
                        <Typography className={classes.mainLvl}>
                          Lv. <span className={classes.lvlNumber}>{curLvl}</span> to Lv.{' '}
                          <span className={classes.lvlNumber}>{reqLvl}</span>
                        </Typography>
                        {/* eslint-enable */}
                      </div>
                    )}
                    <div className={classes.cardTalentLevels}>
                      {/* eslint-disable */}
                      <Typography className={classes.talentFont}>
                        Copies: <span className={classes.lvlNumber}>x{weapon.number}</span>
                      </Typography>
                      {/* eslint-enable */}
                    </div>
                  </>
                )}
              </div>
            )}
            {weapon.hidden && <div className={classes.levelOverlay}> </div>}
          </ButtonBase>
        </Card>
        <WeaponModal weapon={weapon} modalOpen={modalOpen} onClose={this.handleClose} />
      </>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
WeaponCard.propTypes = {
  weapon: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  showLevels: PropTypes.bool,
};

WeaponCard.defaultProps = {
  showLevels: false,
};

export default withStyles(styles, { withTheme: true })(WeaponCard);
