import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Privacy.css';

const SUPPORT_EMAIL = 'gulguletech@gmail.com';
const MAIL_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Delete my GulGule account')}`;

const SECTIONS = [
  {
    title: 'Delete your account inside the app',
    steps: [
      'Open the GulGule app and go to the Profile tab.',
      'Scroll down and tap Delete Account.',
      'Confirm when asked. Your account is deleted immediately and you are logged out.',
    ],
  },
  {
    title: 'What gets deleted',
    bullets: [
      'Your profile: name, bio, photo, interests, languages and phone number.',
      'Your chats and messages.',
      'Verification files you uploaded: selfie, voice note and PAN image.',
      'Payment screenshots and UPI IDs you submitted.',
      'Any remaining coins or balance. These cannot be refunded or restored after deletion.',
    ],
  },
  {
    title: 'What we keep',
    body: [
      'Basic transaction and call records (amounts and dates only, with no personal details) are kept for accounting and legal compliance.',
    ],
  },
  {
    title: 'Before you delete',
    body: [
      'If you have a withdrawal that is still pending, please wait until it is processed. Deletion is blocked until then.',
    ],
  },
];

export default function DeleteAccount() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="privacy-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="page-hero__inner">
          <Reveal effect="up">
            <span className="page-eyebrow">Your data, your choice</span>
            <h1>Delete Your <span className="grad-text">Account</span></h1>
            <p>You can delete your GulGule account and personal data at any time. Here is how.</p>
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
                {s.steps && (
                  <ol className="delete-list">
                    {s.steps.map((t, i) => <li key={i}>{t}</li>)}
                  </ol>
                )}
                {s.bullets && (
                  <ul className="delete-list">
                    {s.bullets.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </div>
            ))}

            <div className="privacy-block privacy-block--address">
              <h2>Can't open the app?</h2>
              <p>
                Email us from support with your registered phone number and we will delete your
                account within 7 days.
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
