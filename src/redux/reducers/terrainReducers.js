import {
  TERRAIN_CREATE_REQUEST,
  TERRAIN_CREATE_SUCCESS,
  TERRAIN_CREATE_FAIL,
  TERRAIN_MINE_REQUEST,
  TERRAIN_MINE_SUCCESS,
  TERRAIN_MINE_FAIL,
  TERRAIN_LIST_REQUEST,
  TERRAIN_LIST_SUCCESS,
  TERRAIN_LIST_FAIL,
  TERRAIN_DELETE_REQUEST,
  TERRAIN_DELETE_SUCCESS,
  TERRAIN_DELETE_FAIL,
  TERRAIN_UPDATE_REQUEST,
  TERRAIN_UPDATE_SUCCESS,
  TERRAIN_UPDATE_FAIL,
} from "../constants/terrainConstants";

export const terrainCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case TERRAIN_CREATE_REQUEST:
      return { loading: true };
    case TERRAIN_CREATE_SUCCESS:
      return { loading: false, success: true, terrain: action.payload };
    case TERRAIN_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const terrainMineReducer = (state = { terrains: [] }, action) => {
  switch (action.type) {
    case TERRAIN_MINE_REQUEST:
      return { loading: true, terrains: [] };
    case TERRAIN_MINE_SUCCESS:
      return { loading: false, terrains: action.payload };
    case TERRAIN_MINE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const terrainListReducer = (state = { terrains: [] }, action) => {
  switch (action.type) {
    case TERRAIN_LIST_REQUEST:
      return { loading: true };
    case TERRAIN_LIST_SUCCESS:
      return { loading: false, terrains: action.payload };
    case TERRAIN_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- SUPPRESSION ---
export const terrainDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case TERRAIN_DELETE_REQUEST:
      return { loading: true };
    case TERRAIN_DELETE_SUCCESS:
      return { loading: false, success: true };
    case TERRAIN_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- MISE À JOUR ---
export const terrainUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case TERRAIN_UPDATE_REQUEST:
      return { loading: true };
    case TERRAIN_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case TERRAIN_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
