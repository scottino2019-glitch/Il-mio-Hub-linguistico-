import React, { useEffect, useRef, useState } from "react";
import { Eraser, ExternalLink, Eye, EyeOff, RotateCcw } from "lucide-react";
import "./QuaderniScritturaCards.css";

export interface QuadernoLink {
  title: string;
  subtitle?: string;
  url: string;
}

// =========================================
// 🇨🇳 MODIFICA QUI I LINK DEI QUADERNI CINESE
// =========================================
const QUADERNI_CINESE: QuadernoLink[] = [
  {
    title: "Skitter",
    subtitle: "Crea fogli di scrittura",
    url: "https://hanzi-pro-build.netlify.app/",
  },
  {
    title: "HanziCraft",
    subtitle: "Decomposizione Cinese",
    url: "https://quaderni-per-esercizi.vercel.app/",
  },
  {
    title: "Studio Calligrafico",
    subtitle: "Pratica libera",
    url: "https://studio-calligrafico.netlify.app/",
  },
  {
    title: "Hanzi Studio Pro",
    subtitle: "Comporre frasi",
    url: "https://hanzi-studio-pro.vercel.app//",
  },
  // { title: "Altro Quaderno", subtitle: "Descrizione", url: "https://..." },
];

// =========================================
// 🇰🇷 MODIFICA QUI I LINK DEI QUADERNI COREANO
// =========================================
const QUADERNI_COREANO: QuadernoLink[] = [
  {
    title: "Write It!! (1)",
    subtitle: "Pratica Hangul",
    url: "https://scrittura-coreana.vercel.app/",
  },
  {
    title: "Write It!! (2)",
    subtitle: "Fogli esercizi",
    url: "https://generatore-di-fogli-di-scrittura-co.vercel.app/",
  },
  {
    title: "Mirinae Korean",
    subtitle: "Eserciziario",
    url: "https://eserciziario-di-lingua-coreana.vercel.app/",
  },
    {
    title: "Hangeul Studio",
    subtitle: "Eserciziario",
    url: "https://scrittura-coreana.vercel.app/",
  },
 {
    title: "Wongoji Studio",
    subtitle: "Fogli",
    url: "https://wongoji-creator.netlify.app/",
  },
 // { title: "Quaderno Hangul", subtitle: "Descrizione", url: "https://..." },
];

interface PracticeGlyph {
  char: string;
  reading: string;
  meaning: string;
}

const HANZI_SAMPLES: PracticeGlyph[] = [
  { char: "永", reading: "yǒng", meaning: "eterno" },
  { char: "学", reading: "xué", meaning: "studiare" },
  { char: "书", reading: "shū", meaning: "libro" },
  { char: "水", reading: "shuǐ", meaning: "acqua" },
  { char: "心", reading: "xīn", meaning: "cuore" },
];

const HANGUL_SAMPLES: PracticeGlyph[] = [
  { char: "한", reading: "han", meaning: "coreano" },
  { char: "글", reading: "geul", meaning: "scrittura" },
  { char: "가", reading: "ga", meaning: "sillaba base" },
  { char: "마", reading: "ma", meaning: "sillaba m+a" },
  { char: "사랑", reading: "sa-rang", meaning: "amore" },
];

interface PracticeCanvasProps {
  strokeColor: string;
  ghostChar: string;
  showGuide: boolean;
  gridType: "tianzige" | "mizige" | "wongoji" | "lined";
  gridColor: string;
  ghostColorClass: string;
  clearSignal: number;
  ariaLabel: string;
}

function PracticeCanvas({
  strokeColor,
  ghostChar,
  showGuide,
  gridType,
  gridColor,
  ghostColorClass,
  clearSignal,
  ariaLabel,
}: PracticeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);

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
  }, [clearSignal]);

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
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
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
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 6.5;
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
    <div className="relative w-full h-full select-none">
      {/* Guide geometriche del quaderno (SVG nitido) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        {gridType === "tianzige" && (
          <>
            <line x1="50" y1="0" x2="50" y2="100" stroke={gridColor} strokeWidth="0.8" strokeDasharray="2.5 2.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke={gridColor} strokeWidth="0.8" strokeDasharray="2.5 2.5" />
          </>
        )}
        {gridType === "mizige" && (
          <>
            <line x1="50" y1="0" x2="50" y2="100" stroke={gridColor} strokeWidth="0.8" strokeDasharray="2.5 2.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke={gridColor} strokeWidth="0.8" strokeDasharray="2.5 2.5" />
            <line x1="0" y1="0" x2="100" y2="100" stroke={gridColor} strokeWidth="0.7" strokeDasharray="2 3" />
            <line x1="100" y1="0" x2="0" y2="100" stroke={gridColor} strokeWidth="0.7" strokeDasharray="2 3" />
          </>
        )}
        {gridType === "wongoji" && (
          <>
            <line x1="50" y1="0" x2="50" y2="100" stroke={gridColor} strokeWidth="0.7" strokeDasharray="2 2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke={gridColor} strokeWidth="0.7" strokeDasharray="2 2" />
            <rect x="6" y="6" width="88" height="88" fill="none" stroke={gridColor} strokeWidth="0.5" strokeDasharray="1.5 2" />
          </>
        )}
        {gridType === "lined" && (
          <>
            <line x1="0" y1="25" x2="100" y2="25" stroke={gridColor} strokeWidth="0.6" />
            <line x1="0" y1="50" x2="100" y2="50" stroke={gridColor} strokeWidth="0.8" strokeDasharray="2.5 2.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke={gridColor} strokeWidth="0.6" />
          </>
        )}
      </svg>

      {/* Carattere guida semitrasparente per ricalco */}
      {showGuide && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center pointer-events-none font-serif font-normal ${ghostColorClass} ${
            ghostChar.length > 1 ? "text-5xl tracking-tight" : "text-7xl"
          }`}
        >
          {ghostChar}
        </div>
      )}

      {/* Canvas interattivo mouse/touch */}
      <canvas
        ref={canvasRef}
        width={260}
        height={260}
        aria-label={ariaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative z-10 w-full h-full cursor-crosshair touch-none"
      />

      {/* Azione rapida pulizia */}
      {hasInk && (
        <button
          type="button"
          onClick={clearCanvas}
          title="Pulisci foglio"
          aria-label="Pulisci foglio"
          className="absolute bottom-1.5 right-1.5 z-20 p-1.5 rounded bg-black/75 text-white hover:bg-black transition-opacity cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// =========================================
// 1. QUADERNO CINESE INTERATTIVO (田字格 · 线装)
// =========================================
export const QuadernoCineseCard: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [gridMode, setGridMode] = useState<"tianzige" | "mizige">("mizige");
  const [showGuide, setShowGuide] = useState(true);
  const [clearCount, setClearCount] = useState(0);

  const activeGlyph = HANZI_SAMPLES[selectedIdx];

  const handleSelectChar = (idx: number) => {
    setSelectedIdx(idx);
    setClearCount((c) => c + 1);
  };

  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": "-1deg" } as React.CSSProperties}
    >
      <div className="cn-notebook w-full pl-9 pr-4 py-4">
        {/* Rilegatura a filo sul dorso sinistro */}
        <div className="cn-binding-spine" aria-hidden="true">
          <div className="cn-stitch-hole" />
          <div className="cn-stitch-hole" />
          <div className="cn-stitch-hole" />
          <div className="cn-stitch-hole" />
        </div>

        {/* Testata editoriale su carta Xuan */}
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#c0392b]/35">
          <div>
            <p className="text-[11px] font-mono text-[#96281b] tracking-wide">
              Scrittura cinese · 练习本
            </p>
            <h3 className="text-lg font-bold tracking-tight text-[#2b1810] leading-snug">
              Quaderno Hanzi
            </h3>
          </div>
          <div
            className="cn-seal-stamp px-1.5 py-1 text-[11px] font-bold tracking-widest select-none shrink-0"
            aria-hidden="true"
          >
            汉字
          </div>
        </div>

        {/* Barra selezione carattere */}
        <div className="mt-3 flex items-center gap-1.5" role="tablist" aria-label="Caratteri da praticare">
          {HANZI_SAMPLES.map((item, idx) => {
            const active = idx === selectedIdx;
            return (
              <button
                key={item.char}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectChar(idx)}
                className={`flex-1 h-8 rounded text-base font-serif transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-[#96281b] text-[#fdf7ea] font-bold shadow-xs"
                    : "bg-[#efe2c6] text-[#4e2a1e] hover:bg-[#e5d2ab]"
                }`}
              >
                {item.char}
              </button>
            );
          })}
        </div>

        {/* Foglio pratica interattivo 田字格 / 米字格 */}
        <div className="mt-3 flex items-center gap-3">
          <div className="cn-grid-box w-[124px] h-[124px] shrink-0">
            <PracticeCanvas
              strokeColor="#1f1410"
              ghostChar={activeGlyph.char}
              showGuide={showGuide}
              gridType={gridMode}
              gridColor="rgba(192, 57, 43, 0.42)"
              ghostColorClass="text-[#c0392b]/22"
              clearSignal={clearCount}
              ariaLabel={`Area di pratica per il carattere ${activeGlyph.char}`}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <div className="text-xs font-mono text-[#7c3726] truncate">
                {activeGlyph.reading} · {activeGlyph.meaning}
              </div>
              <p className="text-[11px] text-[#5c3d2e] leading-snug mt-0.5">
                Traccia sul riquadro.
              </p>
            </div>

            <div className="inline-flex items-center gap-0.5 bg-[#eadbbf] p-0.5 rounded">
              <button
                type="button"
                onClick={() => setGridMode("tianzige")}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  gridMode === "tianzige"
                    ? "bg-[#fbf6ea] text-[#96281b] font-bold"
                    : "text-[#634232] hover:text-[#2b1810]"
                }`}
                title="Griglia a croce 田字格"
              >
                田字格
              </button>
              <button
                type="button"
                onClick={() => setGridMode("mizige")}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  gridMode === "mizige"
                    ? "bg-[#fbf6ea] text-[#96281b] font-bold"
                    : "text-[#634232] hover:text-[#2b1810]"
                }`}
                title="Griglia diagonale 米字格"
              >
                米字格
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setShowGuide((g) => !g)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-[#eadbbf] hover:bg-[#dfcba6] text-[#3e2217] transition-colors cursor-pointer whitespace-nowrap"
              >
                {showGuide ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showGuide ? "Nascondi" : "Guida"}</span>
              </button>
              <button
                type="button"
                onClick={() => setClearCount((c) => c + 1)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-[#eadbbf] hover:bg-[#dfcba6] text-[#3e2217] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Eraser className="w-3 h-3" />
                <span>Pulisci</span>
              </button>
            </div>
          </div>
        </div>

        {/* Indice quaderni integrato sulle righe del foglio */}
        <div className="mt-4 pt-3 border-t border-[#c0392b]/30">
          <div className="text-[11px] font-mono text-[#8c2d19] mb-1.5">
            Quaderni collegati · {QUADERNI_CINESE.length}
          </div>
          <div className="divide-y divide-[#c0392b]/20">
            {QUADERNI_CINESE.map((item, idx) => (
              <a
                key={`${item.title}-${item.url}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 py-2 px-1 -mx-1 rounded hover:bg-[#c0392b]/8 transition-colors"
              >
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-[11px] font-mono tabular-nums text-[#96281b] shrink-0">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#2b1810] group-hover:text-[#96281b] transition-colors truncate block">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-[11px] text-[#6d4838] truncate block">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#96281b]/70 group-hover:text-[#96281b] shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================
// 2. QUADERNO COREANO INTERATTIVO (원고지 · 공책)
// =========================================
export const QuadernoCoreanoCard: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [gridMode, setGridMode] = useState<"wongoji" | "lined">("wongoji");
  const [showGuide, setShowGuide] = useState(true);
  const [clearCount, setClearCount] = useState(0);

  const activeGlyph = HANGUL_SAMPLES[selectedIdx];

  const handleSelectChar = (idx: number) => {
    setSelectedIdx(idx);
    setClearCount((c) => c + 1);
  };

  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": "1deg" } as React.CSSProperties}
    >
      <div className="kr-notebook w-full">
        {/* Fascia superiore quaderno coreano */}
        <div className="kr-top-binding px-4 py-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-mono text-emerald-100/80">
              Scrittura coreana · 원고지 공책
            </p>
            <h3 className="text-lg font-bold tracking-tight text-white leading-snug">
              Quaderno Hangul
            </h3>
          </div>
          <div
            className="w-9 h-9 rounded border border-emerald-200/40 bg-emerald-950/35 flex items-center justify-center text-base font-bold text-white select-none shrink-0"
            aria-hidden="true"
          >
            한
          </div>
        </div>

        <div className="p-4">
          {/* Selezione sillaba */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Sillabe Hangul da praticare">
            {HANGUL_SAMPLES.map((item, idx) => {
              const active = idx === selectedIdx;
              return (
                <button
                  key={item.char}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectChar(idx)}
                  className={`flex-1 h-8 rounded text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[#1e5f4b] text-white shadow-xs"
                      : "bg-[#dcebe0] text-[#174134] hover:bg-[#cbe1d1]"
                  }`}
                >
                  {item.char}
                </button>
              );
            })}
          </div>

          {/* Cella Wongoji interattiva */}
          <div className="mt-3 flex items-center gap-3">
            <div className="kr-wongoji-box w-[124px] h-[124px] shrink-0">
              <PracticeCanvas
                strokeColor="#0f2922"
                ghostChar={activeGlyph.char}
                showGuide={showGuide}
                gridType={gridMode}
                gridColor="rgba(38, 115, 89, 0.42)"
                ghostColorClass="text-[#1e5f4b]/22"
                clearSignal={clearCount}
                ariaLabel={`Area di pratica Hangul per ${activeGlyph.char}`}
              />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <div className="text-xs font-mono text-[#1e5f4b] truncate">
                  {activeGlyph.reading} · {activeGlyph.meaning}
                </div>
                <p className="text-[11px] text-[#355a4e] leading-snug mt-0.5">
                  Scrivi nella cella.
                </p>
              </div>

              <div className="inline-flex items-center gap-0.5 bg-[#dcebe0] p-0.5 rounded">
                <button
                  type="button"
                  onClick={() => setGridMode("wongoji")}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                    gridMode === "wongoji"
                      ? "bg-white text-[#1b5e4a] font-bold"
                      : "text-[#356455] hover:text-[#132a23]"
                  }`}
                  title="Cella 원고지"
                >
                  원고지
                </button>
                <button
                  type="button"
                  onClick={() => setGridMode("lined")}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                    gridMode === "lined"
                      ? "bg-white text-[#1b5e4a] font-bold"
                      : "text-[#356455] hover:text-[#132a23]"
                  }`}
                  title="Righe esercizio"
                >
                  Righe
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowGuide((g) => !g)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-[#dcebe0] hover:bg-[#cbe1d1] text-[#153e31] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {showGuide ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showGuide ? "Nascondi" : "Guida"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setClearCount((c) => c + 1)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-[#dcebe0] hover:bg-[#cbe1d1] text-[#153e31] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Eraser className="w-3 h-3" />
                  <span>Pulisci</span>
                </button>
              </div>
            </div>
          </div>

          {/* Indice quaderni sulle celle del quaderno */}
          <div className="mt-4 pt-3 border-t border-[#267359]/25">
            <div className="text-[11px] font-mono text-[#1e5f4b] mb-1.5">
              Quaderni collegati · {QUADERNI_COREANO.length}
            </div>
            <div className="divide-y divide-[#267359]/20">
              {QUADERNI_COREANO.map((item, idx) => (
                <a
                  key={`${item.title}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 py-2 px-1 -mx-1 rounded hover:bg-[#267359]/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="kr-link-cell w-6 h-6 flex items-center justify-center text-[10px] font-mono tabular-nums font-bold shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-[#132a23] group-hover:text-[#1e5f4b] transition-colors truncate block">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[11px] text-[#3d6457] truncate block">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1e5f4b]/70 group-hover:text-[#1e5f4b] shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
