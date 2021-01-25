import { LOAD_GEN_DATA } from '../actions/types';

const initialState = {
  genCharList: [],
  genWeaponList: [],
  genMaterials: {},
  isLoaded: false,
};

const genReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GEN_DATA:
      // eslint-disable-next-line
      const loadCharList = action.payload.charList.sort((a, b) => (a.name > b.name ? 1 : -1));
      return {
        genCharList: loadCharList,
        genWeaponList: action.payload.weaponList,
        genMaterials: action.payload.materials,
        isLoaded: true,
      };
    default:
      return state;
  }
};

export default genReducer;
