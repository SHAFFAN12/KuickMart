import React from 'react';
import { useDispatch } from 'react-redux';
import { FcGoogle } from 'react-icons/fc';
import { googleLogin } from './redux/actions/authAction';

const GoogleLogin = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(googleLogin());
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow-md hover:shadow-lg focus:outline-none transition-shadow duration-200"
    >
      <FcGoogle className="mr-2" size={24} />
      <span>Login with Google</span>
    </button>
  );
};

export default GoogleLogin;
