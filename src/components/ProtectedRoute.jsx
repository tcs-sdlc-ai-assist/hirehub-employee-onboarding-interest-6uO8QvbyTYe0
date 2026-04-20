import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AdminLogin } from './AdminLogin';

export function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('hirehub_admin_auth') === 'true';
    } catch (err) {
      console.error('ProtectedRoute: failed to read sessionStorage:', err);
      return false;
    }
  });

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;