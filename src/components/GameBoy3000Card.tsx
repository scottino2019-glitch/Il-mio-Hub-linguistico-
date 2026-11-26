import React, { useRef, useState } from "react";

export interface ConsoleGameEntry {
  title: string;
  file: string;
}

// =========================================
// 🎮 MODIFICA QUI I GIOCHI HTML IN /public/
// =========================================
const GAME_ROMS: ConsoleGameEntry[] = [
  { title: "Gioco15", file: "gioco-15.html" },
  { title: "Gioco152", file: "gioco-15 (1).html" },
  { title: "Memory", file: "memory-vocabolario-italiano-english.html" },

  // { title: "Nuovo Gioco", file: "nome-file.html" },
];

function playRetroBeep(freq = 800, dur = 0.06) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    // Ignore audio errors if blocked by browser autoplay policy
  }
}

export const GameBoy3000Card: React.FC = () => {
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeGame, setActiveGame] = useState<ConsoleGameEntry | null>(null);
  const [reloadNonce, setReloadNonce] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleTogglePower = () => {
    const next = !powerOn;
    setPowerOn(next);
    if (!next) {
      setActiveGame(null);
    }
    playRetroBeep(next ? 1100 : 180, 0.09);
  };

  const handleLaunchGame = (game: ConsoleGameEntry, idx: number) => {
    if (!powerOn) return;
    setSelectedIndex(idx);
    setActiveGame(game);
    setReloadNonce((n) => n + 1);
    playRetroBeep(1200, 0.07);
  };

  const handleBackToMenu = () => {
    if (!powerOn) return;
    setActiveGame(null);
    playRetroBeep(520, 0.06);
  };

  const handleMoveSelection = (delta: number) => {
    if (!powerOn || GAME_ROMS.length === 0) return;
    playRetroBeep(900, 0.03);
    if (activeGame) {
      // Se un gioco è aperto, passa il focus all'iframe
      iframeRef.current?.focus();
      return;
    }
    setSelectedIndex((prev) => (prev + delta + GAME_ROMS.length) % GAME_ROMS.length);
  };

  const handleButtonA = () => {
    if (!powerOn) return;
    if (activeGame) {
      playRetroBeep(1000, 0.04);
      iframeRef.current?.focus();
      return;
    }
    const chosen = GAME_ROMS[selectedIndex];
    if (chosen) handleLaunchGame(chosen, selectedIndex);
  };

  const handleButtonB = () => {
    if (!powerOn) return;
    if (activeGame) {
      handleBackToMenu();
    } else {
      playRetroBeep(600, 0.04);
    }
  };

  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": "0.8deg" } as React.CSSProperties}
    >
      <div className="relative flex flex-col items-center select-none w-full max-w-[390px] mx-auto pt-2">
        {/* Titolo superiore */}
        <div className="text-center mb-3 pointer-events-none select-none">
          <span className="font-mono text-xs tracking-[0.2em] font-extrabold text-[#94a3b8] uppercase">
            ◈ GAMEBOY-3000 ◈
          </span>
        </div>

        {/* Cartuccia decorativa inserita correttamente nella sede superiore */}
        <div
          className="w-48 h-8 bg-zinc-700 rounded-t-lg border-x-4 border-t-4 border-zinc-900 flex justify-center items-start pt-1 z-0 -mb-2 shadow-md"
          aria-hidden="true"
        >
          <div className="w-10/12 h-5 bg-gradient-to-b from-blue-600 to-indigo-800 rounded-t-sm px-2 flex justify-center items-center text-[8px] font-mono text-white font-extrabold uppercase truncate border-x border-t border-indigo-950">
            GAME CART 👾
          </div>
        </div>

        {/* Corpo Console Game Boy (colori originali viola/scuro, dimensioni più lunghe e comode) */}
        <div
          style={{
            background: "radial-gradient(circle at 15% 15%, #280064b0, #000000c0)",
            border: "10px solid #5b21b6",
            borderRadius: "36px",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 0 20px rgba(139,92,246,0.25), 0 20px 45px rgba(0,0,0,0.6)",
          }}
          className="w-full p-4 pt-6 pb-5 flex flex-col justify-between items-center relative z-10"
        >
          {/* Selettore Power OFF / ON sul bordo superiore */}
          <div className="absolute -top-3 left-5 flex items-center gap-1 bg-stone-500 border border-stone-400 px-1.5 py-0.5 rounded-t z-20">
            <span className="text-[6px] text-zinc-950 font-black leading-none font-mono">
              OFF ON
            </span>
            <button
              type="button"
              onClick={handleTogglePower}
              aria-label={powerOn ? "Spegni console" : "Accendi console"}
              className={`w-6 h-3 bg-zinc-950 rounded p-0.5 flex items-center cursor-pointer ${
                powerOn ? "justify-end" : "justify-start"
              }`}
            >
              <div className="w-2.5 h-full bg-slate-100 rounded-sm" />
            </button>
          </div>

          {/* Cornice grigia schermo con LED batteria */}
          <div className="w-full bg-[#8e8d8d] border-t-2 border-b-4 border-x-2 border-[#737373] p-3 pt-2.5 pb-2.5 rounded-xl flex flex-col gap-1.5 relative shadow-inner z-10">
            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-200 px-1.5 font-bold">
              <span className="text-red-500">&#9679; BATTERY</span>
              <span>DOT MATRIX CONSOLE</span>
            </div>

            {/* Riquadro schermo più lungo e largo */}
            <div className="relative w-full h-[340px] bg-[#707c6d] border-4 border-stone-900 rounded-sm overflow-hidden flex flex-col font-mono text-stone-900">
              {/* Scanline CRT decorative non bloccanti */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                  background:
                    "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.16) 50%), linear-gradient(90deg, rgba(255,0,0,0.04), rgba(0,255,0,0.015), rgba(0,0,255,0.04))",
                  backgroundSize: "100% 4px, 6px 100%",
                }}
              />

              {!powerOn ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-4 uppercase">
                  <span className="text-xs font-bold animate-pulse">SISTEMA SPENTO</span>
                  <span className="text-[9px] text-stone-800 mt-1.5 leading-relaxed">
                    Sposta il selettore ON in alto per accedere ai giochi.
                  </span>
                </div>
              ) : activeGame ? (
                <div className="relative z-10 flex-1 flex flex-col w-full h-full bg-black">
                  {/* Barra rapida dentro la console per tornare al menu o ricaricare */}
                  <div className="flex items-center justify-between gap-2 px-2 py-1 bg-[#5a6657] border-b-2 border-stone-900 text-stone-950 text-[10px] font-bold shrink-0">
                    <button
                      type="button"
                      onClick={handleBackToMenu}
                      className="px-2 py-0.5 bg-[#8a9a86] hover:bg-[#9cad97] border border-stone-900 rounded-xs cursor-pointer"
                    >
                      ◀ MENU
                    </button>
                    <span className="truncate uppercase">{activeGame.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReloadNonce((n) => n + 1);
                        playRetroBeep(880, 0.05);
                      }}
                      className="px-1.5 py-0.5 bg-[#8a9a86] hover:bg-[#9cad97] border border-stone-900 rounded-xs cursor-pointer"
                      title="Riavvia gioco"
                    >
                      ↻
                    </button>
                  </div>

                  {/* Iframe gioco HTML da /public/ giocabile con mouse o touch */}
                  <iframe
                    key={`${activeGame.file}-${reloadNonce}`}
                    ref={iframeRef}
                    src={activeGame.file}
                    title={activeGame.title}
                    className="w-full flex-1 border-0 bg-white"
                    allow="autoplay; fullscreen"
                  />
                </div>
              ) : (
                <div className="relative z-10 flex-1 flex flex-col justify-between p-3 overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-stone-900/60 pb-1.5 mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider">
                        SELEZIONA GIOCO
                      </span>
                      <span className="text-[9px] font-bold">
                        {GAME_ROMS.length} ROM
                      </span>
                    </div>

                    {/* Menu testuale dei file HTML */}
                    <div className="space-y-1.5 overflow-y-auto max-h-[245px] pr-0.5">
                      {GAME_ROMS.map((game, idx) => {
                        const isSelected = idx === selectedIndex;
                        return (
                          <button
                            key={`${game.file}-${idx}`}
                            type="button"
                            onClick={() => handleLaunchGame(game, idx)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full text-left px-2.5 py-2 rounded-xs border text-[11px] font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-stone-900 text-[#9cb096] border-stone-950"
                                : "bg-[#818e7d]/70 hover:bg-[#8d9b89] text-stone-950 border-stone-900/35"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <span className="text-[10px]">
                                {isSelected ? "▶" : "·"}
                              </span>
                              <span className="truncate">{game.title}</span>
                            </span>
                            <span className="text-[9px] opacity-75 shrink-0">
                              AVVIA
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-900/35 text-[9px] font-bold flex items-center justify-between text-stone-900/85">
                    <span>TOCCA UN GIOCO O USA A</span>
                    <span>PUBLIC/*.HTML</span>
                  </div>
                </div>
              )}
            </div>

            {/* LED rosso batteria */}
            <div className="absolute left-1 top-[44%] flex flex-col items-center">
              <div
                className={`w-2 h-2 rounded-full border border-stone-800 ${
                  powerOn
                    ? "bg-red-500 shadow shadow-red-500"
                    : "bg-[#5a1c1c]"
                }`}
              />
            </div>
          </div>

          {/* Pulsantiera: D-Pad + Tasti B / A (facoltativi, usabili anche col menu) */}
          <div className="w-full flex justify-between items-center px-3 mt-4 select-none">
            {/* D-Pad a croce */}
            <div className="relative w-16 h-16 shrink-0 bg-transparent">
              <div className="absolute top-[21px] left-0 w-16 h-[22px] bg-[#333333] rounded-[3px] border border-zinc-950 shadow-inner" />
              <div className="absolute left-[21px] top-0 w-[22px] h-16 bg-[#333333] rounded-[3px] border border-zinc-950 shadow-inner" />
              <div className="absolute left-[22px] top-[22px] w-[20px] h-[20px] bg-[#3a3a3a] rounded-sm z-10 pointer-events-none" />

              <button
                type="button"
                onClick={() => handleMoveSelection(-1)}
                aria-label="Su"
                className="absolute top-0 left-[21px] w-[22px] h-[21px] bg-[#262626] active:bg-[#1a1a1a] rounded-t flex items-center justify-center text-[9px] text-zinc-400 font-bold cursor-pointer hover:brightness-110 z-20"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleMoveSelection(1)}
                aria-label="Giù"
                className="absolute bottom-0 left-[21px] w-[22px] h-[21px] bg-[#262626] active:bg-[#1a1a1a] rounded-b flex items-center justify-center text-[9px] text-zinc-400 font-bold cursor-pointer hover:brightness-110 z-20"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => handleMoveSelection(-1)}
                aria-label="Sinistra"
                className="absolute top-[21px] left-0 w-[21px] h-[22px] bg-[#262626] active:bg-[#1a1a1a] rounded-l flex items-center justify-center text-[9px] text-zinc-400 font-bold cursor-pointer hover:brightness-110 z-20"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => handleMoveSelection(1)}
                aria-label="Destra"
                className="absolute top-[21px] right-0 w-[21px] h-[22px] bg-[#262626] active:bg-[#1a1a1a] rounded-r flex items-center justify-center text-[9px] text-zinc-400 font-bold cursor-pointer hover:brightness-110 z-20"
              >
                ▶
              </button>
            </div>

            {/* Tasti B / A rosso bordeaux */}
            <div className="flex gap-3 pt-2">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleButtonB}
                  className="w-9 h-9 rounded-full bg-[#800020] hover:bg-[#600018] border-2 border-zinc-950 text-xs font-black text-slate-100 flex justify-center items-center cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  B
                </button>
                <span className="text-[7.5px] font-mono mt-0.5 font-bold text-stone-400">
                  MENU
                </span>
              </div>
              <div className="flex flex-col items-center pt-2">
                <button
                  type="button"
                  onClick={handleButtonA}
                  className="w-9 h-9 rounded-full bg-[#800020] hover:bg-[#600018] border-2 border-zinc-950 text-xs font-black text-slate-100 flex justify-center items-center cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  A
                </button>
                <span className="text-[7.5px] font-mono mt-0.5 font-bold text-stone-400">
                  AVVIA
                </span>
              </div>
            </div>
          </div>

          {/* Tasti inclinati SELECT / START */}
          <div className="w-8/12 flex justify-center gap-5 border-b border-dashed border-stone-400/50 pb-2.5 mt-3">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleBackToMenu}
                aria-label="Select - Torna al menu"
                className="w-9 h-2.5 bg-[#404040] hover:bg-[#333333] rounded shadow transform -rotate-12 cursor-pointer transition-all active:scale-95"
              />
              <span className="text-[7px] font-mono text-stone-400 font-black mt-1">
                SELECT
              </span>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleButtonA}
                aria-label="Start - Avvia gioco"
                className="w-9 h-2.5 bg-[#404040] hover:bg-[#333333] rounded shadow transform -rotate-12 cursor-pointer transition-all active:scale-95"
              />
              <span className="text-[7px] font-mono text-stone-400 font-black mt-1">
                START
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoy3000Card;
