import React, { useState } from "react";
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
                className="app-tile flex flex-col items-center justify-center p-3.5 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-500/15 hover:border-amber-500/40 rounded-2xl transition-all hover:-translate-y-1"
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
                className="app-tile flex flex-col items-center justify-center p-3.5 bg-indigo-950/40 hover:bg-indigo-950/60 border border-indigo-500/15 hover:border-indigo-500/40 rounded-2xl transition-all hover:-translate-y-1"
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
                className="app-tile flex flex-col items-center justify-center p-3.5 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/15 hover:border-rose-500/40 rounded-2xl transition-all hover:-translate-y-1"
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
                className="app-tile flex flex-col items-center justify-center p-3.5 bg-teal-950/40 hover:bg-teal-950/60 border border-teal-500/15 hover:border-teal-500/40 rounded-2xl transition-all hover:-translate-y-1"
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
                className="app-tile flex flex-col items-center justify-center p-3.5 bg-teal-950/40 hover:bg-teal-950/60 border border-teal-500/15 hover:border-teal-500/40 rounded-2xl transition-all hover:-translate-y-1"
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
                className="app-tile flex flex-col items-center justify-center p-3.5 bg-teal-950/40 hover:bg-teal-950/60 border border-teal-500/15 hover:border-teal-500/40 rounded-2xl transition-all hover:-translate-y-1"
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
export const PinkPdfNotebookCard: React.FC<DeskCardSoundProps> = ({ playSoundBlip }) => {
  const triggerSound = playSoundBlip ?? fallbackPlaySoundBlip;
  const [style, setStyle] = useState<"quadretti" | "righe">("quadretti");
  const [title, setTitle] = useState("La Mia Nota");
  const [content, setContent] = useState("Scrivi qui le tue formule, appunti o pensieri da stampare...");

  const handleCreatePdf = () => {
    triggerSound(1000, "sine", 0.12);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 1. Fill pinkish light background tint (#fdf2f8)
      doc.setFillColor(253, 242, 248);
      doc.rect(0, 0, 210, 297, "F");

      // 2. Draw styled Grid margins or Lined tracks
      doc.setDrawColor(249, 168, 212);
      doc.setLineWidth(0.12);

      if (style === "quadretti") {
        const gridGap = 8;
        for (let x = 10; x < 200; x += gridGap) {
          doc.line(x, 10, x, 287);
        }
        for (let y = 10; y < 287; y += gridGap) {
          doc.line(10, y, 200, y);
        }
      } else {
        const lineGap = 9;
        for (let y = 20; y < 287; y += lineGap) {
          doc.line(10, y, 200, y);
        }
      }

      // 3. Highlight Header Line
      doc.setDrawColor(219, 39, 119);
      doc.setLineWidth(0.6);
      doc.line(15, 28, 195, 28);

      // 4. Add Title Heading
      doc.setTextColor(31, 41, 55);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.text(title || "BlocNote PDF Artist", 15, 24);

      // 5. Add Body paragraph notes
      doc.setTextColor(55, 65, 81);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);

      const cleanContent = content || "Nessuna nota aggiuntiva.";
      const lines = doc.splitTextToSize(cleanContent, 175);
      doc.text(lines, 15, 36);

      // 6. Draw vintage retro stamp at the bottom corner of the page
      doc.setFillColor(251, 191, 36);
      doc.setDrawColor(217, 119, 6);
      doc.rect(132, 264, 62, 16, "FD");

      doc.setTextColor(30, 41, 59);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.text("CREATIVE PDF LAB", 136, 270);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.text("Generatore di Fogli Vintage", 136, 276);

      // Save output
      doc.save(`${title.toLowerCase().replace(/\s+/g, "_") || "quaderno_pdf"}.pdf`);
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
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-mono text-pink-600 font-extrabold uppercase bg-pink-100 px-2 py-0.5 rounded border border-pink-300">
              🗒️ Quaderno Creatore PDF
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

          {/* Form Content */}
          <div className="space-y-2 mt-4 select-text">
            <div>
              <label className="block text-[8px] font-mono uppercase text-pink-800 font-black tracking-wider">
                Oggetto / Titolo:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/70 border-b border-pink-300/60 focus:border-pink-500 font-semibold focus:outline-none text-xs text-stone-900 py-1"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-pink-800 font-black tracking-wider">
                Contenuto Quaderno:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
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