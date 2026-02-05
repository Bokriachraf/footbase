import axios from "axios";
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
    COMPETITION_UPDATE_FAIL,
    COMPETITION_UPDATE_SUCCESS,
    COMPETITION_UPDATE_REQUEST,
    COMPETITION_MINE_REQUEST,
  COMPETITION_MINE_SUCCESS,
  COMPETITION_MINE_FAIL,
} from "../constants/competitionConstants";

const API = process.env.NEXT_PUBLIC_API_URL;

// Liste des compétitions
export const listCompetitions = () => async (dispatch) => {
  try {
    dispatch({ type: COMPETITION_LIST_REQUEST });

    const { data } = await axios.get(`${API}/api/competitions`);

    dispatch({
      type: COMPETITION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMPETITION_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Détails compétition
export const getCompetitionDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: COMPETITION_DETAILS_REQUEST });

    const { data } = await axios.get(`${API}/api/competitions/${id}`);

    dispatch({
      type: COMPETITION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMPETITION_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const registerEquipeCompetition =
  (competitionId, equipeId) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: COMPETITION_REGISTER_REQUEST });

      const {
        footballeurSignin: { footballeurInfo },
      } = getState();

      const { data } = await axios.post(
        `${API}/api/competitions/${competitionId}/register-equipe`,
        { equipeId },
        {
          headers: {
            Authorization: `Bearer ${footballeurInfo.token}`,
          },
        }
      );

      dispatch({
        type: COMPETITION_REGISTER_SUCCESS,
        payload: data.competition,
      });
      return data;
    } catch (error) {
      dispatch({
        type: COMPETITION_REGISTER_FAIL,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Erreur inscription compétition",
      });
    }
  };

export const updateCompetition = (id, data) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPETITION_UPDATE_REQUEST });

    const { proprietaireSignin } = getState();

    if (!proprietaireSignin || !proprietaireSignin.proprietaireInfo) {
      throw new Error("Utilisateur non authentifié");
    }

    const { token } = proprietaireSignin.proprietaireInfo;

    const { data: resData } = await axios.put(
      `${API}/api/competitions/${id}/update`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: COMPETITION_UPDATE_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    dispatch({
      type: COMPETITION_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const listMyCompetitions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPETITION_MINE_REQUEST });

    const { proprietaireSignin } = getState();
    const { token } = proprietaireSignin.proprietaireInfo;

    const { data } = await axios.get(
      `${API}/api/competitions/mine`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: COMPETITION_MINE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMPETITION_MINE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

//   export const updateCompetition = (id, data) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: COMPETITION_UPDATE_REQUEST });

//     const {
//       footballeurSignin: { footballeurInfo },
//     } = getState();

//     const { data: resData } = await axios.put(
//       `/api/competitions/${id}/update`,
//       data,
//       {
//         headers: { Authorization: `Bearer ${footballeurInfo.token}` },
//       }
//     );

//     dispatch({ type: COMPETITION_UPDATE_SUCCESS, payload: resData });
//   } catch (error) {
//     dispatch({
//       type: COMPETITION_UPDATE_FAIL,
//       payload: error.response?.data?.message || error.message,
//     });
//   }
// };
