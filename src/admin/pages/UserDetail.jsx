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

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.getUser(id);
      setData(result);
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
            <DetailRow label="PAN number">{user.panNumber || '—'}</DetailRow>
            <DetailRow label="Holder name">{user.panHolderName || '—'}</DetailRow>
            <DetailRow label="Verified at">{formatDateTime(user.panVerifiedAt)}</DetailRow>
          </div>
        </div>

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
