import { LOGIN_SUCCESS, LOGOUT } from '../actions/types';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log('Login success with user:', action.payload.user, 'and token:', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case LOGOUT:
      console.log('Logout action triggered');
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export default authReducer;
