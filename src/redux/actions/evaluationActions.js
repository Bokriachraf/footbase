import axios from "axios";
import {
  EVALUATION_CREATE_REQUEST,
  EVALUATION_CREATE_SUCCESS,
  EVALUATION_CREATE_FAIL,
} from "../constants/evaluationConstants";

const API = process.env.NEXT_PUBLIC_API_URL;

export const createEvaluation = (matchId, playerId, note, commentaire) => async (dispatch, getState) => {
  try {
    dispatch({ type: EVALUATION_CREATE_REQUEST });
    const { footballeurSignin: { footballeurInfo } } = getState();

    const { data } = await axios.post(
      `${API}/api/evaluations/${matchId}/${playerId}`,
      { note, commentaire },
      { headers: { Authorization: `Bearer ${footballeurInfo.token}` } }
    );

    dispatch({ type: EVALUATION_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EVALUATION_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


