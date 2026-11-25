import React, { useEffect, useMemo, useRef, useState } from "react";
import { ListVideo, Plus, SkipBack, SkipForward, Trash2, Volume2, VolumeX } from "lucide-react";

export interface VideoLinkItem {
  id: string;
  title: string;
  url: string;
}

const STORAGE_KEY = "cinema_video_links_v1";

const DEFAULT_VIDEOS: VideoLinkItem[] = [
  {
    id: "sample-1",
    title: "Demo: Big Buck Bunny",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];

function loadSavedVideos(): VideoLinkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VIDEOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VIDEOS;
  } catch {
    return DEFAULT_VIDEOS;
  }
}

type ParsedSource =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "direct"; src: string };

function parseVideoSource(rawUrl: string): ParsedSource {
  const url = rawUrl.trim();

  // YouTube (watch, youtu.be, shorts, embed)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch?.[1]) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch?.[1]) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return { kind: "direct", src: url };
}

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "00:00";
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export const CinemaVideoCard: React.FC = () => {
  const [videos, setVideos] = useState<VideoLinkItem[]>(() => loadSavedVideos());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Form caricamento solo con link
  const [newTitle, setNewTitle] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [urlError, setUrlError] = useState<string>("");

  // Stato player HTML5
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubberRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    } catch {
      // Ignore storage quota errors
    }
  }, [videos]);

  const safeIndex = videos.length > 0 ? Math.min(currentIndex, videos.length - 1) : 0;
  const currentVideo = videos[safeIndex] ?? null;

  const parsedSource = useMemo(
    () => (currentVideo ? parseVideoSource(currentVideo.url) : null),
    [currentVideo]
  );

  const isEmbed = parsedSource?.kind === "youtube" || parsedSource?.kind === "vimeo";

  // Reset playback stats when track changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setMediaError(false);
  }, [currentVideo?.id, currentVideo?.url]);

  // Sync volume & speed to HTML5 <video>
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = speed;
    el.volume = volume / 100;
    el.muted = isMuted;
  }, [speed, volume, isMuted, currentVideo?.id]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el || isEmbed) return;
    if (el.paused) {
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setMediaError(true));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (videos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleNext = () => {
    if (videos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = videoRef.current;
    const bar = scrubberRef.current;
    if (!el || !bar || !duration || isEmbed) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    el.currentTime = pct * duration;
    setCurrentTime(el.currentTime);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = newUrl.trim();
    if (!trimmedUrl) {
      setUrlError("Incolla un link video valido.");
      return;
    }

    try {
      const parsed = new URL(trimmedUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setUrlError("Il link deve iniziare con http:// o https://");
        return;
      }
    } catch {
      setUrlError("Link non valido. Controlla l'indirizzo.");
      return;
    }

    const fallbackTitle = `Video ${videos.length + 1}`;
    const item: VideoLinkItem = {
      id: `${Date.now()}`,
      title: newTitle.trim() || fallbackTitle,
      url: trimmedUrl,
    };

    const nextList = [...videos, item];
    setVideos(nextList);
    setCurrentIndex(nextList.length - 1);
    setNewTitle("");
    setNewUrl("");
    setUrlError("");
    setMenuOpen(false);
  };

  const handleRemoveVideo = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const idx = videos.findIndex((v) => v.id === id);
    const next = videos.filter((v) => v.id !== id);
    setVideos(next);
    if (next.length === 0) {
      setCurrentIndex(0);
    } else if (idx <= safeIndex) {
      setCurrentIndex(Math.max(0, safeIndex - 1));
    }
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className="desk-card"
      style={{ "--hover-rot": "0.8deg" } as React.CSSProperties}
    >
      <div className="w-full max-w-2xl mx-auto rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Viewport 16:9 Cinema */}
        <div className="relative aspect-video bg-black overflow-hidden group select-none flex flex-col justify-between p-4 sm:p-5">
          {/* Player reale: YouTube / Vimeo iframe oppure <video> HTML5 */}
          {currentVideo && parsedSource ? (
            parsedSource.kind === "youtube" || parsedSource.kind === "vimeo" ? (
              <iframe
                key={currentVideo.id}
                src={parsedSource.embedUrl}
                title={currentVideo.title}
                className="absolute inset-0 w-full h-full border-0 z-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                key={currentVideo.id}
                ref={videoRef}
                src={parsedSource.src}
                playsInline
                onClick={togglePlay}
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration || 0);
                    videoRef.current.playbackRate = speed;
                    videoRef.current.volume = volume / 100;
                    videoRef.current.muted = isMuted;
                  }
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  if (videos.length > 1) handleNext();
                }}
                onError={() => setMediaError(true)}
                className="absolute inset-0 w-full h-full object-contain bg-black cursor-pointer z-0"
              />
            )
          ) : (
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
              alt="Cinematic frame"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}

          {/* Gradiente leggero ai bordi solo quando non c'è iframe attivo o in pausa */}
          {!isEmbed && !isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/65 pointer-events-none z-[1]" />
          )}

          {/* Top Badges + Pulsante Playlist / Carica Link */}
          <div className="relative z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-bold font-mono tracking-wider shadow-lg">
                4K HDR
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300">
                {isEmbed ? "EMBED LINK" : "VIDEO LINK"}
              </span>
            </div>

            <div className="relative pointer-events-auto">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="px-2.5 py-1 rounded-md bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ListVideo className="w-3.5 h-3.5 text-amber-400" />
                <span>Playlist ({videos.length})</span>
              </button>

              {menuOpen && (
                <div className="absolute top-9 right-0 w-72 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-xl p-2.5 shadow-2xl z-30 space-y-2.5">
                  {/* Form carica video da link */}
                  <form onSubmit={handleAddVideo} className="space-y-1.5 pb-2 border-b border-zinc-800">
                    <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                      + Carica Video da Link
                    </div>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Titolo (opzionale)"
                      className="w-full px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={newUrl}
                        onChange={(e) => {
                          setNewUrl(e.target.value);
                          if (urlError) setUrlError("");
                        }}
                        placeholder="Link YouTube, Vimeo o .mp4"
                        className="flex-1 min-w-0 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        title="Aggiungi link"
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {urlError && (
                      <p className="text-[10px] text-rose-400 font-mono">{urlError}</p>
                    )}
                  </form>

                  {/* Lista video salvati */}
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5">
                    {videos.length === 0 ? (
                      <p className="text-[11px] text-zinc-400 text-center py-3 font-mono">
                        Nessun video in playlist.
                      </p>
                    ) : (
                      videos.map((v, idx) => (
                        <div
                          key={v.id}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setMenuOpen(false);
                          }}
                          className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-xs transition ${
                            idx === safeIndex
                              ? "bg-amber-500/20 border border-amber-400/40 text-amber-200"
                              : "hover:bg-white/10 text-zinc-200"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {idx + 1}. {v.title}
                            </div>
                            <div className="text-[9px] font-mono text-zinc-400 truncate">
                              {v.url}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveVideo(e, v.id)}
                            aria-label="Rimuovi video"
                            className="p-1 text-zinc-400 hover:text-rose-400 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Play Overlay (solo per link video diretti in pausa o errore) */}
          {!isEmbed && (!isPlaying || mediaError) && (
            <div className="relative z-10 text-center my-auto flex flex-col items-center pointer-events-none">
              {mediaError ? (
                <div className="bg-black/80 border border-rose-500/40 rounded-xl px-4 py-3 pointer-events-auto max-w-xs">
                  <p className="text-xs text-rose-300 font-medium">
                    Impossibile riprodurre direttamente questo link.
                  </p>
                  {currentVideo && (
                    <a
                      href={currentVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[11px] font-mono text-amber-400 underline"
                    >
                      Apri link esterno ↗
                    </a>
                  )}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={currentVideo ? togglePlay : () => setMenuOpen(true)}
                    className="pointer-events-auto w-14 h-14 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all mb-2 cursor-pointer"
                  >
                    <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                  <h3 className="text-sm sm:text-base font-semibold tracking-tight text-white drop-shadow line-clamp-1 px-2">
                    {currentVideo ? currentVideo.title : "Carica un video con link"}
                  </h3>
                  <p className="text-[11px] text-zinc-300 font-mono mt-0.5">
                    {currentVideo
                      ? `Video ${safeIndex + 1} di ${videos.length}`
                      : "Apri Playlist in alto per incollare un URL"}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Scrubber Bar (per video HTML5) */}
          {!isEmbed && (
            <div className="relative z-10">
              <div
                ref={scrubberRef}
                onClick={handleScrub}
                className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer relative transition-all overflow-hidden"
              >
                <div
                  className="h-full bg-amber-400 rounded-full transition-[width] duration-100"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Console Controls Bar stile iPod */}
        <div className="px-4 sm:px-5 py-3 bg-zinc-900/95 border-t border-zinc-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={videos.length <= 1}
              title="Video precedente"
              className="p-1.5 text-zinc-300 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {!isEmbed && (
              <button
                type="button"
                onClick={togglePlay}
                disabled={!currentVideo}
                title={isPlaying ? "Pausa" : "Riproduci"}
                className="p-1.5 text-zinc-200 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={videos.length <= 1}
              title="Video successivo"
              className="p-1.5 text-zinc-300 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {isEmbed ? (
              <span className="font-mono text-[11px] text-zinc-300 truncate max-w-[140px] sm:max-w-[200px]">
                {currentVideo?.title}
              </span>
            ) : (
              <span className="font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                <span className="text-zinc-200">{formatTime(currentTime)}</span> /{" "}
                <span>{formatTime(duration)}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isEmbed && (
              <>
                <button
                  type="button"
                  onClick={cycleSpeed}
                  className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-300 cursor-pointer"
                >
                  {speed.toFixed(speed % 1 === 0 ? 1 : 2)}×
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsMuted((m) => !m)}
                    className="text-zinc-400 hover:text-white cursor-pointer"
                    aria-label={isMuted ? "Riattiva audio" : "Muto"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolume(val);
                      setIsMuted(val === 0);
                    }}
                    className="w-14 sm:w-16 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] hover:bg-amber-500/25 cursor-pointer"
            >
              + Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaVideoCard;
