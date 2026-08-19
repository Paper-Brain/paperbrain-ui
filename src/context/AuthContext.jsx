// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../util/constants.js';

// 1. Create the Context
const AuthContext = createContext(null);

// Axios instance with credentials for httpOnly cookie handling defined outside component
// to prevent recreation on every render and simplify dependency trees.
const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // Critical: sends httpOnly cookies automatically
});

// Helper to safely validate session
const fetchSessionUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Helper to safely trigger backend logout
const requestLogout = async () => {
  await api.post('/auth/logout');
};

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login: backend sets httpOnly cookie; we only receive user data
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Logout: call backend to clear httpOnly cookie, then clear local state
  const logout = useCallback(async () => {
    try {
      await requestLogout();
    } catch {
      // Silent catch to prevent blocking local logout on network failure
    } finally {
      setUser(null);
    }
  }, []);

  // Validate session on mount using cookie-based auth
  useEffect(() => {
    let mounted = true;

    const validateSession = async () => {
      try {
        const userData = await fetchSessionUser();
        if (mounted) {
          setUser(userData);
        }
      } catch {
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
  }, []);

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