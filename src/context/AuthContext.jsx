// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../util/constants.js';

// 1. Create the Context
const AuthContext = createContext(null);

/**
 * Production‑safe logger.
 * In development it logs a generic message; in production it is a no‑op.
 * No sensitive data or stack traces are ever emitted.
 */
const logger = {
  // Centralized error logger. In production this should forward to a secure monitoring service.
  // No console statements are emitted to avoid leaking internal details.
  error: (message = 'An internal error occurred') => {
    // Example placeholder for integration with a monitoring service (e.g., Sentry, Datadog)
    // monitorService.captureException(new Error(message));
    // No‑op in this minimal implementation.
  },
};

/**
 * Fetch the authenticated user profile using the provided token.
 * Throws on network or authentication errors.
 *
 * @param {string} token - Bearer token
 * @returns {Promise<Object>} User data
 */
const fetchUserProfile = async (token) => {
  const response = await axios.get(`${BASE_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Ensure HTTPS is used; axios will enforce it if BASE_API_URL is https://
  });
  return response.data;
};

/**
 * AuthProvider component – supplies authentication state and helpers.
 */
/**
 * Hook that encapsulates all authentication state and side‑effects.
 * Keeps AuthProvider thin and improves testability.
 */
const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const validateAndLoadUser = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserProfile(token);
        if (isMounted) setUser(userData);
      } catch (err) {
        logger.error('Token validation failed');
        if (isMounted) logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    validateAndLoadUser();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const contextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
  };

  return { contextValue, loading };
};

/**
 * AuthProvider component – supplies authentication state and helpers.
 * Delegates all logic to useProvideAuth for clarity and single‑responsibility.
 */
export const AuthProvider = ({ children }) => {
  const { contextValue, loading } = useProvideAuth();

  if (loading) {
    return <div>Loading user session...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy consumption
export const useAuth = () => {
  return useContext(AuthContext);
};