// Base URL of the Spring Boot backend (backend-tv).
//
// Hardcoded directly here so it works regardless of Vercel/CRA env var
// setup. If you ever move the backend to a new URL, just change the line
// below and redeploy — that's the only place it needs to change.
const HARDCODED_API_BASE_URL = 'https://backend-tv-x7kh.onrender.com';

// Still supports overriding via REACT_APP_API_BASE_URL if you set it later
// (e.g. to point a preview deployment at a staging backend), but the
// hardcoded value above is what's used if that env var isn't set.
export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ||
  HARDCODED_API_BASE_URL;

export const ADMIN_TOKEN_KEY = 'gulgule_admin_token';
export const ADMIN_USERNAME_KEY = 'gulgule_admin_username';
