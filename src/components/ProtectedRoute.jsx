import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Redirects to /login if the user isn't authenticated.
// Waits for the session-restore check to finish first (authReady).
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authReady } = useApp();
  if (!authReady) return null; // could show a spinner here
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
