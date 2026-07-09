import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../admin/admin.css';

export default function AgencyLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="admin-shell">
      <Sidebar open={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />

      {mobileNavOpen && (
        <div className="admin-shell__scrim" onClick={() => setMobileNavOpen(false)} />
      )}

      <div className="admin-shell__main">
        <div className="admin-topbar">
          <button
            className="admin-topbar__burger"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle agency menu"
          >
            <span />
            <span />
            <span />
          </button>
          <span className="admin-topbar__title">GulGule Agency</span>
        </div>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
