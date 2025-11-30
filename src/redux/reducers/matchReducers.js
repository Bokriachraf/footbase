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
  //  MATCH_RATE_REQUEST,
  // MATCH_RATE_SUCCESS,
  // MATCH_RATE_FAIL,
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

// export const matchRateReducer = (state = {}, action) => {
//   switch (action.type) {
//     case MATCH_RATE_REQUEST:
//       return { loading: true };
//     case MATCH_RATE_SUCCESS:
//       return { loading: false, success: true };
//     case MATCH_RATE_FAIL:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };