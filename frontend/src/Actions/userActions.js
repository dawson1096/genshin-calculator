import axios from 'axios';
import { GET_USER_ERRORS, LOADING_USER, LOAD_USER, UPDATE_CHARLIST } from './types';

export const loadUser = () => (dispatch, getState) => {
  dispatch({
    type: LOADING_USER,
  });

  const {
    auth: { isAuthenticated },
  } = getState();

  if (isAuthenticated) {
    axios
      .get('/api/user')
      .then((res) =>
        dispatch({
          type: LOAD_USER,
          payload: res.data.userData,
        })
      )
      .catch((err) => {
        dispatch({
          type: GET_USER_ERRORS,
          payload: {
            field: 'user',
            error: err,
          },
        });
      });
  }
};

export const addChar = (addList) => (dispatch, getState) => {
  dispatch({
    type: LOADING_USER,
  });

  const {
    userData,
    auth: { isAuthenticated },
  } = getState();
  userData.charList = [...addList, ...userData.charList];
  userData.charList.sort((a, b) => (a.name > b.name ? 1 : -1));

  if (isAuthenticated) {
    const sendData = {
      charList: userData.charList,
      weaponList: userData.weaponList,
      materials: userData.materials,
    };
    axios
      .post('/api/user', sendData)
      .then(() =>
        dispatch({
          type: UPDATE_CHARLIST,
          payload: userData.charList,
        })
      )
      .catch((err) => {
        dispatch({
          type: GET_USER_ERRORS,
          payload: {
            field: 'charList',
            error: err,
          },
        });
      });
  } else {
    dispatch({
      type: UPDATE_CHARLIST,
      payload: userData.charList,
    });
  }
};

export const removeChar = (name) => (dispatch, getState) => {
  dispatch({
    type: LOADING_USER,
  });

  const {
    userData,
    auth: { isAuthenticated },
  } = getState();
  for (let i = 0; i < userData.charList.length; i++) {
    if (name === userData.charList[i].name) {
      userData.charList.splice(i, 1);
      break;
    }
  }

  if (isAuthenticated) {
    const sendData = {
      charList: userData.charList,
      weaponList: userData.weaponList,
      materials: userData.materials,
    };
    axios
      .post('/api/user', sendData)
      .then(() =>
        dispatch({
          type: UPDATE_CHARLIST,
          payload: userData.charList,
        })
      )
      .catch((err) => {
        dispatch({
          type: GET_USER_ERRORS,
          payload: {
            field: 'charList',
            error: err,
          },
        });
      });
  } else {
    dispatch({
      type: UPDATE_CHARLIST,
      payload: userData.charList,
    });
  }
};

export const toggleBool = (name, field) => (dispatch, getState) => {
  dispatch({
    type: LOADING_USER,
    payload: 'loadingChar',
  });

  const {
    userData,
    auth: { isAuthenticated },
  } = getState();
  for (let i = 0; i < userData.charList.length; i++) {
    if (name === userData.charList[i].name) {
      userData.charList[i][field] = !userData.charList[i][field];
    }
  }

  if (isAuthenticated) {
    const sendData = {
      charList: userData.charList,
      weaponList: userData.weaponList,
      materials: userData.materials,
    };

    axios
      .post('/api/user', sendData)
      .then(() =>
        dispatch({
          type: UPDATE_CHARLIST,
          payload: userData.charList,
        })
      )
      .catch((err) => {
        dispatch({
          type: GET_USER_ERRORS,
          payload: {
            field: 'charList',
            error: err,
          },
        });
      });
  } else {
    dispatch({
      type: UPDATE_CHARLIST,
      payload: userData.charList,
    });
  }
};

export const editLvl = (charLevels) => (dispatch, getState) => {
  dispatch({
    type: LOADING_USER,
    payload: 'loadingChar',
  });

  const {
    userData,
    auth: { isAuthenticated },
  } = getState();
  for (let i = 0; i < userData.charList.length; i++) {
    if (charLevels.name === userData.charList[i].name) {
      userData.charList[i].curLvl = charLevels.curLvl;
      userData.charList[i].reqLvl = charLevels.reqLvl;
      userData.charList[i].autoAttack.curLvl = charLevels.autoAttack.curLvl;
      userData.charList[i].autoAttack.reqLvl = charLevels.autoAttack.reqLvl;
      userData.charList[i].eleSkill.curLvl = charLevels.eleSkill.curLvl;
      userData.charList[i].eleSkill.reqLvl = charLevels.eleSkill.reqLvl;
      userData.charList[i].eleBurst.curLvl = charLevels.eleBurst.curLvl;
      userData.charList[i].eleBurst.reqLvl = charLevels.eleBurst.reqLvl;
    }
  }

  if (isAuthenticated) {
    const sendData = {
      charList: userData.charList,
      weaponList: userData.weaponList,
      materials: userData.materials,
    };
    axios
      .post('/api/user', sendData)
      .then(() =>
        dispatch({
          type: UPDATE_CHARLIST,
          payload: userData.charList,
        })
      )
      .catch((err) => {
        dispatch({
          type: GET_USER_ERRORS,
          payload: {
            field: 'charList',
            error: err,
          },
        });
      });
  } else {
    dispatch({
      type: UPDATE_CHARLIST,
      payload: userData.charList,
    });
  }
};
