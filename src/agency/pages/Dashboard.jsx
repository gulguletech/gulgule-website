import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { agencyApi } from '../agencyApi';
import { useAgencyAuth } from '../AgencyAuthContext';
import { Spinner, ErrorBanner } from '../../admin/components/Feedback';

export default function Dashboard() {
  const { agencyName, agencyCode } = useAgencyAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [girls, earnings] = await Promise.all([
        agencyApi.getGirls(),
        agencyApi.getEarnings(),
      ]);
      setStats({
        girlsCount: girls.length,
        totalEarnings: earnings.totalEarnings ?? 0,
        year: earnings.year,
        month: earnings.month,
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
          <p>
            <strong>{agencyName}</strong> · Agency code <code>{agencyCode}</code>
          </p>
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
                <div className="admin-stat-card__label">My girls</div>
                <div className="admin-stat-card__value">{stats.girlsCount}</div>
                <div className="admin-stat-card__sub">Linked to your agency code</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__label">This month's earnings</div>
                <div className="admin-stat-card__value">₹{Number(stats.totalEarnings).toFixed(2)}</div>
                <div className="admin-stat-card__sub">{monthLabel(stats.year, stats.month)} · combined</div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__head">
                <h2>Quick actions</h2>
              </div>
              <div className="admin-card__body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link className="admin-btn admin-btn--primary" to="/agency/girls">
                  View my girls
                </Link>
                <Link className="admin-btn admin-btn--ghost" to="/agency/earnings">
                  View earnings breakdown
                </Link>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

function monthLabel(year, month) {
  if (!year || !month) return '';
  try {
    return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
    });
  } catch {
    return `${month}/${year}`;
  }
}
