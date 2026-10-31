import { useMemo, useState } from 'react';
import { DOW_LONG, MONTHS, keyOf, weekDays } from '../lib/dates.js';
import { groupByDay, sortTasks } from '../lib/tasks.js';
import { Crown, IcPlus } from './Icons.jsx';
import TaskCard from './TaskCard.jsx';

// The week as a vertical list: one row per day (Monday at the top), tasks listed under each other.
export default function WeekView({ anchor, tasks, crowns, editing, onToggleCrown, onMove, onOpenTask, onAdd }) {
  const days = weekDays(anchor);
  const today = keyOf(new Date());
  const [over, setOver] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [popped, setPopped] = useState(null);
  const byDay = useMemo(() => groupByDay(tasks), [tasks]);

  const dropHandlers = k => !editing ? {} : {
    onDragOver: e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== k) setOver(k); },
    onDragLeave: e => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(null); },
    onDrop: e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      setOver(null); setDragId(null);
      if (id) onMove(id, k);
    },
  };

  return (
    <div className="week">
      {days.map((d, i) => {
        const k = keyOf(d);
        const list = sortTasks(byDay[k] || []);
        const crowned = !!crowns[k];
        const isToday = k === today;
        return (
          <section
            key={k}
            className={`day ${isToday ? 'today' : ''} ${over === k ? 'over' : ''}`}
            aria-label={`${DOW_LONG[i]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`}
            {...dropHandlers(k)}
          >
            <div className="day-head">
              <div className="day-date">
                <span className="dnum">{d.getDate()}</span>
                <span className="dtext">
                  <span className="dname">{DOW_LONG[i]}</span>
                  <span className="dmonth">{isToday ? <span className="today-tag">Today</span> : MONTHS[d.getMonth()].slice(0, 3)}</span>
                </span>
              </div>
              {editing ? (
                <button
                  type="button"
                  className={`crown-btn ${popped === k ? 'pop' : ''}`}
                  aria-pressed={crowned}
                  aria-label={crowned ? 'Remove crown' : 'Crown this day as a successful day'}
                  title={crowned ? 'Successful day!' : 'Mark as a successful day'}
                  onClick={() => { setPopped(crowned ? null : k); onToggleCrown(k); }}
                >
                  <Crown on={crowned} />
                </button>
              ) : crowned && <span className="crown-static" title="Successful day"><Crown /></span>}
            </div>

            <div className="tasks">
              {list.length === 0 && !editing && <div className="empty">Free day</div>}
              {list.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  editing={editing}
                  dragging={dragId === t.id}
                  onOpen={onOpenTask}
                  onDragStart={setDragId}
                  onDragEnd={() => { setDragId(null); setOver(null); }}
                />
              ))}
              {editing && (
                <button type="button" className="add-row" onClick={() => onAdd(k)}>
                  <IcPlus />{list.length === 0 ? 'Add a task or drop one here' : 'Add task'}
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
