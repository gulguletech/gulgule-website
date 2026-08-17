import React, { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import './Download.css';

const APK_URL = 'https://github.com/gulguletech/onaroy-website/releases/download/v1.0.0/app-release.apk';

export default function Download() {
  const [clicked, setClicked] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleDownload = (platform) => {
    setClicked(platform);
    setTimeout(() => setClicked(null), 2500);
  };

  return (
    <div className="download-page">
      {/* Hero */}
      <section className="dl-hero">
        <div className="dl-hero__blobs">
          <div className="dl-blob dl-blob-1" />
          <div className="dl-blob dl-blob-2" />
          <div className="dl-blob dl-blob-3" />
        </div>
        <div className="dl-hero__inner">
          <div className="dl-hero__text animate-slide-up">
            <span className="dl-eyebrow">🚀 Available Now</span>
            <h1>GulGule is free.<br /><span className="grad-text">Download & start.</span></h1>
            <p>No account needed to install. Your first new friend is one tap away.</p>

            <a href={APK_URL} download className="dl-apk-btn">
              <span className="dl-apk-btn__icon">⬇</span>
              <span className="dl-apk-btn__text">
                <strong>Download APK Directly</strong>
                <small>For Android · 366 MB · v1.0.0</small>
              </span>
            </a>

            <p className="dl-note">Free download · No credit card · Works on iOS 13+ and Android 8+</p>
          </div>

          <div className="dl-hero__mockup animate-float">
            <div className="dl-phone">
              <div className="dl-phone__notch" />
              <div className="dl-phone__screen">
                {/* Splash screen mockup */}
                <div className="dl-splash">
                  <img src="/assets/logo.png" alt="GulGule" className="dl-splash__logo" />
                  <div className="dl-splash__name grad-text">GulGule</div>
                  <div className="dl-splash__tagline">Meet. Chat. Vibe.</div>
                  <div className="dl-splash__btn">Get Started →</div>
                </div>
              </div>
            </div>
            <div className="dl-phone__shadow" />
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="dl-requirements">
        <div className="dl-req-inner">
          <Reveal effect="up"><h2>Works on your device.</h2></Reveal>
          <div className="dl-req-grid">
            {[
              { icon: '🍎', title: 'iOS', items: ['iOS 13.0 or later', 'iPhone 6s and newer', 'iPad (6th gen+)', '~45 MB download size'] },
              { icon: '🤖', title: 'Android', items: ['Android 8.0 (Oreo) or later', '2 GB RAM minimum', 'All major Android brands', '~38 MB download size'] },
              { icon: '📶', title: 'Network', items: ['Works on 3G, 4G, 5G', 'Works on Wi-Fi', 'Adapts to slow connections', 'Low data mode available'] },
            ].map((card, i) => (
              <Reveal as="div" className="dl-req-card" key={card.title} delay={i * 100} effect="up">
                <span className="dl-req-icon">{card.icon}</span>
                <h3>{card.title}</h3>
                <ul>
                  {card.items.map(it => <li key={it}>{it}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="dl-included">
        <div className="dl-included-inner">
          <Reveal effect="up">
            <h2 className="section-title">Everything is <span className="grad-text">free on install.</span></h2>
          </Reveal>
          <div className="dl-included-grid">
            {[
              { icon: '🎤', label: 'Audio Calls', free: true },
              { icon: '📹', label: 'Video Calls', free: true },
              { icon: '💬', label: 'Live Chat', free: true },
              { icon: '🛡️', label: 'Verified Profiles', free: true },
              { icon: '🪙', label: 'Earn Coins (Girls)', free: true },
              { icon: '🔒', label: 'Encrypted Calls', free: true },
              { icon: '🌍', label: 'Global Access', free: true },
              { icon: '🆘', label: 'Safety & Reporting', free: true },
            ].map((item, i) => (
              <Reveal as="div" className="dl-included-item" key={item.label} delay={i * 60} effect="scale">
                <span className="dl-included-icon">{item.icon}</span>
                <span className="dl-included-label">{item.label}</span>
                <span className="dl-included-check">✓ Free</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="dl-final">
        <div className="dl-final-inner">
          <Reveal effect="up">
            <div className="dl-final-rating">⭐⭐⭐⭐⭐ <span>Rated 4.8 by 200,000+ users</span></div>
            <h2>Join 2 million people<br />making new friends right now.</h2>
            <div className="dl-buttons dl-buttons--centered">
              <a href={APK_URL} download className="dl-apk-btn" onClick={() => handleDownload('android2')}>
                <span className="dl-apk-btn__icon">⬇</span>
                <span className="dl-apk-btn__text">
                  <strong>Download APK Directly</strong>
                  <small>For Android · 366 MB · v1.0.0</small>
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}