import React from "react";
import { ExternalLink, PenLine } from "lucide-react";

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
    title: "Hanzi Builder Pro",
    subtitle: "Costruttore caratteri",
    url: "hanziBuilderPro.html",
  },
  {
    title: "Quaderni per Esercizi",
    subtitle: "Griglie di scrittura",
    url: "https://quaderni-per-esercizi.vercel.app/",
  },
  {
    title: "Quaderno Digitale",
    subtitle: "Pratica libera",
    url: "https://quaderno-digitale.vercel.app/",
  },
  {
    title: "Lingua Cinese",
    subtitle: "Portale studio",
    url: "https://lingua-cinese.vercel.app/",
  },
  // { title: "Altro Quaderno", subtitle: "Descrizione", url: "https://..." },
];

// =========================================
// 🇰🇷 MODIFICA QUI I LINK DEI QUADERNI COREANO
// =========================================
const QUADERNI_COREANO: QuadernoLink[] = [
  {
    title: "Lingua Coreana",
    subtitle: "Portale studio",
    url: "https://linguacoreana.netlify.app/",
  },
  {
    title: "Esercizi PDF Lingua",
    subtitle: "Fogli esercizi",
    url: "eserciziPDF.html",
  },
  {
    title: "Quaderno Digitale",
    subtitle: "Pratica Hangul",
    url: "https://quaderno-digitale.vercel.app/",
  },
  // { title: "Quaderno Hangul", subtitle: "Descrizione", url: "https://..." },
];

interface QuadernoMiniCardProps {
  badge: string;
  title: string;
  character: string;
  accent: "cinese" | "coreano";
  hoverRot: string;
  links: QuadernoLink[];
}

const ACCENT_STYLES = {
  cinese: {
    card: "bg-[#fef2f2] border-rose-900 shadow-[5px_5px_0px_0px_rgba(136,19,55,0.9)]",
    headerBorder: "border-rose-300",
    badge: "bg-rose-600 text-white",
    title: "text-rose-950",
    char: "bg-rose-100 text-rose-700 border-rose-300",
    item: "bg-white/80 hover:bg-rose-100/80 border-rose-200 hover:border-rose-400 text-slate-900",
    sub: "text-rose-700/80",
    icon: "text-rose-600",
  },
  coreano: {
    card: "bg-[#f0f9ff] border-sky-950 shadow-[5px_5px_0px_0px_rgba(12,74,110,0.9)]",
    headerBorder: "border-sky-300",
    badge: "bg-sky-600 text-white",
    title: "text-sky-950",
    char: "bg-sky-100 text-sky-700 border-sky-300",
    item: "bg-white/80 hover:bg-sky-100/80 border-sky-200 hover:border-sky-400 text-slate-900",
    sub: "text-sky-700/80",
    icon: "text-sky-600",
  },
};

function QuadernoMiniCard({
  badge,
  title,
  character,
  accent,
  hoverRot,
  links,
}: QuadernoMiniCardProps) {
  const s = ACCENT_STYLES[accent];

  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": hoverRot } as React.CSSProperties}
    >
      <div className={`w-full rounded-2xl border-2 p-4 ${s.card}`}>
        {/* Intestazione compatta */}
        <div className={`flex items-center justify-between pb-3 mb-3 border-b ${s.headerBorder}`}>
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${s.badge}`}>
              <PenLine className="w-3 h-3" />
              {badge}
            </span>
            <h3 className={`text-base font-extrabold tracking-tight mt-1 ${s.title}`}>
              {title}
            </h3>
          </div>
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-black select-none ${s.char}`}>
            {character}
          </div>
        </div>

        {/* Lista link quaderni */}
        <div className="space-y-2">
          {links.map((item) => (
            <a
              key={`${item.title}-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition-all hover:-translate-y-0.5 ${s.item}`}
            >
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{item.title}</div>
                {item.subtitle && (
                  <div className={`text-[10px] font-mono truncate ${s.sub}`}>
                    {item.subtitle}
                  </div>
                )}
              </div>
              <ExternalLink className={`w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 ${s.icon}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// 1. CARD QUADERNI CINESE
export const QuadernoCineseCard: React.FC = () => (
  <QuadernoMiniCard
    badge="Scrittura Cinese"
    title="Quaderni Hanzi"
    character="汉"
    accent="cinese"
    hoverRot="-1deg"
    links={QUADERNI_CINESE}
  />
);

// 2. CARD QUADERNI COREANO
export const QuadernoCoreanoCard: React.FC = () => (
  <QuadernoMiniCard
    badge="Scrittura Coreana"
    title="Quaderni Hangul"
    character="한"
    accent="coreano"
    hoverRot="1deg"
    links={QUADERNI_COREANO}
  />
);
