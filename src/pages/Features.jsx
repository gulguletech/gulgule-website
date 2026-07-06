import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Features.css';

const FEATURES = [
  {
    icon: '🎤',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    title: 'Crystal-Clear Audio Calls',
    desc: "HD voice technology with noise cancellation. Hear every laugh, every story, every moment as if they're right there with you. Zero latency, maximum emotion.",
    tags: ['HD Voice', 'Noise Cancellation', 'Low Latency'],
  },
  {
    icon: '📹',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    title: 'Face-to-Face Video Calls',
    desc: 'See the expressions behind the words. GulGule video calls adapt to your network automatically — smooth even on 3G. Beauty filters and virtual backgrounds included.',
    tags: ['Adaptive Quality', 'Beauty Filters', 'Virtual BG'],
  },
  {
    icon: '💬',
    color: '#EC1C7D',
    bg: 'rgba(236,28,125,0.08)',
    title: 'Instant Live Chat',
    desc: 'Messages that feel alive. Send texts, voice notes, reactions, and media in a smooth chat experience designed for real conversations, not just small talk.',
    tags: ['Voice Notes', 'Media Sharing', 'Reactions'],
  },
  {
    icon: '🪙',
    color: '#FF7A18',
    bg: 'rgba(255,122,24,0.08)',
    title: 'Coins & Earnings',
    desc: 'Talk, earn, withdraw. Girls earn coins per minute spent on calls. Redeem for real cash directly into your bank account. GulGule is the only app that values your time.',
    tags: ['Earn Per Call', 'Bank Withdrawal', 'Real Rewards'],
  },
  {
    icon: '🎯',
    color: '#9C27B0',
    bg: 'rgba(156,39,176,0.08)',
    title: 'Smart Matching',
    desc: 'Not random, not algorithmic swiping. We show you people who share your languages, interests, and availability — so you meet people worth meeting.',
    tags: ['By Language', 'By Interest', 'By Availability'],
  },
  {
    icon: '🛡️',
    color: '#EC1C7D',
    bg: 'rgba(236,28,125,0.08)',
    title: 'Verified Profiles',
    desc: 'Every profile on GulGule goes through phone verification. No bots. No catfish. Just real, verified people ready to make a genuine connection.',
    tags: ['Phone Verified', 'Anti-Fraud AI', 'Real Humans Only'],
  },
];

export default function Features() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="features-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="page-hero__inner">
          <Reveal effect="up">
            <span className="page-eyebrow">Everything you need</span>
            <h1>Built for <span className="grad-text">meeting new people.</span></h1>
            <p>Every feature in GulGule is designed around one question: does this help you meet new people and make new friends?</p>
          </Reveal>
        </div>
      </section>

      <section className="features-grid-section">
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Reveal as="div" className="feature-card" key={f.title} delay={i * 90} effect="up">
              <div className="feature-card__icon" style={{ background: f.bg }}>
                <span style={{ fontSize: '1.8rem' }}>{f.icon}</span>
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
              <div className="feature-card__tags">
                {f.tags.map(t => (
                  <span className="feature-card__tag" key={t} style={{ color: f.color, background: f.bg }}>{t}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="comparison-section">
        <div className="comparison-inner">
          <Reveal effect="up">
            <h2 className="section-title">GulGule vs <span className="grad-text">the rest</span></h2>
            <p className="section-sub">Other apps made for swiping. We built for meeting new people and making real friends.</p>
          </Reveal>
          <Reveal effect="scale" className="comparison-table">
            <div className="ct-header">
              <div />
              <div className="ct-col ct-col--other">Others</div>
              <div className="ct-col ct-col--gulgule">
                <img src="/assets/logo.png" alt="GulGule" className="ct-logo-img" /> GulGule
              </div>
            </div>
            {[
              ['HD Audio Calls', false, true],
              ['Video Calls', true, true],
              ['Earn Real Money', false, true],
              ['Verified Profiles', false, true],
              ['Interest Matching', false, true],
              ['No Fake Profiles', false, true],
              ['India-First Design', false, true],
            ].map(([label, other, gulgule]) => (
              <div className="ct-row" key={label}>
                <div className="ct-label">{label}</div>
                <div className="ct-col">{other ? <span className="ct-yes">✓</span> : <span className="ct-no">✗</span>}</div>
                <div className="ct-col ct-col--gulgule">{gulgule ? <span className="ct-yes ct-yes--gulgule">✓</span> : <span className="ct-no">✗</span>}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="page-cta">
        <Link to="/download" className="btn-primary btn-primary--lg">Get All Features Free</Link>
      </div>
    </div>
  );
}
