import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import SecretReveal from '../components/SecretReveal';

const EMPTY_FORM = { agencyName: '', phone: '', accountNumber: '', ifscCode: '', email: '' };

export default function Agencies() {
  const [pageNum, setPageNum] = useState(0);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [created, setCreated] = useState(null); // { agencyCode, password }

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.listAgencies(pageNum);
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
  }, [pageNum]);

  const agencies = page?.content || [];

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError('');
    if (!form.agencyName.trim()) {
      setCreateError('Agency name is required.');
      return;
    }
    setCreating(true);
    try {
      const result = await adminApi.createAgency(form);
      setCreated({ agencyCode: result.agencyCode, password: result.password });
      setForm(EMPTY_FORM);
      setPageNum(0);
      load();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function closeCreateModal() {
    setShowCreate(false);
    setCreated(null);
    setCreateError('');
    setForm(EMPTY_FORM);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Agencies</h1>
          <p>Businesses that recruit girls and earn a view into their combined earnings.</p>
        </div>
        <div className="admin-toolbar">
          <button className="admin-btn admin-btn--primary" onClick={() => setShowCreate(true)}>
            + Create agency
          </button>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <div className="admin-card">
        {loading ? (
          <div className="admin-card__body"><Spinner label="Loading agencies…" /></div>
        ) : agencies.length === 0 ? (
          <EmptyState title="No agencies yet" hint="Create one to get started." />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Agency name</th>
                  <th>Code</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((a) => (
                  <tr key={a.id}>
                    <td>{a.agencyName}</td>
                    <td><code>{a.agencyCode}</code></td>
                    <td>{a.phone || '—'}</td>
                    <td>{a.email || '—'}</td>
                    <td>{formatDate(a.createdAt)}</td>
                    <td>
                      <Link className="admin-link" to={`/admin/agencies/${a.id}`}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} onPageChange={setPageNum} />

      {showCreate && (
        <Modal title="Create agency" onClose={closeCreateModal}>
          {created ? (
            <>
              <SecretReveal agencyCode={created.agencyCode} password={created.password} />
              <div className="admin-form-actions">
                <button className="admin-btn admin-btn--primary" onClick={closeCreateModal}>
                  Done
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreate}>
              <div className="admin-form-grid">
                <label className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  Agency name
                  <input
                    value={form.agencyName}
                    onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                    autoFocus
                  />
                </label>
                <label className="admin-field">
                  Phone
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  Account number
                  <input
                    value={form.accountNumber}
                    onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  IFSC code
                  <input
                    value={form.ifscCode}
                    onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
                  />
                </label>
              </div>

              {createError && <div className="admin-form-error" style={{ marginTop: 14 }}>{createError}</div>}

              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={closeCreateModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={creating}>
                  {creating ? 'Creating…' : 'Create agency'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
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
