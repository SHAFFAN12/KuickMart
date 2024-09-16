import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux'; // Import useDispatch
import {adminLogin} from '../redux/actions/authActions'
import axiosInstance from '../../../adminaxios';
import {useNavigate} from 'react-router-dom'
const Login = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
const navigate =  useNavigate()

const dispatch =useDispatch()


  const onSubmit = async (data) => {
    try {
      console.log(data)
      setLoading(true);
      // await axiosInstance.post('/auth/admin/login', data);
const res= await dispatch(adminLogin(data))
if(res.success){    
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

navigate('/admin/dashboard')
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center text-3xl font-bold text-gray-700 mb-6">Login</div>

      <div className="flex items-center border-b-2 border-gray-300 py-2">
        <FaUser className="mr-2 text-gray-500" />
        <input 
          {...register('email', { required: 'email is required' })} 
          type="text" 
          placeholder="email" 
          className="w-full p-2 border-none outline-none text-gray-700" 
        />
      </div>
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

      <div className="flex items-center border-b-2 border-gray-300 py-2">
        <FaLock className="mr-2 text-gray-500" />
        <input 
          {...register('password', { required: 'Password is required' })} 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 border-none outline-none text-gray-700" 
        />
      </div>
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

      <button 
        type="submit" 
        className={`w-full py-3 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300`} 
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center">
        <button 
          type="button" 
          onClick={() => onSwitch('forgotPassword')} 
          className="text-blue-500 hover:underline mt-4 block"
        >
          Forgot Password?
        </button>
        <button 
          type="button" 
          onClick={() => onSwitch('register')} 
          className="text-blue-500 hover:underline mt-2 block"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default Login;
