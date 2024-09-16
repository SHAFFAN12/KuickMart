import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { adminRegister } from '../redux/actions/authActions';
import axiosInstance from '../../../adminaxios';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Register = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const verifyEmail = async (verificationCode) => {
    try {
      await axiosInstance.post('/auth/admin/verify-code', { code: verificationCode });
      Swal.fire({
        title: 'Success!',
        text: 'Email verified successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Verification failed!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Password validation handler
  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  // Watch password input to validate in real-time
  const password = watch('password');
  useEffect(() => {
    if (password) validatePassword(password);
  }, [password]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await dispatch(adminRegister(data));
  
      if (result.success) {
        const { value: verificationCode } = await Swal.fire({
          title: 'Verify your email',
          input: 'text',
          inputLabel: 'Enter the 4-digit code sent to your email',
          inputPlaceholder: '4-digit code',
          inputAttributes: {
            maxlength: 4,
            autocapitalize: 'off',
            autocorrect: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Verify',
          cancelButtonText: 'Cancel',
          background: '#f9fafb',
          iconColor: '#10b981',
          customClass: {
            title: 'text-2xl font-semibold',
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg',
          },
        });
  
        if (verificationCode) {
          await verifyEmail(verificationCode);
          onSwitch('login');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
  
      if (errorMessage === 'Admin already exists') {
        const { value: verificationCode } = await Swal.fire({
          title: 'Email Verification Required',
          text: 'Please enter the verification code sent to your email to complete registration.',
          input: 'text',
          inputPlaceholder: 'Verification Code',
          showCancelButton: true,
          confirmButtonText: 'Verify',
          cancelButtonText: 'Cancel',
        });
        if (verificationCode) {
          await verifyEmail(verificationCode);
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#f9fafb',
          iconColor: '#f87171',
          customClass: {
            title: 'text-2xl font-semibold text-red-600',
            confirmButton: 'bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <div className="text-center text-3xl font-bold text-gray-700 mb-6">Register</div>

      <div className="flex items-center border-b-2 border-gray-300 py-2">
        <FaUser className="mr-2 text-gray-500" />
        <input 
          {...register('name', { required: 'Name is required' })} 
          type="text" 
          placeholder="Name" 
          className="w-full p-2 border-none outline-none text-gray-700" 
          autoComplete="name"
        />
      </div>
      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

      <div className="flex items-center border-b-2 border-gray-300 py-2">
        <FaEnvelope className="mr-2 text-gray-500" />
        <input 
          {...register('email', { required: 'Email is required' })} 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border-none outline-none text-gray-700" 
          autoComplete="email"
        />
      </div>
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

      <div className="relative">
        <div className="flex items-center border-b-2 border-gray-300 py-2">
          <FaLock className="mr-2 text-gray-500" />
          <input 
            {...register('password', { required: 'Password is required' })} 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            className="w-full p-2 border-none outline-none text-gray-700" 
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
          >
            {showPassword ? <HiEyeOff className="text-gray-500" /> : <HiEye className="text-gray-500" />}
          </button>
        </div>
        <div id="password-validation" className="mt-2 text-sm space-y-1">
          <div className={`flex items-center ${passwordValidations.length ? 'text-green-500' : 'text-red-500'}`}>
            {passwordValidations.length ? '✔' : '✘'} Minimum 8 characters
          </div>
          <div className={`flex items-center ${passwordValidations.uppercase ? 'text-green-500' : 'text-red-500'}`}>
            {passwordValidations.uppercase ? '✔' : '✘'} At least one uppercase letter
          </div>
          <div className={`flex items-center ${passwordValidations.lowercase ? 'text-green-500' : 'text-red-500'}`}>
            {passwordValidations.lowercase ? '✔' : '✘'} At least one lowercase letter
          </div>
          <div className={`flex items-center ${passwordValidations.number ? 'text-green-500' : 'text-red-500'}`}>
            {passwordValidations.number ? '✔' : '✘'} At least one number
          </div>
          <div className={`flex items-center ${passwordValidations.specialChar ? 'text-green-500' : 'text-red-500'}`}>
            {passwordValidations.specialChar ? '✔' : '✘'} At least one special character
          </div>
        </div>
      </div>
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

      <button 
        type="submit" 
        className={`w-full py-3 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300`} 
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      <div className="text-center">
        <button 
          type="button" 
          onClick={() => onSwitch('login')} 
          className="text-blue-500 hover:underline mt-4"
        >
          Already have an account? Login
        </button>
      </div>
    </form>
  );
};

export default Register;
