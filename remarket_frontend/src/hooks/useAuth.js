import { useState, useEffect } from 'react';
import { isAuthenticated, refreshAccessToken, logout, getAccessToken, verifyAccessToken } from '../utils/auth';

export const useAuth = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('Checking auth status in useAuth hook...');
      if (isAuthenticated()) {
        try {
          await refreshAccessToken();
          const accessToken = getAccessToken();
          if (accessToken) {
            const decodedToken = verifyAccessToken(accessToken);
            if (decodedToken) {
              console.log('User is authenticated in useAuth hook');
              setAuthStatus({
                isAuthenticated: true,
                isAdmin: decodedToken.isAdmin,
              });
            }
          }
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