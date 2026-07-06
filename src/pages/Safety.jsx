import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Safety.css';

const PILLARS = [
  {
    icon: '📱',
    title: 'Phone Verification',
    desc: 'Every account is tied to a real phone number, verified via OTP. One device, one account. No anonymity loopholes.',
    color: '#EC1C7D',
  },
  {
    icon: '🤖',
    title: 'AI Content Moderation',
    desc: 'Our AI systems monitor calls and chats in real time for harmful behaviour. Violations are flagged and reviewed instantly.',
    color: '#7C3AED',
  },
  {
    icon: '🚫',
    title: 'One-Tap Block & Report',
    desc: 'Feel uncomfortable? Block and report from inside any call or chat. The user is immediately restricted while we investigate.',
    color: '#FF7A18',
  },
  {
    icon: '👁️',
    title: 'Human Review Team',
    desc: 'Every report is reviewed by a real person within 24 hours. Verified violations result in permanent bans.',
    color: '#9C27B0',
  },
  {
    icon: '🔒',
    title: 'End-to-End Encryption',
    desc: 'All calls and messages are encrypted. No one — including GulGule — can access the content of your private conversations.',
    color: '#10B981',
  },
  {
    icon: '🛑',
    title: 'Zero-Tolerance Policy',
    desc: 'Harassment, nudity, hate speech, or threats lead to immediate permanent removal. No second chances for serious violations.',
    color: '#EC1C7D',
  },
];

const TIPS = [
  "Never share your home address, workplace, or daily routine with someone you just met.",
  "Trust your instincts — if a conversation makes you uncomfortable, hang up and report.",
  "Don't send money to anyone you've only spoken to online, no matter their story.",
  "Keep conversations on GulGule until you genuinely trust the person.",
  "Use the block feature freely — you don't owe anyone a second call.",
];

export default function Safety() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="safety-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="page-hero__inner">
          <Reveal effect="up">
            <span className="page-eyebrow">Your safety is our job</span>
            <h1>A space where you can <span className="grad-text">speak freely.</span></h1>
            <p>GulGule is built on the belief that everyone deserves to meet new people and make new friends without fear. Here's how we protect you.</p>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="pillars-section">
        <div className="pillars-inner">
          <div className="pillars-grid">
            {PILLARS.map((p, i) => (
              <Reveal as="div" className="pillar-card" key={p.title} delay={i * 90} effect="up">
                <div className="pillar-card__icon" style={{ background: `${p.color}15`, color: p.color }}>
                  {p.icon}
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="tips-section">
        <div className="tips-inner">
          <Reveal effect="scale" className="tips-card">
            <div className="tips-card__left">
              <span className="tips-card__badge">Community Guidelines</span>
              <h2>Smart habits for safer conversations.</h2>
              <p>Safety is a two-way street. Here are the habits we encourage all GulGule users to keep.</p>
            </div>
            <div className="tips-card__right">
              {TIPS.map((t, i) => (
                <div className="tip-item" key={i}>
                  <span className="tip-item__num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{t}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="page-cta">
        <Link to="/download" className="btn-primary btn-primary--lg">Join Safely — Download Free</Link>
      </div>
    </div>
  );
}
