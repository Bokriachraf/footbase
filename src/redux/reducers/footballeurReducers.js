import {
    FOOTBALLEUR_REGISTER_FAIL,
  FOOTBALLEUR_REGISTER_REQUEST,
  FOOTBALLEUR_REGISTER_SUCCESS,
  FOOTBALLEUR_SIGNIN_FAIL,
  FOOTBALLEUR_SIGNIN_REQUEST,
  FOOTBALLEUR_SIGNIN_SUCCESS,
  FOOTBALLEUR_SIGNOUT,
    FOOTBALLEUR_LIST_REQUEST,
  FOOTBALLEUR_LIST_SUCCESS,
  FOOTBALLEUR_LIST_FAIL,
    FOOTBALLEUR_DELETE_REQUEST,
  FOOTBALLEUR_DELETE_SUCCESS,
  FOOTBALLEUR_DELETE_FAIL,
   FOOTBALLEUR_UPDATE_REQUEST,
  FOOTBALLEUR_UPDATE_SUCCESS,
  FOOTBALLEUR_UPDATE_FAIL,
  FOOTBALLEUR_DETAILS_REQUEST,
  FOOTBALLEUR_DETAILS_SUCCESS,
  FOOTBALLEUR_DETAILS_FAIL,
} from '../constants/footballeurConstants';

export const footballeurRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case FOOTBALLEUR_REGISTER_REQUEST:
      return { loading: true };
    case FOOTBALLEUR_REGISTER_SUCCESS:
      return { loading: false, footballeurInfo: action.payload };
    case FOOTBALLEUR_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const footballeurSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case FOOTBALLEUR_SIGNIN_REQUEST:
      return { loading: true };
    case FOOTBALLEUR_SIGNIN_SUCCESS:
      return { loading: false, footballeurInfo: action.payload };
    case FOOTBALLEUR_SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    case FOOTBALLEUR_SIGNOUT:
      return {};
    default:
      return state;
  }
};

export const footballeurListReducer = (state = { footballeurs: [] }, action) => {
  switch (action.type) {
    case FOOTBALLEUR_LIST_REQUEST:
      return { loading: true }
    case FOOTBALLEUR_LIST_SUCCESS:
      return { loading: false, footballeurs: action.payload }
    case FOOTBALLEUR_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
export const footballeurDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case FOOTBALLEUR_DELETE_REQUEST:
      return { loading: true }
    case FOOTBALLEUR_DELETE_SUCCESS:
      return { loading: false, success: true }
    case FOOTBALLEUR_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}



export const footballeurUpdateReducer = (state = { footballeurInfo: {} }, action) => {
  switch (action.type) {
    case FOOTBALLEUR_UPDATE_REQUEST:
      return { ...state, loading: true };

    case FOOTBALLEUR_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        footballeurInfo: {
          ...state.footballeurInfo, // garde les anciennes infos
          ...action.payload, // fusionne avec les nouvelles
        },
      };

    case FOOTBALLEUR_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const footballeurDetailsReducer = (state = { footballeur: {} }, action) => {
  switch (action.type) {
    case FOOTBALLEUR_DETAILS_REQUEST:
      return { loading: true, ...state };
    case FOOTBALLEUR_DETAILS_SUCCESS:
      return { loading: false, footballeur: action.payload };
    case FOOTBALLEUR_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
