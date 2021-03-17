import React, { useState, useEffect } from 'react';
import { makeStyles, Container, Typography, Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash.isempty';

import UserMaterialCard from '../materials/UserMaterialCard';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  spinner: {
    height: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: theme.spacing(4),
  },
  matGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  matTitle: {
    fontSize: theme.spacing(5),
    margin: theme.spacing(4),
  },
  totalGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function Dashboard() {
  const classes = useStyles();
  const userMat = useSelector((state) => state.userData.materials);
  const [mat, setMat] = useState(() => ({
    ...userMat,
  }));
  useEffect(() => {
    setMat(userMat);
  }, [userMat]);

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Typography className={classes.title} variant="h4">
          Dashboard
        </Typography>
        {isEmpty(mat) ? (
          <div className={classes.spinner}>
            <CircularProgress size={80} />
          </div>
        ) : (
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Elemental Materials</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.eleMat.map((i) => (
                    <Grid key={i.name} item>
                      <UserMaterialCard
                        curMat={i}
                        matInfo={{
                          matGroup: 'eleMat',
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Weapon Materials</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.weaponMat.map((wMat) =>
                    wMat.matList.map((i) => (
                      <Grid item key={i.name}>
                        <UserMaterialCard
                          curMat={i}
                          matInfo={{
                            matGroup: 'weaponMat',
                            matType: wMat.name,
                          }}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Elite Materials</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.eliteMat.map((elite) =>
                    elite.matList.map((i) => (
                      <Grid item key={i.name}>
                        <UserMaterialCard
                          curMat={i}
                          matInfo={{
                            matGroup: 'eliteMat',
                            matType: elite.name,
                          }}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Elemental Crystals</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.eleCrys.map((crys) =>
                    crys.matList.map((i) => (
                      <Grid item key={i.name}>
                        <UserMaterialCard
                          curMat={i}
                          matInfo={{
                            matGroup: 'eleCrys',
                            matType: crys.name,
                          }}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Common Materials</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.comMat.map((com) =>
                    com.matList.map((i) => (
                      <Grid item key={i.name}>
                        <UserMaterialCard
                          curMat={i}
                          matInfo={{
                            matGroup: 'comMat',
                            matType: com.name,
                          }}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Local Specialty</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.locSpec.map((i) => (
                    <Grid item key={i.name}>
                      <UserMaterialCard
                        curMat={i}
                        matInfo={{
                          matGroup: 'locSpec',
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Talent Books</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.talentMat.map((tal) =>
                    tal.matList.map((i) => (
                      <Grid item key={i.name}>
                        <UserMaterialCard
                          curMat={i}
                          matInfo={{
                            matGroup: 'talentMat',
                            matType: tal.name,
                          }}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.matGroup}>
                <Typography className={classes.matTitle}>Boss Materials</Typography>
                <Grid className={classes.totalGrid} container>
                  {mat.bossMat.map((i) => (
                    <Grid item key={i.name}>
                      <UserMaterialCard
                        curMat={i}
                        matInfo={{
                          matGroup: 'bossMat',
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Grid className={classes.totalGrid} spacing={3} container>
                <Grid className={classes.matGroup} item>
                  <Typography className={classes.matTitle}>Character Exp</Typography>
                  <Grid className={classes.totalGrid} container>
                    {mat.charExp.map((i) => (
                      <Grid item key={i.name}>
                        <UserMaterialCard
                          curMat={i}
                          matInfo={{
                            matGroup: 'charExp',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid className={classes.matGroup} item>
                  <Typography className={classes.matTitle}>Weapon Exp</Typography>
                  <Grid className={classes.totalGrid} container>
                    {mat.weaponExp.map((i) => (
                      <Grid item key={i.name}>
                        <UserMaterialCard
                          curMat={i}
                          matInfo={{
                            matGroup: 'weaponExp',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid className={classes.matGroup} item>
                  <Typography className={classes.matTitle}>Mora</Typography>
                  <Grid className={classes.totalGrid} container>
                    <Grid item>
                      <UserMaterialCard
                        curMat={mat.misc[0]}
                        matInfo={{
                          matGroup: 'misc',
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.matGroup} item>
                  <Typography className={classes.matTitle}>Crown of Insight</Typography>
                  <Grid className={classes.totalGrid} container>
                    <Grid item>
                      <UserMaterialCard
                        curMat={mat.misc[1]}
                        matInfo={{
                          matGroup: 'misc',
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>
    </Container>
  );
}

export default Dashboard;
