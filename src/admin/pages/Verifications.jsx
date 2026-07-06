import React, { useEffect, useState } from 'react';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';

export default function Verifications() {
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
      const data = await adminApi.pendingVerifications();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id, name) {
    setBusyId(id);
    setError('');
    try {
      await adminApi.approveVerification(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setToast(`Approved ${name || 'profile'}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id, name) {
    setBusyId(id);
    setError('');
    try {
      await adminApi.rejectVerification(id, reason.trim() || undefined);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setToast(`Rejected ${name || 'profile'}.`);
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
          <h1>Verifications</h1>
          <p>Girl profiles waiting for a manual selfie + voice-note review.</p>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading pending profiles…" /></div>
        ) : items.length === 0 ? (
          <EmptyState title="Nothing to review" hint="New submissions will show up here." />
        ) : (
          <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item) => (
              <div key={item.id} style={{ border: '1px solid var(--adm-card-line)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {item.selfieUrl && (
                  <img
                    src={item.selfieUrl}
                    alt={`${item.username || 'Applicant'} selfie`}
                    style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                  />
                )}

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    {item.username || 'Unnamed applicant'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>{item.phoneNumber}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)', marginTop: 4 }}>
                    Submitted {formatDateTime(item.submittedAt)}
                  </div>
                  {item.voiceNoteUrl && (
                    <audio controls src={item.voiceNoteUrl} style={{ marginTop: 10, height: 32, width: '100%', maxWidth: 280 }} />
                  )}
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
                          onClick={() => handleReject(item.id, item.username)}
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
                        onClick={() => handleApprove(item.id, item.username)}
                      >
                        Approve
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
