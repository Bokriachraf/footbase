import {
  EQUIPE_ADD_PLAYER_REQUEST,
  EQUIPE_ADD_PLAYER_SUCCESS,
  EQUIPE_ADD_PLAYER_FAIL,
  EQUIPE_REMOVE_PLAYER_REQUEST,
  EQUIPE_REMOVE_PLAYER_SUCCESS,
  EQUIPE_REMOVE_PLAYER_FAIL,
   EQUIPE_CREATE_REQUEST,
  EQUIPE_CREATE_SUCCESS,
  EQUIPE_CREATE_FAIL,
  EQUIPE_CREATE_RESET,
    EQUIPE_MINE_REQUEST,
  EQUIPE_MINE_SUCCESS,
  EQUIPE_MINE_FAIL,
  EQUIPE_DETAILS_REQUEST,
  EQUIPE_DETAILS_SUCCESS,
  EQUIPE_DETAILS_FAIL,
} from '../constants/equipeConstants';



export const equipeReducer = (state = { equipe: null }, action) => {
  switch (action.type) {
    case EQUIPE_ADD_PLAYER_REQUEST:
    case EQUIPE_REMOVE_PLAYER_REQUEST:
      return { ...state, loading: true };

    case EQUIPE_ADD_PLAYER_SUCCESS:
    case EQUIPE_REMOVE_PLAYER_SUCCESS:
      return {
        loading: false,
        equipe: action.payload,
      };

    case EQUIPE_ADD_PLAYER_FAIL:
    case EQUIPE_REMOVE_PLAYER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const myCaptainEquipesReducer = (
  state = { equipes: [] },
  action
) => {
  switch (action.type) {
    case 'EQUIPE_CAPITAINE_REQUEST':
      return { loading: true, equipes: [] };

    case 'EQUIPE_CAPITAINE_SUCCESS':
      return {
        loading: false,
        equipes: action.payload,
      };

    case 'EQUIPE_CAPITAINE_FAIL':
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const equipeCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case EQUIPE_CREATE_REQUEST:
      return { loading: true };
    case EQUIPE_CREATE_SUCCESS:
      return { loading: false, equipe: action.payload };
    case EQUIPE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case EQUIPE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// reducers/equipeReducers.js
export const equipeDetailsReducer = (
  state = { equipe: { joueurs: [] } },
  action
) => {
  switch (action.type) {
    case EQUIPE_DETAILS_REQUEST:
      return { loading: true };
    case EQUIPE_DETAILS_SUCCESS:
      return { loading: false, equipe: action.payload };
    case EQUIPE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const equipeMineReducer = (state = { equipes: [] }, action) => {
  switch (action.type) {
    case EQUIPE_MINE_REQUEST:
      return { loading: true, equipes: [] };
    case EQUIPE_MINE_SUCCESS:
      return { loading: false, equipes: action.payload };
    case EQUIPE_MINE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};