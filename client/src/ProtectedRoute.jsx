import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, isAdminRoute = false }) => {
  const user = useSelector((state) => state.auth.user);
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo')); // Get adminInfo from localStorage
  const location = useLocation();

  if (isAdminRoute) {
    return adminInfo ? element : <Navigate to="/" state={{ from: location }} />;
  }

  return user ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
