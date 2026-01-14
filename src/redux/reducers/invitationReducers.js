import {
  INVITATION_SEND_REQUEST,
  INVITATION_SEND_SUCCESS,
  INVITATION_SEND_FAIL,
  INVITATION_LIST_MY_REQUEST,
  INVITATION_LIST_MY_SUCCESS,
  INVITATION_LIST_MY_FAIL,
} from "../constants/invitationConstants";

export const invitationSendReducer = (state = {}, action) => {
  switch (action.type) {
    case INVITATION_SEND_REQUEST:
      return { loading: true };
    case INVITATION_SEND_SUCCESS:
      return { loading: false, success: true };
    case INVITATION_SEND_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const invitationListMyReducer = (
  state = { invitations: [] },
  action
) => {
  switch (action.type) {
    case INVITATION_LIST_MY_REQUEST:
      return { loading: true, invitations: [] };
    case INVITATION_LIST_MY_SUCCESS:
      return { loading: false, invitations: action.payload };
    case INVITATION_LIST_MY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
