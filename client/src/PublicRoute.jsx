// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);

  return user ? <Navigate to="/customer-dashboard" /> : element;
};

export default PublicRoute;
