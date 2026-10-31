import { catStyle } from '../lib/config.js';
import { fmtTime } from '../lib/dates.js';
import { taskTitle } from '../lib/tasks.js';
import { CatIcon, IcClock, IcGrip } from './Icons.jsx';

// One task, shown as a single row: category · title · time.
export default function TaskCard({ task, cat, editing, dragging, onOpen, onDragStart, onDragEnd }) {
  const time = task.start ? `${fmtTime(task.start)}${task.end ? ' – ' + fmtTime(task.end) : ''}` : 'Anytime';
  const inner = <>
    <span className="cat-cell"><span className="chip"><CatIcon icon={cat.icon} />{cat.name}</span></span>
    <span className="title">{taskTitle(task, cat)}{task.organizer && <span className="organizer">by {task.organizer}</span>}</span>
    <span className={`time ${task.start ? '' : 'anytime'}`}><IcClock />{time}</span>
    {editing && <IcGrip />}
  </>;

  // View mode: read-only row with all details.
  if (!editing) return <div className="card" style={catStyle(cat)}>{inner}</div>;

  // Edit mode: draggable, and clicking opens the edit dialog.
  return (
    <button
      type="button"
      className={`card editable ${dragging ? 'dragging' : ''}`}
      style={catStyle(cat)}
      draggable
      onDragStart={e => { e.dataTransfer.setData('text/plain', task.id); e.dataTransfer.effectAllowed = 'move'; onDragStart(task.id); }}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(task)}
      aria-label={`Edit ${taskTitle(task, cat)}`}
    >
      {inner}
    </button>
  );
}
