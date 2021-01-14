import {
  ADD_CHAR,
  LOAD_USER,
  REMOVE_CHAR,
} from '../actions/types';

const initialState = {
  charList: [],
  weaponList: [],
  materials: {},
  isLoaded: false,
};

const userReducer = (state = initialState, action) => {
  const { charList } = state;

  switch (action.type) {
    case LOAD_USER:
      return {
        charList: action.payload.charList,
        weaponList: action.payload.weaponList,
        materials: action.payload.materials,
        isLoaded: true,
      };
    case ADD_CHAR:
      return {
        ...state,
        charList: [...action.payload, ...state.charList],
      };
    case REMOVE_CHAR:
      for (let i = 0; i < charList.length; i++) {
        if (action.payload === charList[i].name) {
          charList.splice(i, 1);
          break;
        }
      }
      return {
        ...state,
        charList,
      };
    default:
      return state;
  }
};

export default userReducer;
