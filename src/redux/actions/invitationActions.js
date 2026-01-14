import Axios from "axios";
import {
  INVITATION_SEND_REQUEST,
  INVITATION_SEND_SUCCESS,
  INVITATION_SEND_FAIL,
  INVITATION_LIST_MY_REQUEST,
  INVITATION_LIST_MY_SUCCESS,
  INVITATION_LIST_MY_FAIL,
} from "../constants/invitationConstants";

const API = process.env.NEXT_PUBLIC_API_URL;

export const sendInvitation =
  ({ equipeId, playerId, matchId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: INVITATION_SEND_REQUEST });

      const {
        footballeurSignin: { footballeurInfo },
      } = getState();

      const { data } = await Axios.post(
        `${API}/api/invitations`,
        { equipeId, playerId, matchId },
        {
          headers: {
            Authorization: `Bearer ${footballeurInfo.token}`,
          },
        }
      );

      dispatch({
        type: INVITATION_SEND_SUCCESS,
        payload: data,
      });
      alert('Invitation envoyée');
    } catch (error) {
      dispatch({
        type: INVITATION_SEND_FAIL,
        payload:
          error.response?.data?.message || error.message,
      });
    }
  };


  export const listMyInvitations = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INVITATION_LIST_MY_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const { data } = await Axios.get(
      `${API}/api/invitations/mine`,
      {
        headers: {
          Authorization: `Bearer ${footballeurInfo.token}`,
        },
      }
    );

    dispatch({
      type: INVITATION_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVITATION_LIST_MY_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};