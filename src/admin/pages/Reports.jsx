import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const FILTERS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: '', label: 'All' },
];

export default function Reports() {
  const [status, setStatus] = useState('OPEN');
  const [pageNum, setPageNum] = useState(0);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [action, setAction] = useState(null); // { type: 'resolve' | 'ban', report }
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.listReports(pageNum, status || undefined);
      setPage(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pageNum, status]);

  useEffect(() => { load(); }, [load]);

  function openAction(type, report) {
    setAction({ type, report });
    setNote('');
  }

  async function confirmAction() {
    if (!action) return;
    setBusy(true);
    setError('');
    try {
      if (action.type === 'ban') {
        await adminApi.banReportedUser(action.report.id, note.trim() || undefined);
        setToast('User banned and report resolved.');
      } else {
        await adminApi.resolveReport(action.report.id, note.trim() || undefined);
        setToast('Report marked as resolved.');
      }
      setAction(null);
      await load();
    } catch (err) {
      setError(err.message);
      setAction(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleUnban(userId) {
    setError('');
    try {
      await adminApi.unbanUser(userId);
      setToast('User unbanned.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const reports = page?.content || [];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>User reports</h1>
          <p>
            Reports sent by users from a profile or chat. Child-safety reports (underage user,
            sexual content involving minors) come first: review them straight away and ban the account.
          </p>
        </div>
        <div className="admin-toolbar">
          <select
            className="admin-select"
            value={status}
            onChange={(e) => { setPageNum(0); setStatus(e.target.value); }}
          >
            {FILTERS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
          </select>
          <button className="admin-btn admin-btn--ghost" onClick={load}>Refresh</button>
        </div>
      </div>

      {toast && <div className="admin-toast" onClick={() => setToast('')}>{toast}</div>}
      <ErrorBanner message={error} onRetry={load} />

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading reports…" /></div>
        ) : reports.length === 0 ? (
          <EmptyState
            title={status === 'OPEN' ? 'No open reports' : 'No reports found'}
            hint="New reports from users will show up here."
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Reported user</th>
                  <th>Reported by</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDateTime(r.createdAt)}</td>
                    <td>
                      <strong>{r.reason}</strong>
                      {r.details && <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>{r.details}</div>}
                      {r.adminNote && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Note: {r.adminNote}</div>
                      )}
                    </td>
                    <td><UserCell user={r.reported} showBan /></td>
                    <td><UserCell user={r.reporter} /></td>
                    <td><StatusBadge value={r.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {r.status !== 'RESOLVED' && (
                          <button
                            className="admin-btn admin-btn--ghost admin-btn--sm"
                            onClick={() => openAction('resolve', r)}
                          >
                            Resolve
                          </button>
                        )}
                        {r.reported?.banned ? (
                          <button
                            className="admin-btn admin-btn--good admin-btn--sm"
                            onClick={() => handleUnban(r.reported.id)}
                          >
                            Unban
                          </button>
                        ) : (
                          !r.reported?.missing && !r.reported?.deleted && (
                            <button
                              className="admin-btn admin-btn--bad admin-btn--sm"
                              onClick={() => openAction('ban', r)}
                            >
                              Ban user
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} onPageChange={setPageNum} />
      </div>

      {action && (
        <Modal
          title={action.type === 'ban' ? 'Ban this user?' : 'Resolve this report?'}
          onClose={() => !busy && setAction(null)}
        >
          <p style={{ marginTop: 0 }}>
            {action.type === 'ban'
              ? `${action.report.reported?.username || 'This user'} will be logged out, hidden from everyone, and unable to sign in or call. The report is marked resolved. You can unban later.`
              : 'Mark this report as handled (no action on the account).'}
          </p>
          <label className="admin-field">
            Note (optional, saved with the report)
            <textarea
              rows={3}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What you checked / decided"
            />
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="admin-btn admin-btn--ghost" disabled={busy} onClick={() => setAction(null)}>
              Cancel
            </button>
            <button
              className={`admin-btn ${action.type === 'ban' ? 'admin-btn--bad' : 'admin-btn--primary'}`}
              disabled={busy}
              onClick={confirmAction}
            >
              {busy ? 'Working…' : action.type === 'ban' ? 'Ban user' : 'Resolve'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function UserCell({ user, showBan }) {
  if (!user) return <span>—</span>;
  if (user.missing) return <span>Deleted user</span>;
  return (
    <div>
      <Link className="admin-link" to={`/admin/users/${user.id}`}>
        {user.username || user.phoneNumber || 'Unnamed user'}
      </Link>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
        <StatusBadge value={user.role} />
        {showBan && user.banned && <span className="badge badge--bad">BANNED</span>}
        {user.deleted && <span className="badge badge--neutral">DELETED</span>}
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
