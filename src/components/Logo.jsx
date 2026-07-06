import React from 'react';
import './Logo.css';

export default function Logo({ size = 32, showText = true, className = '' }) {
  return (
    <span className={`brand-logo ${className}`}>
      <img
        src="/assets/logo.png"
        alt="GulGule logo"
        className="brand-logo__img"
        style={{ width: size, height: size }}
      />
      {showText && <span className="brand-logo__text">GulGule</span>}
    </span>
  );
}
