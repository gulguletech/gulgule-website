import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { adminApi } from './adminApi';
import { ADMIN_TOKEN_KEY, ADMIN_USERNAME_KEY } from './config';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [username, setUsername] = useState(() => localStorage.getItem(ADMIN_USERNAME_KEY));

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  // The API client dispatches this when a request comes back 401/403 —
  // e.g. the admin session expired while a page was already open.
  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      setUsername(null);
    };
    window.addEventListener('admin-unauthorized', onUnauthorized);
    return () => window.removeEventListener('admin-unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async (usernameInput, password) => {
    const result = await adminApi.login(usernameInput, password);
    localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
    localStorage.setItem(ADMIN_USERNAME_KEY, result.username);
    setToken(result.token);
    setUsername(result.username);
    return result;
  }, []);

  const value = {
    isAuthenticated: !!token,
    username,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
