import axios from "axios";
import {
  PROPRIETAIRE_REGISTER_REQUEST,
  PROPRIETAIRE_REGISTER_SUCCESS,
  PROPRIETAIRE_REGISTER_FAIL,
  PROPRIETAIRE_SIGNIN_REQUEST,
  PROPRIETAIRE_SIGNIN_SUCCESS,
  PROPRIETAIRE_SIGNIN_FAIL,
  PROPRIETAIRE_SIGNOUT,
} from "../constants/proprietaireConstants";

const API = process.env.NEXT_PUBLIC_API_URL;

// Connexion
export const signinProprietaire = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: PROPRIETAIRE_SIGNIN_REQUEST });

    const { data } = await axios.post(`${API}/api/proprietaires/signin`, { email, password });

    dispatch({ type: PROPRIETAIRE_SIGNIN_SUCCESS, payload: data });

    localStorage.setItem("proprietaireInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: PROPRIETAIRE_SIGNIN_FAIL,
      payload:
        error.response?.data?.message || error.message || "Erreur de connexion",
    });
  }
};

// Inscription
export const proprietaireRegister = (data, router) => async (dispatch) => {
  try {
    dispatch({ type: PROPRIETAIRE_REGISTER_REQUEST });

    const { nom, email, password, telephone, gouvernorat, terrain } = data;

    const { data: proprietaireData } = await axios.post(`${API}/api/proprietaires/register`, {
      nom,
      email,
      password,
      telephone,
      gouvernorat,
      terrain,
    });

    dispatch({ type: PROPRIETAIRE_REGISTER_SUCCESS, payload: proprietaireData });
    dispatch({ type: PROPRIETAIRE_SIGNIN_SUCCESS, payload: proprietaireData });

    localStorage.setItem("proprietaireInfo", JSON.stringify(proprietaireData));

    router.push("/proprietaire/dashboard");
  } catch (error) {
    dispatch({
      type: PROPRIETAIRE_REGISTER_FAIL,
      payload:
        error.response?.data?.message || error.message || "Erreur lors de l'inscription",
    });
  }
};

// Déconnexion
export const signoutProprietaire = (router) => (dispatch) => {
  localStorage.removeItem("proprietaireInfo");
  dispatch({ type: PROPRIETAIRE_SIGNOUT });
   if (router) router.push("/");
};
