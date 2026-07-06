import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAdminAuth } from '../AdminAuthContext';

const icons = {
  dashboard: (
    <path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z" />
  ),
  users: (
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  ),
  verify: (
    <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.2 14.6-3.4-3.4 1.42-1.42L10.8 12.8l4.98-4.98 1.42 1.42-6.4 6.36z" />
  ),
  transactions: (
    <path d="M7 15h10v2H7zm0-4h10v2H7zm0-4h10v2H7zM5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5zm0 2h14v14H5V5z" />
  ),
  calls: (
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.58.11.35.03.74-.25 1.02L6.6 10.8z" />
  ),
  logout: (
    <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />
  ),
};

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/verifications', label: 'Verifications', icon: 'verify' },
  { to: '/admin/transactions', label: 'Transactions', icon: 'transactions' },
  { to: '/admin/calls', label: 'Live calls', icon: 'calls' },
];

export default function Sidebar({ open, onNavigate }) {
  const { username, logout } = useAdminAuth();

  return (
    <aside className={`admin-sidebar ${open ? 'admin-sidebar--open' : ''}`}>
      <div className="admin-sidebar__brand">
        <Logo size={30} />
        <span className="admin-sidebar__tag">Admin</span>
      </div>

      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
              {icons[item.icon]}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__who">
          <span className="admin-sidebar__who-dot" />
          Signed in as <strong>{username}</strong>
        </div>
        <button className="admin-sidebar__logout" onClick={logout}>
          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
            {icons.logout}
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
