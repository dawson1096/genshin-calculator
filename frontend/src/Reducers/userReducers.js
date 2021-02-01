import { GET_USER_ERRORS, LOADING_USER, LOAD_USER, UPDATE_CHARLIST } from '../actions/types';

const initialState = {
  charList: [],
  weaponList: [],
  materials: {},
  errors: {},
  loading: false,
  loadingChar: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.error,
        },
      };
    case LOADING_USER:
      return {
        ...state,
        [action.payload]: true,
      };
    case LOAD_USER:
      /* eslint-disable */
      const loadCharList = action.payload.charList.sort((a, b) => (a.name > b.name ? 1 : -1));
      const loadWeaponList = action.payload.weaponList.sort((a, b) => (a.name > b.name ? 1 : -1));
      return {
        charList: loadCharList,
        weaponList: loadWeaponList,
        materials: action.payload.materials,
        loading: false,
      };
    case UPDATE_CHARLIST:
      return {
        ...state,
        charList: action.payload,
        loadingChar: false,
      };
    default:
      return state;
  }
};

export default userReducer;
