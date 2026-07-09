import React, { useEffect, useMemo, useState } from 'react';
import { agencyApi } from '../agencyApi';
import { Spinner, EmptyState, ErrorBanner } from '../../admin/components/Feedback';
import StatusBadge from '../../admin/components/StatusBadge';

export default function Girls() {
  const [girls, setGirls] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await agencyApi.getGirls();
      setGirls(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return girls;
    return girls.filter(
      (g) =>
        (g.username || '').toLowerCase().includes(q) ||
        (g.phoneNumber || '').toLowerCase().includes(q)
    );
  }, [girls, search]);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>My girls</h1>
          <p>Every girl profile currently linked to your agency code.</p>
        </div>
        <div className="admin-toolbar">
          <input
            className="admin-input"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading girls…" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No girls found"
            hint={girls.length === 0 ? "No one has linked your agency code yet." : 'Try a different search.'}
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Verification</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id}>
                    <td>{g.username || <em>—</em>}</td>
                    <td>{g.phoneNumber}</td>
                    <td><StatusBadge value={g.verificationStatus} /></td>
                    <td>{formatDate(g.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}
