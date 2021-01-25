import axios from 'axios';
import { GET_ALL_CHAR_REQ } from './types';

export const getAllCharReq = () => (dispatch, getState) => {
  const { userData } = getState();
  const data = {
    charList: userData.charList,
    materials: userData.materials,
  };
  axios.post('/api/character', data).then((res) => {
    dispatch({
      type: GET_ALL_CHAR_REQ,
      payload: res.data,
    });
  });
};

export const test = 5;
