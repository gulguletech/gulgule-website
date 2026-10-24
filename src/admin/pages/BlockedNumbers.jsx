import React, { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

export default function BlockedNumbers() {
  const [pageNum, setPageNum] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [unblocking, setUnblocking] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPage(await adminApi.listBlockedPhones(pageNum, search.trim() || undefined));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pageNum, search]);

  useEffect(() => { load(); }, [load]);

  const digits = phone.replace(/\D/g, '');
  const phoneValid = digits.length === 10 || (digits.length >= 11 && digits.length <= 15);

  async function handleBlock() {
    setBusy(true);
    setError('');
    try {
      await adminApi.blockPhone(phone.trim(), reason.trim() || undefined);
      setToast('Number blocked. It can no longer log in or sign up.');
      setPhone('');
      setReason('');
      setConfirmBlock(false);
      setPageNum(0);
      await load();
    } catch (err) {
      setError(err.message);
      setConfirmBlock(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleUnblock() {
    setBusy(true);
    setError('');
    try {
      await adminApi.unblockPhone(unblocking.id);
      setToast('Number unblocked.');
      setUnblocking(null);
      await load();
    } catch (err) {
      setError(err.message);
      setUnblocking(null);
    } finally {
      setBusy(false);
    }
  }

  const rows = page?.content || [];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Blocked numbers</h1>
          <p>
            Blocked numbers can never log in or create a new account, even if the old account
            is deleted. An existing account on that number is banned immediately.
          </p>
        </div>
        <div className="admin-toolbar">
          <input
            className="admin-input"
            type="search"
            placeholder="Search number…"
            value={search}
            onChange={(e) => { setPageNum(0); setSearch(e.target.value); }}
          />
          <button className="admin-btn admin-btn--ghost" onClick={load}>Refresh</button>
        </div>
      </div>

      {toast && <div className="admin-toast" onClick={() => setToast('')}>{toast}</div>}
      <ErrorBanner message={error} onRetry={load} />

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card__body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <label className="admin-field" style={{ flex: '1 1 220px', margin: 0 }}>
              Phone number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>
            <label className="admin-field" style={{ flex: '2 1 280px', margin: 0 }}>
              Reason (optional)
              <input
                type="text"
                maxLength={500}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why this number is blocked"
              />
            </label>
            <button
              className="admin-btn admin-btn--bad"
              disabled={!phoneValid}
              onClick={() => setConfirmBlock(true)}
            >
              Block number
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '8px 0 0' }}>
            A 10-digit number is treated as Indian (+91).
          </p>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading blocked numbers…" /></div>
        ) : rows.length === 0 ? (
          <EmptyState
            title={search ? 'No matching numbers' : 'No blocked numbers'}
            hint="Numbers you block will show up here."
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Reason</th>
                  <th>Blocked on</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id}>
                    <td><strong>+{b.phoneNumber}</strong></td>
                    <td>{b.reason || '—'}</td>
                    <td>{formatDateTime(b.createdAt)}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn--good admin-btn--sm"
                        onClick={() => setUnblocking(b)}
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} onPageChange={setPageNum} />
      </div>

      {confirmBlock && (
        <Modal title="Block this number?" onClose={() => !busy && setConfirmBlock(false)}>
          <p style={{ marginTop: 0 }}>
            <strong>{phone.trim()}</strong> will be blocked permanently. It can't log in or sign up
            again, and any account using it is banned and logged out right away.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="admin-btn admin-btn--ghost" disabled={busy} onClick={() => setConfirmBlock(false)}>
              Cancel
            </button>
            <button className="admin-btn admin-btn--bad" disabled={busy} onClick={handleBlock}>
              {busy ? 'Working…' : 'Block permanently'}
            </button>
          </div>
        </Modal>
      )}

      {unblocking && (
        <Modal title="Unblock this number?" onClose={() => !busy && setUnblocking(null)}>
          <p style={{ marginTop: 0 }}>
            +{unblocking.phoneNumber} will be able to log in again, and any account on it is unbanned.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="admin-btn admin-btn--ghost" disabled={busy} onClick={() => setUnblocking(null)}>
              Cancel
            </button>
            <button className="admin-btn admin-btn--primary" disabled={busy} onClick={handleUnblock}>
              {busy ? 'Working…' : 'Unblock'}
            </button>
          </div>
        </Modal>
      )}
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
