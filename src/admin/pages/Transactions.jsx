import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';

  const [pageNum, setPageNum] = useState(0);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.listTransactions(pageNum, userId || undefined);
      setPage(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, userId]);

  useEffect(() => {
    setPageNum(0);
  }, [userId]);

  const rows = page?.content || [];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Transactions</h1>
          <p>
            {userId
              ? 'Filtered to a single user.'
              : 'Coin purchases, deductions, earnings, withdrawals and refunds across the platform.'}
          </p>
        </div>
        {userId && (
          <button
            className="admin-btn admin-btn--ghost"
            onClick={() => setSearchParams({})}
          >
            Clear filter
          </button>
        )}
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading transactions…" /></div>
        ) : rows.length === 0 ? (
          <EmptyState title="No transactions found" hint={userId ? 'This user has no transactions yet.' : 'Nothing has happened yet.'} />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Coins</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Reference</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id}>
                    <td><StatusBadge value={t.type} /></td>
                    <td><StatusBadge value={t.status} /></td>
                    <td>{t.coins ?? '—'}</td>
                    <td>{t.amount !== null && t.amount !== undefined ? `₹${t.amount}` : '—'}</td>
                    <td>{t.description || '—'}</td>
                    <td>
                      {t.cashfreeOrderId && <code title="Cashfree order ID">{t.cashfreeOrderId}</code>}
                      {t.cashfreeTransferId && <code title="Cashfree transfer ID">{t.cashfreeTransferId}</code>}
                      {!t.cashfreeOrderId && !t.cashfreeTransferId && '—'}
                    </td>
                    <td>{formatDateTime(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} onPageChange={setPageNum} />

      {!userId && (
        <p style={{ fontSize: '0.82rem', color: 'var(--adm-text-muted)', marginTop: 10 }}>
          Tip: open a user from the <Link className="admin-link" to="/admin/users">Users</Link> page to see just their transactions.
        </p>
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
