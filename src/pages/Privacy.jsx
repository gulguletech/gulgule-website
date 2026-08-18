import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Privacy.css';

const LAST_UPDATED = 'August 18, 2026';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect information you provide directly, such as your name, phone number, date of birth, profile photos, and any details you add to your profile.',
      'We also collect information generated through your use of GulGule, including call and chat metadata (such as duration and timestamps), device information, IP address, app usage data, and location data where you have granted permission.',
      'If you make a purchase or send a gift within the app, we (or our payment processing partners) collect transaction details necessary to complete and record that payment.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'To create and maintain your account, verify your identity via phone OTP, and operate core features like calling, chat, and matching.',
      'To keep the platform safe — including automated and human review of reported content, fraud prevention, and enforcement of our community guidelines.',
      'To personalise your experience, respond to support requests, send you service-related notifications, and improve GulGule through aggregated, non-identifying analytics.',
    ],
  },
  {
    title: '3. How We Share Your Information',
    body: [
      'We do not sell your personal information. We share data only with service providers who help us run GulGule (such as cloud hosting, payment processing, and SMS/OTP delivery), and only to the extent needed for them to perform those services.',
      'We may disclose information if required by law, to protect the rights and safety of our users, or in connection with a merger, acquisition, or sale of assets, subject to confidentiality safeguards.',
    ],
  },
  {
    title: '4. Calls, Chats & Moderation',
    body: [
      'Calls and messages on GulGule are encrypted in transit. Automated systems may scan for policy violations such as harassment, nudity, or threats; content flagged by these systems or reported by users may be reviewed by our trust & safety team.',
      'We retain limited metadata (not full recordings, unless required for an active abuse investigation) to support safety reviews and comply with legal obligations.',
    ],
  },
  {
    title: '5. Data Retention',
    body: [
      'We retain your information for as long as your account is active and for a reasonable period afterward to comply with legal obligations, resolve disputes, and enforce our agreements.',
      'You can request deletion of your account and associated data at any time, subject to any records we are legally required to keep.',
    ],
  },
  {
    title: '6. Your Choices & Rights',
    body: [
      'You can access, update, or delete your profile information from within the app at any time.',
      'You can withdraw location or notification permissions through your device settings, and you can request a copy or deletion of your data by contacting us using the details below.',
    ],
  },
  {
    title: '7. Children\u2019s Privacy',
    body: [
      'GulGule is intended for users aged 18 and above. We do not knowingly collect information from anyone under 18. If we learn that we have collected data from a minor, we will delete it promptly.',
    ],
  },
  {
    title: '8. Security',
    body: [
      'We use industry-standard technical and organisational measures — including encryption, access controls, and regular security reviews — to protect your information. No system is completely secure, so we encourage you to use strong, unique passwords and report any suspicious activity.',
    ],
  },
  {
    title: '9. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the app or by other reasonable means before the changes take effect.',
    ],
  },
  {
    title: '10. Contact Us',
    body: [
      'If you have questions about this Privacy Policy or how we handle your data, reach out to us at gulguletech@gmail.com or write to us at our registered office below.',
    ],
  },
];

export default function Privacy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="privacy-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="page-hero__inner">
          <Reveal effect="up">
            <span className="page-eyebrow">Your data, respected</span>
            <h1>Privacy <span className="grad-text">Policy</span></h1>
            <p>This policy explains what information GulGule collects, how we use it, and the choices you have. Last updated: {LAST_UPDATED}.</p>
          </Reveal>
        </div>
      </section>

      <section className="privacy-section">
        <div className="privacy-inner">
          <Reveal effect="up" className="privacy-card">
            {SECTIONS.map((s) => (
              <div className="privacy-block" key={s.title}>
                <h2>{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}

            <div className="privacy-block privacy-block--address">
              <h2>Registered Office</h2>
              <p>
                LumX Pvt. Ltd.<br />
                3rd Floor, Vajra Building, Bellandur, NGEF Layout,<br />
                Sadanandanagar, Bennigana Halli, Bengaluru, Karnataka 560038
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="page-cta">
        <Link to="/download" className="btn-primary btn-primary--lg">Join GulGule — Download Free</Link>
      </div>
    </div>
  );
}
