import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, ErrorBanner } from '../components/Feedback';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [all, boys, girls, pending, calls] = await Promise.all([
        adminApi.listUsers(0),
        adminApi.listUsers(0, 'BOY'),
        adminApi.listUsers(0, 'GIRL'),
        adminApi.pendingVerifications(),
        adminApi.ongoingCalls(),
      ]);
      setStats({
        totalUsers: all.totalElements ?? 0,
        boys: boys.totalElements ?? 0,
        girls: girls.totalElements ?? 0,
        pendingVerifications: pending.length,
        ongoingCalls: calls.length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>A quick snapshot of what's happening on GulGule right now.</p>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <Spinner label="Loading overview…" />
      ) : (
        stats && (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-card__label">Total users</div>
                <div className="admin-stat-card__value">{stats.totalUsers}</div>
                <div className="admin-stat-card__sub">{stats.boys} boys · {stats.girls} girls</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__label">Pending verifications</div>
                <div className="admin-stat-card__value">{stats.pendingVerifications}</div>
                <div className="admin-stat-card__sub">Girl profiles awaiting review</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__label">Live calls</div>
                <div className="admin-stat-card__value">{stats.ongoingCalls}</div>
                <div className="admin-stat-card__sub">Ringing or connected right now</div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__head">
                <h2>Quick actions</h2>
              </div>
              <div className="admin-card__body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link className="admin-btn admin-btn--primary" to="/admin/verifications">
                  Review verifications
                </Link>
                <Link className="admin-btn admin-btn--ghost" to="/admin/users">
                  Browse users
                </Link>
                <Link className="admin-btn admin-btn--ghost" to="/admin/transactions">
                  Browse transactions
                </Link>
                <Link className="admin-btn admin-btn--ghost" to="/admin/calls">
                  View live calls
                </Link>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
