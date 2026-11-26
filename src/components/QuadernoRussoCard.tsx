import React, { useEffect, useRef, useState } from "react";
import { Eraser, ExternalLink, Eye, EyeOff, RotateCcw } from "lucide-react";

export interface QuadernoRussoLink {
  title: string;
  url: string;
}

// =========================================
// 🇷🇺 MODIFICA QUI I LINK PER IL RUSSO
// =========================================
const QUADERNI_RUSSO: QuadernoRussoLink[] = [
  { title: "Write It!", url: "https://generatore-di-esercizi-di-scrittura.vercel.app/" },
  { title: "Russo Corsivo", url: "https://russo-corsivo-cirillico.vercel.app/" },
  // { title: "Altro Quaderno Russo", url: "https://..." },
];

interface CyrillicSample {
  char: string;
  reading: string;
  note: string;
}

const CYRILLIC_SAMPLES: CyrillicSample[] = [
  { char: "Д д", reading: "d", note: "de" },
  { char: "Ж ж", reading: "ž", note: "zhe" },
  { char: "Ф ф", reading: "f", note: "ef" },
  { char: "Щ щ", reading: "šč", note: "shcha" },
  { char: "Я я", reading: "ja", note: "ya" },
];

export const QuadernoRussoCard: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [gridMode, setGridMode] = useState<"propisi" | "lined">("propisi");
  const [showGuide, setShowGuide] = useState(true);
  const [hasInk, setHasInk] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const activeSample = CYRILLIC_SAMPLES[selectedIdx];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  useEffect(() => {
    clearCanvas();
  }, [selectedIdx]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const pt = getPoint(e);
    lastPointRef.current = pt;

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#162d4c";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      setHasInk(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pt = getPoint(e);
    ctx.strokeStyle = "#162d4c";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    lastPointRef.current = pt;
    setHasInk(true);
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": "-0.8deg" } as React.CSSProperties}
    >
      {/* Quaderno scolastico russo (Тетрадь · Прописи) compatto */}
      <div
        className="w-full max-w-[300px] mx-auto rounded-xl border-[1.5px] border-[#1d3b66] overflow-hidden"
        style={{
          backgroundColor: "#eef3fa",
          backgroundImage:
            "linear-gradient(rgba(37, 74, 128, 0.06) 1px, transparent 1px)",
          backgroundSize: "100% 18px",
          boxShadow: "5px 5px 0 rgba(23, 50, 88, 0.34)",
          color: "#132640",
        }}
      >
        {/* Testata blu quaderno russo */}
        <div
          className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-white border-b-2 border-[#142a4a]"
          style={{
            background: "linear-gradient(180deg, #24487a 0%, #1a3760 100%)",
          }}
        >
          <div>
            <p className="text-[10px] font-mono text-sky-100/80">
              Scrittura russa · Прописи
            </p>
            <h3 className="text-base font-bold tracking-tight leading-tight">
              Quaderno Cirillico
            </h3>
          </div>
          <div
            className="w-8 h-8 rounded border border-sky-200/35 bg-[#122847] flex items-center justify-center text-sm font-serif font-bold select-none shrink-0"
            aria-hidden="true"
          >
            Я
          </div>
        </div>

        <div className="p-3 space-y-2.5">
          {/* Selezione lettera cirillica */}
          <div
            className="flex items-center gap-1"
            role="tablist"
            aria-label="Lettere cirilliche da praticare"
          >
            {CYRILLIC_SAMPLES.map((item, idx) => {
              const active = idx === selectedIdx;
              return (
                <button
                  key={item.char}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedIdx(idx)}
                  className={`flex-1 h-7 rounded text-xs font-serif transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[#1e3f6e] text-white font-bold"
                      : "bg-[#dce6f5] text-[#1a3760] hover:bg-[#ccd9ee]"
                  }`}
                >
                  {item.char}
                </button>
              );
            })}
          </div>

          {/* Riga Propisi compatta (косая линейка) */}
          <div
            className="relative w-full h-[88px] rounded border-[1.5px] border-[#3b66a3] bg-[#fafcff] overflow-hidden select-none"
          >
            <svg
              viewBox="0 0 260 88"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              {/* Linee guida orizzontali */}
              <line x1="0" y1="22" x2="260" y2="22" stroke="rgba(59, 102, 163, 0.3)" strokeWidth="0.9" />
              <line x1="0" y1="40" x2="260" y2="40" stroke="rgba(59, 102, 163, 0.55)" strokeWidth="1" />
              <line x1="0" y1="64" x2="260" y2="64" stroke="rgba(59, 102, 163, 0.65)" strokeWidth="1.1" />
              {/* Linee oblique a 65° tipiche dei quaderni russi (косая линейка) */}
              {gridMode === "propisi" &&
                Array.from({ length: 11 }).map((_, i) => {
                  const xBottom = i * 28 - 10;
                  const xTop = xBottom + 41;
                  return (
                    <line
                      key={i}
                      x1={xBottom}
                      y1="88"
                      x2={xTop}
                      y2="0"
                      stroke="rgba(59, 102, 163, 0.25)"
                      strokeWidth="0.9"
                    />
                  );
                })}
            </svg>

            {showGuide && (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center pointer-events-none font-serif italic text-4xl text-[#2a548f]/25 tracking-wider"
              >
                {activeSample.char}
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={520}
              height={176}
              aria-label={`Area di pratica cirillica per ${activeSample.char}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative z-10 w-full h-full cursor-crosshair touch-none"
            />

            {hasInk && (
              <button
                type="button"
                onClick={clearCanvas}
                title="Pulisci riga"
                aria-label="Pulisci riga"
                className="absolute bottom-1 right-1 z-20 p-1 rounded bg-[#1a3760]/85 text-white hover:bg-[#1a3760] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Barra compatta lettura + comandi */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-mono text-[#234575] truncate">
              {activeSample.reading} · {activeSample.note}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setGridMode((m) => (m === "propisi" ? "lined" : "propisi"))
                }
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#dce6f5] hover:bg-[#ccd9ee] text-[#1a3760] cursor-pointer whitespace-nowrap"
                title="Cambia rigatura"
              >
                {gridMode === "propisi" ? "Косая" : "Righe"}
              </button>
              <button
                type="button"
                onClick={() => setShowGuide((g) => !g)}
                className="p-1 rounded bg-[#dce6f5] hover:bg-[#ccd9ee] text-[#1a3760] cursor-pointer"
                title={showGuide ? "Nascondi guida" : "Mostra guida"}
                aria-label={showGuide ? "Nascondi guida" : "Mostra guida"}
              >
                {showGuide ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={clearCanvas}
                className="p-1 rounded bg-[#dce6f5] hover:bg-[#ccd9ee] text-[#1a3760] cursor-pointer"
                title="Pulisci"
                aria-label="Pulisci"
              >
                <Eraser className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Link compatti integrati sulle righe */}
          <div className="pt-2 border-t border-[#3b66a3]/25 divide-y divide-[#3b66a3]/15">
            {QUADERNI_RUSSO.map((item, idx) => (
              <a
                key={`${item.title}-${item.url}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 py-1.5 px-1 -mx-1 rounded hover:bg-[#3b66a3]/10 transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0 text-xs font-medium text-[#132640] group-hover:text-[#1e3f6e] truncate">
                  <span className="text-[10px] font-mono tabular-nums text-[#3b66a3]">
                    0{idx + 1}
                  </span>
                  <span className="truncate">{item.title}</span>
                </span>
                <ExternalLink className="w-3 h-3 text-[#3b66a3]/75 group-hover:text-[#1e3f6e] shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadernoRussoCard;
