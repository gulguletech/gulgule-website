import React, { useEffect, useState } from 'react';
import { adminApi } from '../adminApi';
import { Spinner, EmptyState, ErrorBanner } from '../components/Feedback';
import Modal from '../components/Modal';

const EMPTY_PACKAGE = {
  name: '',
  tagline: '',
  code: '',
  originalPrice: '',
  originalCoins: '',
  discountedPrice: '',
  increasedCoins: '',
  popular: false,
  active: true,
  sortOrder: 0,
};

export default function Pricing() {
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Pricing</h1>
          <p>Coin economics and recharge packages — changes take effect immediately.</p>
        </div>
      </div>
      <PricingConfigCard />
      <PackagesCard />
    </div>
  );
}

// ── Coin economics config ─────────────────────────────────────────────────

function PricingConfigCard() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.getPricingConfig();
      setForm(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await adminApi.updatePricingConfig({
        audioCoinsPerMinute: Number(form.audioCoinsPerMinute),
        videoCoinsPerMinute: Number(form.videoCoinsPerMinute),
        coinValueInPaise: Number(form.coinValueInPaise),
        minAudioCoinsToStart: Number(form.minAudioCoinsToStart),
        minVideoCoinsToStart: Number(form.minVideoCoinsToStart),
      });
      setForm(updated);
      setToast('Pricing config saved — takes effect on the next call.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: 20 }}>
      <div className="admin-card__head"><h2>Coin economics</h2></div>
      <div className="admin-card__body">
        {loading ? (
          <Spinner label="Loading pricing config…" />
        ) : (
          form && (
            <form onSubmit={handleSave}>
              {toast && <div className="admin-toast">{toast}</div>}
              <ErrorBanner message={error} />
              <div className="admin-form-grid">
                <label className="admin-field">
                  Audio coins / minute
                  <input
                    type="number"
                    min="1"
                    value={form.audioCoinsPerMinute}
                    onChange={(e) => setForm({ ...form, audioCoinsPerMinute: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  Video coins / minute
                  <input
                    type="number"
                    min="1"
                    value={form.videoCoinsPerMinute}
                    onChange={(e) => setForm({ ...form, videoCoinsPerMinute: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  Coin value (paise)
                  <input
                    type="number"
                    min="1"
                    value={form.coinValueInPaise}
                    onChange={(e) => setForm({ ...form, coinValueInPaise: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  Min coins — audio call
                  <input
                    type="number"
                    min="1"
                    value={form.minAudioCoinsToStart}
                    onChange={(e) => setForm({ ...form, minAudioCoinsToStart: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  Min coins — video call
                  <input
                    type="number"
                    min="1"
                    value={form.minVideoCoinsToStart}
                    onChange={(e) => setForm({ ...form, minVideoCoinsToStart: e.target.value })}
                  />
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}

// ── Recharge packages ──────────────────────────────────────────────────────

function PackagesCard() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [modalPkg, setModalPkg] = useState(null); // EMPTY_PACKAGE for create, or a package object for edit
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.listRechargePackages();
      setPackages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setFormError('');
    setModalPkg({ ...EMPTY_PACKAGE });
  }

  function openEdit(pkg) {
    setFormError('');
    setModalPkg({ ...pkg });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!modalPkg.name.trim()) {
      setFormError('Package name is required.');
      return;
    }
    setSaving(true);
    const body = {
      name: modalPkg.name,
      tagline: modalPkg.tagline,
      code: modalPkg.code || undefined,
      originalPrice: numOrUndefined(modalPkg.originalPrice),
      originalCoins: numOrUndefined(modalPkg.originalCoins),
      discountedPrice: numOrUndefined(modalPkg.discountedPrice),
      increasedCoins: numOrUndefined(modalPkg.increasedCoins),
      popular: !!modalPkg.popular,
      active: !!modalPkg.active,
      sortOrder: Number(modalPkg.sortOrder) || 0,
    };
    try {
      if (modalPkg.id) {
        await adminApi.updateRechargePackage(modalPkg.id, body);
        setToast(`Updated "${modalPkg.name}".`);
      } else {
        await adminApi.createRechargePackage(body);
        setToast(`Created "${modalPkg.name}".`);
      }
      setModalPkg(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(pkg, field) {
    try {
      await adminApi.updateRechargePackage(pkg.id, { [field]: !pkg[field] });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(pkg) {
    setDeletingId(pkg.id);
    try {
      await adminApi.deleteRechargePackage(pkg.id);
      setToast(`Deleted "${pkg.name}".`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  const sorted = packages.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="admin-card">
      <div className="admin-card__head">
        <h2>Recharge packages</h2>
        <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={openCreate}>
          + Create package
        </button>
      </div>

      {toast && <div className="admin-toast" style={{ margin: '16px 20px 0' }}>{toast}</div>}
      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <div className="admin-card__body"><Spinner label="Loading packages…" /></div>
      ) : sorted.length === 0 ? (
        <EmptyState title="No packages yet" hint="Create one to show it in the app." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Was ₹ / coins</th>
                <th>Now ₹ / coins</th>
                <th>Popular</th>
                <th>Active</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><code>{p.code}</code></td>
                  <td>₹{p.originalPrice} / {p.originalCoins}</td>
                  <td>₹{p.discountedPrice} / {p.increasedCoins}</td>
                  <td>
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        checked={!!p.popular}
                        onChange={() => handleToggle(p, 'popular')}
                      />
                      <span className="admin-toggle__track" />
                    </label>
                  </td>
                  <td>
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        checked={!!p.active}
                        onChange={() => handleToggle(p, 'active')}
                      />
                      <span className="admin-toggle__track" />
                    </label>
                  </td>
                  <td>{p.sortOrder}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn--bad admin-btn--sm"
                      disabled={deletingId === p.id}
                      onClick={() => handleDelete(p)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalPkg && (
        <Modal title={modalPkg.id ? 'Edit package' : 'Create package'} onClose={() => setModalPkg(null)} width={520}>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <label className="admin-field" style={{ gridColumn: '1 / -1' }}>
                Name
                <input
                  value={modalPkg.name}
                  onChange={(e) => setModalPkg({ ...modalPkg, name: e.target.value })}
                  autoFocus
                />
              </label>
              <label className="admin-field" style={{ gridColumn: '1 / -1' }}>
                Tagline
                <input
                  value={modalPkg.tagline || ''}
                  onChange={(e) => setModalPkg({ ...modalPkg, tagline: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Code (optional)
                <input
                  value={modalPkg.code || ''}
                  onChange={(e) => setModalPkg({ ...modalPkg, code: e.target.value.toUpperCase() })}
                  placeholder="auto-generated"
                />
              </label>
              <label className="admin-field">
                Sort order
                <input
                  type="number"
                  value={modalPkg.sortOrder}
                  onChange={(e) => setModalPkg({ ...modalPkg, sortOrder: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Original price (₹)
                <input
                  type="number"
                  value={modalPkg.originalPrice}
                  onChange={(e) => setModalPkg({ ...modalPkg, originalPrice: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Original coins
                <input
                  type="number"
                  value={modalPkg.originalCoins}
                  onChange={(e) => setModalPkg({ ...modalPkg, originalCoins: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Discounted price (₹)
                <input
                  type="number"
                  value={modalPkg.discountedPrice}
                  onChange={(e) => setModalPkg({ ...modalPkg, discountedPrice: e.target.value })}
                  placeholder="defaults to original"
                />
              </label>
              <label className="admin-field">
                Increased coins
                <input
                  type="number"
                  value={modalPkg.increasedCoins}
                  onChange={(e) => setModalPkg({ ...modalPkg, increasedCoins: e.target.value })}
                  placeholder="defaults to original"
                />
              </label>
              <label className="admin-field admin-field--row">
                Popular
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={!!modalPkg.popular}
                    onChange={(e) => setModalPkg({ ...modalPkg, popular: e.target.checked })}
                  />
                  <span className="admin-toggle__track" />
                </label>
              </label>
              <label className="admin-field admin-field--row">
                Active
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={!!modalPkg.active}
                    onChange={(e) => setModalPkg({ ...modalPkg, active: e.target.checked })}
                  />
                  <span className="admin-toggle__track" />
                </label>
              </label>
            </div>

            {formError && <div className="admin-form-error" style={{ marginTop: 14 }}>{formError}</div>}

            <div className="admin-form-actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setModalPkg(null)}>
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : modalPkg.id ? 'Save changes' : 'Create package'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function numOrUndefined(v) {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}
