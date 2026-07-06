import React from 'react';

// Expects a Spring Data `Page` shape: { number, totalPages, totalElements }
export default function Pagination({ page, onPageChange }) {
  if (!page || page.totalPages <= 1) return null;

  const current = page.number;
  const last = page.totalPages - 1;

  return (
    <div className="admin-pagination">
      <button disabled={current <= 0} onClick={() => onPageChange(current - 1)}>
        ← Prev
      </button>
      <span className="admin-pagination__label">
        Page {current + 1} of {page.totalPages} · {page.totalElements} total
      </span>
      <button disabled={current >= last} onClick={() => onPageChange(current + 1)}>
        Next →
      </button>
    </div>
  );
}
