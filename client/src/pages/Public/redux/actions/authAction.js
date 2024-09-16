import { LOGIN_SUCCESS, LOGOUT } from './types';

export const loginSuccess = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  return {
    type: LOGIN_SUCCESS,
    payload: { user, token },
  };
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return {
    type: LOGOUT,
  };
};

export const googleLogin = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};

export const handleGoogleLoginCallback = (user, token) => (dispatch) => {
  console.log('Handling Google login callback with user:', user, 'and token:', token);
  dispatch(loginSuccess(user, token));
  window.location.href = 'customer-dashboard'; // Redirect after login
};
