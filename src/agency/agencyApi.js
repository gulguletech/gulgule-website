import { API_BASE_URL, AGENCY_TOKEN_KEY, AGENCY_CODE_KEY, AGENCY_NAME_KEY } from './config';

function getToken() {
  return localStorage.getItem(AGENCY_TOKEN_KEY);
}

/**
 * Fires when the backend rejects a request as unauthenticated/unauthorized
 * (expired session, wrong/regenerated password used elsewhere, etc).
 * AgencyAuthContext listens for this and bounces back to the login screen —
 * same pattern as adminApi.js's 'admin-unauthorized' event, kept as its own
 * event name so an admin tab and an agency tab open at once never interfere
 * with each other.
 */
function announceUnauthorized() {
  localStorage.removeItem(AGENCY_TOKEN_KEY);
  localStorage.removeItem(AGENCY_CODE_KEY);
  localStorage.removeItem(AGENCY_NAME_KEY);
  window.dispatchEvent(new Event('agency-unauthorized'));
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      `Could not reach the server at ${API_BASE_URL}. Is the backend running and REACT_APP_API_BASE_URL set correctly?`
    );
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = null;
    }
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      announceUnauthorized();
    }
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const agencyApi = {
  login: (agencyCode, password) =>
    request('/api/agency/auth/login', { method: 'POST', body: { agencyCode, password } }),

  getMe: () => request('/api/agency/me'),

  getGirls: () => request('/api/agency/girls'),

  // year/month optional — omit both for the current calendar month
  getEarnings: (year, month) => {
    const params = new URLSearchParams();
    if (year) params.set('year', year);
    if (month) params.set('month', month);
    const qs = params.toString();
    return request(`/api/agency/earnings${qs ? `?${qs}` : ''}`);
  },
};
