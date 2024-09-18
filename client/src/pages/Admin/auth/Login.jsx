import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { MdEmail } from "react-icons/md";

const Login = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async(data) => {
    try {
      setLoading(true);
      const res = await dispatch(adminLogin(data));

      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Logged in successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          background: '#f9fafb',
          iconColor: '#10b981',
          customClass: {
            title: 'text-2xl font-semibold',
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg',
          },
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Invalid credentials!',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#f9fafb',
        iconColor: '#f87171',
        customClass: {
          title: 'text-2xl font-semibold text-red-600',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const [inputIndex, setInputIndex] = useState(null);
  const focusInput = (index) => {
    setInputIndex(index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-lg">
      <div className="text-center text-3xl font-bold text-gray-700 mb-6">Login</div>

      <div className={`flex items-center bg-gray-100 rounded-full px-4 py-3 ${inputIndex === 0 && 'ring-2 ring-blue-400'}`}>
        <MdEmail className="text-gray-400 mr-2" />
        <input
          {...register('email', { required: 'Email is required' })}
          type="text"
          placeholder="Enter Your Email"
          onFocus={() => focusInput(0)}
          className="bg-transparent w-full outline-none text-gray-700"
        />
      </div>
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

      <div className={`flex items-center bg-gray-100 rounded-full px-4 py-3 ${inputIndex === 1 && 'ring-2 ring-blue-400'}`}>
        <FaLock className="text-gray-400 mr-2" />
        <input
          {...register('password', { required: 'Password is required' })}
          type="password"
          placeholder="Enter Your Password"
          onFocus={() => focusInput(1)}
          className="bg-transparent w-full outline-none text-gray-700"
        />
      </div>
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

      <button
        type="submit"
        className={`w-full py-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105`}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => onSwitch('forgotPassword')}
        className="text-blue-500 mt-4 hover:font-semibold hover:text-blue-700"
      >
        Forgot Password?
      </button>
      <button
        type="button"
        onClick={() => onSwitch('register')}
        className="text-blue-500 mt-2 "
      >
        Don't have an account! <span className='hover:font-semibold hover:text-blue-700'>Register</span>
      </button>
    </div>
    
    
    </form>
  );
};

export default Login;
