import {
  LOAD_GEN_DATA,
} from '../actions/types';

const initialState = {
  genCharList: [],
  genWeaponList: [],
  genMaterials: {},
  isLoaded: false,
};

const genReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GEN_DATA:
      return {
        genCharList: action.payload.charList,
        genWeaponList: action.payload.weaponList,
        genMaterials: action.payload.materials,
        isLoaded: true,
      };
    default:
      return state;
  }
};

export default genReducer;
