import { ADD_CHAR, EDIT_LEVELS, LOAD_USER, REMOVE_CHAR } from '../actions/types';

const initialState = {
  charList: [],
  weaponList: [],
  materials: {},
  isLoaded: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USER:
      /* eslint-disable */
      const loadCharList = action.payload.charList.sort((a, b) => (a.name > b.name ? 1 : -1));
      const loadWeaponList = action.payload.weaponList.sort((a, b) => (a.name > b.name ? 1 : -1));
      return {
        charList: loadCharList,
        weaponList: loadWeaponList,
        materials: action.payload.materials,
        isLoaded: true,
      };
    case ADD_CHAR:
      return {
        ...state,
        charList: action.payload,
      };
    case REMOVE_CHAR:
      return {
        ...state,
        charList: action.payload,
      };
    case EDIT_LEVELS:
      return {
        ...state,
        charList: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
