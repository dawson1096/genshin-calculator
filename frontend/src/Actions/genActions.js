import axios from 'axios';
import { GET_GEN_ERRORS, LOADING_GEN_DATA, LOAD_GEN_DATA } from './types';

export const loadGenData = () => (dispatch) => {
  dispatch({
    type: LOADING_GEN_DATA,
  });

  axios
    .get('/api/data')
    .then((res) => {
      dispatch({
        type: LOAD_GEN_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_GEN_ERRORS,
        payload: {
          field: 'all',
          error: err,
        },
      });
    });
};

export const test = 5;
