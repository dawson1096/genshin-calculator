import axios from 'axios';
import { LOAD_USER, ADD_CHAR, REMOVE_CHAR, EDIT_LEVELS } from './types';

export const loadUser = () => (dispatch) => {
  axios
    .get('/api/user')
    .then((res) => {
      dispatch({
        type: LOAD_USER,
        payload: res.data.userData,
      });
    })
    .catch((err) => {
      // eslint-disable-next-line
      console.log(err);
    });
};

export const addChar = (addList) => (dispatch, getState) => {
  const { userData } = getState();
  userData.charList = [...addList, ...userData.charList];
  userData.charList.sort((a, b) => (a.name > b.name ? 1 : -1));
  const sendData = {
    charList: userData.charList,
    weaponList: userData.weaponList,
    materials: userData.materials,
  };
  axios
    .post('/api/user', sendData)
    .then(() => {
      dispatch({
        type: ADD_CHAR,
        payload: userData.charList,
      });
    })
    .catch(() => {
      dispatch({
        type: ADD_CHAR,
        payload: userData.charList,
      });
    });
};

export const removeChar = (name) => (dispatch, getState) => {
  const { userData } = getState();
  for (let i = 0; i < userData.charList.length; i++) {
    if (name === userData.charList[i].name) {
      userData.charList.splice(i, 1);
      break;
    }
  }
  const sendData = {
    charList: userData.charList,
    weaponList: userData.weaponList,
    materials: userData.materials,
  };
  axios
    .post('/api/user', sendData)
    .then(() => {
      dispatch({
        type: REMOVE_CHAR,
        payload: userData.charList,
      });
    })
    .catch(() => {
      dispatch({
        type: REMOVE_CHAR,
        payload: userData.charList,
      });
    });
};

export const editLvl = (charLevels) => (dispatch, getState) => {
  const { userData } = getState();
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
  const sendData = {
    charList: userData.charList,
    weaponList: userData.weaponList,
    materials: userData.materials,
  };
  axios
    .post('/api/user', sendData)
    .then(() => {
      dispatch({
        type: EDIT_LEVELS,
        payload: userData.charList,
      });
    })
    .catch(() => {
      dispatch({
        type: EDIT_LEVELS,
        payload: userData.charList,
      });
    });
};
