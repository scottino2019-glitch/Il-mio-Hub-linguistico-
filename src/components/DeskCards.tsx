import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import "./DeskCards.css";

export interface DeskCardSoundProps {
  playSoundBlip?: (freq: number, type?: OscillatorType, duration?: number) => void;
}

const fallbackPlaySoundBlip = (
  freq: number,
  type: OscillatorType = "sine",
  duration: number = 0.06
) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors if blocked by browser autoplay policy
  }
};

// 1. ROJI CARD
export const RojiCard: React.FC = () => {
  return (
    <div className="desk-card hover-rot-1" style={{ "--hover-rot": "1deg" } as React.CSSProperties}>
      <div className="roji-embed-container bg-black rounded-[2rem] shadow-2xl border-4 border-stone-800 overflow-hidden relative aspect-[5/7.2] w-full max-w-[420px] mx-auto">
        <iframe
          src="https://roji-tawny.vercel.app/"
          className="absolute inset-0 w-full h-full border-none"
          allow="autoplay; clipboard-write; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-forms"
          title="roji"
        />
      </div>
    </div>
  );
};

// 2. SMARTPHONE CARD
export const SmartphoneCard: React.FC<DeskCardSoundProps> = ({ playSoundBlip }) => {
  const triggerSound = playSoundBlip ?? fallbackPlaySoundBlip;

  return (
    <div className="desk-card hover-rot-1" style={{ "--hover-rot": "1deg" } as React.CSSProperties}>
      <div className="smartphone-bezel overflow-hidden">
        <div className="top-ears">
          <div className="notch-camera"></div>
          <div className="ear-speaker"></div>
        </div>

        <div className="smartphone-screen p-4 min-h-[460px] flex flex-col justify-between select-none">
          <div>
            {/* Glowing Status grid bar */}
            <div className="flex justify-between items-center text-[9px] text-white/70 font-mono mb-4">
              <span>16:49</span>
              <div className="flex gap-1.5 items-center">
                <span className="text-[7px]">📶</span>
                <span>5G</span>
                <span>🔋 99%</span>
              </div>
            </div>

            <div
              className="text-center font-bold text-white tracking-wider text-base mt-2 mb-6"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              📚 Libri &amp; Codex
            </div>

            {/* Icon apps grid list */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://libreria-pdf.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerSound(880, "sine", 0.06)}
                className="app-tile flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all"
              >
                <span className="text-3xl mb-1.5">📚</span>
                <span className="text-[11px] text-white font-bold tracking-tight">Libreria</span>
                <span className="text-[7.5px] text-amber-400 font-mono mt-1 opacity-85">LINK DIRETTO ↗</span>
              </a>

              <a
                href="https://vox-libro.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerSound(880, "sine", 0.05)}
                className="app-tile flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all"
              >
                <span className="text-3xl mb-1.5">🎧</span>
                <span className="text-[11px] text-white font-bold tracking-tight">VoxLibro</span>
                <span className="text-[7.5px] text-indigo-400 font-mono mt-1 opacity-85">LINK DIRETTO ↗</span>
              </a>

              <a
                href="https://biblioteca-six-plum.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerSound(880, "sine", 0.05)}
                className="app-tile flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all"
              >
                <span className="text-3xl mb-1.5">📕</span>
                <span className="text-[11px] text-white font-bold tracking-tight">Biblioteca</span>
                <span className="text-[7.5px] text-rose-400 font-mono mt-1 opacity-85">LINK DIRETTO ↗</span>
              </a>

              <a
                href="https://1lib.sk/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerSound(880, "sine", 0.05)}
                className="app-tile flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all"
              >
                <span className="text-3xl mb-1.5">🗄</span>
                <span className="text-[11px] text-white font-bold tracking-tight">Z-Library</span>
                <span className="text-[7.5px] text-teal-400 font-mono mt-1 opacity-85">LINK DIRETTO ↗</span>
              </a>

              <a
                href="Laboratorio-programmazione.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerSound(880, "sine", 0.05)}
                className="app-tile flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all"
              >
                <span className="text-3xl mb-1.5">⚛️</span>
                <span className="text-[11px] text-white font-bold tracking-tight">ReactLab</span>
                <span className="text-[7.5px] text-teal-400 font-mono mt-1 opacity-85">LINK DIRETTO ↗</span>
              </a>

              <a
                href="https://lettore-pdf.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerSound(880, "sine", 0.05)}
                className="app-tile flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all"
              >
                <span className="text-3xl mb-1.5">📔</span>
                <span className="text-[11px] text-white font-bold tracking-tight">Lettore Pdf</span>
                <span className="text-[7.5px] text-teal-400 font-mono mt-1 opacity-85">LINK DIRETTO ↗</span>
              </a>
            </div>
          </div>

          {/* iPhone style home button strip bar */}
          <div className="w-24 h-1.5 bg-white/70 rounded-full mx-auto mt-6"></div>
        </div>
      </div>
    </div>
  );
};

// 3. PINK SPIRAL NOTEBOOK (Quadretti / Righe + PDF Creator)
type NotebookLang = "it" | "ko" | "ru" | "zh-CN";

const NOTEBOOK_LANG_OPTIONS: {
  code: NotebookLang;
  label: string;
  chars: string[];
  placeholderTitle: string;
  placeholderBody: string;
}[] = [
  {
    code: "it",
    label: "IT",
    chars: [],
    placeholderTitle: "La Mia Nota",
    placeholderBody: "Scrivi qui le tue formule, appunti o pensieri da stampare...",
  },
  {
    code: "ko",
    label: "한국어",
    chars: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅎ", "ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ"],
    placeholderTitle: "한국어 노트",
    placeholderBody: "여기에 한국어 문장이나 단어를 입력하세요...",
  },
  {
    code: "ru",
    label: "Русский",
    chars: ["а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"],
    placeholderTitle: "Мои заметки",
    placeholderBody: "Пишите здесь заметки на русском языке...",
  },
  {
    code: "zh-CN",
    label: "中文",
    chars: ["一", "二", "三", "人", "口", "日", "月", "木", "水", "火", "山", "田", "心", "爱", "学", "书"],
    placeholderTitle: "我的中文笔记",
    placeholderBody: "在这里输入汉字、词语或例句...",
  },
];

const MULTILINGUAL_FONT_STACK =
  '"Noto Sans SC", "Noto Sans KR", "PingFang SC", "Apple SD Gothic Neo", "Microsoft YaHei", "Malgun Gothic", "Noto Sans", "Segoe UI", system-ui, sans-serif';

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  rawText: string,
  maxWidth: number
): string[] {
  const result: string[] = [];
  const paragraphs = rawText.split(/\r?\n/);

  for (const para of paragraphs) {
    if (!para) {
      result.push("");
      continue;
    }

    let currentLine = "";
    // Suddividi preservando spazi/parole per lingue latine/russo e carattere per carattere per CJK lunghi
    const tokens = para.split(/(\s+)/);

    for (const token of tokens) {
      if (!token) continue;
      const testLine = currentLine + token;

      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else if (ctx.measureText(token).width > maxWidth) {
        // Token lungo (es. frase cinese/coreana senza spazi): spezza per singolo carattere
        for (const ch of Array.from(token)) {
          if (ctx.measureText(currentLine + ch).width <= maxWidth) {
            currentLine += ch;
          } else {
            if (currentLine) result.push(currentLine);
            currentLine = ch;
          }
        }
      } else {
        if (currentLine.trimEnd()) result.push(currentLine.trimEnd());
        currentLine = token.trimStart();
      }
    }

    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result;
}

export const PinkPdfNotebookCard: React.FC<DeskCardSoundProps> = ({ playSoundBlip }) => {
  const triggerSound = playSoundBlip ?? fallbackPlaySoundBlip;
  const [style, setStyle] = useState<"quadretti" | "righe">("quadretti");
  const [lang, setLang] = useState<NotebookLang>("it");
  const [title, setTitle] = useState("La Mia Nota");
  const [content, setContent] = useState("Scrivi qui le tue formule, appunti o pensieri da stampare...");
  const [activeField, setActiveField] = useState<"title" | "content">("content");

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const contentInputRef = useRef<HTMLTextAreaElement | null>(null);

  const currentLangConfig =
    NOTEBOOK_LANG_OPTIONS.find((item) => item.code === lang) ?? NOTEBOOK_LANG_OPTIONS[0];

  const handleInsertChar = (ch: string) => {
    triggerSound(920, "sine", 0.03);
    const isTitle = activeField === "title";
    const el = isTitle ? titleInputRef.current : contentInputRef.current;
    const value = isTitle ? title : content;
    const setter = isTitle ? setTitle : setContent;

    if (!el) {
      setter(value + ch);
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + ch + value.slice(end);
    setter(next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + ch.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleCreatePdf = () => {
    triggerSound(1000, "sine", 0.12);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Rendering A4 ad alta risoluzione su Canvas per supportare perfettamente Coreano, Russo, Cinese e Italiano
      const pageW = 1654; // 210mm @ 200 DPI
      const pageH = 2339; // 297mm @ 200 DPI
      const mm = (val: number) => (val / 210) * pageW;

      const drawSheetBase = (ctx: CanvasRenderingContext2D, pageIndex: number) => {
        // 1. Sfondo rosa chiaro (#fdf2f8)
        ctx.fillStyle = "#fdf2f8";
        ctx.fillRect(0, 0, pageW, pageH);

        // 2. Quadretti o righe
        ctx.strokeStyle = "#f9a8d4";
        ctx.lineWidth = Math.max(1, mm(0.16));

        if (style === "quadretti") {
          const gridGap = 8;
          ctx.beginPath();
          for (let x = 10; x < 200; x += gridGap) {
            ctx.moveTo(mm(x), mm(10));
            ctx.lineTo(mm(x), mm(287));
          }
          for (let y = 10; y < 287; y += gridGap) {
            ctx.moveTo(mm(10), mm(y));
            ctx.lineTo(mm(200), mm(y));
          }
          ctx.stroke();
        } else {
          const lineGap = 9;
          ctx.beginPath();
          for (let y = 20; y < 287; y += lineGap) {
            ctx.moveTo(mm(10), mm(y));
            ctx.lineTo(mm(200), mm(y));
          }
          ctx.stroke();
        }

        // 3. Linea intestazione
        ctx.strokeStyle = "#db2777";
        ctx.lineWidth = mm(0.6);
        ctx.beginPath();
        ctx.moveTo(mm(15), mm(28));
        ctx.lineTo(mm(195), mm(28));
        ctx.stroke();

        // 4. Titolo
        ctx.fillStyle = "#1f2937";
        ctx.font = `700 ${Math.round(mm(7))}px ${MULTILINGUAL_FONT_STACK}`;
        ctx.textBaseline = "alphabetic";
        const heading = (title || "BlocNote PDF Artist") + (pageIndex > 0 ? ` (${pageIndex + 1})` : "");
        ctx.fillText(heading, mm(15), mm(23), mm(180));

        // 5. Timbro vintage in basso a destra
        ctx.fillStyle = "#fbbf24";
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = mm(0.5);
        ctx.fillRect(mm(132), mm(264), mm(62), mm(16));
        ctx.strokeRect(mm(132), mm(264), mm(62), mm(16));

        ctx.fillStyle = "#1e293b";
        ctx.font = `700 ${Math.round(mm(3.3))}px ${MULTILINGUAL_FONT_STACK}`;
        ctx.fillText("CREATIVE PDF LAB", mm(136), mm(270));
        ctx.font = `400 ${Math.round(mm(2.6))}px ${MULTILINGUAL_FONT_STACK}`;
        ctx.fillText("Generatore di Fogli Vintage", mm(136), mm(276));
      };

      const measureCanvas = document.createElement("canvas");
      measureCanvas.width = pageW;
      measureCanvas.height = pageH;
      const measureCtx = measureCanvas.getContext("2d");
      if (!measureCtx) return;

      const bodyFontSize = Math.round(mm(4.2));
      const lineHeightPx = mm(6.8);
      measureCtx.font = `400 ${bodyFontSize}px ${MULTILINGUAL_FONT_STACK}`;

      const cleanContent = content || "Nessuna nota aggiuntiva.";
      const allLines = wrapCanvasText(measureCtx, cleanContent, mm(178));

      const startY = mm(38);
      const maxY = mm(255);
      const linesPerPage = Math.max(1, Math.floor((maxY - startY) / lineHeightPx));

      const totalPages = Math.max(1, Math.ceil(allLines.length / linesPerPage));

      for (let p = 0; p < totalPages; p++) {
        if (p > 0) doc.addPage();
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = pageW;
        pageCanvas.height = pageH;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) continue;

        drawSheetBase(ctx, p);

        ctx.fillStyle = "#374151";
        ctx.font = `400 ${bodyFontSize}px ${MULTILINGUAL_FONT_STACK}`;
        ctx.textBaseline = "alphabetic";

        const slice = allLines.slice(p * linesPerPage, (p + 1) * linesPerPage);
        slice.forEach((line, idx) => {
          ctx.fillText(line, mm(15), startY + idx * lineHeightPx);
        });

        const imgData = pageCanvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0, 0, 210, 297);
      }

      const safeFilename =
        title
          .trim()
          .replace(/[^\p{L}\p{N}_-]+/gu, "_")
          .replace(/^_+|_+$/g, "") || "quaderno_pdf";
      doc.save(`${safeFilename}.pdf`);
    } catch (e) {
      console.error("Errore generazione PDF: ", e);
    }
  };

  return (
    <div
      className="desk-card pink-spiral-notebook hover-rot-1"
      style={{ "--hover-rot": "1.5deg" } as React.CSSProperties}
    >
      {/* Silver Bindings Metal Rings */}
      <div className="spiral-rings-left">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="spiral-wire" />
        ))}
      </div>

      {/* Retro stickers */}
      <div className="notebook-sticker">★ PDF STUDIO</div>
      <div className="notebook-sticker-heart">💖</div>

      {/* Internal Ruled or Squared Sheets */}
      <div
        className={`pink-notebook-sheet min-h-[440px] flex flex-col justify-between ${
          style === "quadretti" ? "bg-quadretti" : "bg-righe"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono text-pink-600 font-extrabold uppercase bg-pink-100 px-2 py-0.5 rounded border border-pink-300">
              🗒️ Quaderno PDF Multi-Lingua
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  triggerSound(800, "sine", 0.04);
                  setStyle("quadretti");
                }}
                className={`px-1.5 py-0.5 text-[8px] font-bold rounded cursor-pointer transition-all ${
                  style === "quadretti"
                    ? "bg-pink-600 text-white"
                    : "bg-white text-pink-700 border border-pink-200"
                }`}
              >
                Quadretti ⚃
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerSound(800, "sine", 0.04);
                  setStyle("righe");
                }}
                className={`px-1.5 py-0.5 text-[8px] font-bold rounded cursor-pointer transition-all ${
                  style === "righe"
                    ? "bg-pink-600 text-white"
                    : "bg-white text-pink-700 border border-pink-200"
                }`}
              >
                Righe ☰
              </button>
            </div>
          </div>

          {/* Selettore lingua (IT / Coreano / Russo / Cinese) */}
          <div className="flex flex-wrap items-center gap-1 mt-2">
            {NOTEBOOK_LANG_OPTIONS.map((item) => {
              const active = lang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    triggerSound(860, "sine", 0.03);
                    setLang(item.code);
                  }}
                  className={`px-2 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                    active
                      ? "bg-pink-700 text-white"
                      : "bg-white/80 text-pink-800 border border-pink-200 hover:bg-pink-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Tastierino rapido caratteri per Coreano, Russo e Cinese */}
          {currentLangConfig.chars.length > 0 && (
            <div className="mt-2 p-1.5 bg-white/75 border border-pink-200 rounded-lg flex flex-wrap gap-1">
              {currentLangConfig.chars.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => handleInsertChar(ch)}
                  className="px-1.5 py-0.5 min-w-[20px] text-[10px] font-medium bg-pink-50 hover:bg-pink-200 text-stone-900 border border-pink-200 rounded cursor-pointer transition-colors"
                >
                  {ch}
                </button>
              ))}
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-2 mt-3 select-text">
            <div>
              <label className="block text-[8px] font-mono uppercase text-pink-800 font-black tracking-wider">
                Oggetto / Titolo:
              </label>
              <input
                ref={titleInputRef}
                type="text"
                lang={lang}
                value={title}
                onFocus={() => setActiveField("title")}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={currentLangConfig.placeholderTitle}
                style={{ fontFamily: MULTILINGUAL_FONT_STACK }}
                className="w-full bg-white/70 border-b border-pink-300/60 focus:border-pink-500 font-semibold focus:outline-none text-xs text-stone-900 py-1 px-1"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-pink-800 font-black tracking-wider">
                Contenuto Quaderno (IT · 한국어 · Русский · 中文):
              </label>
              <textarea
                ref={contentInputRef}
                lang={lang}
                value={content}
                onFocus={() => setActiveField("content")}
                onChange={(e) => setContent(e.target.value)}
                placeholder={currentLangConfig.placeholderBody}
                rows={4}
                style={{ fontFamily: MULTILINGUAL_FONT_STACK }}
                className="w-full bg-white/60 border border-pink-200 focus:border-pink-500 rounded p-1.5 focus:outline-none text-[11px] text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Action button to trigger JS download */}
        <div className="mt-4 pt-4 border-t border-pink-300/40">
          <button
            type="button"
            onClick={handleCreatePdf}
            className="w-full py-2 bg-pink-600 hover:bg-pink-700 active:translate-y-px text-white text-[10.5px] font-extrabold tracking-wider rounded-xl shadow-[0_3px_0px_#db2777] active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>🖨️ Crea &amp; Scarica PDF {style === "quadretti" ? "a Quadretti" : "a Righe"}</span>
          </button>

          {/* Direct Retro Link List for other PDF devices */}
          <div className="mt-3 bg-white/50 border border-pink-200 rounded-lg p-1.5 space-y-1 text-[9px] font-mono text-pink-900">
            <div className="font-extrabold text-[8px] uppercase tracking-wide text-pink-800 mb-1 flex items-center gap-1">
              <span>🚀</span> Altri editor PDF sulla scrivania:
            </div>
            <a
              href="editor-pdf-quadretti.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:underline hover:text-pink-600"
            >
              ➜ 📑 Pdf Editor (Quadretti)
            </a>
            <a
              href="righe-pdf-editor.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:underline hover:text-pink-600"
            >
              ➜ 🗒 Pdf Editor (Righe)
            </a>
            <a
              href="pdf-creator.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:underline hover:text-pink-600"
            >
              ➜ 💼 Pdf Creator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. AGENDA DEI KANJI CARD (Iframe Miniaturizzato 90%)
export const AgendaKanjiCard: React.FC = () => {
  return (
    <div
      className="desk-card hover-rot-1"
      style={{ "--hover-rot": "-1deg" } as React.CSSProperties}
    >
      <div className="relative overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] w-full h-[650px] rounded-3xl border-4 border-solid border-slate-200 shadow-lg bg-white">
        <iframe
          src="https://l-agenda-dei-kanji.scottino2019.workers.dev/"
          style={{
            width: "111.11%",
            height: "111.11%",
            transform: "scale(0.9)",
            transformOrigin: "top left",
            border: 0,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          title="L'Agenda dei Kanji"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

// 5. HEADER THE BENTO CHRONICLE (libero, senza wrapper card)
export const BentoChronicleHeader: React.FC = () => {
  return (
    <header className="relative z-30 w-full bg-[#fefce8] text-slate-900 border-2 border-slate-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] font-serif space-y-3">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-900 pb-2 text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase">
        <span>EDIZIONE SPECIALE • VOL. XCVI</span>
        <span>LUNEDÌ, 21 SETTEMBRE 2026</span>
        <span>METEO: SERENO 24°C • € 1,50</span>
      </div>

      <div className="text-center py-2 border-y-2 border-slate-900">
        <h1 className="text-3xl sm:text-5xl font-black tracking-wider uppercase font-serif">
          The Bento Chronicle
        </h1>
        <p className="text-[10px] sm:text-xs font-mono text-slate-600 tracking-[0.3em] uppercase mt-1">
          IL QUOTIDIANO MODULARE DEI COMPONENTI TATTILI
        </p>
      </div>

      <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-800">
        <span className="font-bold">★ PRIMA PAGINA</span>
        <span className="text-amber-800 font-bold hover:underline cursor-pointer">
          Sfoglia Indice ➔
        </span>
      </div>
    </header>
  );
};
