import React, { useState } from 'react';
import './DiacriticsArchKor.css';

const DEFAULT_SETS: Record<string, string[]> = {
  Consonanti: [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ],
  Vocali: [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ',
    'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
  ],
  'Doppio Batchim': [
    'ㄳ', 'ㄵ', 'ㄶ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅄ',
  ],
};

// Tabelle ufficiali Hangul Compatibility Jamo -> indici Unicode (0xAC00)
const LEADS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

const VOWELS = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ',
  'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
] as const;

// Indice 0 = nessun batchim; 1..27 = batchim singolo o doppio
const TAILS: (string | null)[] = [
  null, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ',
  'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ',
  'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// Combinazioni di due vocali in vocale composta
const COMPOUND_VOWELS: Record<string, string> = {
  'ㅗ+ㅏ': 'ㅘ',
  'ㅗ+ㅐ': 'ㅙ',
  'ㅗ+ㅣ': 'ㅚ',
  'ㅜ+ㅓ': 'ㅝ',
  'ㅜ+ㅔ': 'ㅞ',
  'ㅜ+ㅣ': 'ㅟ',
  'ㅡ+ㅣ': 'ㅢ',
};

// Combinazioni di due consonanti in batchim doppio
const COMPOUND_TAILS: Record<string, string> = {
  'ㄱ+ㅅ': 'ㄳ',
  'ㄴ+ㅈ': 'ㄵ',
  'ㄴ+ㅎ': 'ㄶ',
  'ㄹ+ㄱ': 'ㄺ',
  'ㄹ+ㅁ': 'ㄻ',
  'ㄹ+ㅂ': 'ㄼ',
  'ㄹ+ㅅ': 'ㄽ',
  'ㄹ+ㅌ': 'ㄾ',
  'ㄹ+ㅍ': 'ㄿ',
  'ㄹ+ㅎ': 'ㅀ',
  'ㅂ+ㅅ': 'ㅄ',
};

// Divisione di un batchim doppio quando la seconda parte diventa iniziale della sillaba successiva
const SPLIT_TAILS: Record<string, [string, string]> = {
  'ㄳ': ['ㄱ', 'ㅅ'],
  'ㄵ': ['ㄴ', 'ㅈ'],
  'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'],
  'ㄻ': ['ㄹ', 'ㅁ'],
  'ㄼ': ['ㄹ', 'ㅂ'],
  'ㄽ': ['ㄹ', 'ㅅ'],
  'ㄾ': ['ㄹ', 'ㅌ'],
  'ㄿ': ['ㄹ', 'ㅍ'],
  'ㅀ': ['ㄹ', 'ㅎ'],
  'ㅄ': ['ㅂ', 'ㅅ'],
};

// Consonanti che NON possono stare come batchim finale (ㄸ, ㅃ, ㅉ)
const NON_TAIL_CONSONANTS = new Set(['ㄸ', 'ㅃ', 'ㅉ']);

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;

function isSyllable(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return ch.length === 1 && code >= HANGUL_BASE && code <= HANGUL_END;
}

function composeSyllable(leadIdx: number, vowelIdx: number, tailIdx = 0): string {
  return String.fromCharCode(HANGUL_BASE + leadIdx * 21 * 28 + vowelIdx * 28 + tailIdx);
}

function decomposeSyllable(ch: string): { lead: string; vowel: string; tail: string | null } | null {
  if (!isSyllable(ch)) return null;
  const offset = ch.charCodeAt(0) - HANGUL_BASE;
  const leadIdx = Math.floor(offset / (21 * 28));
  const vowelIdx = Math.floor((offset % (21 * 28)) / 28);
  const tailIdx = offset % 28;
  return {
    lead: LEADS[leadIdx],
    vowel: VOWELS[vowelIdx],
    tail: TAILS[tailIdx],
  };
}

function appendHangulChar(current: string, jamo: string): string {
  if (!current) return jamo;

  const chars = Array.from(current);
  const last = chars[chars.length - 1];
  const rest = chars.slice(0, -1).join('');

  const isConsonant = (LEADS as readonly string[]).includes(jamo);
  const isVowel = (VOWELS as readonly string[]).includes(jamo);

  // 1. L'ultimo carattere è già una sillaba completa (es. 가, 간, 닭)
  if (isSyllable(last)) {
    const parts = decomposeSyllable(last)!;
    const leadIdx = LEADS.indexOf(parts.lead as (typeof LEADS)[number]);
    const vowelIdx = VOWELS.indexOf(parts.vowel as (typeof VOWELS)[number]);

    if (isConsonant) {
      // Caso A: la sillaba non ha ancora un batchim -> aggiungi batchim (es. 가 + ㄴ = 간)
      if (!parts.tail) {
        if (!NON_TAIL_CONSONANTS.has(jamo)) {
          const tailIdx = TAILS.indexOf(jamo);
          if (tailIdx > 0) {
            return rest + composeSyllable(leadIdx, vowelIdx, tailIdx);
          }
        }
        return current + jamo;
      }

      // Caso B: ha già un batchim singolo -> prova a formare batchim doppio (es. ㄹ + ㄱ = ㄺ)
      const isExistingSingleTail = TAILS.indexOf(parts.tail) > 0 && !SPLIT_TAILS[parts.tail];
      if (isExistingSingleTail) {
        const combinedTail = COMPOUND_TAILS[`${parts.tail}+${jamo}`];
        if (combinedTail) {
          const tailIdx = TAILS.indexOf(combinedTail);
          return rest + composeSyllable(leadIdx, vowelIdx, tailIdx);
        }
      }

      // Altrimenti inizia una nuova consonante sciolta
      return current + jamo;
    }

    if (isVowel) {
      // Caso C: ha un batchim -> il batchim diventa iniziale della nuova sillaba! (es. 간 + ㅏ = 가나)
      if (parts.tail) {
        if (SPLIT_TAILS[parts.tail]) {
          const [keepTail, nextLead] = SPLIT_TAILS[parts.tail];
          const keepTailIdx = TAILS.indexOf(keepTail);
          const nextLeadIdx = LEADS.indexOf(nextLead as (typeof LEADS)[number]);
          const nextVowelIdx = VOWELS.indexOf(jamo as (typeof VOWELS)[number]);
          return (
            rest +
            composeSyllable(leadIdx, vowelIdx, keepTailIdx) +
            composeSyllable(nextLeadIdx, nextVowelIdx, 0)
          );
        } else {
          const nextLeadIdx = LEADS.indexOf(parts.tail as (typeof LEADS)[number]);
          const nextVowelIdx = VOWELS.indexOf(jamo as (typeof VOWELS)[number]);
          if (nextLeadIdx >= 0 && nextVowelIdx >= 0) {
            return (
              rest +
              composeSyllable(leadIdx, vowelIdx, 0) +
              composeSyllable(nextLeadIdx, nextVowelIdx, 0)
            );
          }
        }
      }

      // Caso D: sillaba aperta (es. 가) + nuova vocale -> prova vocale composta (es. 오 + ㅏ = 와)
      const combinedVowel = COMPOUND_VOWELS[`${parts.vowel}+${jamo}`];
      if (combinedVowel) {
        const nextVowelIdx = VOWELS.indexOf(combinedVowel as (typeof VOWELS)[number]);
        return rest + composeSyllable(leadIdx, nextVowelIdx, 0);
      }

      return current + jamo;
    }
  }

  // 2. L'ultimo carattere è una consonante sciolta (es. ㄱ) + vocale (ㅏ) -> 가
  if ((LEADS as readonly string[]).includes(last) && isVowel) {
    const leadIdx = LEADS.indexOf(last as (typeof LEADS)[number]);
    const vowelIdx = VOWELS.indexOf(jamo as (typeof VOWELS)[number]);
    if (leadIdx >= 0 && vowelIdx >= 0) {
      return rest + composeSyllable(leadIdx, vowelIdx, 0);
    }
  }

  // 3. L'ultimo carattere è una vocale sciolta (es. ㅗ) + vocale (ㅏ) -> ㅘ
  if ((VOWELS as readonly string[]).includes(last) && isVowel) {
    const combinedVowel = COMPOUND_VOWELS[`${last}+${jamo}`];
    if (combinedVowel) {
      return rest + combinedVowel;
    }
  }

  // 4. L'ultimo carattere è una consonante sciolta (es. ㄹ) + consonante (ㄱ) -> ㄺ
  if (isConsonant && (TAILS as readonly (string | null)[]).includes(last)) {
    const combinedTail = COMPOUND_TAILS[`${last}+${jamo}`];
    if (combinedTail) {
      return rest + combinedTail;
    }
  }

  return current + jamo;
}

function backspaceHangul(current: string): string {
  if (!current) return '';
  const chars = Array.from(current);
  const last = chars[chars.length - 1];
  const rest = chars.slice(0, -1).join('');

  if (isSyllable(last)) {
    const parts = decomposeSyllable(last)!;
    const leadIdx = LEADS.indexOf(parts.lead as (typeof LEADS)[number]);
    const vowelIdx = VOWELS.indexOf(parts.vowel as (typeof VOWELS)[number]);

    // Se ha un batchim: se è doppio riduce a singolo, altrimenti toglie il batchim
    if (parts.tail) {
      if (SPLIT_TAILS[parts.tail]) {
        const firstPart = SPLIT_TAILS[parts.tail][0];
        return rest + composeSyllable(leadIdx, vowelIdx, TAILS.indexOf(firstPart));
      }
      return rest + composeSyllable(leadIdx, vowelIdx, 0);
    }

    // Se non ha batchim, torna alla consonante iniziale sciolta
    return rest + parts.lead;
  }

  return rest;
}

export function DiacriticsArchKor({
  charSets = DEFAULT_SETS,
  initialValue = '한글 · 닦 · 값',
}: {
  charSets?: Record<string, string[]>;
  initialValue?: string;
}) {
  const names = Object.keys(charSets);
  const [activeSet, setActiveSet] = useState(names[0]);
  const [value, setValue] = useState(initialValue);
  const [copied, setCopied] = useState(false);

  const handleKeyPress = (ch: string) => {
    setValue((prev) => appendHangulChar(prev, ch));
  };

  const handleBackspace = () => {
    setValue((prev) => backspaceHangul(prev));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="gk-pebblepad">
      <div className="gk-pebblepad__tabs">
        {names.map((name) => (
          <button
            key={name}
            type="button"
            className={`gk-pebblepad__tab ${activeSet === name ? 'is-active' : ''}`}
            onClick={() => setActiveSet(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <input
        className="gk-pebblepad__input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Componi sillabe Hangul…"
        aria-label="Testo coreano con batchim"
      />

      <div className="gk-pebblepad__keys">
        {charSets[activeSet].map((ch) => (
          <button
            key={ch}
            type="button"
            className="gk-pebblepad__key"
            onClick={() => handleKeyPress(ch)}
          >
            {ch}
          </button>
        ))}
      </div>

      <div className="gk-pebblepad__foot">
        <button
          type="button"
          className="gk-pebblepad__btn gk-pebblepad__btn--ghost"
          onClick={handleBackspace}
        >
          Cancella
        </button>
        <button
          type="button"
          className="gk-pebblepad__btn gk-pebblepad__btn--ghost"
          onClick={() => setValue('')}
        >
          Pulisci
        </button>
        <button
          type="button"
          className="gk-pebblepad__btn"
          onClick={handleCopy}
        >
          {copied ? 'Copiato ✓' : 'Copia testo'}
        </button>
      </div>
    </div>
  );
}
