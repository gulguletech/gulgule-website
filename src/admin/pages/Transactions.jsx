import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';

// Default export range: last 30 days, inclusive.
function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
function defaultFrom() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return isoDate(d);
}
function defaultTo() {
  return isoDate(new Date());
}

// Wraps a CSV field in quotes and escapes embedded quotes, if needed.
function csvField(value) {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function transactionsToCsv(rows, includeUserColumns) {
  const headers = [
    'Date', 'Type', 'Status', 'Coins', 'Amount', 'Description', 'UPI ID', 'Screenshot', 'Admin Note',
    ...(includeUserColumns ? ['Username', 'Phone', 'Role'] : []),
  ];
  const lines = [headers.map(csvField).join(',')];

  for (const t of rows) {
    const cells = [
      t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
      t.type ?? '',
      t.status ?? '',
      t.coins ?? '',
      t.amount ?? '',
      t.description ?? '',
      t.upiId ?? '',
      t.screenshotUrl ?? '',
      t.adminNote ?? '',
      ...(includeUserColumns ? [t.username ?? '', t.phoneNumber ?? '', t.role ?? ''] : []),
    ];
    lines.push(cells.map(csvField).join(','));
  }

  // Leading BOM so Excel opens the UTF-8 file (₹ symbol etc.) correctly.
  return '\uFEFF' + lines.join('\r\n');
}

function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';

  const [pageNum, setPageNum] = useState(0);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [fromDate, setFromDate] = useState(defaultFrom());
  const [toDate, setToDate] = useState(defaultTo());
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

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

  async function handleDownload() {
    setExportError('');
    if (!fromDate || !toDate) {
      setExportError('Pick both a start and end date.');
      return;
    }
    if (toDate < fromDate) {
      setExportError("'To' date must be on or after 'From' date.");
      return;
    }
    setExporting(true);
    try {
      const exportRows = await adminApi.exportTransactions(fromDate, toDate, userId || undefined);
      if (!exportRows || exportRows.length === 0) {
        setExportError('No transactions found in that date range.');
        return;
      }
      const csv = transactionsToCsv(exportRows, !userId);
      const suffix = userId ? '_user' : '_all-users';
      downloadCsv(`transactions_${fromDate}_to_${toDate}${suffix}.csv`, csv);
    } catch (err) {
      setExportError(err.message);
    } finally {
      setExporting(false);
    }
  }

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
        <div className="admin-card__body admin-export-bar">
          <div className="admin-export-bar__field">
            <label htmlFor="export-from">From</label>
            <input
              id="export-from"
              type="date"
              className="admin-input"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="admin-export-bar__field">
            <label htmlFor="export-to">To</label>
            <input
              id="export-to"
              type="date"
              className="admin-input"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button
            className="admin-btn admin-btn--primary"
            onClick={handleDownload}
            disabled={exporting}
          >
            {exporting ? 'Preparing…' : '⬇ Download Excel'}
          </button>
          {userId && (
            <span className="admin-export-bar__hint">Exports this user only.</span>
          )}
        </div>
        {exportError && (
          <div className="admin-card__body" style={{ paddingTop: 0 }}>
            <ErrorBanner message={exportError} />
          </div>
        )}
      </div>

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
                  <th>Proof</th>
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
                      {t.screenshotUrl && (
                        <a className="admin-link" href={t.screenshotUrl} target="_blank" rel="noreferrer">Screenshot</a>
                      )}
                      {t.upiId && <div><code title="UPI ID">{t.upiId}</code></div>}
                      {t.adminNote && <div style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>{t.adminNote}</div>}
                      {!t.screenshotUrl && !t.upiId && !t.adminNote && '—'}
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