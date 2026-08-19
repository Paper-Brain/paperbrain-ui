// src/context/AuthContext.jsx
// ============================================================
// 1. CORE INFRASTRUCTURE - Stable references outside component
// ============================================================
import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../util/constants.js';

const AuthContext = createContext(null);

// Singleton axios instance with credentials for httpOnly cookie handling
const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

// ============================================================
// 2. PURE API FUNCTIONS - No React dependencies, testable in isolation
// ============================================================

/** Fetch authenticated user from session endpoint */
const fetchSessionUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/** Trigger backend logout to clear httpOnly cookie */
const requestLogout = async () => {
  await api.post('/auth/logout');
};

// ============================================================
// 3. CUSTOM HOOKS - Composable business logic units
// ============================================================

/** Manages session initialization with automatic cleanup */
const useSessionInitialization = (setUser) => {
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const userData = await fetchSessionUser();
        if (mounted) setUser(userData);
      } catch {
        if (mounted) setUser(null);
      }
    };

    initializeSession();
    return () => { mounted = false; };
  }, [setUser]);
};

/** Creates stable login handler */
const useLoginHandler = (setUser) => {
  return useCallback(
    (userData) => setUser(userData),
    [setUser]
  );
};

/** Creates logout handler with graceful failure tolerance */
const useLogoutHandler = (setUser) => {
  return useCallback(async () => {
    try {
      await requestLogout();
    } catch {
      // Swallow network errors—local state must clear regardless
    } finally {
      setUser(null);
    }
  }, [setUser]);
};

// ============================================================
// 4. PROVIDER COMPONENT - Orchestration layer only
// ============================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useLoginHandler(setUser);
  const logout = useLogoutHandler(setUser);

  useSessionInitialization(setUser);

  // Derive computed values from state
  const isAuthenticated = useMemo(() => !!user, [user]);
  const contextValue = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated }),
    [user, loading, login, logout, isAuthenticated]
  );

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