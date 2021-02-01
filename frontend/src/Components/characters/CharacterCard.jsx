import React, { Component } from 'react';
import { withStyles, Typography, ButtonBase, Card, CardMedia } from '@material-ui/core';
import PropTypes from 'prop-types';

import CharacterModal from './CharacterModal';

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
    height: 142,
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
    width: '100%',
  },
  imgBack: {
    backgroundColor: 'purple',
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

class CharacterCard extends Component {
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
    this.setState({
      modalOpen: false,
    });
  };

  toggleRaised = () => {
    const { raised } = this.state;
    this.setState({ raised: !raised });
  };

  render() {
    const { char, classes, showLevels } = this.props;
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
            {showLevels && (
              <div className={classes.levelBlock}>
                {char.curLvl === char.reqLvl &&
                char.autoAttack.curLvl === char.autoAttack.reqLvl &&
                char.eleSkill.curLvl === char.eleSkill.reqLvl &&
                char.eleBurst.curLvl === char.eleBurst.reqLvl ? (
                  <div className={classes.cardTalentLevels}>Goals Reached</div>
                ) : (
                  <>
                    {char.curLvl !== char.reqLvl && (
                      <div className={classes.levels}>
                        {/* eslint-disable */}
                        <Typography className={classes.mainLvl}>
                          Lv. <span className={classes.lvlNumber}>{curLvl}</span> to Lv.{' '}
                          <span className={classes.lvlNumber}>{reqLvl}</span>
                        </Typography>
                        {/* eslint-enable */}
                      </div>
                    )}
                    {char.autoAttack.curLvl !== char.autoAttack.reqLvl && (
                      <div className={classes.cardTalentLevels}>
                        <CardMedia
                          className={classes.talentImg}
                          component="img"
                          image={char.autoAttack.imgPath}
                        />
                        {/* eslint-disable */}
                        <Typography className={classes.talentFont}>
                          Lv. <span className={classes.lvlNumber}>{char.autoAttack.curLvl}</span> to
                          Lv. <span className={classes.lvlNumber}>{char.autoAttack.reqLvl}</span>
                        </Typography>
                        {/* eslint-enable */}
                      </div>
                    )}
                    {char.eleSkill.curLvl !== char.eleSkill.reqLvl && (
                      <div className={classes.cardTalentLevels}>
                        <CardMedia
                          className={classes.talentImg}
                          component="img"
                          image={char.eleSkill.imgPath}
                        />
                        {/* eslint-disable */}
                        <Typography className={classes.talentFont}>
                          Lv. <span className={classes.lvlNumber}>{char.eleSkill.curLvl}</span> to
                          Lv. <span className={classes.lvlNumber}>{char.eleSkill.reqLvl}</span>
                        </Typography>
                        {/* eslint-enable */}
                      </div>
                    )}
                    {char.eleBurst.curLvl !== char.eleBurst.reqLvl && (
                      <div className={classes.cardTalentLevels}>
                        <CardMedia
                          className={classes.talentImg}
                          component="img"
                          image={char.eleBurst.imgPath}
                        />
                        {/* eslint-disable */}
                        <Typography className={classes.talentFont}>
                          Lv. <span className={classes.lvlNumber}>{char.eleBurst.curLvl}</span> to
                          Lv. <span className={classes.lvlNumber}>{char.eleBurst.reqLvl}</span>
                        </Typography>
                        {/* eslint-enable */}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {char.hidden && <div className={classes.levelOverlay}> </div>}
          </ButtonBase>
        </Card>
        <CharacterModal char={char} modalOpen={modalOpen} onClose={this.handleClose} />
      </>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
CharacterCard.propTypes = {
  char: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  showLevels: PropTypes.bool,
};

CharacterCard.defaultProps = {
  showLevels: false,
};

export default withStyles(styles, { withTheme: true })(CharacterCard);
