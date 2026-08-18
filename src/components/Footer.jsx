import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <Logo size={30} />
          </div>
          <p className="footer__tagline">The dating app to meet new people and make new friends.</p>
          <div className="footer__social">
            {['Instagram', 'Twitter', 'YouTube'].map(s => (
              <a key={s} href="#!" className="footer__social-link">{s[0]}</a>
            ))}
          </div>
        </div>

        <div className="footer__links-group">
          <h4>App</h4>
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/download">Download</Link>
        </div>

        <div className="footer__links-group">
          <h4>Trust</h4>
          <Link to="/safety">Safety</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <a href="#!">Terms of Service</a>
        </div>

        <div className="footer__download">
          <h4>Get the app</h4>
          <a href="#!" className="footer__store-btn" onClick={e => e.preventDefault()}>
            <span className="footer__store-icon">🍎</span>
            <span>
              <small>Download on the</small>
              <strong>App Store</strong>
            </span>
          </a>
          <a href="#!" className="footer__store-btn" onClick={e => e.preventDefault()}>
            <span className="footer__store-icon">▶</span>
            <span>
              <small>Get it on</small>
              <strong>Google Play</strong>
            </span>
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__address">
         3rd Floor, Vajra Building, Bellandur, NGEF Layout,
          Sadanandanagar, Bennigana Halli, Bengaluru, Karnataka 560038
        </p>
        <p>Copyright 2026 @ LumX Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}