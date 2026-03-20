/**
 * Format a currency amount using the user's browser locale.
 * Returns '—' for zero/invalid values.
 */
export function formatAmount(amount, currency) {
  const num = parseFloat(amount);
  if (isNaN(num) || num === 0) return '\u2014';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num);
}

/**
 * Format a date string using the user's browser locale.
 * Returns null if dateStr is falsy.
 */
export function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });
}
