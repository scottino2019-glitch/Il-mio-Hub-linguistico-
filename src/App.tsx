
import { useMemo } from 'react';
import { LayoutGrid, PlusSquare } from 'lucide-react';
import { DiacriticsArchPad } from "./components/DiacriticsArchPad";
import {StaticWhiteBoard } from "./components/StaticWhiteBoard";
import { DiacriticsArchKor } from "./components/DiacriticsArchKor";
import { RojiCard, SmartphoneCard, PinkPdfNotebookCard, AgendaKanjiCard,  BentoChronicleHeader } from "./components/DeskCards";
import { FavoritesCard } from "./components/FavoritesCard";
import { QuadernoCineseCard, QuadernoCoreanoCard } from "./components/QuaderniScritturaCards";
import { MobileIframe } from "./components/MobileIframe";
import { MiniPhoneCard } from ".components/MiniPhoneCard";
import { TypewriterEditorCard } from "./components/TypewriterEditorCard";

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
        <a href="https://linguacoreana.netlify.app/" target="_blank" rel="noopener noreferrer" className="dock-item coreano" data-tooltip="Lingua Coreana">🇰🇷</a>
        <a href="https://chinese-os-cell.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item apple" data-tooltip="Cinese OS">📱</a>
        <a href="https://photo-finder-kohl.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item immagini" data-tooltip="Ricerca immagini">🖼</a>
        <a href="https://winamp-swart.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Musica" data-tooltip="Musica">🎧</a>
        <a href="social.html" target="_blank" rel="noopener noreferrer" className="dock-item Social" data-tooltip="Social">👥</a>
        <a href="https://bunko-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Editor" data-tooltip="Bunko">📝</a>
        <a href="https://ufficio-virtuale.vercel.app/" target="_blank" rel="noopener noreferrer" className="dock-item Ufficio-Virtuale" data-tooltip="Ufficio-Virtuale">🧰</a>
        <a href="BlogCraft.html" target="_blank" rel="noopener noreferrer" className="dock-item BlogCraft" data-tooltip="BlogCraft">🌐</a>
      </nav>

      {/* 3. HEADER SEGNAPOSTO */}
      <header className="max-w-[1200px] mx-auto text-center mb-10 relative z-30">
        <div className="w-full flex justify-center mb-4">
          <div className="w-full max-w-[1000px] h-[150px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/25 backdrop-blur-sm flex flex-col items-center justify-center px-6">
            <LayoutGrid className="w-6 h-6 text-slate-400 mb-2" />
          <BentoChronicleHeader />
          </div>
        </div>
      
      </header>

      {/* 4. MAIN FLUID MASONRY GRID CONTAINER */}
      <main className="main-content">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 [column-fill:balance] w-full">
          {/* SEGNAPOSTO 1 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
            <div
              className="ipod-embed-container"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                aspectRatio: '4 / 7.2',
                borderRadius: '2rem',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden',
                backgroundColor: '#000',
              }}
            >
              <iframe
                src="https://i-pod-audio-player.vercel.app/"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="autoplay; clipboard-write; encrypted-media"
                sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
                title="Retro iPod Player"
              />
            </div>
          </div>

        
          {/* SEGNAPOSTO 2 */}
         <div className="desk-card hover-rot-1" style= {{ '--hover-rot': '0.5deg' } as any}>
          <QuadernoCineseCard />
          </div>

          {/* SEGNAPOSTO 3 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '0.5deg' } as any}>
           <QuadernoCoreanoCard />
          </div>

          {/* SEGNAPOSTO 4 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
          <MobileIframe />
           
          </div>

          {/* SEGNAPOSTO 5 (in attesa del file src/components/StaticWhiteboard.jsx) */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1.5deg' } as any}>
            <DiacriticsArchPad />
            
          </div>

          {/* SEGNAPOSTO 6 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
           <FavoritesCard />

          </div>

          {/* SEGNAPOSTO 7 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
           
            <div className="w-full min-h-[290px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <PlusSquare className="w-5 h-5 text-slate-400 mb-2" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 07</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 7</p>
            </div>
          </div>

          {/* SEGNAPOSTO 8 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1.5deg' } as any}>
           <SmartphoneCard />
          </div>

          {/* SEGNAPOSTO 9 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
           <StaticWhiteBoard />

           
          </div>

          {/* SEGNAPOSTO 10 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <RojiCard />
          </div>

          {/* SEGNAPOSTO 11 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '0.5deg' } as any}>
            <DiacriticsArchKor />
          </div>

          {/* SEGNAPOSTO 12 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
          <MiniPhoneCard />
          </div>

          {/* SEGNAPOSTO 13 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1deg' } as any}>
            <div className="w-full min-h-[340px] rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <PlusSquare className="w-5 h-5 text-slate-400 mb-2" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Segnaposto 13</span>
              <p className="text-sm text-slate-500 mt-1">Posiziona qui la Card 13</p>
            </div>
          </div>

          {/* SEGNAPOSTO 14 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
            <PinkPdfNotebookCard />
          </div>

          {/* SEGNAPOSTO 15 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '1.5deg' } as any}>
           <AgendaKanjiCard />
          </div>

          {/* SEGNAPOSTO 16 */}
          <div className="desk-card hover-rot-1" style={{ '--hover-rot': '-1deg' } as any}>
           <TypewriterEditorCard />
          </div>
        </div>
      </main>
    </div>
  );
}
