import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAdminAuth } from '../AdminAuthContext';
import './Login.css';

export default function Login() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Enter both username and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate('/admin/dashboard', { replace: true });
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
        <h1>Admin sign in</h1>
        <p className="admin-login__sub">Restricted area — GulGule staff only.</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
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
