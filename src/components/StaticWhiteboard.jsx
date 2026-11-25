import React, { useState } from 'react';
import './StaticWhiteboard.css';

const DEFAULT_NOTES = [
  { id: '1', text: 'Call cliente ore 11:00', color: 'yellow' },
  { id: '2', text: 'Deploy build v1.4', color: 'sky' },
  { id: '3', text: 'Rivedere copy home', color: 'rose' },
  { id: '4', text: 'Test mobile Safari', color: 'mint' },
];

export default function StaticWhiteboard({
  initialNotes = DEFAULT_NOTES,
  defaultLocked = true,
}) {
  const [locked, setLocked] = useState(defaultLocked);
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState('');

  const addNote = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const colors = ['yellow', 'sky', 'rose', 'mint'];
    setNotes((p) => [
      ...p.slice(-5),
      { id: String(Date.now()), text: draft.trim(), color: colors[p.length % colors.length] },
    ]);
    setDraft('');
  };

  return (
    <div className="off-sb-frame">
      <div className="off-sb-cork">
        <div className="off-sb-grid">
          {notes.map((n, idx) => (
            <div
              key={n.id}
              onClick={() => !locked && setNotes((p) => p.filter((x) => x.id !== n.id))}
              className={`off-sb-note is-${n.color} ${idx % 2 === 0 ? 'tilt-l' : 'tilt-r'} ${locked ? '' : 'is-editable'}`}
            >
              <span className="off-sb-pin" />
              {n.text}
            </div>
          ))}
        </div>

        <div className="off-sb-bar">
          <span className="off-sb-badge">{locked ? 'Bacheca fissata' : 'Clicca per togliere'}</span>
          <button type="button" className="off-sb-lock" onClick={() => setLocked((v) => !v)}>
            {locked ? 'Sblocca' : 'Blocca'}
          </button>
        </div>
      </div>

      {!locked && (
        <form className="off-sb-add" onSubmit={addNote}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Attacca un post-it..." />
          <button type="submit">+</button>
        </form>
      )}
    </div>
  );
}
