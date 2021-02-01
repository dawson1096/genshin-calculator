import React from 'react';
import { Typography, Grid, Card, CircularProgress, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import MaterialCard from './MaterialCard';

const useStyles = makeStyles((theme) => ({
  totalGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(4),
  },
}));

function Materials({ total, mat, loading }) {
  const classes = useStyles();
  if (loading) {
    return (
      <div className={classes.spinner}>
        <CircularProgress size={40} />
      </div>
    );
  }
  return (
    <>
      {total ? (
        <Grid className={classes.totalGrid} container>
          {mat.eleMat &&
            mat.eleMat.length !== 0 &&
            mat.eleMat.map((i) => (
              <Grid item key={i.name}>
                <MaterialCard curMat={i} />
              </Grid>
            ))}
          {mat.eleCrys &&
            mat.eleCrys.length !== 0 &&
            mat.eleCrys.map((crys) =>
              crys.matList.map((i) => (
                <Grid item key={i.name}>
                  <MaterialCard curMat={i} />
                </Grid>
              ))
            )}
          {mat.comMat &&
            mat.comMat.length !== 0 &&
            mat.comMat.map((com) =>
              com.matList.map((i) => (
                <Grid item key={i.name}>
                  <MaterialCard curMat={i} />
                </Grid>
              ))
            )}
          {mat.locSpec &&
            mat.locSpec.length !== 0 &&
            mat.locSpec.map((i) => (
              <Grid item key={i.name}>
                <MaterialCard curMat={i} />
              </Grid>
            ))}
          {mat.talentMat &&
            mat.talentMat.length !== 0 &&
            mat.talentMat.map((tal) =>
              tal.matList.map((i) => (
                <Grid item key={i.name}>
                  <MaterialCard curMat={i} />
                </Grid>
              ))
            )}
          {mat.bossMat &&
            mat.bossMat.length !== 0 &&
            mat.bossMat.map((i) => (
              <Grid item key={i.name}>
                <MaterialCard curMat={i} />
              </Grid>
            ))}
          {mat.charExp &&
            mat.charExp.matList.length !== 0 &&
            mat.charExp.matList.map((i) => (
              <Grid item key={i.name}>
                <MaterialCard curMat={i} />
              </Grid>
            ))}
          {mat.misc && mat.misc[1] && (
            <Grid item>
              <MaterialCard curMat={mat.misc[1]} />
            </Grid>
          )}
          {mat.misc && mat.misc[0] && (
            <Grid item>
              <MaterialCard curMat={mat.misc[0]} />
            </Grid>
          )}
        </Grid>
      ) : (
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              {mat.eleMat && mat.eleMat.length !== 0 && (
                <Card className={classes.card}>
                  <Typography>Elemental Materials</Typography>
                  <Grid className={classes.matList} container>
                    {mat.eleMat.map((i) => (
                      <Grid item key={i.name}>
                        <MaterialCard curMat={i} />
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              )}
            </Grid>
            <Grid item xs={6}>
              {mat.eleCrys && mat.eleCrys.length !== 0 && (
                <Card className={classes.card}>
                  <Typography>Elemental Crystals</Typography>
                  {mat.eleCrys.map((crys) => (
                    <Grid key={crys.name} className={classes.matList} container>
                      {crys.matList.map((i) => (
                        <Grid item key={i.name}>
                          <MaterialCard curMat={i} />
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </Card>
              )}
            </Grid>
            <Grid item xs={6}>
              {mat.comMat && mat.comMat.length !== 0 && (
                <div>
                  <Typography>Common Materials</Typography>

                  {mat.comMat.map((com) => (
                    <Grid key={com.name} className={classes.matList} container>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              {mat.talentMat && mat.talentMat.length !== 0 && (
                <div>
                  <Typography>Talent Books</Typography>
                  {mat.talentMat.map((tal) => (
                    <Grid key={tal.name} className={classes.matList} container>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
        </div>
      )}
    </>
  );
}

/* eslint-disable react/forbid-prop-types */
Materials.propTypes = {
  mat: PropTypes.object,
  total: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
};

Materials.defaultProps = {
  total: false,
  mat: {},
};

export default Materials;
