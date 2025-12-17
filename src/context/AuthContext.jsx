// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = 'https://srs-stalls-backend-1.onrender.com/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
const [user, setUser] = useState(null);  // ← Always start as null
const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

const saveAuth = (newToken, newUser) => {
  setToken(newToken);
  setUser(newUser);

  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // optional
  }

  // Only store user if you want (but it's not authoritative)
  if (newUser) {
    localStorage.setItem('user', JSON.stringify(newUser));
  }
};

  // 1) Run once on mount to hydrate from token
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setInitializing(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) {
          saveAuth(null, null);
        } else {
          const data = await res.json();
          console.log(data);
          saveAuth(storedToken, data.user);
        }
      } catch (e) {
        console.error('/me error', e);
        saveAuth(null, null);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, []);

  // 2) Login explicitly sets token+user from /login response
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Login failed' };
      }
      saveAuth(data.token, data.user);
      return { success: true };
    } catch (e) {
      console.error('login error', e);
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => saveAuth(null, null);
  const isAdmin = () => user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    initializing,
    login,
    logout,
    isAdmin,
    saveAuth,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
