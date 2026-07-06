import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Home.css';

const STATS = [
  { value: '2M+', label: 'Active Users' },
  { value: '50M+', label: 'Calls Made' },
  { value: '4.8★', label: 'App Rating' },
  { value: '180+', label: 'Countries' },
];

const TESTIMONIALS = [
  { name: 'Riya S.', city: 'Mumbai', text: "GulGule changed how I meet people. Real voices, real vibes — I made my best friend here.", avatar: '🌸' },
  { name: 'Arjun M.', city: 'Bangalore', text: "The audio quality is insane. Feels like they're in the same room. No fake profiles either.", avatar: '🔥' },
  { name: 'Pooja T.', city: 'Delhi', text: "Finally a Freindship-App that doesn't waste your time. I've made so many new friends here.", avatar: '✨' },
];

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg-blobs">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <div className="hero__content">
          <div className="hero__text animate-slide-up">
            <span className="hero__eyebrow">🇮🇳 India's #1 Freindship-App to Make New Friends</span>
            <h1 className="hero__headline">
              Meet someone new.
              <br />
              <span className="grad-text">Make a real friend.</span>
            </h1>
            <p className="hero__sub">
              GulGule is the Freindship-App where you can meet new people and make new friends —
              through audio calls, video calls, and live chats. No boring swiping. Just real conversation.
            </p>
            <div className="hero__actions">
              <Link to="/download" className="btn-primary">Download Free</Link>
              <Link to="/how-it-works" className="btn-ghost">See How It Works →</Link>
            </div>
            <p className="hero__disclaimer">Free to download · Available on iOS & Android</p>
          </div>

          <div className="hero__phone animate-float">
            <div className="phone-mockup">
              <div className="phone-mockup__screen">
                <div className="pm-header">
                  <span className="pm-logo">
                    <img src="/assets/logo.png" alt="GulGule" className="pm-logo__img" />
                    GulGule
                  </span>
                  <span className="pm-coins">🪙 240</span>
                </div>
                <div className="pm-status-row">
                  <span className="pm-status-dot" />
                  <span className="pm-status-text">You're online</span>
                </div>
                <div className="pm-cards">
                  {[
                    { name: 'Priya', age: 22, tag: 'Music · Hindi', available: true, type: 'audio' },
                    { name: 'Neha', age: 24, tag: 'Travel · English', available: true, type: 'video' },
                    { name: 'Anjali', age: 21, tag: 'Art · Tamil', available: false, type: 'audio' },
                  ].map((p, i) => (
                    <div className={`pm-card ${!p.available ? 'pm-card--unavailable' : ''}`} key={i}>
                      <div className="pm-card__avatar">{p.name[0]}</div>
                      <div className="pm-card__info">
                        <strong>{p.name}, {p.age}</strong>
                        <small>{p.tag}</small>
                      </div>
                      <div className="pm-card__actions">
                        <button className={`pm-btn pm-btn--${p.type} ${!p.available ? 'pm-btn--off' : ''}`}>
                          {p.type === 'audio' ? '🎤' : '📹'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="phone-mockup__glow" />
          </div>
        </div>

        {/* Stats */}
        <div className="hero__stats">
          {STATS.map((s, i) => (
            <Reveal as="div" className="hero__stat" key={s.label} delay={i * 80} effect="up">
              <span className="hero__stat-val grad-text">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QUICK FEATURE STRIP */}
      <section className="feature-strip">
        <div className="feature-strip__inner">
          {[
            { icon: '🎤', title: 'Audio Calls', desc: 'Crystal-clear voice, anytime' },
            { icon: '📹', title: 'Video Calls', desc: 'Face-to-face connection' },
            { icon: '💬', title: 'Live Chat', desc: 'Instant messages, real replies' },
            { icon: '🪙', title: 'Earn Coins', desc: 'Talk and get rewarded' },
          ].map((f, i) => (
            <Reveal as="div" className="feature-strip__item" key={f.title} delay={i * 90} effect="up">
              <span className="feature-strip__icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="testimonials__inner">
          <Reveal effect="up">
            <h2 className="section-title">Real people. <span className="grad-text">Real friendships.</span></h2>
            <p className="section-sub">Millions of new connections and friendships happen every day on GulGule.</p>
          </Reveal>
          <div className="testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal as="div" className="testimonial-card" key={t.name} delay={i * 110} effect="scale">
                <div className="testimonial-card__quote">"</div>
                <p className="testimonial-card__text">{t.text}</p>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__avatar">{t.avatar}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.city}</small>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <Reveal effect="up">
            <h2>Meet someone new<br /><span className="grad-text">in under 30 seconds.</span></h2>
            <p>Download GulGule free — the Freindship-App to meet new people and make new friends. No credit card. No subscription required.</p>
            <Link to="/download" className="btn-primary btn-primary--lg">Download Now — It's Free</Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
