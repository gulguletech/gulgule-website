import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { agencyApi } from './agencyApi';
import { AGENCY_TOKEN_KEY, AGENCY_CODE_KEY, AGENCY_NAME_KEY } from './config';

const AgencyAuthContext = createContext(null);

export function AgencyAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AGENCY_TOKEN_KEY));
  const [agencyCode, setAgencyCode] = useState(() => localStorage.getItem(AGENCY_CODE_KEY));
  const [agencyName, setAgencyName] = useState(() => localStorage.getItem(AGENCY_NAME_KEY));

  const logout = useCallback(() => {
    localStorage.removeItem(AGENCY_TOKEN_KEY);
    localStorage.removeItem(AGENCY_CODE_KEY);
    localStorage.removeItem(AGENCY_NAME_KEY);
    setToken(null);
    setAgencyCode(null);
    setAgencyName(null);
  }, []);

  // agencyApi dispatches this when a request comes back 401/403 — e.g. the
  // session expired, or the admin regenerated this agency's password while
  // this tab was already open.
  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      setAgencyCode(null);
      setAgencyName(null);
    };
    window.addEventListener('agency-unauthorized', onUnauthorized);
    return () => window.removeEventListener('agency-unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async (agencyCodeInput, password) => {
    const result = await agencyApi.login(agencyCodeInput, password);
    localStorage.setItem(AGENCY_TOKEN_KEY, result.token);
    localStorage.setItem(AGENCY_CODE_KEY, result.agencyCode);
    localStorage.setItem(AGENCY_NAME_KEY, result.agencyName);
    setToken(result.token);
    setAgencyCode(result.agencyCode);
    setAgencyName(result.agencyName);
    return result;
  }, []);

  const value = {
    isAuthenticated: !!token,
    agencyCode,
    agencyName,
    login,
    logout,
  };

  return <AgencyAuthContext.Provider value={value}>{children}</AgencyAuthContext.Provider>;
}

export function useAgencyAuth() {
  const ctx = useContext(AgencyAuthContext);
  if (!ctx) throw new Error('useAgencyAuth must be used within AgencyAuthProvider');
  return ctx;
}
