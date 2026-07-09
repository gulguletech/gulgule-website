import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAgencyAuth } from '../AgencyAuthContext';
import '../../admin/pages/Login.css';

export default function Login() {
  const { isAuthenticated, login } = useAgencyAuth();
  const navigate = useNavigate();

  const [agencyCode, setAgencyCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/agency/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!agencyCode.trim() || !password) {
      setError('Enter both agency code and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(agencyCode.trim(), password);
      navigate('/agency/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <Logo size={38} />
        </div>
        <h1>Agency sign in</h1>
        <p className="admin-login__sub">Restricted area — GulGule partner agencies only.</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <label>
            Agency code
            <input
              type="text"
              value={agencyCode}
              onChange={(e) => setAgencyCode(e.target.value.toUpperCase())}
              autoComplete="username"
              autoCapitalize="characters"
              autoFocus
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <div className="admin-login__error">{error}</div>}

          <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
