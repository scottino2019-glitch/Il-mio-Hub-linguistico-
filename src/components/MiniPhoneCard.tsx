import React from "react";

export interface PhoneAppLink {
  label: string;
  icon: string;
  url: string;
  accentBg?: string;
}

// =========================================
// 📱 MODIFICA QUI LE ICONE E I LINK DEL TELEFONO
// =========================================
const PHONE_APPS: PhoneAppLink[] = [
  { label: "App 1", icon: "📚", url: "#", accentBg: "bg-amber-500/20 border-amber-400/30" },
  { label: "App 2", icon: "✍️", url: "#", accentBg: "bg-rose-500/20 border-rose-400/30" },
  { label: "App 3", icon: "🎧", url: "#", accentBg: "bg-sky-500/20 border-sky-400/30" },
  { label: "App 4", icon: "🀄", url: "#", accentBg: "bg-emerald-500/20 border-emerald-400/30" },
  { label: "App 5", icon: "🇰🇷", url: "#", accentBg: "bg-indigo-500/20 border-indigo-400/30" },
  { label: "App 6", icon: "📝", url: "#", accentBg: "bg-fuchsia-500/20 border-fuchsia-400/30" },
  { label: "App 7", icon: "🗂️", url: "#", accentBg: "bg-teal-500/20 border-teal-400/30" },
  { label: "App 8", icon: "🔖", url: "#", accentBg: "bg-orange-500/20 border-orange-400/30" },
  { label: "App 9", icon: "⭐", url: "#", accentBg: "bg-yellow-500/20 border-yellow-400/30" },
];

export const MiniPhoneCard: React.FC = () => {
  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": "1deg" } as React.CSSProperties}
    >
      {/* Frame Smartphone 9:16 con Dynamic Island */}
      <div className="relative w-full max-w-[320px] mx-auto bg-slate-950 p-3.5 rounded-[3rem] border-4 border-slate-800 shadow-2xl flex flex-col justify-between min-h-[460px]">
        {/* Bordo Superiore: Status Bar & Dynamic Island */}
        <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[10px] font-mono text-slate-400 select-none">
          <span className="font-bold text-white">09:41</span>
          {/* Dynamic Island Nera al Centro */}
          <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-2 border border-slate-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="flex items-center gap-1 text-[9px]">
            <span>5G</span>
            <span className="font-bold">100%</span>
          </div>
        </div>

        {/* Schermo Interno Display */}
        <div className="flex-1 w-full bg-slate-900 rounded-[2.2rem] p-4 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-slate-800">
          {/* Header schermo */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider">
              HOME APP
            </span>
            <span className="text-xs">🔔</span>
          </div>

          {/* Griglia piccole icone app */}
          <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
            {PHONE_APPS.map((app, index) => {
              const hasRealUrl = Boolean(app.url && app.url !== "#");
              return (
                <a
                  key={`${app.label}-${index}`}
                  href={app.url || "#"}
                  target={hasRealUrl ? "_blank" : undefined}
                  rel={hasRealUrl ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!hasRealUrl) e.preventDefault();
                  }}
                  title={hasRealUrl ? app.label : `${app.label} (inserisci il link in MiniPhoneCard.tsx)`}
                  className="group flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/5 transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shadow-md transition-transform group-hover:scale-105 ${
                      app.accentBg ?? "bg-slate-800/80 border-slate-700"
                    }`}
                  >
                    {app.icon}
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 group-hover:text-white truncate max-w-full text-center">
                    {app.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Barra dock inferiore interna */}
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>{PHONE_APPS.length} ICONE</span>
            <span className="text-amber-400/80">LINK RAPIDI</span>
          </div>
        </div>

        {/* Home Indicator Inferiore */}
        <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2.5 mb-1"></div>
      </div>
    </div>
  );
};

