// src/redux/reducers/notificationReducer.js
import {
  NOTIFICATION_ADD,
  NOTIFICATION_CLEAR,
  NOTIFICATION_RESET,
  NOTIFICATION_LOAD_SUCCESS,
  NOTIFICATION_LOAD_FAIL,
  NOTIFICATION_MARK_READ,
} from "../constants/notificationConstants";

const initialState = {
  list: [], // array of notifications
  error: null,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_ADD:
      // push en tête (nouvelle notif)
      return { ...state, list: [action.payload, ...state.list] };

    case NOTIFICATION_LOAD_SUCCESS:
      return { ...state, list: action.payload || [], error: null };

    case NOTIFICATION_LOAD_FAIL:
      return { ...state, error: action.payload };

    case NOTIFICATION_MARK_READ:
      return {
        ...state,
        list: state.list.map((n) =>
          n._id === action.payload ? { ...n, read: true } : n
        ),
      };

    case NOTIFICATION_CLEAR:
      return { ...state, list: state.list.filter((n) => n._id !== action.payload) };

    case NOTIFICATION_RESET:
      return { ...state, list: [] };

    default:
      return state;
  }
};



// import { NOTIFICATION_ADD, NOTIFICATION_CLEAR,
//    NOTIFICATION_RESET, NOTIFICATION_MARK_READ,
//    NOTIFICATION_LOAD_SUCCESS } from "../constants/notificationConstants";

// export const notificationReducer = (state = { list: [] }, action) => {
//   switch (action.type) {
//     case NOTIFICATION_ADD:
//       return {
//         ...state,
//         list: [...state.list, action.payload], // ajoute une notif
//       };

//   case NOTIFICATION_LOAD_SUCCESS:
//       return {
//         ...state,
//         list: action.payload,
//         unreadCount: action.payload.filter((n) => !n.isRead).length,
//       };

//      case NOTIFICATION_MARK_READ:
//       return {
//         ...state,
//         list: state.list.map((n) =>
//           n.id === action.payload ? { ...n, read: true } : n
//         ),
//       };
   
//       case NOTIFICATION_CLEAR:
//       return {
//         ...state,
//         list: state.list.filter((n) => n.id !== action.payload),
//       };

   

//     case NOTIFICATION_RESET:
//       return {
//         list: [],
//       };

//     default:
//       return state;
//   }
// };
