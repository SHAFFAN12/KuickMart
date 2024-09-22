import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { adminRegister } from '../redux/actions/authActions';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoIosLock } from "react-icons/io";
import '../../../index.css';
import axiosInstance from '../../../adminaxios';

const Register = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const [showPasswordHints, setShowPasswordHints] = useState(false); // For showing hints when password is focused
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const [isShowPassword, setIsShowPassword] = useState(false);

  const dispatch = useDispatch();

  const verifyEmail = async (verificationCode) => {
    try {
      await axiosInstance.post('/auth/admin/verify-code', { code: verificationCode });
      Swal.fire({
        title: 'Success!',
        text: 'Email verified successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#ffffff',
        iconColor: '#28a745',
        customClass: {
          popup: 'shadow-lg rounded-2xl px-6 py-8',
          title: 'text-2xl font-semibold text-green-600',
          confirmButton: 'bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105',
        },
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Verification failed!',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        iconColor: '#dc3545',
        customClass: {
          popup: 'shadow-lg rounded-2xl px-6 py-8',
          title: 'text-2xl font-semibold text-red-600',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105',
        },
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

  const password = watch('password');
  useEffect(() => {
    if (password) validatePassword(password);
  }, [password]);

  const onSubmit = async(data) => {
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
          background: '#ffffff',
          iconColor: '#10b981',
          customClass: {
            title: 'text-2xl font-semibold',
            input: 'border rounded-lg px-4 py-2',
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg',
            cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg',
            container: 'py-6 px-4',
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
          background: '#f0f4f8',  // Light gray background for a soft look
          iconColor: '#1d4ed8',   // Blue color for the icon to make it stand out
          customClass: {
            title: 'text-2xl font-bold text-gray-800 mb-2',  // Bold title with dark gray color
            input: 'border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400',
            confirmButton: 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105',
            cancelButton: 'bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105',
            container: 'py-6 px-4',
          },
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
          background: '#ffffff',
          iconColor: '#dc3545',
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

  

  const focusInput = (index) => {
    setInputIndex(index);
    if (index === 2) {
      setShowPasswordHints(true); // Show password hints when password field is focused
    }
  };

  const hidePasswordHints = () => {
    setInputIndex(null);
    setShowPasswordHints(false); // Hide password hints when password field loses focus
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6 bg-gray-100 p-6 rounded-lg shadow-lg relative">
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Create Your Account</h2>

      <div className={`flex items-center  rounded-full px-4 py-3 ${inputIndex === 0 && 'ring-2 ring-blue-400'}`}>
        <FaUser className="text-gray-400 mr-2" />
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          placeholder="Username"
          onFocus={() => focusInput(0)}
          onBlur={hidePasswordHints}
          className="bg-transparent w-full outline-none text-gray-700"
          autoComplete="name"
        />
      </div>
      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

      <div className={`flex items-center bg-gray-100 rounded-full px-4 py-3 ${inputIndex === 1 && 'ring-2 ring-blue-400'}`}>
        <MdEmail className="text-gray-400 mr-2" />
        <input
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="Email"
          onFocus={() => focusInput(1)}
          onBlur={hidePasswordHints}
          className="bg-transparent w-full outline-none text-gray-700"
          autoComplete="email"
        />
      </div>
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

      <div className={`flex items-center bg-gray-100 rounded-full px-4 py-3 relative ${inputIndex === 2 && 'ring-2 ring-blue-400'}`}>
        <IoIosLock className="text-gray-400 mr-2" />
        <input
          {...register('password', { required: 'Password is required' })}
          type={isShowPassword ? 'text' : 'password'}
          placeholder="Password"
          onFocus={() => focusInput(2)}
          onBlur={hidePasswordHints}
          className="bg-transparent w-full outline-none text-gray-700"
          autoComplete="current-password"
        />
        <span onClick={() => setIsShowPassword(!isShowPassword)} className="absolute right-4  cursor-pointer text-gray-500">
          {isShowPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </span>
      </div>
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

      {/* Password validation box that shows up when the password field is focused */}
      {showPasswordHints && (
        <div id="password-validation" className="absolute lg:bottom-3 lg:right-[-280px] z-10 mt-2 lg:p-6 p-4 bg-white rounded-lg shadow-md">
          <h4 className="text-gray-800 mb-2">Password must include:</h4>
          <ul className="list-disc ml-5 text-gray-600">
            <li className={`flex items-center ${passwordValidations.length ? 'text-green-600' : 'text-red-600'}`}>
              {passwordValidations.length ? '✔️' : '❌'} At least 8 characters long
            </li>
            <li className={`flex items-center ${passwordValidations.uppercase ? 'text-green-600' : 'text-red-600'}`}>
              {passwordValidations.uppercase ? '✔️' : '❌'} At least one uppercase letter
            </li>
            <li className={`flex items-center ${passwordValidations.lowercase ? 'text-green-600' : 'text-red-600'}`}>
              {passwordValidations.lowercase ? '✔️' : '❌'} At least one lowercase letter
            </li>
            <li className={`flex items-center ${passwordValidations.number ? 'text-green-600' : 'text-red-600'}`}>
              {passwordValidations.number ? '✔️' : '❌'} At least one number
            </li>
            <li className={`flex items-center ${passwordValidations.specialChar ? 'text-green-600' : 'text-red-600'}`}>
              {passwordValidations.specialChar ? '✔️' : '❌'} At least one special character
            </li>
          </ul>
        </div>
      )}

      <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>

      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <button type="button" onClick={() => onSwitch('login')} className="text-blue-500 hover:underline">
          Login
        </button>
      </p>
    </form>
  );
};

export default Register;
