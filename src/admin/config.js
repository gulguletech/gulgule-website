// Base URL of the Spring Boot backend (backend-tv).
//
// In production (e.g. on Vercel), set the environment variable
// REACT_APP_API_BASE_URL to your deployed backend's URL, for example:
//
//   REACT_APP_API_BASE_URL=https://your-backend.onrender.com
//
// CRA only reads REACT_APP_* env vars, and only at build time — after
// changing it on your host, you must trigger a new deployment/build.
// Locally, create a `.env` file at the project root (same level as
// package.json) with that line, then restart `npm start`.
//
// If it isn't set, this falls back to localhost:8080 for local dev against
// a backend running on your machine.
export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ||
  'http://localhost:8080';

export const ADMIN_TOKEN_KEY = 'gulgule_admin_token';
export const ADMIN_USERNAME_KEY = 'gulgule_admin_username';
