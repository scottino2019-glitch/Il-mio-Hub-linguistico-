'use client';
import React, { useState } from 'react';

export interface MobileIframeProps {
  initialUrl?: string;
}

function safeUrl(raw: string): string | null {
  try {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

export function MobileIframe({
  initialUrl = 'https://lingua-planner.netlify.app/',
}: MobileIframeProps) {
  useComponentStyles();
  const [urlDraft, setUrlDraft] = useState(initialUrl);
  const [activeUrl, setActiveUrl] = useState(initialUrl);
  const [reloadKey, setReloadKey] = useState(0);

  const openUrl = (target: string) => {
    const valid = safeUrl(target);
    if (!valid) return;
    setUrlDraft(valid);
    setActiveUrl(valid);
    setReloadKey((k) => k + 1);
  };

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    openUrl(urlDraft);
  };

  return (
    <div className="off-mob-wrap">
      <div className="off-mob-chassis">
        <span className="off-mob-key off-mob-key-1" />
        <span className="off-mob-key off-mob-key-2" />
        <span className="off-mob-key off-mob-key-r" />
        <div className="off-mob-bezel">
          <div className="off-mob-island"><span /></div>
          <div className="off-mob-screen">
            <iframe
              key={`${activeUrl}-${reloadKey}`}
              title="Smartphone Iframe"
              src={activeUrl}
              allow="autoplay; clipboard-write; encrypted-media"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-downloads"
              className="off-mob-iframe"
            />
          </div>
        </div>
      </div>

      <form className="off-mob-bar" onSubmit={handleLoad}>
        <button
          type="button"
          className="off-mob-btn"
          title="Torna alla pagina iniziale"
          onClick={() => openUrl(initialUrl)}
        >
          ⌂
        </button>
        <input
          type="text"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="https://..."
        />
        <button type="submit" className="off-mob-go">Vai</button>
        <button
          type="button"
          className="off-mob-btn"
          title="Ricarica"
          onClick={() => setReloadKey((k) => k + 1)}
        >
          ↻
        </button>
      </form>
    </div>
  );
}

export default MobileIframe;

/* --- Stili CSS integrati nel componente --- */
const STYLE_ID = 'officina-mobile-iframe-css';
const COMPONENT_CSS = `
.off-mob-wrap {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-family: system-ui, -apple-system, sans-serif;
}

.off-mob-chassis {
  position: relative;
  width: 316px;
  height: 560px;
  border-radius: 46px;
  padding: 11px;
  background: linear-gradient(180deg, #334155 0%, #0f172a 55%, #020617 100%);
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
}

.off-mob-key {
  position: absolute;
  width: 3px;
  background: #334155;
}

.off-mob-key-1 { left: -3px; top: 128px; height: 36px; border-radius: 2px 0 0 2px; }
.off-mob-key-2 { left: -3px; top: 176px; height: 48px; border-radius: 2px 0 0 2px; }
.off-mob-key-r { right: -3px; top: 144px; height: 64px; border-radius: 0 2px 2px 0; }

.off-mob-bezel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 36px;
  background: #000000;
  padding: 4px;
  overflow: hidden;
  box-sizing: border-box;
}

.off-mob-island {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 78px;
  height: 19px;
  border-radius: 999px;
  background: #000000;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 7px;
}

.off-mob-island span {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #1e293b;
}

.off-mob-screen {
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  background: #020617;
}

.off-mob-iframe {
  width: 340px;
  height: 630px;
  border: 0;
  transform: scale(0.841);
  transform-origin: top left;
  display: block;
  background: #ffffff;
}

.off-mob-bar {
  width: 100%;
  display: flex;
  gap: 4px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 4px;
  box-sizing: border-box;
}

.off-mob-bar input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  font-size: 12px;
  color: #334155;
  outline: none;
}

.off-mob-btn,
.off-mob-go {
  padding: 5px 8px;
  font-size: 11px;
  font-weight: 600;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.off-mob-btn {
  background: #f1f5f9;
  color: #334155;
}

.off-mob-go {
  background: #0f172a;
  color: #ffffff;
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
