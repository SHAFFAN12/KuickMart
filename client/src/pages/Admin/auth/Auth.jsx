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
    <div className="flex justify-center items-center min-h-screen bg-neutral-200"> 
      {/* Changed background color to light gray (a soft white shade) */}

      <div className="space-y-6 p-8 max-w-md w-full ">{/*bg-green-400 shadow-lg rounded-xl*/}
        {authState === 'login' && <Login onSwitch={handleSwitch} />}
        {authState === 'register' && <Register onSwitch={handleSwitch} />}
        {authState === 'forgotPassword' && <ForgotPassword onSwitch={handleSwitch} />}
      </div>
    </div>
  );
};

export default Auth;
