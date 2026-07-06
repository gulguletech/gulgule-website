import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import StatusBadge from '../components/StatusBadge';

const AUTO_REFRESH_MS = 15000;

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await adminApi.ongoingCalls();
      setCalls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Live calls</h1>
          <p>Calls that are currently ringing or connected. Refreshes automatically every 15s.</p>
        </div>
        <button className="admin-btn admin-btn--ghost" onClick={load}>Refresh now</button>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading live calls…" /></div>
        ) : calls.length === 0 ? (
          <EmptyState title="No calls in progress" hint="Ringing or connected calls will appear here in real time." />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Caller</th>
                  <th>Receiver</th>
                  <th>Channel</th>
                  <th>Started</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((c) => (
                  <tr key={c.id}>
                    <td><span className="pulse-dot" /><StatusBadge value={c.status} /></td>
                    <td><StatusBadge value={c.callType} /></td>
                    <td>
                      <Link className="admin-link" to={`/admin/users/${c.callerId}`}>
                        {c.callerUsername || c.callerPhoneNumber}
                      </Link>
                    </td>
                    <td>
                      <Link className="admin-link" to={`/admin/users/${c.receiverId}`}>
                        {c.receiverUsername || c.receiverPhoneNumber}
                      </Link>
                    </td>
                    <td><code>{c.channelName}</code></td>
                    <td>{formatDateTime(c.startedAt || c.createdAt)}</td>
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

function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return value;
  }
}
