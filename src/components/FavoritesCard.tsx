'use client';
import React, { useEffect, useState } from 'react';

export interface FavoriteTile {
  id: string;
  label: string;
  url: string;
  short: string;
  color: string;
  pinned: boolean;
}

export interface FavoritesCardProps {
  initialTiles?: FavoriteTile[];
  storageKey?: string;
}

const DEFAULT_TILES: FavoriteTile[] = [
  { id: '1', label: 'Inklingo', url: 'https://www.inklingo.app/it/chinese', short: 'Ink', color: '#0ea5e9', pinned: true },
  { id: '2', label: 'MDN', url: 'https://developer.mozilla.org', short: 'MD', color: '#4f46e5', pinned: false },
  { id: '3', label: 'GitHub', url: 'https://github.com', short: 'GH', color: '#334155', pinned: false },
  { id: '4', label: 'Figma', url: 'https://figma.com', short: 'Fg', color: '#f43f5e', pinned: false },
  { id: '5', label: 'Vite', url: 'https://vite.dev', short: 'Vt', color: '#f59e0b', pinned: false },
];

function sanitizeTiles(raw: unknown, fallback: FavoriteTile[]): FavoriteTile[] {
  if (!Array.isArray(raw)) return fallback;
  const cleaned: FavoriteTile[] = [];
  raw.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const obj = item as Record<string, unknown>;
    if (typeof obj.label !== 'string' || typeof obj.url !== 'string') return;
    cleaned.push({
      id: typeof obj.id === 'string' && obj.id ? obj.id : `fav-${idx}-${Date.now()}`,
      label: obj.label,
      url: obj.url,
      short: typeof obj.short === 'string' && obj.short ? obj.short : obj.label.slice(0, 2).toUpperCase(),
      color: typeof obj.color === 'string' && obj.color ? obj.color : '#2563eb',
      pinned: Boolean(obj.pinned),
    });
  });
  return cleaned.length > 0 ? cleaned : fallback;
}

export function FavoritesCard({
  initialTiles = DEFAULT_TILES,
  storageKey = 'officina_favorites_v1',
}: FavoritesCardProps) {
  useComponentStyles();
  const [tiles, setTiles] = useState<FavoriteTile[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return sanitizeTiles(JSON.parse(saved), initialTiles);
    } catch {}
    return initialTiles;
  });
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tiles));
    } catch {}
  }, [tiles, storageKey]);

  const sorted = [...tiles].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    const raw = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;
      setTiles((p) => [
        ...p,
        {
          id: String(Date.now()),
          label: label.trim(),
          url: parsed.toString(),
          short: label.trim().slice(0, 2).toUpperCase(),
          color: '#2563eb',
          pinned: false,
        },
      ]);
      setLabel('');
      setUrl('');
      setAdding(false);
    } catch {}
  };

  return (
    <div className="off-fav-dock">
      <div className="off-fav-head">
        <span>Accesso Rapido · Preferiti</span>
        <span className="off-fav-count">{tiles.length} salvati</span>
      </div>

      {adding ? (
        <form className="off-fav-form" onSubmit={add}>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nome sito" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
          <div className="off-fav-fbtns">
            <button type="button" onClick={() => setAdding(false)}>Annulla</button>
            <button type="submit" className="is-primary">Salva</button>
          </div>
        </form>
      ) : (
        <div className="off-fav-grid">
          {sorted.map((t) => (
            <div key={t.id} className="off-fav-tile">
              <button
                type="button"
                className={`off-fav-pin ${t.pinned ? 'is-on' : ''}`}
                onClick={() => setTiles((p) => p.map((x) => (x.id === t.id ? { ...x, pinned: !x.pinned } : x)))}
              >
                ★
              </button>
              <a href={t.url} target="_blank" rel="noopener noreferrer">
                <span className="off-fav-icon" style={{ backgroundColor: t.color }}>{t.short}</span>
                <span className="off-fav-name">{t.label}</span>
              </a>
            </div>
          ))}
          <button type="button" className="off-fav-add" onClick={() => setAdding(true)}>
            <span className="off-fav-plus">+</span>
            <span>Aggiungi</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default FavoritesCard;

/* --- Stili CSS integrati nel componente --- */
const STYLE_ID = 'officina-favorites-card-css';
const COMPONENT_CSS = `
.off-fav-dock {
  width: 100%;
  max-width: 310px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.22);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}

.off-fav-head {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
}

.off-fav-count {
  font-size: 11px;
  font-weight: 400;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.off-fav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.off-fav-tile,
.off-fav-add {
  position: relative;
  background: rgba(30, 41, 59, 0.75);
  border: 1px solid rgba(51, 65, 85, 0.7);
  border-radius: 12px;
  padding: 10px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #e2e8f0;
  font-size: 11px;
  cursor: pointer;
}

.off-fav-add {
  border-style: dashed;
  background: rgba(30, 41, 59, 0.35);
  color: #94a3b8;
}

.off-fav-tile a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: inherit;
  width: 100%;
}

.off-fav-icon,
.off-fav-plus {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.off-fav-plus {
  background: #1e293b;
  font-size: 18px;
}

.off-fav-name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.off-fav-pin {
  position: absolute;
  top: 4px;
  right: 5px;
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 11px;
  color: #64748b;
  cursor: pointer;
}

.off-fav-pin.is-on {
  color: #fbbf24;
}

.off-fav-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.off-fav-form input {
  padding: 7px 10px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #020617;
  color: #ffffff;
}

.off-fav-fbtns {
  display: flex;
  gap: 8px;
}

.off-fav-fbtns button {
  flex: 1;
  padding: 6px;
  border-radius: 8px;
  border: 0;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  background: #334155;
  color: #ffffff;
}

.off-fav-fbtns button.is-primary {
  background: #2563eb;
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

