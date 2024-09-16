import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';

const Auth = () => {
  const [authState, setAuthState] = useState('login'); // 'login', 'register', 'forgotPassword'

  const handleSwitch = (state) => {
    setAuthState(state);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="space-y-6 p-8 max-w-md w-full bg-white shadow-lg rounded-xl">
        {authState === 'login' && <Login onSwitch={handleSwitch} />}
        {authState === 'register' && <Register onSwitch={handleSwitch} />}
        {authState === 'forgotPassword' && <ForgotPassword onSwitch={handleSwitch} />}
      </div>
    </div>
  );
};

export default Auth;
