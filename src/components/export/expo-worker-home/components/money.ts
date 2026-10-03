/** ₹ with Indian digit grouping (1,00,000) — no Intl dependency. */
export function inr(n: number, sign: '' | '-' = ''): string {
  const s = String(Math.round(Math.abs(n)));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${sign === '-' ? '−' : ''}₹${rest ? `${rest},${last3}` : last3}`;
}
