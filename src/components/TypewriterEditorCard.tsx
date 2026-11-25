import React, { useEffect, useRef, useState } from "react";

interface SavedTypewriterFile {
  id: string;
  preview: string;
  content: string;
  savedAt: string;
}

const STORAGE_KEY = "royal1954_typewriter_files";
const DEFAULT_TEXT = "Capitolo 1: La Notte dei Gatti Silenziosi.";

const KEY_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM.,".split(""),
];

function loadSavedFiles(): SavedTypewriterFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const TypewriterEditorCard: React.FC = () => {
  const [text, setText] = useState<string>(DEFAULT_TEXT);
  const [savedFiles, setSavedFiles] = useState<SavedTypewriterFile[]>(() => loadSavedFiles());
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showFiles, setShowFiles] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFiles));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedFiles]);

  const insertAtCursor = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      setText((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + snippet + text.slice(end);
    setText(next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleBackspace = () => {
    const el = textareaRef.current;
    if (!el) {
      const next = text.slice(0, -1);
      setText(next);
      if (!next) setActiveFileId(null);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;

    let next = text;
    let nextPos = start;

    if (start !== end) {
      next = text.slice(0, start) + text.slice(end);
      nextPos = start;
    } else if (start > 0) {
      next = text.slice(0, start - 1) + text.slice(start);
      nextPos = start - 1;
    }

    setText(next);
    if (!next) setActiveFileId(null);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextPos, nextPos);
    });
  };

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const firstLine =
      trimmed.split("\n").find((l) => l.trim().length > 0)?.trim() ?? "Foglio senza titolo";
    const preview = firstLine.length > 32 ? `${firstLine.slice(0, 32)}…` : firstLine;
    const now = new Date().toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (activeFileId && savedFiles.some((f) => f.id === activeFileId)) {
      setSavedFiles((prev) =>
        prev.map((f) =>
          f.id === activeFileId ? { ...f, preview, content: text, savedAt: now } : f
        )
      );
    } else {
      const newId = `${Date.now()}`;
      setSavedFiles((prev) => [{ id: newId, preview, content: text, savedAt: now }, ...prev]);
      setActiveFileId(newId);
    }

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1200);
  };

  const handleOpenFile = (file: SavedTypewriterFile) => {
    setText(file.content);
    setActiveFileId(file.id);
    setShowFiles(false);
  };

  const handleDeleteFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) setActiveFileId(null);
  };

  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": "-0.8deg" } as React.CSSProperties}
    >
      <div className="w-full max-w-[340px] mx-auto select-none font-sans">
        <div className="relative bg-gradient-to-b from-[#2b353b] via-[#1f262a] to-[#12171a] rounded-2xl p-3 shadow-2xl border-[3px] border-[#3d4950] text-neutral-200">
          {/* Barra Rullo Foglio */}
          <div className="relative mb-3">
            <div className="w-full h-3.5 bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-500 rounded-sm border border-neutral-600 shadow-sm flex items-center justify-between px-2">
              <span className="text-[6px] font-mono text-neutral-800 font-bold tracking-widest">
                |...|...|...|...|...|
              </span>
              <span className="text-[7px] font-mono text-neutral-900 font-black">
                ROYAL 1954
              </span>
            </div>

            {/* Foglio di Carta Battuta / Mini Editor */}
            <div className="relative -mt-1.5 mx-auto w-[92%] bg-[#faf7ee] rounded-t-sm px-2.5 pt-2.5 pb-2 shadow-xl border-x-2 border-t-2 border-[#d6cfbe] text-neutral-900">
              {/* Mini barra in cima al foglio con i soli due mini tasti Salva e File */}
              <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-[#e5decb]">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-[9px] font-bold tracking-wide transition cursor-pointer"
                >
                  {justSaved ? "Salvato ✓" : "Salva"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiles((v) => !v)}
                  className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold tracking-wide transition cursor-pointer ${
                    showFiles
                      ? "bg-amber-700 text-white"
                      : "bg-[#e7e0ce] hover:bg-[#dcd2bb] text-neutral-800"
                  }`}
                >
                  {showFiles ? "Chiudi" : `File (${savedFiles.length})`}
                </button>
              </div>

              {showFiles ? (
                <div className="h-[104px] overflow-y-auto space-y-1 pr-0.5 select-text">
                  {savedFiles.length === 0 ? (
                    <p className="text-[10px] font-mono text-neutral-500 text-center py-6">
                      Nessun file salvato.
                    </p>
                  ) : (
                    savedFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => handleOpenFile(file)}
                        className={`flex items-center justify-between gap-1.5 px-2 py-1 rounded border text-left cursor-pointer transition ${
                          activeFileId === file.id
                            ? "bg-amber-100 border-amber-400"
                            : "bg-white/80 hover:bg-amber-50 border-[#ded6c1]"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-[10px] font-bold text-neutral-800 truncate">
                            {file.preview}
                          </div>
                          <div className="font-mono text-[8px] text-neutral-500">
                            {file.savedAt}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFile(e, file.id)}
                          aria-label="Elimina file"
                          className="text-[10px] font-mono text-neutral-400 hover:text-rose-600 px-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => {
                    const val = e.target.value;
                    setText(val);
                    if (!val) setActiveFileId(null);
                  }}
                  rows={5}
                  placeholder="Scrivi qui..."
                  aria-label="Foglio macchina da scrivere"
                  className="w-full h-[104px] resize-none bg-transparent border-0 p-0 font-mono text-[11px] text-neutral-800 leading-relaxed focus:outline-none focus:ring-0 select-text"
                />
              )}
            </div>

            {/* Tasto A Capo */}
            <button
              type="button"
              onClick={() => insertAtCursor("\n")}
              className="absolute -top-2.5 right-1.5 px-2 py-0.5 rounded-full bg-gradient-to-b from-neutral-300 to-neutral-500 text-neutral-950 text-[9px] font-mono font-black border border-neutral-400 shadow cursor-pointer active:scale-95"
            >
              DING! A CAPO
            </button>
          </div>

          {/* Tastiera Rotonda Cromata Compatta (tutte le lettere) */}
          <div className="bg-[#181e22] p-2 rounded-xl border-2 border-[#2b353b] shadow-inner space-y-1.5">
            {KEY_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-1">
                {row.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => insertAtCursor(char.toLowerCase())}
                    className="w-[26px] h-[26px] rounded-full bg-gradient-to-b from-white to-neutral-300 text-neutral-900 font-serif font-black text-[10px] flex items-center justify-center shadow border border-neutral-400 active:scale-95 cursor-pointer"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}

            <div className="flex justify-center items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => insertAtCursor(" ")}
                className="flex-1 max-w-[150px] h-6 rounded-md bg-neutral-900 border border-neutral-500 text-neutral-400 font-mono text-[10px] cursor-pointer active:scale-95"
              >
                SPAZIO
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="px-2.5 h-6 rounded-lg bg-neutral-800 text-neutral-300 text-[10px] font-mono font-bold cursor-pointer active:scale-95"
              >
                ⌫ Canc
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
