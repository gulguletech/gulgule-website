import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';

export default function Withdrawals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [actingId, setActingId] = useState(null); // 'approve' or 'reject' flow open for this id
  const [note, setNote] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.pendingWithdrawals();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id) {
    setBusyId(id);
    setError('');
    try {
      await adminApi.approveWithdrawal(id, note.trim() || undefined);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setToast('Marked as paid.');
      setActingId(null);
      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    setBusyId(id);
    setError('');
    try {
      await adminApi.rejectWithdrawal(id, note.trim() || undefined);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setToast('Request rejected, balance restored.');
      setActingId(null);
      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Withdrawal Requests</h1>
          <p>Girls' withdrawal requests. Pay them manually via UPI, then mark as paid here.</p>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading pending withdrawals…" /></div>
        ) : items.length === 0 ? (
          <EmptyState title="Nothing to review" hint="New withdrawal requests will show up here." />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>UPI ID</th>
                  <th>Requested</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>₹{Math.abs(item.amount)}</td>
                    <td><code>{item.upiId || '—'}</code></td>
                    <td>{formatDateTime(item.createdAt)}</td>
                    <td>
                      <Link className="admin-link" to={`/admin/users/${item.user?.id || ''}`}>
                        View user
                      </Link>
                    </td>
                    <td>
                      {actingId === item.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
                          <input
                            className="admin-input"
                            placeholder="Note / UTR reference (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="admin-btn admin-btn--good admin-btn--sm"
                              disabled={busyId === item.id}
                              onClick={() => handleApprove(item.id)}
                            >
                              Confirm paid
                            </button>
                            <button
                              className="admin-btn admin-btn--bad admin-btn--sm"
                              disabled={busyId === item.id}
                              onClick={() => handleReject(item.id)}
                            >
                              Reject
                            </button>
                            <button
                              className="admin-btn admin-btn--ghost admin-btn--sm"
                              onClick={() => { setActingId(null); setNote(''); }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="admin-btn admin-btn--primary admin-btn--sm"
                          onClick={() => setActingId(item.id)}
                        >
                          Mark paid / Reject
                        </button>
                      )}
                    </td>
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
