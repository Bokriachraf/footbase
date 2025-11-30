import Axios from 'axios';
import {
  FOOTBALLEUR_REGISTER_FAIL,
  FOOTBALLEUR_REGISTER_REQUEST,
  FOOTBALLEUR_REGISTER_SUCCESS,
  FOOTBALLEUR_SIGNIN_FAIL,
  FOOTBALLEUR_SIGNIN_REQUEST,
  FOOTBALLEUR_SIGNIN_SUCCESS,
  FOOTBALLEUR_SIGNOUT,
  FOOTBALLEUR_UPDATE_SUCCESS,
  FOOTBALLEUR_UPDATE_REQUEST,
  FOOTBALLEUR_UPDATE_FAIL,
  FOOTBALLEUR_LIST_REQUEST,
  FOOTBALLEUR_LIST_SUCCESS,
  FOOTBALLEUR_LIST_FAIL,
  FOOTBALLEUR_DELETE_REQUEST,
  FOOTBALLEUR_DELETE_SUCCESS,
  FOOTBALLEUR_DELETE_FAIL,
  FOOTBALLEUR_DETAILS_REQUEST,
  FOOTBALLEUR_DETAILS_SUCCESS,
  FOOTBALLEUR_DETAILS_FAIL,
} from '../constants/footballeurConstants';

const API = process.env.NEXT_PUBLIC_API_URL;


export const register = (name, email, password, position, age, gouvernorat, router) => async (dispatch) => {
  dispatch({ type: FOOTBALLEUR_REGISTER_REQUEST, payload: { name, email, position } });

  try {
    const { data } = await Axios.post(`${API}/api/footballeurs/register`, {
      name,
      email,
      password,
      position,
       age,
        gouvernorat,
    });

    dispatch({ type: FOOTBALLEUR_REGISTER_SUCCESS, payload: data });
    dispatch({ type: FOOTBALLEUR_SIGNIN_SUCCESS, payload: data });

    localStorage.setItem("footballeurInfo", JSON.stringify(data));

    if (router && typeof router.push === "function") {
      router.push(data.isAdmin ? "/admin" : "/");
    }

  } catch (error) {
    dispatch({
      type: FOOTBALLEUR_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// --- SIGNIN ---
export const signin = (email, password, router) => async (dispatch) => {
  dispatch({ type: FOOTBALLEUR_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post(`${API}/api/footballeurs/signin`, {
      email,
      password,
    });

    dispatch({ type: FOOTBALLEUR_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('footballeurInfo', JSON.stringify(data));

    // 👉 Redirection après connexion
    if (data.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (error) {
    dispatch({
      type: FOOTBALLEUR_SIGNIN_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// --- SIGNOUT ---
export const signout = (router) => (dispatch) => {
  localStorage.removeItem('footballeurInfo');
  dispatch({ type: FOOTBALLEUR_SIGNOUT });
  // router.push('/signin');
};

// --- LIST FOOTBALLEURS (admin only) ---
export const listFootballeurs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FOOTBALLEUR_LIST_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${footballeurInfo.token}`,
      },
    };

    const { data } = await Axios.get(`${API}/api/footballeurs`, config);
    dispatch({ type: FOOTBALLEUR_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FOOTBALLEUR_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// --- DELETE FOOTBALLEUR (admin only) ---
export const deleteFootballeur = (footballeurId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FOOTBALLEUR_DELETE_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${footballeurInfo.token}`,
      },
    };

    await Axios.delete(`${API}/api/footballeurs/${footballeurId}`, config);

    dispatch({ type: FOOTBALLEUR_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: FOOTBALLEUR_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const completeInscription = (inscriptionData) => async (dispatch, getState) => {
  try {
    dispatch({ type: FOOTBALLEUR_UPDATE_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${footballeurInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await Axios.put(`${API}/api/inscription/complete`, inscriptionData, config);

    // ✅ Fusionner l'ancien footballeurInfo et les nouvelles données reçues
    const updatedFootballeurnfo = {
      ...footballeurInfo,              // garde token, email, name, etc.
      ...data,                  // ajoute les nouvelles infos du backend
      isInscriptionComplete: true, // s’assure que ce flag soit mis à jour
    };

    // ✅ Met à jour Redux
    dispatch({ type: FOOTBALLEUR_UPDATE_SUCCESS, payload: updatedFootballeurInfo });
    dispatch({ type: FOOTBALLEUR_SIGNIN_SUCCESS, payload: updatedFootballeurInfo });

    // ✅ Sauvegarde dans localStorage sans perdre le token
    localStorage.setItem('footballeurInfo', JSON.stringify(updatedFootballeurInfo));
  } catch (error) {
    dispatch({
      type: FOOTBALLEUR_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.error('Erreur inscription complète :', error);
  }
};

export const getFootballeurDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FOOTBALLEUR_DETAILS_REQUEST });

    const {
      footballeurSignin: { footballeurInfo },
    } = getState();

    const { data } = await Axios.get(`${API}/api/footballeurs/${id}`, {
      headers: { Authorization: `Bearer ${footballeurInfo.token}` },
    });

    dispatch({ type: FOOTBALLEUR_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FOOTBALLEUR_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};