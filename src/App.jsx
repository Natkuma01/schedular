import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_NAME, GOAL, possessive } from './lib/config.js';
import { MONTHS, addDays, fromKey, keyOf, weekDays, weekLabel } from './lib/dates.js';
import { loadPref, loadState, savePref, saveState } from './lib/storage.js';
import { Cat, Crown, IcCheck, IcLeft, IcPencil, IcPlus, IcRight } from './components/Icons.jsx';
import WeekView from './components/WeekView.jsx';
import MonthView from './components/MonthView.jsx';
import TaskModal from './components/TaskModal.jsx';
import NameModal from './components/NameModal.jsx';
import Celebration from './components/Celebration.jsx';

export default function App() {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState(() => loadPref('view', 'week'));
  const [name, setName] = useState(() => loadPref('name', DEFAULT_NAME));
  const [anchor, setAnchor] = useState(() => new Date());
  const [editing, setEditing] = useState(false);
  const [modal, setModal] = useState(null); // { task?, date }
  const [naming, setNaming] = useState(false);
  const [party, setParty] = useState(0);

  useEffect(() => saveState(state), [state]);
  useEffect(() => savePref('view', view), [view]);
  useEffect(() => { savePref('name', name); document.title = `${possessive(name)} Calendar`; }, [name]);
  useEffect(() => {
    const k = e => { if (e.key === 'Escape') { setModal(null); setNaming(false); } };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  const { tasks, crowns, cats } = state;
  const days = weekDays(anchor);
  const weekCrowns = days.filter(d => crowns[keyOf(d)]).length;
  const hasSample = tasks.some(t => t.sample);

  const toggleCrown = k => {
    const wk = weekDays(fromKey(k)).map(keyOf);
    const before = wk.filter(x => crowns[x]).length;
    const next = { ...crowns };
    if (next[k]) delete next[k]; else next[k] = true;
    const after = wk.filter(x => next[x]).length;
    setState(s => ({ ...s, crowns: next }));
    if (before < GOAL && after >= GOAL) setTimeout(() => setParty(after), 350);
  };
  const moveTask = (id, date) =>
    setState(s => ({ ...s, tasks: s.tasks.map(t => (t.id === id ? { ...t, date, order: Date.now() } : t)) }));
  const saveTask = task => {
    setState(s => ({
      ...s,
      tasks: s.tasks.some(t => t.id === task.id) ? s.tasks.map(t => (t.id === task.id ? task : t)) : [...s.tasks, task],
    }));
    setModal(null);
  };
  const deleteTask = id => { setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) })); setModal(null); };
  const saveCat = cat => setState(s => ({
    ...s,
    cats: s.cats.some(c => c.id === cat.id) ? s.cats.map(c => (c.id === cat.id ? cat : c)) : [...s.cats, cat],
  }));
  const deleteCat = id => setState(s => ({ ...s, cats: s.cats.filter(c => c.id !== id) }));
  const usage = {};
  tasks.forEach(t => (usage[t.category] = (usage[t.category] || 0) + 1));
  const clearSamples = () => setState(s => ({ ...s, tasks: s.tasks.filter(t => !t.sample), crowns: {} }));
  const closeParty = useCallback(() => setParty(0), []);

  const shift = dir =>
    setAnchor(a => (view === 'week' ? addDays(a, 7 * dir) : new Date(a.getFullYear(), a.getMonth() + dir, 1)));
  const label = view === 'week' ? weekLabel(anchor) : `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
  const todayKey = keyOf(new Date());
  const defaultAddDate = days.some(d => keyOf(d) === todayKey) ? todayKey : keyOf(days[0]);

  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <div className="brand">
            <button type="button" className="cat-btn" onClick={() => setNaming(true)} aria-label="Change your name" title="Change your name"><Cat /></button>
            <h1>{possessive(name)} Calendar</h1>
          </div>
          <div className="seg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'week'} onClick={() => setView('week')}>Week</button>
            <button type="button" aria-pressed={view === 'month'} onClick={() => { setView('month'); setEditing(false); }}>Month</button>
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="toolbar">
          <div className="period">
            <button type="button" className="btn icon" aria-label="Previous" onClick={() => shift(-1)}><IcLeft /></button>
            <button type="button" className="btn icon" aria-label="Next" onClick={() => shift(1)}><IcRight /></button>
            <h2>{label}</h2>
            <button type="button" className="btn ghost" onClick={() => setAnchor(new Date())}>Today</button>
          </div>
          {view === 'week' && (
            <>
              <div className="progress" aria-label={`${weekCrowns} of ${GOAL} crowns this week`}>
                <div className="slots">{Array.from({ length: GOAL }, (_, i) => <Crown key={i} on={i < weekCrowns} face={false} />)}</div>
                <span className="label"><b>{weekCrowns}</b> / {GOAL} crowns</span>
              </div>
              <div className="actions">
                <button type="button" className="btn green" onClick={() => setModal({ date: defaultAddDate })}><IcPlus />Add task</button>
                <button type="button" className={`btn ${editing ? 'gold' : 'blue'}`} aria-pressed={editing} onClick={() => setEditing(e => !e)}>
                  {editing ? <><IcCheck />Done</> : <><IcPencil />Edit</>}
                </button>
              </div>
            </>
          )}
        </div>

        {hasSample && (
          <div className="banner sample">
            <p>These are example tasks so you can try things out. Your own tasks save in this browser.</p>
            <button type="button" className="btn" onClick={clearSamples}>Remove examples</button>
          </div>
        )}
        {view === 'week' && editing && (
          <div className="banner edit">
            <p>Edit mode: drag tasks to another day, click a task to change or delete it, and click a crown to mark a successful day.</p>
          </div>
        )}

        {view === 'week' ? (
          <WeekView
            anchor={anchor} tasks={tasks} cats={cats} crowns={crowns} editing={editing}
            onToggleCrown={toggleCrown} onMove={moveTask}
            onOpenTask={t => setModal({ task: t, date: t.date })}
            onAdd={k => setModal({ date: k })}
          />
        ) : (
          <MonthView anchor={anchor} tasks={tasks} cats={cats} crowns={crowns} onPickDay={d => { setAnchor(d); setView('week'); }} />
        )}
      </main>

      {modal && (
        <TaskModal
          key={modal.task?.id || 'new-' + modal.date}
          initial={modal.task} defaultDate={modal.date} cats={cats} usage={usage}
          onSave={saveTask} onDelete={deleteTask} onSaveCat={saveCat} onDeleteCat={deleteCat} onClose={() => setModal(null)}
        />
      )}
      {naming && <NameModal name={name} onSave={n => { setName(n); setNaming(false); }} onClose={() => setNaming(false)} />}
      {party > 0 && <Celebration count={party} name={name} onClose={closeParty} />}
    </>
  );
}
