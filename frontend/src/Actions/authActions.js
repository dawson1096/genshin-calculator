import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, LOAD_USER, SET_CURRENT_USER, USER_LOADING } from './types';

// Set logged in user
export const setCurrentUser = (decoded) => ({
  type: SET_CURRENT_USER,
  payload: decoded,
});

// User loading
export const setUserLoading = () => ({
  type: USER_LOADING,
});

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Register User
export const registerUser = (user, history) => (dispatch, getState) => {
  const { userData } = getState();
  const sendData = {
    ...user,
    userData: {
      charList: userData.charList,
      weaponList: userData.weaponList,
      materials: userData.materials,
    },
  };

  axios
    .post('/api/register', sendData)
    .then(() => history.push('/login')) // re-direct to login on successful register
    .catch((err) => {
      let payload = err.response.data;
      if (err.response.status === 500) {
        payload = { internalError: 'Could not connect to server' };
      }
      dispatch({
        type: GET_ERRORS,
        payload,
      });
    });
};

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post('/api/login', userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwtDecode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .then(() => axios.get('/api/user'))
    .then((res) => {
      dispatch({
        type: LOAD_USER,
        payload: res.data.userData,
      });
    })
    .catch((err) => {
      let payload = err.response.data;
      if (err.response.status === 500) {
        payload = { internalError: 'Could not connect to server' };
      }
      dispatch({
        type: GET_ERRORS,
        payload,
      });
    });
};
