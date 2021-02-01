import {
  GET_ALL_CHAR_REQ,
  GET_CHAR_REQ,
  GET_REQ_ERRORS,
  GET_TALENT_REQ,
  LOADING_REQ,
} from '../actions/types';

const initialState = {
  allCharReq: {
    mat: {},
    loading: false,
  },
  charReq: {
    mat: {},
    loading: false,
  },
  talentReq: {
    mat: {
      total: {},
      autoAttack: {},
      eleSkill: {},
      eleBurst: {},
    },
    loading: false,
  },
  errors: {},
};

const calcReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_REQ:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          loading: true,
        },
      };
    case GET_REQ_ERRORS:
      return {
        ...state,
        [action.payload.req]: {
          ...state[action.payload],
          loading: false,
        },
        errors: {
          ...state.errors,
          [action.payload.req]: action.payload.error,
        },
      };
    case GET_ALL_CHAR_REQ:
      return {
        ...state,
        allCharReq: {
          mat: action.payload,
          loading: false,
        },
      };
    case GET_CHAR_REQ:
      return {
        ...state,
        charReq: {
          mat: action.payload,
          loading: false,
        },
      };
    case GET_TALENT_REQ:
      if (action.payload.type === 'total') {
        return {
          ...state,
          talentReq: {
            mat: {
              ...state.talentReq.mat,
              total: action.payload.req.total,
            },
            loading: false,
          },
        };
      }
      return {
        ...state,
        talentReq: {
          mat: {
            ...state.talentReq,
            autoAttack: action.payload.req.autoAttack,
            eleSkill: action.payload.req.eleSkill,
            eleBurst: action.payload.req.eleBurst,
          },
          loading: false,
        },
      };

    default:
      return state;
  }
};

export default calcReducer;
