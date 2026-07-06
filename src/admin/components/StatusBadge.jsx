import React from 'react';

// Central place mapping every status/role/type string the backend can send
// to a badge tone. Unknown values still render (as neutral), they just
// won't be color-coded — so a new enum value on the backend never breaks
// the admin UI, it just looks plain until this map is updated.
const TONE_MAP = {
  // verification / user status
  APPROVED: 'good',
  VERIFIED: 'good',
  SUCCESS: 'good',
  PENDING: 'warn',
  NOT_SUBMITTED: 'neutral',
  REJECTED: 'bad',
  FAILED: 'bad',
  // roles
  BOY: 'info',
  GIRL: 'pink',
  ADMIN: 'purple',
  // call status
  INITIATED: 'warn',
  ACCEPTED: 'good',
  ENDED: 'neutral',
  MISSED: 'bad',
  DECLINED: 'bad',
  // transaction type
  COIN_PURCHASE: 'info',
  COIN_DEDUCT: 'neutral',
  MONEY_EARN: 'good',
  WITHDRAWAL: 'pink',
  REFUND: 'warn',
};

export default function StatusBadge({ value }) {
  if (value === null || value === undefined || value === '') {
    return <span className="badge badge--neutral">—</span>;
  }
  const tone = TONE_MAP[value] || 'neutral';
  return <span className={`badge badge--${tone}`}>{String(value).replaceAll('_', ' ')}</span>;
}
