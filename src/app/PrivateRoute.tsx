import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
