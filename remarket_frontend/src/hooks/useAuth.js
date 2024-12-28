// remarket_frontend/src/hooks/useAuth.js

import { useState, useEffect } from 'react';
import { isAuthenticated, refreshAccessToken, logout } from '../utils/auth';

export const useAuth = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isAuthenticated()) {
        try {
          await refreshAccessToken();
          // Assuming you have a way to check if the user is an admin
          const isAdmin = checkIfUserIsAdmin(); // Implement this function based on your requirements
          setAuthStatus({ isAuthenticated: true, isAdmin });
        } catch (error) {
          console.error('Error refreshing access token:', error);
          logout();
        }
      }
    };

    checkAuthStatus();
  }, []);

  return authStatus;
};

// Implement this function based on your requirements
const checkIfUserIsAdmin = () => {
  // Example implementation
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  const decoded = jwt.decode(token);
  return decoded && decoded.isAdmin;
};