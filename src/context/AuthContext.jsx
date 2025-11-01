// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Create the Context
const AuthContext = createContext(null);

// Optional: Define a function to retrieve the user's token (e.g., from localStorage)
const getAuthToken = () => localStorage.getItem('authToken');

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the user object
  const [loading, setLoading] = useState(true); // To prevent rendering before check

  // This function would be called after a successful OAuth redirect/callback
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token); // Store the token for future requests
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    // Optional: Redirect to login page
  };

  // Logic to validate token and fetch user on application load
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // In a real app, you would hit your backend's /api/v1/auth/me endpoint
      // to validate the token and get the latest user data.
      const validateUser = async () => {
        try {
          // Replace with your actual validation endpoint
          const response = await axios.get('https://localhost:8000/api/v1/auth/me', { 
            headers: { 
              Authorization: `Bearer ${token}` 
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error("Token validation failed:", error);
          logout(); // Clear bad token
        } finally {
          setLoading(false);
        }
      };
      validateUser();
    } else {
      setLoading(false);
    }
  }, []);

  const contextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user, // Helper boolean
  };

  // If you are loading, you might want to show a spinner here
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