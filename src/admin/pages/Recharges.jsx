import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';

export default function Recharges() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.pendingRecharges();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  async function handleApprove(id) {
    setBusyId(id);
    setError('');
    try {
      const result = await adminApi.approveRecharge(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setToast(`Approved — ${result.coinsAdded} coins credited.`);
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
      await adminApi.rejectRecharge(id, reason.trim() || undefined);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setToast('Recharge rejected.');
      setRejectingId(null);
      setReason('');
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
          <h1>Recharge Screenshots</h1>
          <p>Coin purchases where a boy paid via QR code and uploaded a payment screenshot.</p>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading pending recharges…" /></div>
        ) : items.length === 0 ? (
          <EmptyState title="Nothing to review" hint="New recharge screenshots will show up here." />
        ) : (
          <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item) => (
              <div key={item.id} style={{ border: '1px solid var(--adm-card-line)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {item.screenshotUrl && (
                  <a href={item.screenshotUrl} target="_blank" rel="noreferrer">
                    <img
                      src={item.screenshotUrl}
                      alt="Payment screenshot"
                      style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0, border: '1px solid var(--adm-card-line)' }}
                    />
                  </a>
                )}

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    {item.description || 'Coin recharge'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
                    ₹{item.amount} · {item.coins} coins
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)', marginTop: 4 }}>
                    Submitted {formatDateTime(item.createdAt)}
                  </div>
                  <Link className="admin-link" style={{ fontSize: '0.8rem' }} to={`/admin/users/${item.user?.id || ''}`}>
                    View user →
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                  {rejectingId === item.id ? (
                    <>
                      <input
                        className="admin-input"
                        placeholder="Reason (optional)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="admin-btn admin-btn--bad admin-btn--sm"
                          disabled={busyId === item.id}
                          onClick={() => handleReject(item.id)}
                        >
                          Confirm reject
                        </button>
                        <button
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          onClick={() => { setRejectingId(null); setReason(''); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        className="admin-btn admin-btn--good admin-btn--sm"
                        disabled={busyId === item.id}
                        onClick={() => handleApprove(item.id)}
                      >
                        Approve — credit coins
                      </button>
                      <button
                        className="admin-btn admin-btn--bad admin-btn--sm"
                        disabled={busyId === item.id}
                        onClick={() => setRejectingId(item.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
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