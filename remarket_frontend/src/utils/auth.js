import axios from 'axios';
import { API_FULL_URL } from '../utils/constants';
import jwt_decode from 'jwt-decode'; // To decode JWT token if needed

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Retrieves the access token from local storage.
 * @returns {string|null} The access token or null if not found.
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Retrieves the refresh token from local storage.
 * @returns {string|null} The refresh token or null if not found.
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Stores the access token in local storage.
 * @param {string} token - The access token to store.
 */
export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Stores the refresh token in local storage.
 * @param {string} token - The refresh token to store.
 */
export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Clears the access and refresh tokens from local storage.
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Checks if the user is authenticated based on the presence of an access token.
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  if (!accessToken) return false;

  try {
    // Verify token validity and expiration
    const decoded = jwt_decode(accessToken);
    if (decoded.exp * 1000 < Date.now()) {
      // Token is expired
      return false;
    }
    return true;
  } catch (error) {
    // Token is invalid
    return false;
  }
};

/**
 * Handles refreshing the access token using the refresh token.
 * @returns {Promise<string|null>} The new access token, or null if refresh failed.
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_FULL_URL}/users/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

/**
 * Handles user logout by clearing tokens and optionally redirecting to a login page.
 * @param {string} [redirectUrl='/login'] - The URL to redirect to after logout.
 */
export const logout = (redirectUrl = '/login') => {
  clearTokens();
  window.location.href = redirectUrl;
};