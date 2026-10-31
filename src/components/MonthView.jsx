import { useMemo } from 'react';
import { CATS, CAT_ORDER, catStyle } from '../lib/config.js';
import { DOW, addDays, keyOf, startOfWeek } from '../lib/dates.js';
import { groupByDay, sortTasks } from '../lib/tasks.js';
import { Crown } from './Icons.jsx';

const MAX_PILLS = 3;

// Month view is read-only: category names in their colors, plus crowns. Clicking a day opens that week.
export default function MonthView({ anchor, tasks, crowns, onPickDay }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const cells = [];
  for (let d = startOfWeek(first), end = addDays(startOfWeek(last), 6); d <= end; d = addDays(d, 1)) cells.push(d);
  const today = keyOf(new Date());
  const byDay = useMemo(() => groupByDay(tasks), [tasks]);

  return (
    <div className="month">
      <div className="mgrid">
        {DOW.map(d => <div key={d} className="mhead">{d}</div>)}
        {cells.map(d => {
          const k = keyOf(d);
          const list = sortTasks(byDay[k] || []);
          const out = d.getMonth() !== anchor.getMonth();
          return (
            <button
              type="button"
              key={k}
              className={`mcell ${out ? 'out' : ''} ${k === today ? 'today' : ''}`}
              onClick={() => onPickDay(d)}
              aria-label={`${d.toDateString()}: ${list.length} tasks${crowns[k] ? ', crowned' : ''}. Open this week`}
            >
              <div className="mtop"><span className="mnum">{d.getDate()}</span>{crowns[k] && <Crown />}</div>
              {list.slice(0, MAX_PILLS).map(t => <span key={t.id} className="pill" style={catStyle(t.category)}>{CATS[t.category].name}</span>)}
              {list.length > MAX_PILLS && <span className="more">+{list.length - MAX_PILLS} more</span>}
              <span className="dots">{list.map(t => <i key={t.id} className="dot" style={catStyle(t.category)} />)}</span>
            </button>
          );
        })}
      </div>
      <div className="legend">
        {CAT_ORDER.map(c => <span key={c} style={catStyle(c)}><i />{CATS[c].name}</span>)}
        <span><Crown />Successful day</span>
      </div>
    </div>
  );
}
