import { useState } from 'react';
import { COLORS, ICONS, TYPES, TYPE_ORDER, catStyle } from '../lib/config.js';
import { uid } from '../lib/tasks.js';
import { CatIcon, IcCheck, IcPlus, IcTrash } from './Icons.jsx';

// Create a category (pick a type first) or change an existing one's name, question, look and options.
// The type is fixed once created, so existing tasks always match their category.
export default function CategoryEditor({ initial, cats, used, onSave, onDelete, onBack }) {
  const isNew = !initial;
  const firstFree = COLORS.find(p => !cats.some(c => c.color === p.color)) || COLORS[0];
  const [type, setType] = useState(initial?.type || 'event');
  const [name, setName] = useState(initial?.name || '');
  const [prompt, setPrompt] = useState(initial?.prompt || TYPES.event.prompt);
  const [unit, setUnit] = useState(initial?.unit || '');
  const [options, setOptions] = useState(initial?.options || []);
  const [newOption, setNewOption] = useState('');
  const [color, setColor] = useState(initial ? { color: initial.color, dark: initial.dark } : firstFree);
  const [icon, setIcon] = useState(initial?.icon || 'star');
  const [errors, setErrors] = useState({});
  const [confirmDel, setConfirmDel] = useState(false);

  // While creating, keep the question in step with the type until the user writes their own.
  const pickType = t => {
    if (prompt === TYPES[type].prompt) setPrompt(TYPES[t].prompt);
    setType(t);
    setErrors({});
  };

  const addOption = () => {
    const v = newOption.trim();
    if (!v) return;
    if (!options.some(o => o.toLowerCase() === v.toLowerCase())) setOptions([...options, v]);
    setNewOption('');
    setErrors(e => ({ ...e, options: undefined }));
  };

  const submit = e => {
    e.preventDefault();
    const err = {};
    const n = name.trim();
    if (!n) err.name = 'Give the category a name.';
    else if (cats.some(c => c.id !== initial?.id && c.name.toLowerCase() === n.toLowerCase())) err.name = 'You already have a category with this name.';
    if (!prompt.trim()) err.prompt = 'Type the question to ask when adding a task.';
    if (type === 'dropdown' && !options.length) err.options = 'Add at least one option.';
    setErrors(err);
    if (Object.keys(err).length) return;

    onSave({
      ...(initial || { id: uid() }),
      name: n,
      type,
      prompt: prompt.trim(),
      icon,
      ...color,
      options: type === 'dropdown' ? options : undefined,
      unit: type === 'count' ? unit.trim() || undefined : undefined,
    });
  };

  const deleteBlock = used > 0
    ? `${used} task${used === 1 ? '' : 's'} use${used === 1 ? 's' : ''} this category. Move or delete ${used === 1 ? 'it' : 'them'} first.`
    : cats.length <= 1 ? 'You need at least one category.' : '';

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div>
        <h3 id="mt">{isNew ? 'New category' : 'Edit category'}</h3>
        <div className="picked" style={catStyle(color)}>
          <span className="chip"><CatIcon icon={icon} />{name.trim() || 'Category name'}</span>
          {!isNew && <span className="type-tag">{TYPES[type].name}</span>}
        </div>
      </div>

      {isNew && (
        <div className="field">
          <span className="label" id="f-type">Type</span>
          <div className="type-grid" role="radiogroup" aria-labelledby="f-type">
            {TYPE_ORDER.map(t => (
              <button key={t} type="button" role="radio" aria-checked={type === t} className="type-tile" onClick={() => pickType(t)}>
                <b>{TYPES[t].name}</b><span>{TYPES[t].hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="c-name">Name</label>
        <input id="c-name" className={`input ${errors.name ? 'bad' : ''}`} value={name} maxLength={28} autoFocus
          onChange={e => setName(e.target.value)} placeholder="e.g. Networking Events" />
        {errors.name && <span className="err">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="c-prompt">Question when adding a task</label>
        <input id="c-prompt" className={`input ${errors.prompt ? 'bad' : ''}`} value={prompt} maxLength={60}
          onChange={e => setPrompt(e.target.value)} />
        {errors.prompt && <span className="err">{errors.prompt}</span>}
      </div>

      {type === 'count' && (
        <div className="field">
          <label htmlFor="c-unit">What are you counting?</label>
          <input id="c-unit" className="input" value={unit} maxLength={28}
            onChange={e => setUnit(e.target.value)} placeholder="e.g. job application" />
          <span className="hint">Shown as “5 {unit.trim() || 'job application'}s”. Write it as one item.</span>
        </div>
      )}

      {type === 'dropdown' && (
        <div className="field">
          <label htmlFor="c-option">Dropdown options</label>
          {options.length > 0 && (
            <ul className="opt-list">
              {options.map(o => (
                <li key={o}>
                  <span>{o}</span>
                  <button type="button" className="btn ghost icon" aria-label={`Remove ${o}`}
                    onClick={() => setOptions(options.filter(x => x !== o))}><IcTrash /></button>
                </li>
              ))}
            </ul>
          )}
          <div className="add-opt">
            <input id="c-option" className={`input ${errors.options ? 'bad' : ''}`} value={newOption} maxLength={40}
              onChange={e => setNewOption(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
              placeholder="New option" />
            <button type="button" className="btn" onClick={addOption}><IcPlus />Add</button>
          </div>
          {errors.options && <span className="err">{errors.options}</span>}
        </div>
      )}

      <div className="field">
        <span className="label" id="c-color">Color</span>
        <div className="swatches" role="radiogroup" aria-labelledby="c-color">
          {COLORS.map(p => (
            <button key={p.color} type="button" role="radio" aria-checked={color.color === p.color} aria-label={p.color}
              className="swatch" style={catStyle(p)} onClick={() => setColor(p)} />
          ))}
        </div>
      </div>

      <div className="field">
        <span className="label" id="c-icon">Icon</span>
        <div className="swatches" role="radiogroup" aria-labelledby="c-icon" style={catStyle(color)}>
          {ICONS.map(i => (
            <button key={i} type="button" role="radio" aria-checked={icon === i} aria-label={i}
              className="icon-pick" onClick={() => setIcon(i)}><CatIcon icon={i} /></button>
          ))}
        </div>
      </div>

      <div className="modal-foot">
        {!isNew && (confirmDel ? (
          <span className="confirm">
            Delete this category?
            <button type="button" className="btn danger" onClick={() => onDelete(initial.id)}>Delete</button>
            <button type="button" className="btn ghost" onClick={() => setConfirmDel(false)}>Keep</button>
          </span>
        ) : deleteBlock ? (
          <span className="hint">{deleteBlock}</span>
        ) : (
          <button type="button" className="btn ghost danger-text" onClick={() => setConfirmDel(true)}>Delete</button>
        ))}
        <div className="right">
          <button type="button" className="btn" onClick={onBack}>Back</button>
          <button type="submit" className="btn green"><IcCheck />Save</button>
        </div>
      </div>
    </form>
  );
}
