import React from 'react';

export default function Modal({ title, onClose, children, width = 440 }) {
  return (
    <div className="admin-modal-scrim" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__head">
          <h2>{title}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
}
