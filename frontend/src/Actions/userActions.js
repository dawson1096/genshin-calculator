import axios from 'axios';
import { LOAD_USER, ADD_CHAR, REMOVE_CHAR } from './types';

export const loadUser = () => (dispatch) => {
  axios
    .get('/api/user')
    .then((res) => {
      dispatch({
        type: LOAD_USER,
        payload: res.data.userData,
      });
    })
    .catch(() => {
      const payload = {
        charList: [],
        weaponList: [],
        materials: {},
      };
      dispatch({
        type: LOAD_USER,
        payload,
      });
    });
};

export const addChar = (addList) => (dispatch) => {
  dispatch({
    type: ADD_CHAR,
    payload: addList,
  });
};

export const removeChar = (name) => (dispatch) => {
  dispatch({
    type: REMOVE_CHAR,
    payload: name,
  });
};
