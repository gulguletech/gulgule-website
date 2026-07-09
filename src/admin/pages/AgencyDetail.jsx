import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SecretReveal from '../components/SecretReveal';

export default function AgencyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [toast, setToast] = useState('');

  const [regenerating, setRegenerating] = useState(false);
  const [newPassword, setNewPassword] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.getAgency(id);
      setData(result);
      setForm({
        agencyName: result.agency.agencyName || '',
        phone: result.agency.phone || '',
        accountNumber: result.agency.accountNumber || '',
        ifscCode: result.agency.ifscCode || '',
        email: result.agency.email || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      await adminApi.updateAgency(id, form);
      setToast('Agency details updated.');
      load();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    setSaveError('');
    try {
      const result = await adminApi.regenerateAgencyPassword(id);
      setNewPassword(result.password);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) return <Spinner label="Loading agency…" />;
  if (error) return <ErrorBanner message={error} onRetry={load} />;
  if (!data || !form) return null;

  const { agency, girls } = data;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <Link className="admin-link" to="/admin/agencies">← Back to agencies</Link>
          <h1 style={{ marginTop: 8 }}>{agency.agencyName}</h1>
          <p>Agency code <code>{agency.agencyCode}</code></p>
        </div>
        <button
          className="admin-btn admin-btn--ghost"
          onClick={handleRegenerate}
          disabled={regenerating}
        >
          {regenerating ? 'Regenerating…' : 'Regenerate password'}
        </button>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
      {saveError && <ErrorBanner message={saveError} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        <div className="admin-card">
          <div className="admin-card__head"><h2>Agency details</h2></div>
          <div className="admin-card__body">
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <label className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  Agency name
                  <input
                    value={form.agencyName}
                    onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
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
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head"><h2>Girls linked ({girls.length})</h2></div>
          {girls.length === 0 ? (
            <EmptyState title="No girls yet" hint="Share the agency code so girls can link it from their profile." />
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {girls.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <Link className="admin-link" to={`/admin/users/${g.id}`}>
                          {g.username || 'Unnamed'}
                        </Link>
                      </td>
                      <td>{g.phoneNumber}</td>
                      <td><StatusBadge value={g.verificationStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {newPassword && (
        <Modal title="New password generated" onClose={() => setNewPassword(null)}>
          <SecretReveal password={newPassword} />
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={() => setNewPassword(null)}>
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
