import { addDays, keyOf, startOfWeek } from './dates.js';

export const uid = () => Math.random().toString(36).slice(2, 10);

// Count tasks read like "5 job applications"; everything else shows its text.
export const taskTitle = (t, cat) =>
  cat.type === 'count' ? `${t.count} ${cat.unit || cat.name}${t.count === 1 ? '' : 's'}` : t.detail;

// Reminders always lead the day in week and month views. Within each priority
// group, untimed tasks keep their added order and timed tasks sort by start.
export const sortTasks = list => [...list].sort((a, b) => {
  const aReminder = String(a.category).toLowerCase() === 'reminder';
  const bReminder = String(b.category).toLowerCase() === 'reminder';
  if (aReminder !== bReminder) return aReminder ? -1 : 1;
  if (!a.start && !b.start) return (a.order || 0) - (b.order || 0);
  if (!a.start) return -1;
  if (!b.start) return 1;
  return a.start.localeCompare(b.start);
});

export const groupByDay = tasks => {
  const m = {};
  tasks.forEach(t => (m[t.date] = m[t.date] || []).push(t));
  return m;
};

// Example data shown on the very first visit, so the calendar isn't empty.
export function makeSample() {
  const mon = startOfWeek(new Date());
  const d = n => keyOf(addDays(mon, n));
  let o = 0;
  const T = (day, category, extra) => ({ id: uid(), date: d(day), category, start: '', end: '', sample: true, order: o++, ...extra });
  const tasks = [
    T(-7, 'learning', { detail: 'Machine Learning video' }), T(-6, 'job', { count: 4 }), T(-5, 'project', { detail: 'Spaceship titanic' }),
    T(-4, 'network', { detail: 'Alumni mixer', start: '18:00', end: '20:00' }), T(-3, 'house', { detail: 'Laundry' }), T(-2, 'learning', { detail: 'Kaggle' }),
    T(0, 'learning', { detail: 'Data Analysis' }), T(0, 'job', { count: 5 }),
    T(1, 'network', { detail: 'Women in Data coffee chat', start: '18:00', end: '19:30' }), T(1, 'project', { detail: 'Spaceship titanic' }),
    T(2, 'learning', { detail: 'Kaggle' }), T(2, 'house', { detail: 'Laundry' }),
    T(3, 'project', { detail: 'Homicide-clearance' }), T(3, 'job', { count: 3 }),
    T(4, 'learning', { detail: 'AWS Data Certificate' }), T(4, 'others', { detail: 'Call mom' }),
    T(5, 'house', { detail: 'Deep cleaning' }), T(5, 'network', { detail: 'PyData meetup', start: '14:00', end: '16:00' }),
    T(6, 'project', { detail: 'Wine Inventory Tracker' }),
    T(9, 'network', { detail: 'Career fair', start: '10:00', end: '13:00' }), T(10, 'learning', { detail: 'Data Analysis' }), T(12, 'house', { detail: 'Decorate' }),
  ];
  const crowns = { [d(-7)]: true, [d(-5)]: true, [d(-2)]: true, [d(0)]: true, [d(1)]: true, [d(3)]: true };
  return { tasks, crowns };
}
