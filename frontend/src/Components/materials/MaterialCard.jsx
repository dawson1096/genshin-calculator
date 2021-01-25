import React from 'react';
import { withStyles, Card, Typography, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'grey',
    borderColor: 'black',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  matImg: {
    width: 'auto',
    height: theme.spacing(8),
  },
  imgBack: {
    backgroundColor: 'white',
    height: theme.spacing(10),
    width: theme.spacing(12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqNum: {
    color: 'white',
    fontSize: theme.spacing(2.5),
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function formatNum(reqNum) {
  /* eslint-disable */
  if (reqNum >= 1000 && reqNum < 1000000) {
    const thou = Math.floor(reqNum / 1000);
    const hun = Math.floor((reqNum - thou * 1000) / 100);
    return `${thou}${hun > 0 ? `.${hun}` : ''}k`;
  } else if (reqNum >= 1000000) {
    const mil = Math.floor(reqNum / 1000000);
    const hunthou = Math.floor((reqNum - mil * 1000000) / 100000);
    return `${mil}${hunthou > 0 ? `.${hunthou}` : ''}m`;
  }
  return reqNum;
  /* eslint-enable */
}

function toolTip(curMat) {
  const num = curMat.reqNum.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  return (
    <div style={{ textAlign: 'center' }}>
      <div>{curMat.name}</div>
      {curMat.reqNum >= 1000 && <div>{num}</div>}
    </div>
  );
}

function MaterialCard({ classes, curMat }) {
  return (
    <Tooltip title={toolTip(curMat, classes)} arrow>
      <Card className={classes.root}>
        <div className={classes.imgBack}>
          <img className={classes.matImg} src={curMat.imgPath} alt={curMat.name} />
        </div>
        <Typography className={classes.reqNum}>{formatNum(curMat.reqNum)}</Typography>
      </Card>
    </Tooltip>
  );
}

/* eslint-disable react/forbid-prop-types */
MaterialCard.propTypes = {
  curMat: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MaterialCard);
