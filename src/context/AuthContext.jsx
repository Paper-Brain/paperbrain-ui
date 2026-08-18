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

  // Extracted: Validate session with backend (relies on httpOnly cookie)
  const validateSession = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/auth/me`, {
        withCredentials: true, // Critical: sends httpOnly cookie automatically
      });
      setUser(response.data);
    } catch (error) {
      // Token invalid/expired - user remains null
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  // Called by OAuth callback route after backend sets httpOnly cookie
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Clears local state; backend should clear cookie via /logout endpoint
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const contextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

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
>