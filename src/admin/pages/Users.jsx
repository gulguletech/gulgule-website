import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'BOY', label: 'Boy' },
  { value: 'GIRL', label: 'Girl' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function Users() {
  const [role, setRole] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.listUsers(pageNum, role || undefined);
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
  }, [pageNum, role]);

  const users = page?.content || [];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Users</h1>
          <p>Everyone who has signed up on GulGule.</p>
        </div>
        <div className="admin-toolbar">
          <select
            className="admin-select"
            value={role}
            onChange={(e) => {
              setPageNum(0);
              setRole(e.target.value);
            }}
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading users…" /></div>
        ) : users.length === 0 ? (
          <EmptyState title="No users found" hint="Try a different role filter." />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Verification</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username || <em>—</em>}</td>
                    <td>{u.phoneNumber}</td>
                    <td><StatusBadge value={u.role} /></td>
                    <td><StatusBadge value={u.verificationStatus} /></td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <Link className="admin-link" to={`/admin/users/${u.id}`}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} onPageChange={setPageNum} />
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
