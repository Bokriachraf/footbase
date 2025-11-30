import {
  EVALUATION_CREATE_REQUEST,
  EVALUATION_CREATE_SUCCESS,
  EVALUATION_CREATE_FAIL,
} from "../constants/evaluationConstants";

export const evaluationCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case EVALUATION_CREATE_REQUEST:
      return { loading: true };
    case EVALUATION_CREATE_SUCCESS:
      return { loading: false, success: true, evaluation: action.payload };
    case EVALUATION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
