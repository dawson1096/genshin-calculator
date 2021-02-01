import axios from 'axios';
import {
  GET_ALL_CHAR_REQ,
  GET_CHAR_REQ,
  GET_REQ_ERRORS,
  GET_TALENT_REQ,
  LOADING_REQ,
} from './types';

export const getAllCharReq = () => (dispatch, getState) => {
  dispatch({
    type: LOADING_REQ,
    payload: 'allCharReq',
  });
  const { userData } = getState();
  const data = {
    charList: userData.charList,
    materials: userData.materials,
  };
  axios
    .post('/api/character', data)
    .then((res) => {
      dispatch({
        type: GET_ALL_CHAR_REQ,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_REQ_ERRORS,
        payload: {
          req: 'allCharReq',
          error: err,
        },
      });
    });
};

export const getCharReq = (charLevels) => (dispatch, getState) => {
  dispatch({
    type: LOADING_REQ,
    payload: 'charReq',
  });
  const { userData } = getState();
  const data = {
    char: charLevels,
    materials: userData.materials,
  };
  axios
    .post(`/api/character/${charLevels.name.replace(/ /g, '_')}`, data)
    .then((res) => {
      dispatch({
        type: GET_CHAR_REQ,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_REQ_ERRORS,
        payload: {
          req: 'charReq',
          error: err,
        },
      });
    });
};

export const getTalentReq = (charLevels) => (dispatch, getState) => {
  dispatch({
    type: LOADING_REQ,
    payload: 'talentrReq',
  });
  const { userData } = getState();
  const data = {
    char: charLevels,
    materials: userData.materials,
  };
  axios
    .post(`/api/character/${charLevels.name.replace(/ /g, '_')}/talent`, data)
    .then((res) => {
      const payload = {
        type: res.data.total ? 'total' : 'separatae',
        req: res.data,
      };
      dispatch({
        type: GET_TALENT_REQ,
        payload,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_REQ_ERRORS,
        payload: {
          req: 'talentReq',
          error: err,
        },
      });
    });
};
