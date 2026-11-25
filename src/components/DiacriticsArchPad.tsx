import { useState } from 'react';
import './DiacriticsArchPad.css';

const DEFAULT_SETS: Record<string, string[]> = {
  Vocali: ['a', 'я', 'e', 'и', 'й', 'о', 'ю', 'з', 'у', 'ё'],
  Consonanti: ['ц', 'к', 'н', 'г', 'ш', 'щ', 'х', 'ф', 'в', 'п', 'р', 'л', 'ж', 'ч', 'с', 'м', 'и', 'т', 'б','д' ],
  Fonetici: ['ъ', 'ы', 'ь'],

};

export function DiacriticsArchPad({
  charSets = DEFAULT_SETS,
  initialValue = 'а · ñ · я',
}: {
  charSets?: Record<string, string[]>;
  initialValue?: string;
}) {
  const names = Object.keys(charSets);
  const [activeSet, setActiveSet] = useState(names[0]);
  const [value, setValue] = useState(initialValue);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="gk-pebblepad">
      <div className="gk-pebblepad__tabs">
        {names.map((name) => (
          <button key={name} type="button" className={`gk-pebblepad__tab ${activeSet === name ? 'is-active' : ''}`} onClick={() => setActiveSet(name)}>
            {name}
          </button>
        ))}
      </div>
      <input className="gk-pebblepad__input" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Componi caratteri…" aria-label="Testo con caratteri speciali" />
      <div className="gk-pebblepad__keys">
        {charSets[activeSet].map((ch) => (
          <button key={ch} type="button" className="gk-pebblepad__key" onClick={() => setValue((v) => v + ch)}>{ch}</button>
        ))}
      </div>
      <div className="gk-pebblepad__foot">
        <button type="button" className="gk-pebblepad__btn gk-pebblepad__btn--ghost" onClick={() => setValue('')}>Pulisci</button>
        <button type="button" className="gk-pebblepad__btn" onClick={handleCopy}>{copied ? 'Copiato ✓' : 'Copia testo'}</button>
      </div>
    </div>
  );
}