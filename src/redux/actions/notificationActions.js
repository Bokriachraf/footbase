// src/redux/actions/notificationActions.js
import Axios from "axios";
import {
  NOTIFICATION_ADD,
  NOTIFICATION_CLEAR,
  NOTIFICATION_RESET,
  NOTIFICATION_LOAD_SUCCESS,
  NOTIFICATION_LOAD_FAIL,
  NOTIFICATION_MARK_READ,
} from "../constants/notificationConstants";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ajouter en local (socket)
export const addNotification = (notification) => (dispatch) => {
  dispatch({ type: NOTIFICATION_ADD, payload: notification });
};

// charger les notifications depuis la DB (utilisateur connecté)
export const loadNotifications = () => async (dispatch, getState) => {
  try {
    const {
      footballeurSignin: { footballeurInfo },
      proprietaireSignin: { proprietaireInfo },
    } = getState();

    const user = footballeurInfo || proprietaireInfo;
    if (!user || !user.token) {
      return;
    }

    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const { data } = await Axios.get(`${API}/api/notifications/mine`, config);
    dispatch({ type: NOTIFICATION_LOAD_SUCCESS, payload: data });
  } catch (err) {
    console.error("Erreur load notifications:", err);
    dispatch({ type: NOTIFICATION_LOAD_FAIL, payload: err.message });
  }
};

// mark read (optimistic update)
export const markNotificationRead = (notificationId) => async (dispatch, getState) => {
  // Optimistic UI: mark locally first
  dispatch({ type: NOTIFICATION_MARK_READ, payload: notificationId });

  try {
    const {
      footballeurSignin: { footballeurInfo },
      proprietaireSignin: { proprietaireInfo },
    } = getState();

    const user = footballeurInfo || proprietaireInfo;
    if (!user || !user.token) {
      return;
    }

    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    await Axios.patch(`${API}/api/notifications/read/${notificationId}`, {}, config);
    // server returns updated notification if needed; we already updated state
  } catch (err) {
    console.error("Erreur markNotificationRead:", err);
    // Option: rollback if required (not implemented)
  }
};

export const clearNotification = (notificationId) => (dispatch) => {
  dispatch({ type: NOTIFICATION_CLEAR, payload: notificationId });
};

export const resetNotifications = () => (dispatch) => {
  dispatch({ type: NOTIFICATION_RESET });
};



// import { NOTIFICATION_ADD, NOTIFICATION_CLEAR, 
//   NOTIFICATION_RESET, NOTIFICATION_MARK_READ,
// NOTIFICATION_LOAD_SUCCESS, } from "../constants/notificationConstants";
// import Axios from "axios";


// const API = process.env.NEXT_PUBLIC_API_URL;
// export const addNotification = (notification) => (dispatch) => {
//   dispatch({
//     type: NOTIFICATION_ADD,
//     payload: notification,  // { message, fromUserId, matchId }
//   });
// };

// export const clearNotification = (notificationId) => (dispatch) => {
//   dispatch({
//     type: NOTIFICATION_CLEAR,
//     payload: notificationId,
//   });
// };

// export const resetNotifications = () => (dispatch) => {
//   dispatch({ type: NOTIFICATION_RESET });
// };


// export const markNotificationRead = (notificationId) => (dispatch) => {
//   dispatch({
//     type: NOTIFICATION_MARK_READ,
//     payload: notificationId,
//   });
// };

// export const loadNotifications = () => async (dispatch, getState) => {
//   try {
//     const {
//       footballeurSignin: { footballeurInfo },
//       proprietaireSignin: { proprietaireInfo },
//     } = getState();

//     const user = footballeurInfo || proprietaireInfo;

//     if (!user || !user.token) {
//       console.warn("Aucun utilisateur connecté → skip loadNotifications()");
//       return;
//     }

//     const config = {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     };

//     const { data } = await Axios.get(`${API}/api/notifications/mine`, config);

//     dispatch({
//       type: NOTIFICATION_LOAD_SUCCESS,
//       payload: data,
//     });
//   } catch (err) {
//     console.log("Erreur load notifications:", err);
//   }
// };



