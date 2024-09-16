// actions/authActions.js
import axios from 'axios';
import axiosInstance from '../../../../adminaxios';

export const ADMIN_LOGIN_REQUEST = 'ADMIN_LOGIN_REQUEST';
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
export const ADMIN_LOGIN_FAIL = 'ADMIN_LOGIN_FAIL';
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT';

export const adminLogin = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGIN_REQUEST });

    const response = await axiosInstance.post('/auth/admin/login', credentials);
console.log(response.data)
    if (response.data) {
      dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: response.data });
      localStorage.setItem('adminInfo', JSON.stringify(response.data)); // Fixed here
      return { success: true };
    } else {
      dispatch({ type: 'ADMIN_LOGIN_FAIL', payload: response.data.message });
      return { success: false };
    }
  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const adminLogout = () => (dispatch) => {
  localStorage.removeItem('adminInfo');
  dispatch({ type: ADMIN_LOGOUT });
};

export const ADMIN_REGISTER_REQUEST = 'ADMIN_REGISTER_REQUEST';
export const ADMIN_REGISTER_SUCCESS = 'ADMIN_REGISTER_SUCCESS';
export const ADMIN_REGISTER_FAIL = 'ADMIN_REGISTER_FAIL';

export const adminRegister = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_REGISTER_REQUEST });

    const response = await axiosInstance.post('/auth/admin/register', credentials);
    
    if (response.data) {
      dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: response.data });
      localStorage.setItem('adminInfo', JSON.stringify(response.data)); // Fixed here
      return { success: true };
    } else {
      dispatch({ type: 'ADMIN_LOGIN_FAIL', payload: response.data.message });
      return { success: false };
    }
  } catch (error) {
    dispatch({
      type: ADMIN_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error; // Rethrow to handle it in the component
  }
};
