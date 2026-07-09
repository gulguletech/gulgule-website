import React, { useEffect, useState } from 'react';
import { agencyApi } from '../agencyApi';
import { Spinner, EmptyState, ErrorBanner } from '../../admin/components/Feedback';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function currentYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export default function Earnings() {
  const [{ year, month }, setYearMonth] = useState(currentYearMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(y = year, m = month) {
    setLoading(true);
    setError('');
    try {
      const result = await agencyApi.getEarnings(y, m);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const girls = (data?.girls || []).slice().sort((a, b) => (b.earnings || 0) - (a.earnings || 0));

  // Last 12 months, newest first, for the picker.
  const now = new Date();
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthOptions.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Earnings</h1>
          <p>Combined and individual earnings for your girls, by month.</p>
        </div>
        <div className="admin-toolbar">
          <select
            className="admin-select"
            value={`${year}-${month}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-').map(Number);
              setYearMonth({ year: y, month: m });
            }}
          >
            {monthOptions.map((opt) => (
              <option key={`${opt.year}-${opt.month}`} value={`${opt.year}-${opt.month}`}>
                {MONTH_NAMES[opt.month - 1]} {opt.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={() => load()} />

      {loading ? (
        <Spinner label="Loading earnings…" />
      ) : (
        data && (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-card__label">Combined total</div>
                <div className="admin-stat-card__value">₹{Number(data.totalEarnings || 0).toFixed(2)}</div>
                <div className="admin-stat-card__sub">
                  {MONTH_NAMES[(data.month || month) - 1]} {data.year || year}
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__label">Girls with earnings</div>
                <div className="admin-stat-card__value">
                  {girls.filter((g) => (g.earnings || 0) > 0).length}
                </div>
                <div className="admin-stat-card__sub">of {data.girlsCount ?? girls.length} total</div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__head">
                <h2>Per-girl breakdown</h2>
              </div>
              {girls.length === 0 ? (
                <EmptyState title="No girls to show" hint="No one has linked your agency code yet." />
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {girls.map((g) => (
                        <tr key={g.userId}>
                          <td>{g.username || <em>—</em>}</td>
                          <td>₹{Number(g.earnings || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}
