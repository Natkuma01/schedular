import { useState } from 'react';
import { catById, catStyle } from '../lib/config.js';
import { uid } from '../lib/tasks.js';
import { CatIcon, IcCheck, IcPencil, IcPlus } from './Icons.jsx';
import CategoryEditor from './CategoryEditor.jsx';

// Step 1: pick a category (or edit the categories). Step 2: fill in the category's own question, date and time.
export default function TaskModal({ initial, defaultDate, cats, usage, onSave, onDelete, onSaveCat, onDeleteCat, onClose }) {
  const isEdit = !!initial;
  const [catId, setCatId] = useState(initial ? initial.category : null);
  const [detail, setDetail] = useState(initial?.detail || '');
  const [organizer, setOrganizer] = useState(initial?.organizer || '');
  const [count, setCount] = useState(initial?.count ?? 1);
  const [date, setDate] = useState(initial?.date || defaultDate);
  const [hasTime, setHasTime] = useState(!!initial?.start);
  const [start, setStart] = useState(initial?.start || '09:00');
  const [end, setEnd] = useState(initial?.end || '10:00');
  const [errors, setErrors] = useState({});
  const [confirmDel, setConfirmDel] = useState(false);
  const [managing, setManaging] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // null, 'new', or a category
  const [addingOpt, setAddingOpt] = useState(false);
  const [newOpt, setNewOpt] = useState('');

  const cat = catId && catById(cats, catId);
  const type = cat?.type;
  const allDay = type === 'dropdown';
  // Keep an option that was removed from the list visible on tasks that still use it.
  const options = type === 'dropdown'
    ? (detail && !cat.options.includes(detail) ? [...cat.options, detail] : cat.options)
    : [];

  const pick = c => { setCatId(c.id); setDetail(''); setErrors({}); setHasTime(c.type === 'event'); setAddingOpt(false); };

  const addOption = () => {
    const v = newOpt.trim();
    if (!v) { setAddingOpt(false); return; }
    const existing = cat.options.find(o => o.toLowerCase() === v.toLowerCase());
    if (!existing) onSaveCat({ ...cat, options: [...cat.options, v] });
    setDetail(existing || v);
    setNewOpt('');
    setAddingOpt(false);
    setErrors(e => ({ ...e, detail: undefined }));
  };

  const submit = e => {
    e.preventDefault();
    const err = {};
    const timed = hasTime && !allDay;
    if (type === 'count') {
      const n = Number(count);
      if (count === '' || !Number.isInteger(n) || n < 0) err.count = 'Enter a whole number, like 5.';
    } else if (!detail.trim()) {
      err.detail = type === 'dropdown' ? 'Pick one option.' : 'Type a short description.';
    }
    if (!date) err.date = 'Pick a date.';
    if (timed && (!start || !end)) err.time = 'Fill in both times, or turn the time switch off.';
    else if (timed && end <= start) err.time = 'End time must be after the start time.';
    setErrors(err);
    if (Object.keys(err).length) return;

    onSave({
      ...(initial || { id: uid(), order: Date.now() }),
      category: catId,
      date,
      detail: type === 'count' ? '' : detail.trim(),
      organizer: type === 'event' ? organizer.trim() || undefined : undefined,
      count: type === 'count' ? Number(count) : undefined,
      start: timed ? start : '',
      end: timed ? end : '',
      sample: false,
    });
  };

  if (editingCat) {
    return (
      <Shell onClose={onClose}>
        <CategoryEditor
          key={editingCat === 'new' ? 'new' : editingCat.id}
          initial={editingCat === 'new' ? null : editingCat}
          cats={cats}
          used={editingCat === 'new' ? 0 : usage[editingCat.id] || 0}
          onSave={c => { onSaveCat(c); setEditingCat(null); }}
          onDelete={id => { onDeleteCat(id); setEditingCat(null); }}
          onBack={() => setEditingCat(null)}
        />
      </Shell>
    );
  }

  if (!cat) {
    return (
      <Shell onClose={onClose}>
        <h3 id="mt">{managing ? 'Edit categories' : 'Add a task'}</h3>
        <p className="sub">{managing ? 'Click a category to rename it, change its question, or edit its options.' : 'First, pick a category.'}</p>
        <div className="cat-grid">
          {cats.map(c => (
            <button key={c.id} type="button" className="cat-tile" style={catStyle(c)}
              onClick={() => (managing ? setEditingCat(c) : pick(c))}
              aria-label={managing ? `Edit ${c.name}` : undefined}>
              <span className="ic"><CatIcon icon={c.icon} /></span>{c.name}
              {managing && <span className="tile-edit"><IcPencil /></span>}
            </button>
          ))}
          {managing && (
            <button type="button" className="cat-tile new" onClick={() => setEditingCat('new')}>
              <span className="ic"><IcPlus /></span>New category
            </button>
          )}
        </div>
        <div className="modal-foot" style={{ marginTop: 20 }}>
          {managing ? (
            <div className="right"><button type="button" className="btn green" onClick={() => setManaging(false)}><IcCheck />Done</button></div>
          ) : (
            <>
              <button type="button" className="btn ghost" onClick={() => setManaging(true)}><IcPencil />Edit categories</button>
              <div className="right"><button type="button" className="btn" onClick={onClose}>Cancel</button></div>
            </>
          )}
        </div>
      </Shell>
    );
  }

  return (
    <Shell onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <div>
          <h3 id="mt">{isEdit ? 'Edit task' : cat.prompt}</h3>
          <div className="picked" style={catStyle(cat)}>
            <span className="chip"><CatIcon icon={cat.icon} />{cat.name}</span>
            {!isEdit && <button type="button" className="btn ghost" onClick={() => setCatId(null)}>Change</button>}
          </div>
        </div>

        {type === 'dropdown' && (
          <div className="field">
            <label htmlFor="f-option">{cat.prompt}</label>
            <select id="f-option" className={`input ${errors.detail ? 'bad' : ''}`} value={detail} onChange={e => setDetail(e.target.value)}>
              <option value="">Choose one…</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {addingOpt ? (
              <div className="add-opt">
                <input
                  className="input" aria-label="New option" value={newOpt} maxLength={40} autoFocus
                  onChange={e => setNewOpt(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); addOption(); }
                    if (e.key === 'Escape') { e.stopPropagation(); setAddingOpt(false); }
                  }}
                  placeholder="e.g. SQL practice"
                />
                <button type="button" className="btn" onClick={addOption}><IcCheck />Add</button>
              </div>
            ) : (
              <button type="button" className="btn ghost add-opt-btn" onClick={() => setAddingOpt(true)}><IcPlus />Add option</button>
            )}
            {errors.detail && <span className="err">{errors.detail}</span>}
          </div>
        )}

        {(type === 'event' || type === 'text') && (
          <div className="field">
            <label htmlFor="f-text">{cat.prompt}</label>
            <input
              id="f-text"
              className={`input ${errors.detail ? 'bad' : ''}`}
              value={detail}
              onChange={e => setDetail(e.target.value)}
              autoFocus
              placeholder={type === 'event' ? 'e.g. PyData meetup downtown' : 'e.g. Dentist appointment'}
            />
            {errors.detail && <span className="err">{errors.detail}</span>}
          </div>
        )}

        {type === 'event' && (
          <div className="field">
            <label htmlFor="f-organizer">Organizer</label>
            <input id="f-organizer" className="input" value={organizer} maxLength={40}
              onChange={e => setOrganizer(e.target.value)} placeholder="e.g. PyData Toronto" />
          </div>
        )}

        {type === 'count' && (
          <div className="field">
            <label htmlFor="f-count">{cat.prompt}</label>
            <div className="stepper">
              <button type="button" className="btn icon" aria-label="One less" onClick={() => setCount(c => Math.max(0, (Number(c) || 0) - 1))}>−</button>
              <input
                id="f-count"
                className={`input ${errors.count ? 'bad' : ''}`}
                type="number" min="0" step="1" inputMode="numeric"
                value={count}
                onChange={e => setCount(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <button type="button" className="btn icon" aria-label="One more" onClick={() => setCount(c => (Number(c) || 0) + 1)}>+</button>
            </div>
            {errors.count && <span className="err">{errors.count}</span>}
          </div>
        )}

        <div className="field">
          <label htmlFor="f-date">Date</label>
          <input id="f-date" type="date" className={`input ${errors.date ? 'bad' : ''}`} value={date} onChange={e => setDate(e.target.value)} />
          {errors.date && <span className="err">{errors.date}</span>}
        </div>

        {allDay ? (
          <p className="hint">All-day task.</p>
        ) : (
          <div className="field">
            <button type="button" id="f-hastime" className="toggle" role="switch" aria-checked={hasTime} onClick={() => setHasTime(v => !v)}>
              <span className="switch" />{type === 'event' ? 'Set event time' : 'Add start and end time'}
            </button>
            {hasTime && (
              <div className="row">
                <div className="field"><label htmlFor="f-start">Start</label><input id="f-start" type="time" className="input" value={start} onChange={e => setStart(e.target.value)} /></div>
                <div className="field"><label htmlFor="f-end">End</label><input id="f-end" type="time" className={`input ${errors.time ? 'bad' : ''}`} value={end} onChange={e => setEnd(e.target.value)} /></div>
              </div>
            )}
            {errors.time && <span className="err">{errors.time}</span>}
          </div>
        )}

        <div className="modal-foot">
          {isEdit && (confirmDel ? (
            <span className="confirm">
              Delete this task?
              <button type="button" className="btn danger" onClick={() => onDelete(initial.id)}>Delete</button>
              <button type="button" className="btn ghost" onClick={() => setConfirmDel(false)}>Keep</button>
            </span>
          ) : (
            <button type="button" className="btn ghost danger-text" onClick={() => setConfirmDel(true)}>Delete</button>
          ))}
          <div className="right">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn green"><IcCheck />{isEdit ? 'Save' : 'Add task'}</button>
          </div>
        </div>
      </form>
    </Shell>
  );
}

function Shell({ onClose, children }) {
  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mt">{children}</div>
    </div>
  );
}
