import {
  REGISTER_SUCCESS,
  //REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  //LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  TRANSACTINO_VERIFYED,
  GET_SUBACCOUNT,
  SET_VLOAD
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  vloading: false,
  user: null,
  users: [],
  transaction_verify: false
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case SET_VLOAD:
      return {
        ...state,
        vloading: payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case ACCOUNT_DELETED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case TRANSACTINO_VERIFYED:
      return {
        ...state,
        loading: false,
        transaction_verify: payload
      }
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...initialState,
        loading: false,
      };
    case GET_SUBACCOUNT:
      return {
        ...state,
        users: [state.user, ...payload.users]
      };
    default:
      return state;
  }
}

export default authReducer;
