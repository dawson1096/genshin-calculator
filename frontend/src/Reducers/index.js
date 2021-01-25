import { combineReducers } from 'redux';
import authReducer from './authReducers';
import calcReducer from './calcReducers';
import errorReducer from './errorReducers';
import genReducer from './genReducers';
import userReducer from './userReducers';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  userData: userReducer,
  genData: genReducer,
  reqMat: calcReducer,
});
