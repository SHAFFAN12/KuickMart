import {
    ADMIN_LOGIN_REQUEST,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAIL,
    ADMIN_LOGOUT,
  } from '../actions/authActions';
  
  const initialState = {
    adminInfo: localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : null,
  };
  
const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADMIN_LOGIN_REQUEST:
        return { loading: true };
      case ADMIN_LOGIN_SUCCESS:
        return { loading: false, adminInfo: action.payload };
      case ADMIN_LOGIN_FAIL:
        return { loading: false, error: action.payload };
      case ADMIN_LOGOUT:
        return {};
      default:
        return state;
    }
  };

  export default authReducer