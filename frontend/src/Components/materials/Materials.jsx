import React from 'react';
import { Typography, Grid, CircularProgress, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

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
    margin: theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebeeff',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(2),
  },
  matGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
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
          {mat.arrMat &&
            mat.arrMat.length !== 0 &&
            mat.arrMat.map((i) => (
              <Grid item key={i.name}>
                <MaterialCard curMat={i} />
              </Grid>
            ))}
          {/* {mat.eleMat &&
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
          {mat.weaponMat &&
            mat.weaponMat.length !== 0 &&
            mat.weaponMat.map((wMat) =>
              wMat.matList.map((i) => (
                <Grid item key={i.name}>
                  <MaterialCard curMat={i} />
                </Grid>
              ))
            )}
          {mat.eliteMat &&
            mat.eliteMat.length !== 0 &&
            mat.eliteMat.map((elite) =>
              elite.eliteMat.map((i) => (
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
          {mat.weaponExp &&
            mat.weaponExp.matList.length !== 0 &&
            mat.weaponExp.matList.map((i) => (
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
          )} */}
        </Grid>
      ) : (
        !isEmpty(mat) && (
          <div className={classes.root}>
            <Grid container spacing={3} direction="column">
              {mat.eleMat && mat.eleMat.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Elemental Materials</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.eleMat.map((i) => (
                        <Grid key={i.name} item>
                          <MaterialCard curMat={i} />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Grid>
              )}
              {mat.weaponMat && mat.weaponMat.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Weapon Materials</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.weaponMat.map((wMat) =>
                        wMat.matList.map((i) => (
                          <Grid item key={i.name}>
                            <MaterialCard curMat={i} />
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </div>
                </Grid>
              )}
              {mat.eliteMat && mat.eliteMat.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Elite Materials</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.eliteMat.map((elite) =>
                        elite.matList.map((i) => (
                          <Grid item key={i.name}>
                            <MaterialCard curMat={i} />
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </div>
                </Grid>
              )}
              {mat.eleCrys && mat.eleCrys.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Elemental Crystals</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.eleCrys.map((crys) =>
                        crys.matList.map((i) => (
                          <Grid item key={i.name}>
                            <MaterialCard curMat={i} />
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </div>
                </Grid>
              )}
              {mat.comMat && mat.comMat.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Common Materials</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.comMat.map((com) =>
                        com.matList.map((i) => (
                          <Grid item key={i.name}>
                            <MaterialCard curMat={i} />
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </div>
                </Grid>
              )}
              {mat.locSpec && mat.locSpec.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Local Specialty</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.locSpec.map((i) => (
                        <Grid item key={i.name}>
                          <MaterialCard curMat={i} />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Grid>
              )}
              {mat.talentMat && mat.talentMat.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Talent Books</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.talentMat.map((tal) =>
                        tal.matList.map((i) => (
                          <Grid item key={i.name}>
                            <MaterialCard curMat={i} />
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </div>
                </Grid>
              )}
              {mat.bossMat && mat.bossMat.length !== 0 && (
                <Grid item xs={12}>
                  <div className={classes.matGroup}>
                    <Typography>Boss Materials</Typography>
                    <Grid className={classes.totalGrid} container>
                      {mat.bossMat.map((i) => (
                        <Grid item key={i.name}>
                          <MaterialCard curMat={i} />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Grid>
              )}
              {/* eslint-disable */}
              {((mat.charExp && mat.charExp.matList.length !== 0) ||
                (mat.weaponExp && mat.weaponExp.matList.length !== 0) ||
                (mat.misc && mat.misc[0]) ||
                (mat.misc && mat.misc[1])) && (
                <Grid item xs={12}>
                  <Grid className={classes.totalGrid} spacing={3} container>
                    {mat.charExp && mat.charExp.matList.length !== 0 && (
                      <Grid className={classes.matGroup} item>
                        <Typography>Character Exp</Typography>
                        <Grid className={classes.totalGrid} container>
                          {mat.charExp.matList.map((i) => (
                            <Grid item key={i.name}>
                              <MaterialCard curMat={i} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                    {mat.weaponExp && mat.weaponExp.matList.length !== 0 && (
                      <Grid className={classes.matGroup} item>
                        <Typography>Weapon Exp</Typography>
                        <Grid className={classes.totalGrid} container>
                          {mat.weaponExp.matList.map((i) => (
                            <Grid item key={i.name}>
                              <MaterialCard curMat={i} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                    {mat.misc && mat.misc[0] && (
                      <Grid className={classes.matGroup} item>
                        <Typography>Mora</Typography>
                        <Grid className={classes.totalGrid} container>
                          <Grid item>
                            <MaterialCard curMat={mat.misc[0]} />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {mat.misc && mat.misc[1] && (
                      <Grid className={classes.matGroup} item>
                        <Typography>Crown of Insight</Typography>
                        <Grid className={classes.totalGrid} container>
                          <Grid item>
                            <MaterialCard curMat={mat.misc[1]} />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </div>
        )
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
