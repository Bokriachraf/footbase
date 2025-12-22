import {
  EQUIPE_ADD_PLAYER_REQUEST,
  EQUIPE_ADD_PLAYER_SUCCESS,
  EQUIPE_ADD_PLAYER_FAIL,
  EQUIPE_REMOVE_PLAYER_REQUEST,
  EQUIPE_REMOVE_PLAYER_SUCCESS,
  EQUIPE_REMOVE_PLAYER_FAIL,
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
