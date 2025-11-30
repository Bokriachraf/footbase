import {
  PROPRIETAIRE_SIGNIN_REQUEST,
  PROPRIETAIRE_SIGNIN_SUCCESS,
  PROPRIETAIRE_SIGNIN_FAIL,
  PROPRIETAIRE_SIGNOUT,

  PROPRIETAIRE_REGISTER_REQUEST,
  PROPRIETAIRE_REGISTER_SUCCESS,
  PROPRIETAIRE_REGISTER_FAIL,

  PROPRIETAIRE_LIST_REQUEST,
  PROPRIETAIRE_LIST_SUCCESS,
  PROPRIETAIRE_LIST_FAIL,

  PROPRIETAIRE_DELETE_REQUEST,
  PROPRIETAIRE_DELETE_SUCCESS,
  PROPRIETAIRE_DELETE_FAIL,

  PROPRIETAIRE_UPDATE_REQUEST,
  PROPRIETAIRE_UPDATE_SUCCESS,
  PROPRIETAIRE_UPDATE_FAIL,
} from "../constants/proprietaireConstants";

// --- SIGNIN ---
export const proprietaireSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case PROPRIETAIRE_SIGNIN_REQUEST:
      return { loading: true };
    case PROPRIETAIRE_SIGNIN_SUCCESS:
      return { loading: false, proprietaireInfo: action.payload };
    case PROPRIETAIRE_SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    case PROPRIETAIRE_SIGNOUT:
      return {};
    default:
      return state;
  }
};

// --- REGISTER ---
export const proprietaireRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case PROPRIETAIRE_REGISTER_REQUEST:
      return { loading: true };
    case PROPRIETAIRE_REGISTER_SUCCESS:
      return { loading: false, proprietaireInfo: action.payload };
    case PROPRIETAIRE_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- LIST (ADMIN) ---
export const proprietaireListReducer = (state = { proprietaires: [] }, action) => {
  switch (action.type) {
    case PROPRIETAIRE_LIST_REQUEST:
      return { loading: true };
    case PROPRIETAIRE_LIST_SUCCESS:
      return { loading: false, proprietaires: action.payload };
    case PROPRIETAIRE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- DELETE (ADMIN) ---
export const proprietaireDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PROPRIETAIRE_DELETE_REQUEST:
      return { loading: true };
    case PROPRIETAIRE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PROPRIETAIRE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- UPDATE (ADMIN ou profil) ---
export const proprietaireUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PROPRIETAIRE_UPDATE_REQUEST:
      return { loading: true };
    case PROPRIETAIRE_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case PROPRIETAIRE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
