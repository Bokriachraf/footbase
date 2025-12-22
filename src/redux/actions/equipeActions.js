import axios from 'axios';
import {
  EQUIPE_ADD_PLAYER_REQUEST,
  EQUIPE_ADD_PLAYER_SUCCESS,
  EQUIPE_ADD_PLAYER_FAIL,
} from '../constants/equipeConstants';

const API = process.env.NEXT_PUBLIC_API_URL;


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
