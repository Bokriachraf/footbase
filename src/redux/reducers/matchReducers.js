import {
  MATCH_CREATE_REQUEST,
  MATCH_CREATE_SUCCESS,
  MATCH_CREATE_FAIL,
  MATCH_LIST_REQUEST,
  MATCH_LIST_SUCCESS,
  MATCH_LIST_FAIL,
  MATCH_DETAILS_REQUEST,
  MATCH_DETAILS_SUCCESS,
  MATCH_DETAILS_FAIL,
  MATCH_JOIN_REQUEST,
  MATCH_JOIN_SUCCESS,
  MATCH_JOIN_FAIL,
  MATCH_LIST_MY_REQUEST,
  MATCH_LIST_MY_SUCCESS,
  MATCH_LIST_MY_FAIL,
   MATCH_UPDATE_REQUEST,
  MATCH_UPDATE_SUCCESS,
  MATCH_UPDATE_FAIL,
  MATCH_DELETE_REQUEST,
  MATCH_DELETE_SUCCESS,
  MATCH_DELETE_FAIL,
  MATCH_JOIN_EQUIPE_REQUEST,
  MATCH_JOIN_EQUIPE_SUCCESS,
  MATCH_JOIN_EQUIPE_FAIL,
  MATCH_ADD_SCORE_REQUEST,
  MATCH_ADD_SCORE_SUCCESS,
  MATCH_ADD_SCORE_FAIL,
} from "../constants/matchConstants";

export const matchCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case MATCH_CREATE_REQUEST:
      return { loading: true };
    case MATCH_CREATE_SUCCESS:
      return { loading: false, success: true, match: action.payload };
    case MATCH_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const matchListReducer = (state = { matchs: [] }, action) => {
  switch (action.type) {
    case MATCH_LIST_REQUEST:
      return { loading: true, matchs: [] };
    case MATCH_LIST_SUCCESS:
      return { loading: false, matchs: action.payload };
    case MATCH_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const matchDetailsReducer = (state = { match: {} }, action) => {
  switch (action.type) {
    case MATCH_DETAILS_REQUEST:
      return { ...state, loading: true };
    case MATCH_DETAILS_SUCCESS:
      return { loading: false, match: action.payload };
    case MATCH_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const matchJoinReducer = (state = {}, action) => {
  switch (action.type) {
    case MATCH_JOIN_REQUEST:
      return { loading: true };
    case MATCH_JOIN_SUCCESS:
      return { loading: false, success: true, joinedMatch: action.payload };
    case MATCH_JOIN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const matchListMyReducer = (state = { matchs: [] }, action) => {
  switch (action.type) {
    case MATCH_LIST_MY_REQUEST:
      return { loading: true };

    case MATCH_LIST_MY_SUCCESS:
      return { loading: false, matchs: action.payload };

    case MATCH_LIST_MY_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};


 


export const matchUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case MATCH_UPDATE_REQUEST:
      return { loading: true };
    case MATCH_UPDATE_SUCCESS:
      return { loading: false, success: true, match: action.payload };
    case MATCH_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const matchDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case MATCH_DELETE_REQUEST:
      return { loading: true };
    case MATCH_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case MATCH_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const matchJoinEquipeReducer = (state = {}, action) => {
  switch (action.type) {
    case MATCH_JOIN_EQUIPE_REQUEST:
      return { loading: true };

    case MATCH_JOIN_EQUIPE_SUCCESS:
      return { loading: false, success: true, data: action.payload };

    case MATCH_JOIN_EQUIPE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};


export const matchAddScoreReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case MATCH_ADD_SCORE_REQUEST:
      return { loading: true };

    case MATCH_ADD_SCORE_SUCCESS:
      return {
        loading: false,
        success: true,
        match: action.payload,
      };

    case MATCH_ADD_SCORE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
