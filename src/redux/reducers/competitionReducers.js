import {
  COMPETITION_LIST_REQUEST,
  COMPETITION_LIST_SUCCESS,
  COMPETITION_LIST_FAIL,
  COMPETITION_DETAILS_REQUEST,
  COMPETITION_DETAILS_SUCCESS,
  COMPETITION_DETAILS_FAIL,
   COMPETITION_REGISTER_REQUEST,
  COMPETITION_REGISTER_SUCCESS,
  COMPETITION_REGISTER_FAIL,
  COMPETITION_REGISTER_RESET,
  COMPETITION_UPDATE_FAIL,
  COMPETITION_UPDATE_SUCCESS,
  COMPETITION_UPDATE_REQUEST,
} from "../constants/competitionConstants";

export const competitionListReducer = (
  state = { competitions: [] },
  action
) => {
  switch (action.type) {
    case COMPETITION_LIST_REQUEST:
      return { loading: true, competitions: [] };

    case COMPETITION_LIST_SUCCESS:
      return { loading: false, competitions: action.payload };

    case COMPETITION_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const competitionDetailsReducer = (
  state = { competition: {} },
  action
) => {
  switch (action.type) {
    case COMPETITION_DETAILS_REQUEST:
      return { loading: true, competition: {} };

    case COMPETITION_DETAILS_SUCCESS:
      return { loading: false, competition: action.payload };

    case COMPETITION_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};


export const competitionRegisterReducer = (
  state = {},
  action
) => {
  switch (action.type) {
    case COMPETITION_REGISTER_REQUEST:
      return { loading: true };

    case COMPETITION_REGISTER_SUCCESS:
      return { loading: false, success: true };

    case COMPETITION_REGISTER_FAIL:
      return { loading: false, error: action.payload };

    case COMPETITION_REGISTER_RESET:
      return {};

    default:
      return state;
  }
};

export const competitionUpdateReducer = (
  state = {},
  action
) => {
  switch (action.type) {
    case COMPETITION_UPDATE_REQUEST:
      return { loading: true };
    case COMPETITION_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case COMPETITION_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
