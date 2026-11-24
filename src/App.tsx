import { useMemo } from 'react';

const DESK_EMOJIS = ['🀄', '🇯🇵', '🇨🇳', '🇰🇷', '🇷🇺', '🇬🇧', '📌', '📚', '🥋', '💭', '🎧', '🪆', '🎙️', '📺', '🎲'];

export default function App() {
  // =========================================
  // RANDOM DESK BACKGROUND ELEMENTS (Stable)
  // =========================================
  const floatingEmojis = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const emoji = DESK_EMOJIS[Math.floor(Math.random() * DESK_EMOJIS.length)];
      const left = Math.random() * 95;
      const top = Math.random() * 95;
      const fontSize = Math.random() * 2.2 + 1.2;
      const rot = Math.random() * 360;
      const delay = -Math.random() * 20;
      return { id: i, emoji, left, top, fontSize, rot, delay };
    });
  }, []);

  return (
    <div className="relative min-h-screen py-[120px] px-4 md:px-8">
      {/* 1. BACKGROUND FLOATING FILL-GRAIN EMOJIS */}
      <div className="bg-emojis">
        {floatingEmojis.map(item => (
          <div
            key={item.id}
            className="bg-emoji"
            style={{
              left: `${item.left}vw`,
              top: `${item.top}vh`,
              fontSize: `${item.fontSize}rem`,
              animationDelay: `${item.delay}s`,
              transform: `rotate(${item.rot}deg)`,
              ['--rot' as any]: `${item.rot}deg`
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* 2. MENU DOCK SUPERIORE GLASSMORPHISM */}
      <nav className="top-dock">
        <a href="https://lingua-cinese.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item cinese" data-tooltip="Lingua Cinese">🀄</a>
        <a href="https://scuola-virtuale.netlify.app/" target="_blank" rel="noopener noreferrer" className="dock-item school" data-tooltip="Scuola Virtuale">🎓</a>
        <a href="pdf-home.html" target="_blank" rel="noopener noreferrer" className="dock-item eserciziario" data-tooltip="Pdf Home">✍</a>
        <a href="https://lingua-cireana.netlify.app/" target="_blank" rel="noopener noreferrer" className="dock-item coreano" data-tooltip="Lingua Coreana">🇰🇷</a>
        <a href="https://mela-os.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item apple" data-tooltip="IPad Scriba">🍎</a>
        <a href="https://photo-finder-kohl.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item immagini" data-tooltip="Ricerca immagini">🖼</a>
        <a href="https://ricettario-internazionale.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item ricettario" data-tooltip="Ricettario">🍳</a>
        <a href="https://film-finder-indol.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item film" data-tooltip="Film">🎬</a>
        <a href="https://winamp-swart.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Musica" data-tooltip="Musica">🎧</a>
        <a href="https://ide-core.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Coding" data-tooltip="Edu Code">💻</a>
        <a href="https://tutor-programmazione.netlify.app/" target="_blank" rel="noopener noreferrer" className="dock-item Tutor" data-tooltip="Tutor">🖥</a>
        <a href="social.html" target="_blank" rel="noopener noreferrer" className="dock-item Social" data-tooltip="Social">👥</a>
        <a href="https://bunko-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Editor" data-tooltip="Bunko">📝</a>
        <a href="https://playground-web-ten.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Playground" data-tooltip="Playground">🖲</a>
        <a href="https://code-editor-khaki-one.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Code-Editor" data-tooltip="Code-Editor">🖱</a>
        <a href="https://ufficio-virtuale.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Ufficio-Virtuale" data-tooltip="Ufficio-Virtuale">🧰</a>
        <a href="https://web-coding-study-studio.ai.studio/" target="_blank" rel="noopener noreferrer" className="dock-item LearnCode" data-tooltip="LearnCode">📱</a>
        <a href="BlogCraft.html" target="_blank" rel="noopener noreferrer" className="dock-item BlogCraft" data-tooltip="BlogCraft">🌐</a>
      </nav>

      {/* 3. HEADER SEGNAPOSTO */}
      <header className="max-w-[1200px] mx-auto text-center mb-10 relative z-30">
        <div className="w-full flex justify-center mb-4">
          <div className="w-full max-w-[1000px] h-[150px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/25 backdrop-blur-sm flex flex-col items-center justify-center px-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Segnaposto Header
            </span>
            <p className="text-sm text-slate-500 mt-1">
              Inserisci qui il titolo o il banner della scrivania
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Segnaposto sottotitolo
        </p>
      </header>

      {/* 4. MAIN FLUID MASONRY GRID CONTAINER */}
      <main className="main-content">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 [column-fill:balance] w-full">
          {/* SEGNAPOSTO 1 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
            <div className="w-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 01</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 1</p>
            </div>
          </div>

          {/* SEGNAPOSTO 2 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <div className="w-full min-h-[320px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 02</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 2</p>
            </div>
          </div>

          {/* SEGNAPOSTO 3 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '0.5deg' } as any}>
            <div className="w-full min-h-[260px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 03</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 3</p>
            </div>
          </div>

          {/* SEGNAPOSTO 4 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <div className="w-full min-h-[460px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 04</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 4</p>
            </div>
          </div>

          {/* SEGNAPOSTO 5 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1.5deg' } as any}>
            <div className="w-full min-h-[300px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 05</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 5</p>
            </div>
          </div>

          {/* SEGNAPOSTO 6 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <div className="w-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 06</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 6</p>
            </div>
          </div>

          {/* SEGNAPOSTO 7 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
            <div className="w-full min-h-[250px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 07</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 7</p>
            </div>
          </div>

          {/* SEGNAPOSTO 8 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1.5deg' } as any}>
            <div className="w-full min-h-[440px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 08</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 8</p>
            </div>
          </div>

          {/* SEGNAPOSTO 9 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
            <div className="w-full min-h-[290px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 09</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 9</p>
            </div>
          </div>

          {/* SEGNAPOSTO 10 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <div className="w-full min-h-[360px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 10</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 10</p>
            </div>
          </div>

          {/* SEGNAPOSTO 11 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '0.5deg' } as any}>
            <div className="w-full min-h-[400px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 11</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 11</p>
            </div>
          </div>

          {/* SEGNAPOSTO 12 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <div className="w-full min-h-[270px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 12</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 12</p>
            </div>
          </div>

          {/* SEGNAPOSTO 13 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
            <div className="w-full min-h-[340px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 13</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 13</p>
            </div>
          </div>

          {/* SEGNAPOSTO 14 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <div className="w-full min-h-[450px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 14</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 14</p>
            </div>
          </div>

          {/* SEGNAPOSTO 15 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1.5deg' } as any}>
            <div className="w-full min-h-[280px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 15</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 15</p>
            </div>
          </div>

          {/* SEGNAPOSTO 16 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <div className="w-full min-h-[330px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 16</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 16</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
