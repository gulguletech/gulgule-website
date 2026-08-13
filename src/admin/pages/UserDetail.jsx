import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { Spinner, ErrorBanner } from '../components/Feedback';
import StatusBadge from '../components/StatusBadge';

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [agencyCodeInput, setAgencyCodeInput] = useState('');
  const [savingAgencyCode, setSavingAgencyCode] = useState(false);
  const [agencyCodeError, setAgencyCodeError] = useState('');
  const [agencyCodeToast, setAgencyCodeToast] = useState('');

  const [grantCoins, setGrantCoins] = useState('');
  const [grantNote, setGrantNote] = useState('');
  const [grantingCoins, setGrantingCoins] = useState(false);
  const [grantError, setGrantError] = useState('');
  const [grantToast, setGrantToast] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.getUser(id);
      setData(result);
      setAgencyCodeInput(result.user.agencyCode || '');
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

  async function handleAssignAgencyCode(e) {
    e.preventDefault();
    setAgencyCodeError('');
    setAgencyCodeToast('');
    setSavingAgencyCode(true);
    try {
      await adminApi.assignAgencyCode(id, agencyCodeInput.trim());
      setAgencyCodeToast('Agency code updated.');
      await load();
    } catch (err) {
      setAgencyCodeError(err.message);
    } finally {
      setSavingAgencyCode(false);
    }
  }

  async function handleGrantCoins(e) {
    e.preventDefault();
    setGrantError('');
    setGrantToast('');
    const coins = parseInt(grantCoins, 10);
    if (!coins || coins <= 0) {
      setGrantError('Enter a positive number of coins.');
      return;
    }
    setGrantingCoins(true);
    try {
      const result = await adminApi.grantCoins(id, coins, grantNote.trim() || undefined);
      setGrantToast(`Added ${coins} coins. New balance: ${result.newBalance}.`);
      setGrantCoins('');
      setGrantNote('');
      await load();
    } catch (err) {
      setGrantError(err.message);
    } finally {
      setGrantingCoins(false);
    }
  }

  if (loading) return <Spinner label="Loading user…" />;
  if (error) return <ErrorBanner message={error} onRetry={load} />;
  if (!data) return null;

  const { user, wallet } = data;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <Link className="admin-link" to="/admin/users">← Back to users</Link>
          <h1 style={{ marginTop: 8 }}>{user.username || 'Unnamed user'}</h1>
          <p>{user.phoneNumber}</p>
        </div>
        <Link className="admin-btn admin-btn--ghost" to={`/admin/transactions?userId=${user.id}`}>
          View transactions →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        <div className="admin-card">
          <div className="admin-card__head"><h2>Profile</h2></div>
          <div className="admin-card__body">
            <DetailRow label="Role"><StatusBadge value={user.role} /></DetailRow>
            <DetailRow label="Verification"><StatusBadge value={user.verificationStatus} /></DetailRow>
            <DetailRow label="Description">{user.description || '—'}</DetailRow>
            <DetailRow label="Interests">{(user.interests || []).join(', ') || '—'}</DetailRow>
            <DetailRow label="Languages">{(user.languages || []).join(', ') || '—'}</DetailRow>
            <DetailRow label="Profile complete">{user.profileComplete ? 'Yes' : 'No'}</DetailRow>
            <DetailRow label="Audio / Video available">
              {user.audioAvailable ? 'Audio ✓' : 'Audio ✗'} · {user.videoAvailable ? 'Video ✓' : 'Video ✗'}
            </DetailRow>
            <DetailRow label="Joined">{formatDateTime(user.createdAt)}</DetailRow>
            <DetailRow label="Last updated">{formatDateTime(user.updatedAt)}</DetailRow>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head"><h2>Wallet</h2></div>
          <div className="admin-card__body">
            {wallet ? (
              <>
                <DetailRow label="Coin balance">{wallet.coinBalance}</DetailRow>
                <DetailRow label="Money balance">₹{wallet.moneyBalance}</DetailRow>
                <DetailRow label="Total coins purchased">{wallet.totalCoinsPurchased}</DetailRow>
                <DetailRow label="Total money earned">₹{wallet.totalMoneyEarned}</DetailRow>
              </>
            ) : (
              <p style={{ color: 'var(--adm-text-muted)' }}>No wallet created for this user yet.</p>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head"><h2>PAN verification</h2></div>
          <div className="admin-card__body">
            <DetailRow label="Status">{user.panVerified ? 'Verified' : 'Not verified'}</DetailRow>
            <DetailRow label="Verified at">{formatDateTime(user.panVerifiedAt)}</DetailRow>
            {user.panImageUrl && (
              <DetailRow label="PAN picture">
                <a className="admin-link" href={user.panImageUrl} target="_blank" rel="noreferrer">Open</a>
              </DetailRow>
            )}
          </div>
        </div>

        {user.role === 'BOY' && (
          <div className="admin-card">
            <div className="admin-card__head"><h2>Manually add coins</h2></div>
            <div className="admin-card__body">
              <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', margin: '0 0 10px' }}>
                Adds coins straight to this user's wallet — no payment involved. Use for goodwill
                credits, corrections, or off-app payments.
              </p>
              {grantToast && <div className="admin-toast">{grantToast}</div>}
              {grantError && <ErrorBanner message={grantError} />}
              <form onSubmit={handleGrantCoins} style={{ display: 'flex', gap: 8 }}>
                <input
                  className="admin-field"
                  style={{ width: 120 }}
                  type="number"
                  min="1"
                  value={grantCoins}
                  onChange={(e) => setGrantCoins(e.target.value)}
                  placeholder="Coins"
                />
                <input
                  className="admin-field"
                  style={{ flex: 1 }}
                  value={grantNote}
                  onChange={(e) => setGrantNote(e.target.value)}
                  placeholder="Note (optional)"
                />
                <button type="submit" className="admin-btn admin-btn--primary" disabled={grantingCoins}>
                  {grantingCoins ? 'Adding…' : 'Add coins'}
                </button>
              </form>
            </div>
          </div>
        )}

        {user.role === 'GIRL' && (
          <div className="admin-card">
            <div className="admin-card__head"><h2>Agency code</h2></div>
            <div className="admin-card__body">
              <DetailRow label="Current code">{user.agencyCode || '—'}</DetailRow>
              <DetailRow label="Set at">{formatDateTime(user.agencyCodeSetAt)}</DetailRow>
              <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', margin: '4px 0 10px' }}>
                She can only edit her own agency code within a short window after first
                setting it. As admin, you can change it here at any time — leave blank to clear it.
              </p>
              {agencyCodeToast && <div className="admin-toast">{agencyCodeToast}</div>}
              {agencyCodeError && <ErrorBanner message={agencyCodeError} />}
              <form onSubmit={handleAssignAgencyCode} style={{ display: 'flex', gap: 8 }}>
                <input
                  className="admin-field"
                  style={{ flex: 1 }}
                  value={agencyCodeInput}
                  onChange={(e) => setAgencyCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC123"
                />
                <button type="submit" className="admin-btn admin-btn--primary" disabled={savingAgencyCode}>
                  {savingAgencyCode ? 'Saving…' : 'Save'}
                </button>
              </form>
            </div>
          </div>
        )}

        {user.role === 'GIRL' && (
          <div className="admin-card">
            <div className="admin-card__head"><h2>Girl profile verification</h2></div>
            <div className="admin-card__body">
              <DetailRow label="Submitted at">{formatDateTime(user.verificationSubmittedAt)}</DetailRow>
              <DetailRow label="Verified at">{formatDateTime(user.verifiedAt)}</DetailRow>
              {user.verificationRejectionReason && (
                <DetailRow label="Rejection reason">{user.verificationRejectionReason}</DetailRow>
              )}
              {user.selfieUrl && (
                <DetailRow label="Selfie">
                  <a className="admin-link" href={user.selfieUrl} target="_blank" rel="noreferrer">Open</a>
                </DetailRow>
              )}
              {user.voiceNoteUrl && (
                <DetailRow label="Voice note">
                  <audio controls src={user.voiceNoteUrl} style={{ height: 32 }} />
                </DetailRow>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--adm-card-line)', fontSize: '0.88rem' }}>
      <span style={{ color: 'var(--adm-text-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{ textAlign: 'right' }}>{children}</span>
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
