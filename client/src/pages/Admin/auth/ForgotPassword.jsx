import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../adminaxios';
import { MdEmail } from "react-icons/md";
import { useForm } from 'react-hook-form';

const ForgotPassword = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\W_]/.test(password),
    };
  };

  const handleResetPassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Enter Verification Code and New Password',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Verification Code" style="margin-bottom: 10px;">` +
        `<input id="swal-input2" class="swal2-input" type="password" placeholder="New Password" style="margin-bottom: 10px;">` +
        `<div id="password-validation" style="margin-bottom: 10px;"></div>`,
      focusConfirm: false,
      preConfirm: () => {
        const code = document.getElementById('swal-input1').value;
        const password = document.getElementById('swal-input2').value;
        return [code, password];
      },
      didOpen: () => {
        const passwordField = document.getElementById('swal-input2');
        const visibilityToggle = document.createElement('button');
        visibilityToggle.innerHTML = `<i class="${passwordField.type === 'password' ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
        visibilityToggle.style.position = 'absolute';
        visibilityToggle.style.right = '10px';
        visibilityToggle.style.top = '50%';
        visibilityToggle.style.transform = 'translateY(-50%)';
        visibilityToggle.style.border = 'none';
        visibilityToggle.style.background = 'transparent';
        visibilityToggle.style.cursor = 'pointer';
        visibilityToggle.addEventListener('click', () => {
          passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
          visibilityToggle.innerHTML = `<i class="${passwordField.type === 'password' ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
        });

        const inputWrapper = passwordField.parentElement;
        inputWrapper.style.position = 'relative';
        inputWrapper.appendChild(visibilityToggle);

        passwordField.addEventListener('input', () => {
          const password = passwordField.value;
          const passwordValidations = validatePassword(password);
          
          document.getElementById('password-validation').innerHTML = `
            <div style="color: ${passwordValidations.length ? 'green' : 'red'};">${passwordValidations.length ? '✔' : '✘'} Minimum 8 characters</div>
            <div style="color: ${passwordValidations.uppercase ? 'green' : 'red'};">${passwordValidations.uppercase ? '✔' : '✘'} At least one uppercase letter</div>
            <div style="color: ${passwordValidations.lowercase ? 'green' : 'red'};">${passwordValidations.lowercase ? '✔' : '✘'} At least one lowercase letter</div>
            <div style="color: ${passwordValidations.number ? 'green' : 'red'};">${passwordValidations.number ? '✔' : '✘'} At least one number</div>
            <div style="color: ${passwordValidations.specialChar ? 'green' : 'red'};">${passwordValidations.specialChar ? '✔' : '✘'} At least one special character</div>
          `;
        });
      },
      background: '#f9fafb',
      confirmButtonText: 'Reset Password',
      confirmButtonColor: '#3085d6',
      customClass: {
        title: 'text-2xl font-semibold',
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg',
        input: 'p-2 border border-gray-300 rounded-lg',
      },
    });

    if (formValues) {
      const [code, newPassword] = formValues;

      try {
        setLoading(true);
        await axiosInstance.post('/auth/admin/reset-password', { token: code, newPassword });
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been reset successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          background: '#f9fafb',
          iconColor: '#10b981',
          customClass: {
            title: 'text-2xl font-semibold',
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg',
          },
        });
        // Redirect or navigate to the login page if needed
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to reset password!',
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
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/admin/forgot-password', data);
      Swal.fire({
        title: 'Success!',
        text: 'Password reset link sent!',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#f9fafb',
        iconColor: '#10b981',
        customClass: {
          title: 'text-2xl font-semibold',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg',
        },
      });

      handleResetPassword();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Error sending reset link!',
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
      <div className="text-center text-3xl font-bold text-gray-700 mb-6">Forgot Password</div>

      <div className={`flex items-center bg-gray-100 rounded-full px-4 py-3 ${inputIndex === 0 && 'ring-2 ring-blue-400'}`}>
        <MdEmail className="text-gray-400 mr-2" />
        <input
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="Enter Your Email"
          onFocus={() => focusInput(0)}
          className="bg-transparent w-full outline-none text-gray-700"
        />
      </div>
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

      <button 
        type="submit" 
        disabled={loading} 
        className={`w-full py-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105`}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <div className="text-center">
        <button 
          type="button" 
          onClick={() => onSwitch('register')} 
          className="text-blue-500 hover:font-semibold hover:text-blue-700 mt-4"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
