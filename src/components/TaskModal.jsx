import { useState } from 'react';
import { CATS, CAT_ORDER, OPTIONS, PROMPTS, catStyle } from '../lib/config.js';
import { uid } from '../lib/tasks.js';
import { CatIcon, IcCheck } from './Icons.jsx';

// Step 1: pick a category. Step 2: fill in the category's own question, date and optional time.
export default function TaskModal({ initial, defaultDate, onSave, onDelete, onClose }) {
  const isEdit = !!initial;
  const [cat, setCat] = useState(initial ? initial.category : null);
  const [detail, setDetail] = useState(initial?.detail || '');
  const [count, setCount] = useState(initial?.count ?? 1);
  const [date, setDate] = useState(initial?.date || defaultDate);
  const [hasTime, setHasTime] = useState(!!initial?.start);
  const [start, setStart] = useState(initial?.start || '09:00');
  const [end, setEnd] = useState(initial?.end || '10:00');
  const [errors, setErrors] = useState({});
  const [confirmDel, setConfirmDel] = useState(false);

  const pick = c => { setCat(c); setDetail(''); setErrors({}); setHasTime(c === 'network'); };

  const submit = e => {
    e.preventDefault();
    const err = {};
    if (cat === 'job') {
      const n = Number(count);
      if (count === '' || !Number.isInteger(n) || n < 0) err.count = 'Enter a whole number, like 5.';
    } else if (!detail.trim()) {
      err.detail = OPTIONS[cat] ? 'Pick one option.' : 'Type a short description.';
    }
    if (!date) err.date = 'Pick a date.';
    if (hasTime && (!start || !end)) err.time = 'Fill in both times, or turn the time switch off.';
    else if (hasTime && end <= start) err.time = 'End time must be after the start time.';
    setErrors(err);
    if (Object.keys(err).length) return;

    onSave({
      ...(initial || { id: uid(), order: Date.now() }),
      category: cat,
      date,
      detail: cat === 'job' ? '' : detail.trim(),
      count: cat === 'job' ? Number(count) : undefined,
      start: hasTime ? start : '',
      end: hasTime ? end : '',
      sample: false,
    });
  };

  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mt">
        {!cat ? (
          <>
            <h3 id="mt">Add a task</h3>
            <p className="sub">First, pick a category.</p>
            <div className="cat-grid">
              {CAT_ORDER.map(c => (
                <button key={c} type="button" className="cat-tile" style={catStyle(c)} onClick={() => pick(c)}>
                  <span className="ic"><CatIcon cat={c} /></span>{CATS[c].name}
                </button>
              ))}
            </div>
            <div className="modal-foot" style={{ marginTop: 20 }}>
              <div className="right"><button type="button" className="btn" onClick={onClose}>Cancel</button></div>
            </div>
          </>
        ) : (
          <form className="form" onSubmit={submit} noValidate>
            <div>
              <h3 id="mt">{isEdit ? 'Edit task' : PROMPTS[cat]}</h3>
              <div className="picked" style={catStyle(cat)}>
                <span className="chip"><CatIcon cat={cat} />{CATS[cat].name}</span>
                {!isEdit && <button type="button" className="btn ghost" onClick={() => setCat(null)}>Change</button>}
              </div>
            </div>

            {OPTIONS[cat] && (
              <div className="field">
                <label htmlFor="f-option">{PROMPTS[cat]}</label>
                <select id="f-option" className={`input ${errors.detail ? 'bad' : ''}`} value={detail} onChange={e => setDetail(e.target.value)}>
                  <option value="">Choose one…</option>
                  {OPTIONS[cat].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.detail && <span className="err">{errors.detail}</span>}
              </div>
            )}

            {(cat === 'network' || cat === 'others') && (
              <div className="field">
                <label htmlFor="f-text">{PROMPTS[cat]}</label>
                <input
                  id="f-text"
                  className={`input ${errors.detail ? 'bad' : ''}`}
                  value={detail}
                  onChange={e => setDetail(e.target.value)}
                  autoFocus
                  placeholder={cat === 'network' ? 'e.g. PyData meetup downtown' : 'e.g. Dentist appointment'}
                />
                {errors.detail && <span className="err">{errors.detail}</span>}
              </div>
            )}

            {cat === 'job' && (
              <div className="field">
                <label htmlFor="f-count">{PROMPTS.job}</label>
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

            <div className="field">
              <button type="button" id="f-hastime" className="toggle" role="switch" aria-checked={hasTime} onClick={() => setHasTime(v => !v)}>
                <span className="switch" />{cat === 'network' ? 'Set event time' : 'Add start and end time'}
              </button>
              {hasTime && (
                <div className="row">
                  <div className="field"><label htmlFor="f-start">Start</label><input id="f-start" type="time" className="input" value={start} onChange={e => setStart(e.target.value)} /></div>
                  <div className="field"><label htmlFor="f-end">End</label><input id="f-end" type="time" className={`input ${errors.time ? 'bad' : ''}`} value={end} onChange={e => setEnd(e.target.value)} /></div>
                </div>
              )}
              {errors.time && <span className="err">{errors.time}</span>}
            </div>

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
        )}
      </div>
    </div>
  );
}
