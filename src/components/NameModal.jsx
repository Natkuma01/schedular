import { useState } from 'react';
import { Cat, IcCheck } from './Icons.jsx';

export default function NameModal({ name, onSave, onClose }) {
  const [value, setValue] = useState(name);
  const [err, setErr] = useState('');

  const submit = e => {
    e.preventDefault();
    const v = value.trim();
    if (!v) { setErr('Type a name, at least one letter.'); return; }
    onSave(v);
  };

  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal name-modal" role="dialog" aria-modal="true" aria-labelledby="nt">
        <div className="name-cat"><Cat /></div>
        <form className="form" onSubmit={submit} noValidate>
          <div>
            <h3 id="nt">Whose calendar is this?</h3>
            <p className="sub" style={{ margin: 0 }}>The name shows at the top and in your celebrations.</p>
          </div>
          <div className="field" style={{ textAlign: 'left' }}>
            <label htmlFor="f-name">Your name</label>
            <input
              id="f-name"
              className={`input ${err ? 'bad' : ''}`}
              value={value}
              maxLength={24}
              autoFocus
              onChange={e => { setValue(e.target.value); setErr(''); }}
              placeholder="e.g. Natalie"
            />
            {err && <span className="err">{err}</span>}
          </div>
          <div className="modal-foot">
            <div className="right">
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn green"><IcCheck />Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
