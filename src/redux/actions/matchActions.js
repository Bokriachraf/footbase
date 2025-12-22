import Axios from "axios";
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
} from "../constants/matchConstants";

const API = process.env.NEXT_PUBLIC_API_URL;

export const createMatch = (matchData, router) => async (dispatch, getState) => {
  const { proprietaireSignin: { proprietaireInfo } } = getState();
  dispatch({ type: MATCH_CREATE_REQUEST });
  try {
    const { data } = await Axios.post(`${API}/api/matchs/create`, matchData, {
      headers: { Authorization: `Bearer ${proprietaireInfo.token}` }
    });
    dispatch({ type: MATCH_CREATE_SUCCESS, payload: data });
    if (router && typeof router.push === "function") router.push("/proprietaire/dashboard");
  } catch (error) {
    dispatch({ type: MATCH_CREATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const listMatches = () => async (dispatch) => {
  dispatch({ type: MATCH_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`${API}/api/matchs`);
    dispatch({ type: MATCH_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MATCH_LIST_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const getMatchDetails = (id) => async (dispatch) => {
  dispatch({ type: MATCH_DETAILS_REQUEST });
  try {
    const { data } = await Axios.get(`${API}/api/matchs/${id}`);
    dispatch({ type: MATCH_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MATCH_DETAILS_FAIL, payload: error.response?.data?.message || error.message });
  }
};



 export const joinMatch = (matchId) => async (dispatch, getState) => {
  const { footballeurSignin: { footballeurInfo } } = getState();
  dispatch({ type: MATCH_JOIN_REQUEST });
  try {
    const { data } = await Axios.post(`${API}/api/participations/join/${matchId}`, {}, {
      headers: { Authorization: `Bearer ${footballeurInfo.token}` }
    });
    dispatch({ type: MATCH_JOIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MATCH_JOIN_FAIL, payload: error.response?.data?.message || error.message });
  }
}

export const listMyMatchs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MATCH_LIST_MY_REQUEST });

    const { proprietaireSignin: { proprietaireInfo } } = getState();

    const { data } = await Axios.get(
      `${API}/api/matchs/mine`,
      {
        headers: {
          Authorization: `Bearer ${proprietaireInfo.token}`,
        },
      }
    );

    dispatch({ type: MATCH_LIST_MY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MATCH_LIST_MY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateMatch = (matchId, updateData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MATCH_UPDATE_REQUEST });
    const {
      proprietaireSignin: { proprietaireInfo },
    } = getState();

    const { data } = await Axios.put(`${API}/api/matchs/${matchId}`, updateData, {
      headers: { Authorization: `Bearer ${proprietaireInfo.token}` },
    });

    dispatch({ type: MATCH_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MATCH_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete match (owner)
export const deleteMatch = (matchId) => async (dispatch, getState) => {
  try {
    dispatch({ type: MATCH_DELETE_REQUEST });
    const {
      proprietaireSignin: { proprietaireInfo },
    } = getState();

    const { data } = await Axios.delete(`${API}/api/matchs/${matchId}`, {
      headers: { Authorization: `Bearer ${proprietaireInfo.token}` },
    });

    dispatch({ type: MATCH_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MATCH_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const joinMatchEquipe = (matchId) => async (dispatch, getState) => {
  try {
    dispatch({ type: MATCH_JOIN_EQUIPE_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const { data } = await Axios.post(
      `${API}/api/matchs/${matchId}/join-equipe`,
      {},
      {
        headers: {
          Authorization: `Bearer ${footballeurInfo.token}`,
        },
      }
    );

    dispatch({
      type: MATCH_JOIN_EQUIPE_SUCCESS,
      payload: data, // { message, equipe }
    });
  } catch (error) {
    dispatch({
      type: MATCH_JOIN_EQUIPE_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        'Erreur rejoindre équipe',
    });
  }
};
