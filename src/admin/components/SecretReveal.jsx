import React, { useState } from 'react';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="admin-secret-box__copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard API unavailable — the value is still selectable/visible
        }
      }}
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  );
}

// Shown right after AdminAgencyController returns a plaintext password —
// it is never retrievable again after this render, so this always carries
// the "copy it now" warning.
export default function SecretReveal({ agencyCode, password }) {
  return (
    <div className="admin-secret-box">
      {agencyCode && (
        <div className="admin-secret-box__row">
          <div>
            <div className="admin-secret-box__label">Agency code</div>
            <div className="admin-secret-box__value">{agencyCode}</div>
          </div>
          <CopyButton value={agencyCode} />
        </div>
      )}
      {password && (
        <div className="admin-secret-box__row">
          <div>
            <div className="admin-secret-box__label">Password</div>
            <div className="admin-secret-box__value">{password}</div>
          </div>
          <CopyButton value={password} />
        </div>
      )}
      <div className="admin-warn-note">
        This password is shown only once and can't be retrieved again — copy it now and share it
        with the agency securely. You can always generate a new one later from the agency's page.
      </div>
    </div>
  );
}
