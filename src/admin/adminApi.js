import { API_BASE_URL, ADMIN_TOKEN_KEY, ADMIN_USERNAME_KEY } from './config';

function getToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

/**
 * Fires when the backend rejects a request as unauthenticated/unauthorized
 * (expired session, revoked admin, etc). AdminLayout listens for this and
 * bounces back to the login screen. Doing it this way means individual
 * pages don't each need their own "am I still logged in?" handling.
 */
function announceUnauthorized() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USERNAME_KEY);
  window.dispatchEvent(new Event('admin-unauthorized'));
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

export const adminApi = {
  login: (username, password) =>
    request('/api/admin/auth/login', { method: 'POST', body: { username, password } }),

  listUsers: (page = 0, role) =>
    request(`/api/admin/users?page=${page}${role ? `&role=${encodeURIComponent(role)}` : ''}`),

  getUser: (id) => request(`/api/admin/users/${id}`),

  pendingVerifications: () => request('/api/admin/verifications/pending'),

  approveVerification: (girlId) =>
    request(`/api/admin/verifications/${girlId}/approve`, { method: 'POST' }),

  rejectVerification: (girlId, reason) =>
    request(`/api/admin/verifications/${girlId}/reject`, { method: 'POST', body: { reason } }),

  listTransactions: (page = 0, userId) =>
    request(`/api/admin/transactions?page=${page}${userId ? `&userId=${encodeURIComponent(userId)}` : ''}`),

  ongoingCalls: () => request('/api/admin/calls/ongoing'),
};
