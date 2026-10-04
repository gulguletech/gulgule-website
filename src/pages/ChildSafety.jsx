import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Privacy.css';

const SUPPORT_EMAIL = 'gulguletech@gmail.com';
const MAIL_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('GulGule child safety concern')}`;

const SECTIONS = [
  {
    title: 'Our commitment',
    body: [
      'GulGule has zero tolerance for child sexual abuse and exploitation (CSAE), including child sexual abuse material (CSAM), grooming, sexualisation of minors, and any attempt to contact or exploit a child.',
    ],
  },
  {
    title: 'Adults only',
    body: [
      'GulGule is only for people aged 18 and above. Anyone under 18 is not allowed to create an account or use the app. If we find or are told that an account belongs to a minor, we suspend it.',
    ],
  },
  {
    title: 'What is not allowed',
    bullets: [
      'Any sexual or exploitative content involving a person under 18.',
      'Grooming, or asking a minor for sexual content or a meeting.',
      'Sharing, requesting or promoting child sexual abuse material.',
      'Pretending to be a minor, or using the app to find minors.',
    ],
  },
  {
    title: 'How users can report',
    bullets: [
      'In the app: open any profile or chat and tap Report (or the menu icon in a chat), then choose a reason.',
      'Users can also block anyone from the same menu. A blocked person can no longer see or contact them.',
      'By email: write to us at the address below with the details.',
    ],
  },
  {
    title: 'What we do about reports',
    bullets: [
      'Our team reviews every report, and reports about child safety are handled first.',
      'We remove violating content and suspend or permanently ban accounts that break these rules.',
      'We keep records needed for investigation and cooperate with law enforcement.',
      'Where required by law, we report suspected child sexual abuse material and exploitation to the relevant national and regional authorities.',
    ],
  },
  {
    title: 'Compliance with the law',
    body: [
      'We follow the child safety laws that apply to our service, including the laws of India, and we act on valid legal requests from authorities.',
    ],
  },
];

export default function ChildSafety() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="privacy-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="page-hero__inner">
          <Reveal effect="up">
            <span className="page-eyebrow">Safety first</span>
            <h1>Child Safety <span className="grad-text">Standards</span></h1>
            <p>How GulGule protects children and fights child sexual abuse and exploitation (CSAE).</p>
          </Reveal>
        </div>
      </section>

      <section className="privacy-section">
        <div className="privacy-inner">
          <Reveal effect="up" className="privacy-card">
            {SECTIONS.map((s) => (
              <div className="privacy-block" key={s.title}>
                <h2>{s.title}</h2>
                {s.body && s.body.map((p, i) => <p key={i}>{p}</p>)}
                {s.bullets && (
                  <ul className="delete-list">
                    {s.bullets.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </div>
            ))}

            <div className="privacy-block privacy-block--address">
              <h2>Contact for child safety</h2>
              <p>
                Onaroy Industries Private Limited<br />
                F Coworking Building, Cabin No.126, 1-10-176, Begumpet,<br />
                Secunderabad, Hyderabad, Telangana.
              </p>
              <p>
                To report a child safety concern or to reach our designated contact on CSAM
                prevention, email us:
              </p>
              <a href={MAIL_HREF} className="btn-primary">Email {SUPPORT_EMAIL}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="page-cta">
        <Link to="/privacy" className="btn-primary btn-primary--lg">Read our Privacy Policy</Link>
      </div>
    </div>
  );
}
