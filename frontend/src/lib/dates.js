// Date helpers. Days are stored as local "YYYY-MM-DD" keys. Weeks start on Monday.
export const pad = n => String(n).padStart(2, '0');
export const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const startOfWeek = d => addDays(d, -((d.getDay() + 6) % 7));
export const weekDays = d => { const s = startOfWeek(d); return Array.from({ length: 7 }, (_, i) => addDays(s, i)); };

export const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DOW_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const fmtTime = t => {
  if (!t) return '';
  let [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${pad(m)} ${ap}`;
};

export const weekLabel = d => {
  const days = weekDays(d), a = days[0], b = days[6];
  const ma = MONTHS[a.getMonth()].slice(0, 3), mb = MONTHS[b.getMonth()].slice(0, 3);
  return a.getMonth() === b.getMonth()
    ? `${ma} ${a.getDate()} – ${b.getDate()}, ${b.getFullYear()}`
    : `${ma} ${a.getDate()} – ${mb} ${b.getDate()}, ${b.getFullYear()}`;
};
