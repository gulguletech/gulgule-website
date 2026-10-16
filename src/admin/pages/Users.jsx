import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'BOY', label: 'Boy' },
  { value: 'GIRL', label: 'Girl' },
  { value: 'ADMIN', label: 'Admin' },
];

// Same choices the mobile app offers in its complete-profile screen / avatar picker.
const INTEREST_OPTIONS = ['Music', 'Movies', 'Travel', 'Sports', 'Gaming', 'Reading', 'Cooking', 'Art'];
const LANGUAGE_OPTIONS = ['Hindi', 'English', 'Telugu', 'Tamil', 'Marathi', 'Punjabi', 'Bengali'];
const GIRL_AVATAR_OPTIONS = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

const EMPTY_GIRL_FORM = {
  username: '',
  phoneNumber: '',
  description: '',
  avatarUrl: 'G1',
  interests: [],
  languages: [],
  agencyCode: '',
};

export default function Users() {
  const [role, setRole] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_GIRL_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createdGirl, setCreatedGirl] = useState(null);

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

  function toggleInList(key, value) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  function closeCreateModal() {
    setShowCreate(false);
    setCreatedGirl(null);
    setCreateError('');
    setForm(EMPTY_GIRL_FORM);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError('');
    if (form.username.trim().length < 3) {
      setCreateError('Username must be at least 3 characters.');
      return;
    }
    setCreating(true);
    try {
      const girl = await adminApi.createGirl({
        ...form,
        username: form.username.trim(),
        phoneNumber: form.phoneNumber.trim(),
        agencyCode: form.agencyCode.trim(),
      });
      setCreatedGirl(girl);
      setPageNum(0);
      load();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Users</h1>
          <p>Everyone who has signed up on GulGule.</p>
        </div>
        <div className="admin-toolbar">
          <button className="admin-btn admin-btn--primary" onClick={() => setShowCreate(true)}>
            + Create girl
          </button>
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
                    <td>
                      {u.username || <em>—</em>}
                      {u.adminCreated && (
                        <span className="badge badge--purple" style={{ marginLeft: 8 }}>Admin-created</span>
                      )}
                    </td>
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

      {showCreate && (
        <Modal title="Create girl profile" onClose={closeCreateModal} width={560}>
          {createdGirl ? (
            <>
              <p style={{ marginTop: 0 }}>
                <strong>{createdGirl.username}</strong> was created and is already approved.
                She now appears in the app, and calls to her will always show as busy.
              </p>
              <div className="admin-form-actions">
                <Link className="admin-btn admin-btn--ghost" to={`/admin/users/${createdGirl.id}`}>
                  View profile
                </Link>
                <button className="admin-btn admin-btn--primary" onClick={closeCreateModal}>
                  Done
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreate}>
              <p style={{ marginTop: 0, fontSize: 13, color: 'var(--adm-text-muted)' }}>
                Created already approved (no selfie / voice check). She is listed in the app like
                any other girl, but anyone who tries to call her is told she is busy on another call.
              </p>

              <div className="admin-form-grid">
                <label className="admin-field">
                  Username
                  <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    autoFocus
                  />
                </label>
                <label className="admin-field">
                  Avatar
                  <select
                    value={form.avatarUrl}
                    onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                  >
                    {GIRL_AVATAR_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </label>

                <label className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  Bio / description
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </label>

                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  Interests
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                    {INTEREST_OPTIONS.map((i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <input
                          type="checkbox"
                          style={{ width: 'auto' }}
                          checked={form.interests.includes(i)}
                          onChange={() => toggleInList('interests', i)}
                        />
                        {i}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  Languages
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                    {LANGUAGE_OPTIONS.map((l) => (
                      <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <input
                          type="checkbox"
                          style={{ width: 'auto' }}
                          checked={form.languages.includes(l)}
                          onChange={() => toggleInList('languages', l)}
                        />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="admin-field">
                  Phone (optional)
                  <input
                    value={form.phoneNumber}
                    placeholder="Leave blank — no one can log in"
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  Agency code (optional)
                  <input
                    value={form.agencyCode}
                    onChange={(e) => setForm({ ...form, agencyCode: e.target.value.toUpperCase() })}
                  />
                </label>
              </div>

              {createError && <div className="admin-form-error" style={{ marginTop: 14 }}>{createError}</div>}

              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={closeCreateModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={creating}>
                  {creating ? 'Creating…' : 'Create girl'}
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
