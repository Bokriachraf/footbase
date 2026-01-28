import axios from 'axios';
import {
  EQUIPE_ADD_PLAYER_REQUEST,
  EQUIPE_ADD_PLAYER_SUCCESS,
  EQUIPE_ADD_PLAYER_FAIL,
   EQUIPE_CREATE_REQUEST,
  EQUIPE_CREATE_SUCCESS,
  EQUIPE_CREATE_FAIL,
   EQUIPE_MINE_REQUEST,
  EQUIPE_MINE_SUCCESS,
  EQUIPE_MINE_FAIL,
  EQUIPE_DETAILS_REQUEST,
  EQUIPE_DETAILS_SUCCESS,
  EQUIPE_DETAILS_FAIL,
} from '../constants/equipeConstants';

const API = process.env.NEXT_PUBLIC_API_URL;

export const createEquipe =
  ({ nom, matchId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: EQUIPE_CREATE_REQUEST });

      const {
        footballeurSignin: { footballeurInfo },
      } = getState();

      const { data } = await axios.post(
        `${API}/api/equipes`,
        { nom, matchId },
        {
          headers: {
            Authorization: `Bearer ${footballeurInfo.token}`,
          },
        }
      );

      dispatch({
        type: EQUIPE_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EQUIPE_CREATE_FAIL,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Erreur création équipe",
      });
    }
  };

export const addPlayerToEquipe =
  (equipeId, playerId) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: EQUIPE_ADD_PLAYER_REQUEST });

      const {
        footballeurSignin: { footballeurInfo },
      } = getState();

      const { data } = await axios.post(
        `${API}/api/equipes/${equipeId}/add-player`,
        { playerId },
        {
          headers: {
            Authorization: `Bearer ${footballeurInfo.token}`,
          },
        }
      );

      dispatch({
        type: EQUIPE_ADD_PLAYER_SUCCESS,
        payload: data.equipe,
      });
    } catch (error) {
      dispatch({
        type: EQUIPE_ADD_PLAYER_FAIL,
        payload:
          error.response?.data?.message ||
          error.message ||
          'Erreur ajout joueur',
      });
    }
  };

// actions/equipeActions.js
export const getEquipeDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: EQUIPE_DETAILS_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const { data } = await axios.get(`${API}/api/equipes/${id}`, {
      headers: {
        Authorization: `Bearer ${footballeurInfo.token}`,
      },
    });

    dispatch({
      type: EQUIPE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EQUIPE_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

  export const removePlayerFromEquipe =
  (equipeId, playerId) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: EQUIPE_REMOVE_PLAYER_REQUEST });

      const { footballeurSignin } = getState();

      const { data } = await axios.delete(
        `${API}/api/equipes/${equipeId}/remove-player`,
        {
          data: { playerId },
          headers: {
            Authorization: `Bearer ${footballeurSignin.footballeurInfo.token}`,
          },
        }
      );

      dispatch({
        type: EQUIPE_REMOVE_PLAYER_SUCCESS,
        payload: data.equipe,
      });
    } catch (error) {
      dispatch({
        type: EQUIPE_REMOVE_PLAYER_FAIL,
        payload:
          error.response?.data?.message || error.message,
      });
    }
  };

  export const getMyCaptainEquipes = () => async (dispatch, getState) => {
  dispatch({ type: 'EQUIPE_CAPITAINE_REQUEST' });

  const {
    footballeurSignin: { footballeurInfo },
  } = getState();

  const { data } = await axios.get(`${API}/api/equipes/mine/capitaine`, {
    headers: {
      Authorization: `Bearer ${footballeurInfo.token}`,
    },
  });

  dispatch({
    type: 'EQUIPE_CAPITAINE_SUCCESS',
    payload: data,
  });
};

export const createFreeEquipe = (nom) => async (dispatch, getState) => {
  try {
    dispatch({ type: EQUIPE_CREATE_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const { data } = await axios.post(
      `${API}/api/equipes/free`,
      { nom },
      {
        headers: {
          Authorization: `Bearer ${footballeurInfo.token}`,
        },
      }
    );

    dispatch({
      type: EQUIPE_CREATE_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: EQUIPE_CREATE_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

export const listMyEquipes = () => async (dispatch, getState) => {
  try {
    dispatch({ type: EQUIPE_MINE_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const { data } = await axios.get(`${API}/api/equipes/mine`, {
      headers: {
        Authorization: `Bearer ${footballeurInfo.token}`,
      },
    });

    dispatch({
      type: EQUIPE_MINE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EQUIPE_MINE_FAIL,
      payload: error.message,
    });
  }
};