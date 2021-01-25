import React, { Component } from 'react';
import { Typography, withStyles, Grid, Card } from '@material-ui/core';
import PropTypes from 'prop-types';

import MaterialCard from './MaterialCard';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  matGroup: {
    margin: theme.spacing(2),
  },
  matList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: theme.spacing(2),
    backgroundColor: '#ebeeff',
  },
});

class Materials extends Component {
  constructor(props) {
    super(props);
    const { mat } = props;
    this.state = {
      mat,
    };
  }

  static getDerivedStateFromProps(props) {
    // Change to only run on props change
    return {
      mat: props.mat,
    };
  }

  render() {
    // eslint-disable-next-line
    const { mat } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid className={classes.matGroup} item>
            <Card className={classes.card}>
              {mat.eleMat && mat.eleMat.length !== 0 && (
                <div>
                  <Typography>Elemental Materials</Typography>
                  <Grid className={classes.matList} container>
                    {mat.eleMat.map((i) => (
                      <Grid item key={i.name}>
                        <MaterialCard curMat={i} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}
            </Card>
          </Grid>
          <Grid className={classes.matGroup} item>
            <Card className={classes.card}>
              {mat.eleCrys && mat.eleCrys.length !== 0 && (
                <div>
                  <Typography>Elemental Crystals</Typography>

                  {mat.eleCrys.map((crys) => (
                    <Grid className={classes.matList} container>
                      {crys.matList.map((i) => (
                        <Grid item key={i.name}>
                          <MaterialCard curMat={i} />
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </div>
              )}
            </Card>
          </Grid>
          <Grid className={classes.matGroup} item>
            {mat.comMat && mat.comMat.length !== 0 && (
              <div>
                <Typography>Common Materials</Typography>

                {mat.comMat.map((com) => (
                  <Grid className={classes.matList} container>
                    {com.matList.map((i) => (
                      <Grid item key={i.name}>
                        <MaterialCard curMat={i} />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </div>
            )}
          </Grid>
          <Grid className={classes.matGroup} item>
            {mat.locSpec && mat.locSpec.length !== 0 && (
              <div>
                <Typography>Local Specialty</Typography>
                <Grid className={classes.matList} container>
                  {mat.locSpec.map((i) => (
                    <Grid item key={i.name}>
                      <MaterialCard curMat={i} />
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </Grid>
          <Grid className={classes.matGroup} item>
            {mat.talentMat && mat.talentMat.length !== 0 && (
              <div>
                <Typography>Talent Books</Typography>
                {mat.talentMat.map((tal) => (
                  <Grid className={classes.matList} container>
                    {tal.matList.map((i) => (
                      <Grid item key={i.name}>
                        <MaterialCard curMat={i} />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </div>
            )}
          </Grid>
          <Grid className={classes.matGroup} item>
            {mat.bossMat && mat.bossMat.length !== 0 && (
              <div>
                <Typography>Boss Materials</Typography>
                <Grid className={classes.matList} container>
                  {mat.bossMat.map((i) => (
                    <Grid item key={i.name}>
                      <MaterialCard curMat={i} />
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </Grid>
          <Grid className={classes.matGroup} item>
            {mat.charExp && mat.charExp.matList.length !== 0 && (
              <div>
                <Typography>Character Exp</Typography>
                <Grid className={classes.matList} container>
                  {mat.charExp.matList.map((i) => (
                    <Grid item key={i.name}>
                      <MaterialCard curMat={i} />
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </Grid>
          <Grid className={classes.matGroup} item>
            {mat.misc && mat.misc[0] && (
              <div>
                <Typography>Mora</Typography>
                <Grid className={classes.matList} container>
                  <Grid item>
                    <MaterialCard curMat={mat.misc[0]} />
                  </Grid>
                </Grid>
              </div>
            )}
          </Grid>
          <Grid className={classes.matGroup} item>
            {mat.misc && mat.misc[1] && (
              <div>
                <Typography>Crown of Insight</Typography>
                <Grid className={classes.matList} container>
                  <Grid item>
                    <MaterialCard curMat={mat.misc[1]} />
                  </Grid>
                </Grid>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Materials.propTypes = {
  mat: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Materials);
