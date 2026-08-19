// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../util/constants.js';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Axios instance with credentials for httpOnly cookie handling
  const api = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true, // Critical: sends httpOnly cookies automatically
  });

  // Login: backend sets httpOnly cookie; we only receive user data
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Logout: call backend to clear httpOnly cookie, then clear local state
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Log but don't block local logout on network failure
      console.warn('Logout request failed, clearing local session:', error.message);
    } finally {
      setUser(null);
    }
  }, [api]);

  // Validate session on mount using cookie-based auth
  useEffect(() => {
    let mounted = true;

    const validateSession = async () => {
      try {
        const response = await api.get('/auth/me');
        if (mounted) {
          setUser(response.data);
        }
      } catch (error) {
        // 401/403 = no valid session; treat as unauthenticated (no error log)
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error('Session validation error:', error.message);
        }
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    validateSession();

    return () => {
      mounted = false;
    };
  }, [api]);

  const contextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div role="status" aria-live="polite">Loading user session...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};