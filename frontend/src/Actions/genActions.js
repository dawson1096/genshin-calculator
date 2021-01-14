import axios from 'axios';
import {
  GET_ERRORS,
  LOAD_GEN_DATA,
} from './types';

export const loadGenData = () => (dispatch) => {
  axios
    .get('/api/data')
    .then((res) => {
      dispatch({
        type: LOAD_GEN_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      const payload = err.response.data;
      dispatch({
        type: GET_ERRORS,
        payload,
      });
    });
};
