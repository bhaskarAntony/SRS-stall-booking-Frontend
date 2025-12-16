// src/components/auth/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, token, initializing, isAdmin } = useAuth();
  const location = useLocation();

  // THESE LOGS MUST APPEAR — if they don't, the component isn't mounting
  console.log('🚀 AdminRoute MOUNTED');
  console.log('AdminRoute state:', {
    initializing,
    hasToken: !!token,
    userRole: user?.role,
    isAdmin: isAdmin(),
    user,
  });

  if (initializing) {
    console.log('AdminRoute: still initializing...');
    return <div>Loading auth...</div>;
  }

  if (!token) {
    console.log('AdminRoute: no token → redirect to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin()) {
    console.log('AdminRoute: not admin → redirect to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute: authorized → rendering children/layout');

  // TEMPORARY: render children to test old structure
  return children || <Outlet />;
};

export default AdminRoute;