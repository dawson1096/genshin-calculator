import { GET_GEN_ERRORS, LOADING_GEN_DATA, LOAD_GEN_DATA } from '../actions/types';

const initialState = {
  genCharList: [],
  genWeaponList: [],
  genMaterials: {},
  errors: {},
  loading: false,
};

const genReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GEN_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.error,
        },
      };
    case LOADING_GEN_DATA:
      return {
        ...state,
        loading: true,
      };
    case LOAD_GEN_DATA:
      // eslint-disable-next-line
      const loadCharList = action.payload.charList.sort((a, b) => (a.name > b.name ? 1 : -1));
      return {
        genCharList: loadCharList,
        genWeaponList: action.payload.weaponList,
        genMaterials: action.payload.materials,
        loading: false,
      };
    default:
      return state;
  }
};

export default genReducer;
