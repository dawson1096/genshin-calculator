import { GET_ALL_CHAR_REQ } from '../actions/types';

const initialState = {
  allCharReq: {},
  isLoaded: false,
};

const calcReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CHAR_REQ:
      return {
        ...state,
        allCharReq: action.payload,
        isLoaded: true,
      };
    default:
      return state;
  }
};

export default calcReducer;
