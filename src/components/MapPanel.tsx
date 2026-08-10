import { useState, useCallback } from 'react';
import { Compass, Navigation, MapPin, Copy, Check, ExternalLink, Crosshair } from 'lucide-react';

interface MapPanelProps {
  mapQuery: string | null;
  title: string | null;
}

const FALLBACK_QUERY = 'Tokyo, Japan';
const FALLBACK_TITLE = '東京 (預設)';

export default function MapPanel({ mapQuery, title }: MapPanelProps) {
  const [copied, setCopied] = useState(false);
  const query = mapQuery ?? FALLBACK_QUERY;
  const label = title ?? FALLBACK_TITLE;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const openMaps = useCallback(() => {
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }, [mapsUrl]);

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = query;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* noop */ }
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [query]);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-100/80 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs border border-white/60 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105 transition-transform duration-200 shrink-0">
            <Compass size={20} strokeWidth={1.75} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-700 truncate">互動地圖</h3>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {label}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <MapBackdrop query={query} label={label} />

        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent">
          <div className="text-white">
            <p className="text-[11px] uppercase tracking-wider text-white/70 mb-0.5">目前選中景點</p>
            <h4 className="text-base font-semibold leading-tight drop-shadow-sm truncate">{label}</h4>
            <p className="text-xs text-white/85 mt-1 flex items-center gap-1.5 min-w-0">
              <Crosshair className="w-3 h-3 shrink-0" />
              <span className="truncate font-mono">{query}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-100 flex flex-col gap-2">
        <button
          type="button"
          onClick={openMaps}
          className="w-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-semibold text-white bg-fuji-600 hover:bg-fuji-700 active:bg-fuji-800 px-3 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fuji-400"
        >
          <Navigation className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">開啟 Google Maps 導航</span>
        </button>
        <button
          type="button"
          onClick={copyAddress}
          className="w-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-3 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fuji-300"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-matcha-600 shrink-0" />
              <span className="truncate">已複製地址</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">複製地址 / 轉乘路線</span>
            </>
          )}
        </button>
      </div>

      <div className="px-3 pb-3 -mt-1">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-fuji-600 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          於 Google Maps 中查看完整街景與大眾運輸路線
        </a>
      </div>
    </div>
  );
}

function MapBackdrop({ query, label }: { query: string; label: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-fuji-50 via-slate-50 to-matcha-50">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 400 300">
        <path d="M0,180 Q80,120 160,150 T320,130 L400,160" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        <path d="M40,40 L120,80 L200,60 L300,110 L380,90" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />
        <circle cx="120" cy="80" r="4" fill="#64748b" />
        <circle cx="300" cy="110" r="4" fill="#64748b" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-7 w-px h-6 bg-fuji-600/50" />
          <span className="absolute -top-10 whitespace-nowrap rounded-md bg-white/90 backdrop-blur px-2 py-0.5 text-[11px] font-semibold text-fuji-700 shadow-soft max-w-[200px] truncate">
            {label}
          </span>
          <MapPin className="w-9 h-9 text-fuji-600 drop-shadow-md animate-bounce-slow" fill="currentColor" />
          <span className="absolute top-full mt-2 max-w-[240px] truncate text-center text-[11px] font-mono text-slate-500 bg-white/70 backdrop-blur rounded px-1.5 py-0.5">
            {query}
          </span>
        </div>
      </div>
    </div>
  );
}
