import React from 'react';

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="admin-spinner">
      <span className="admin-spinner__dot" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="admin-empty">
      <p className="admin-empty__title">{title}</p>
      {hint && <p className="admin-empty__hint">{hint}</p>}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="admin-error">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="admin-error__retry">
          Retry
        </button>
      )}
    </div>
  );
}
