'use client';
import React, { useEffect, useState } from 'react';

const STYLE_ID = 'officina-static-whiteboard-css';
const COMPONENT_CSS = `
.off-sb-frame {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
  border-radius: 16px;
  padding: 8px;
  background: linear-gradient(180deg, #b45309 0%, #78350f 100%);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}

.off-sb-cork {
  border-radius: 10px;
  padding: 14px;
  min-height: 215px;
  background-color: #c99b66;
  background-image: radial-gradient(rgba(92, 58, 24, 0.22) 1px, transparent 1px);
  background-size: 12px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  box-sizing: border-box;
}

.off-sb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.off-sb-note {
  position: relative;
  padding: 16px 10px 10px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.off-sb-note.tilt-l { transform: rotate(-1.5deg); }
.off-sb-note.tilt-r { transform: rotate(1.5deg); }
.off-sb-note.is-editable { cursor: pointer; }

.off-sb-note.is-yellow { background: #fde68a; color: #451a03; }
.off-sb-note.is-sky { background: #bae6fd; color: #082f49; }
.off-sb-note.is-rose { background: #fecdd3; color: #4c0519; }
.off-sb-note.is-mint { background: #bbf7d0; color: #052e16; }

.off-sb-pin {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #ef4444;
  border: 1px solid rgba(0, 0, 0, 0.25);
}

.off-sb-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.off-sb-badge {
  font-size: 10px;
  font-weight: 600;
  background: rgba(254, 243, 199, 0.85);
  color: #451a03;
  padding: 3px 7px;
  border-radius: 5px;
}

.off-sb-lock {
  border: 0;
  background: #451a03;
  color: #fef3c7;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 6px;
  cursor: pointer;
}

.off-sb-add {
  display: flex;
  gap: 6px;
}

.off-sb-add input {
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 8px;
  border: 0;
  background: #ffffff;
  color: #0f172a;
}

.off-sb-add input::placeholder {
  color: #64748b;
}

.off-sb-add button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: #451a03;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}
`;

function useComponentStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = COMPONENT_CSS;
    document.head.appendChild(style);
  }, []);
}


export interface StaticBoardNote {
  id: string;
  text: string;
  color: 'yellow' | 'sky' | 'rose' | 'mint';
}

export interface StaticWhiteboardProps {
  initialNotes?: StaticBoardNote[];
  defaultLocked?: boolean;
  storageKey?: string;
}

const DEFAULT_NOTES: StaticBoardNote[] = [
  { id: '1', text: 'Call cliente ore 11:00', color: 'yellow' },
  { id: '2', text: 'Deploy build v1.4', color: 'sky' },
  { id: '3', text: 'Rivedere copy home', color: 'rose' },
  { id: '4', text: 'Test mobile Safari', color: 'mint' },
];

export function StaticWhiteboard({
  initialNotes = DEFAULT_NOTES,
  defaultLocked = true,
  storageKey = 'officina_static_board_v1',
}: StaticWhiteboardProps) {
  useComponentStyles();
  const [locked, setLocked] = useState(defaultLocked);
  const [notes, setNotes] = useState<StaticBoardNote[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return initialNotes;
  });
  const [draft, setDraft] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch {}
  }, [notes, storageKey]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const colors: StaticBoardNote['color'][] = ['yellow', 'sky', 'rose', 'mint'];
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
          <span className="off-sb-badge">{locked ? 'Bacheca fissata · Salvata' : 'Clicca per togliere'}</span>
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

export default StaticWhiteboard;
