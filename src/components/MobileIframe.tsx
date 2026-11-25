'use client';
import React, { useState } from 'react';

export interface MobileIframeProps {
  initialUrl?: string;
  initialHtml?: string;
}

const MOBILE_APP_HTML = `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  body{margin:0;background:#0f172a;color:#f8fafc;padding:18px 16px}
  .status{display:flex;justify-content:space-between;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:16px}
  .hero{background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:16px;padding:16px;margin-bottom:12px}
  .hero h2{margin:0;font-size:17px}
  .hero p{margin:4px 0 0;font-size:12px;color:#dbeafe}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
  .tile{background:#1e293b;border-radius:14px;padding:12px}
  .tile small{display:block;font-size:10px;color:#94a3b8}
  .tile strong{display:block;font-size:18px;margin-top:4px;font-variant-numeric:tabular-nums}
  .btn{width:100%;border:0;background:#f8fafc;color:#0f172a;padding:11px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer}
</style></head>
<body>
  <div class="status"><span>09:41</span><span>5G · 94%</span></div>
  <div class="hero"><h2>Mobile Preview</h2><p>Viewport 375px isolato in iframe</p></div>
  <div class="row">
    <div class="tile"><small>Sessioni</small><strong id="s">1.420</strong></div>
    <div class="tile"><small>Conversione</small><strong>4,8%</strong></div>
  </div>
  <button class="btn" onclick="const e=document.getElementById('s');e.textContent=(+e.textContent.replace('.','')+1).toLocaleString('it-IT')">Simula Azione</button>
</body></html>`;

function safeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim().startsWith('http') ? raw.trim() : `https://${raw.trim()}`);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

export function MobileIframe({
  initialUrl = 'https://it.m.wikipedia.org/wiki/React',
  initialHtml = MOBILE_APP_HTML,
}: MobileIframeProps) {
  useComponentStyles();
  const [mode, setMode] = useState<'sandbox' | 'url'>('sandbox');
  const [urlDraft, setUrlDraft] = useState(initialUrl);
  const [activeUrl, setActiveUrl] = useState(initialUrl);
  const [reloadKey, setReloadKey] = useState(0);

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = safeUrl(urlDraft);
    if (!valid) return;
    setActiveUrl(valid);
    setMode('url');
    setReloadKey((k) => k + 1);
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
              key={`${mode}-${reloadKey}`}
              title="Smartphone Iframe"
              src={mode === 'url' ? activeUrl : undefined}
              srcDoc={mode === 'sandbox' ? initialHtml : undefined}
              sandbox="allow-scripts allow-forms allow-same-origin"
              className="off-mob-iframe"
            />
          </div>
        </div>
      </div>

      <form className="off-mob-bar" onSubmit={handleLoad}>
        <button
          type="button"
          className="off-mob-btn"
          onClick={() => setMode((m) => (m === 'sandbox' ? 'url' : 'sandbox'))}
        >
          {mode === 'sandbox' ? 'HTML' : 'URL'}
        </button>
        <input
          type="text"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="https://..."
        />
        <button type="button" className="off-mob-btn" onClick={() => setReloadKey((k) => k + 1)}>
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
  width: 288px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-family: system-ui, -apple-system, sans-serif;
}

.off-mob-chassis {
  position: relative;
  width: 272px;
  height: 476px;
  border-radius: 42px;
  padding: 10px;
  background: linear-gradient(180deg, #334155 0%, #0f172a 55%, #020617 100%);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
}

.off-mob-key {
  position: absolute;
  width: 3px;
  background: #334155;
}

.off-mob-key-1 { left: -3px; top: 112px; height: 32px; border-radius: 2px 0 0 2px; }
.off-mob-key-2 { left: -3px; top: 160px; height: 44px; border-radius: 2px 0 0 2px; }
.off-mob-key-r { right: -3px; top: 128px; height: 56px; border-radius: 0 2px 2px 0; }

.off-mob-bezel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 33px;
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
  width: 72px;
  height: 18px;
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
  border-radius: 29px;
  overflow: hidden;
  background: #020617;
}

.off-mob-iframe {
  width: 340px;
  height: 624px;
  border: 0;
  transform: scale(0.718);
  transform-origin: top left;
  display: block;
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
  font-size: 11px;
  color: #334155;
  outline: none;
}

.off-mob-btn {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border: 0;
  background: #f1f5f9;
  color: #334155;
  border-radius: 8px;
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

