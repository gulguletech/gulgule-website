import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './HowItWorks.css';

const STEPS = [
  {
    num: '01',
    icon: '📲',
    title: 'Download the App',
    desc: 'Get GulGule free from the App Store or Google Play. Takes under a minute to install.',
    color: '#EC1C7D',
  },
  {
    num: '02',
    icon: '✅',
    title: 'Verify Your Number',
    desc: "Enter your phone number and confirm with a quick OTP. That's it — your profile is live.",
    color: '#FF7A18',
  },
  {
    num: '03',
    icon: '🎨',
    title: 'Set Up Your Profile',
    desc: 'Pick an avatar, share your interests, and set which languages you speak. No long forms.',
    color: '#9C27B0',
  },
  {
    num: '04',
    icon: '👋',
    title: "See Who's Online",
    desc: 'Browse real people online right now. See their age, interests, and availability before you call.',
    color: '#7C3AED',
  },
  {
    num: '05',
    icon: '📞',
    title: 'Start Talking',
    desc: 'Tap the audio or video button. Connect instantly. No waiting rooms, no awkward intros required.',
    color: '#10B981',
  },
  {
    num: '06',
    icon: '🪙',
    title: 'Earn & Recharge',
    desc: 'Girls earn coins every minute. Boys recharge to keep conversations going. Everyone wins.',
    color: '#EC1C7D',
  },
];

const FAQS = [
  { q: 'Is GulGule free to download?', a: 'Yes, completely free. Girls can use it without ever paying anything. Boys can start for free and recharge coins to continue longer conversations.' },
  { q: 'How do girls earn money?', a: 'Every audio and video minute earns coins. Once you hit the minimum threshold, you can withdraw directly to your bank account or UPI.' },
  { q: 'Is my phone number visible to others?', a: 'Never. Your phone number is only used for verification. Other users see only your username and avatar.' },
  { q: 'What if I get an uncomfortable call?', a: 'Hang up anytime. Then use the Report button to flag the user. Our moderation team reviews every report within 24 hours.' },
  { q: 'Does GulGule work outside India?', a: 'Yes! GulGule is available in 180+ countries. The coin and payout system currently supports India, with more regions coming soon.' },
];

export default function HowItWorks() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="hiw-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="page-hero__inner">
          <Reveal effect="up">
            <span className="page-eyebrow">Simple by design</span>
            <h1>From download to <span className="grad-text">making a new friend in 60 seconds.</span></h1>
            <p>No tutorials. No confusing settings. GulGule is built so anyone can pick it up and start meeting new people instantly.</p>
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="steps-section">
        <div className="steps-inner">
          {STEPS.map((s, i) => (
            <Reveal as="div" className="step-card" key={s.num} delay={i * 80} effect="up">
              <div className="step-card__num" style={{ color: s.color }}>{s.num}</div>
              <div className="step-card__icon-wrap" style={{ background: `${s.color}15` }}>
                <span>{s.icon}</span>
              </div>
              <div className="step-card__content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className="step-card__connector" />}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="roles-section">
        <div className="roles-inner">
          <Reveal effect="up">
            <h2 className="section-title">Two roles, <span className="grad-text">one great experience.</span></h2>
            <p className="section-sub">GulGule works differently depending on how you join.</p>
          </Reveal>
          <div className="roles-grid">
            <Reveal as="div" className="role-card role-card--boy" effect="left">
              <div className="role-card__badge">👦 For Boys</div>
              <h3>Meet new people with confidence</h3>
              <ul>
                <li>Browse girls available right now</li>
                <li>Start audio or video calls instantly</li>
                <li>Recharge coins to keep conversations going</li>
                <li>Chat between calls for free</li>
                <li>Rate and review your experience</li>
              </ul>
              <Link to="/download" className="role-card__cta">Download & Explore</Link>
            </Reveal>
            <Reveal as="div" className="role-card role-card--girl" effect="right">
              <div className="role-card__badge">👧 For Girls</div>
              <h3>Talk, earn, make new friends</h3>
              <ul>
                <li>Complete profile verification once</li>
                <li>Go online when you're ready</li>
                <li>Earn coins for every minute of conversation</li>
                <li>Withdraw earnings to your bank / UPI</li>
                <li>Block or skip anyone — always in control</li>
              </ul>
              <Link to="/download" className="role-card__cta role-card__cta--girl">Download & Earn</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-inner">
          <Reveal effect="up">
            <h2 className="section-title">Common <span className="grad-text">questions.</span></h2>
          </Reveal>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <Reveal as="details" className="faq-item" key={f.q} delay={i * 70} effect="up">
                <summary className="faq-item__q">
                  {f.q}
                  <span className="faq-item__arrow">›</span>
                </summary>
                <p className="faq-item__a">{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="page-cta">
        <Link to="/download" className="btn-primary btn-primary--lg">Start Your First Call</Link>
      </div>
    </div>
  );
}
