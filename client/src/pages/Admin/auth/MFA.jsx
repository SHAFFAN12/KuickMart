// src/components/MFA.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaLock, FaMobileAlt } from 'react-icons/fa';
import axiosInstance from '../../../adminaxios';

const MFA = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = async () => {
    try {
      // Replace with actual MFA toggle logic
      const action = isEnabled ? 'disable' : 'enable';
      await axiosInstance.post(`/admin/mfa/${action}` );
      setIsEnabled(!isEnabled);
      Swal.fire({
        title: 'Success!',
        text: `MFA has been ${isEnabled ? 'disabled' : 'enabled'}.`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-4">
        <FaLock className="mr-2" />
        <h2 className="text-xl font-semibold">{isEnabled ? 'MFA Enabled' : 'MFA Disabled'}</h2>
      </div>
      <button onClick={handleToggle} className={`w-full py-2 ${isEnabled ? 'bg-red-500' : 'bg-green-500'} text-white rounded-md hover:bg-opacity-80`}>
        {isEnabled ? 'Disable MFA' : 'Enable MFA'}
      </button>
    </div>
  );
};

export default MFA;
