import Axios from "axios";
import {
  TERRAIN_CREATE_REQUEST,
  TERRAIN_CREATE_SUCCESS,
  TERRAIN_CREATE_FAIL,
  TERRAIN_MINE_REQUEST,
  TERRAIN_MINE_SUCCESS,
  TERRAIN_MINE_FAIL
} from "../constants/terrainConstants";

const API = process.env.NEXT_PUBLIC_API_URL;

export const createTerrain = (terrainData) => async (dispatch, getState) => {
  const { proprietaireSignin: { proprietaireInfo } } = getState();
  dispatch({ type: TERRAIN_CREATE_REQUEST });
  try {
    const { data } = await Axios.post(`${API}/api/terrains`, terrainData, {
      headers: { Authorization: `Bearer ${proprietaireInfo.token}` }
    });
    dispatch({ type: TERRAIN_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TERRAIN_CREATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const listMyTerrains = () => async (dispatch, getState) => {
  const { proprietaireSignin: { proprietaireInfo } } = getState();
  dispatch({ type: TERRAIN_MINE_REQUEST });
  try {
    const { data } = await Axios.get(`${API}/api/terrains/mine`, {
      headers: { Authorization: `Bearer ${proprietaireInfo.token}` }
    });
    dispatch({ type: TERRAIN_MINE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TERRAIN_MINE_FAIL, payload: error.response?.data?.message || error.message });
  }
};
