import { useState } from 'react';
import { Plane, Calendar, PlaneTakeoff, PlaneLanding, Crown, Luggage, User, Baby, ChevronDown, Check, MapPin, FileText, Ticket } from 'lucide-react';
import { FLIGHTS } from '@/data/itinerary';

export interface FlightCardProps {
  flight: typeof FLIGHTS.outbound;
  direction: 'outbound' | 'return';
}

export function FlightCard({ flight, direction }: FlightCardProps) {
  const isOutbound = direction === 'outbound';
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full min-w-0 overflow-hidden flex-1 rounded-2xl bg-white border border-slate-100 shadow-sm p-4 sm:p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap ${isOutbound ? 'bg-fuji-50 text-fuji-700' : 'bg-dento-50 text-dento-700'}`}>
          {isOutbound ? <PlaneTakeoff className="w-3.5 h-3.5" /> : <PlaneLanding className="w-3.5 h-3.5" />}
          {isOutbound ? '去程 Outbound' : '回程 Return'}
        </span>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs text-ink-400 font-mono flex-shrink-0 whitespace-nowrap">{flight.flightNo}</span>
          <span className="hidden sm:inline text-[11px] text-ink-500 truncate min-w-0">{flight.airline}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0 whitespace-nowrap">
            <Crown className="w-3 h-3" />
            {flight.cabin}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 text-left">
          <div className="text-lg sm:text-xl font-bold text-ink-800 tabular-nums leading-tight whitespace-nowrap">{flight.depart}</div>
          <div className="text-xs sm:text-sm text-ink-600 flex items-center gap-1">
            <span>🇹🇼</span>
            <span>TPE</span>
          </div>
        </div>

        <div className="flex flex-col items-center px-1 shrink-0">
          <span className="text-[10px] text-ink-400 mb-0.5 whitespace-nowrap">{flight.duration}</span>
          <div className="flex items-center justify-center w-16 sm:w-24">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-300 shrink-0" />
            <span className="flex-1 mx-1 border-t border-dashed border-ink-300" />
            <Plane className={`w-3.5 h-3.5 ${isOutbound ? 'text-fuji-500' : 'text-dento-500 rotate-180'}`} />
            <span className="flex-1 mx-1 border-t border-dashed border-ink-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-ink-300 shrink-0" />
          </div>
          <span className="text-[10px] text-ink-400 mt-0.5 whitespace-nowrap hidden sm:block">{flight.aircraft}</span>
        </div>

        <div className="min-w-0 flex-1 text-right">
          <div className="text-lg sm:text-xl font-bold text-ink-800 tabular-nums leading-tight whitespace-nowrap">{flight.arrive}</div>
          <div className="text-xs sm:text-sm text-ink-600 flex items-center justify-end gap-1">
            <span>🇯🇵</span>
            <span>NRT</span>
          </div>
        </div>
      </div>

      {/* Seat badges */}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        <span className="text-[10px] text-ink-400 font-medium">劃位</span>
        {flight.passengers.map((p, i) => (
          <span key={i} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded tabular-nums ${p.type === 'child' ? 'bg-fuji-50 text-fuji-700' : 'bg-amber-50 text-amber-700'}`}>
            {p.seat}
          </span>
        ))}
      </div>

      {/* Footer: date + expand button */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-xs text-ink-500 min-w-0">
          <Calendar className="w-3.5 h-3.5 text-ink-400" />
          {flight.date} ({flight.weekday})
        </span>
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-[11px] font-medium text-fuji-600 hover:text-fuji-700 transition-colors shrink-0"
        >
          {expanded ? '收合細節' : '顯示乘客與機票細節'}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Collapsible passenger details */}
      {expanded && (
        <div className="mt-3 space-y-2.5 animate-fade-up">
          {/* Confirmation details */}
          <div className="rounded-lg bg-indigo-50/60 border border-indigo-100 px-3 py-2.5 space-y-1.5">
            <div className="text-[11px] text-ink-500 font-medium flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> 訂位憑證
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Ticket className="w-3 h-3" /> PNR / 訂位代碼
              </span>
              <span className="text-sm font-bold text-indigo-700 tabular-nums tracking-wider">{flight.pnr}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">報到櫃檯</span>
              <span className="text-xs font-semibold text-slate-700">{flight.counter}</span>
            </div>
          </div>

          {/* Baggage allowance */}
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
            <div className="text-[11px] text-ink-500 font-medium mb-0.5 flex items-center gap-1.5">
              <Luggage className="w-3 h-3" /> 行李額度
            </div>
            <div className="text-xs text-ink-700">{flight.baggage} · 每位旅客 2 件免費託運</div>
          </div>

          {/* Passenger details */}
          <div className="space-y-2">
            {flight.passengers.map((p, i) => (
              <div key={i} className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1.5">
                  {p.type === 'child' ? <Baby className="w-3.5 h-3.5 text-fuji-500 shrink-0" /> : <User className="w-3.5 h-3.5 text-ink-400 shrink-0" />}
                  <span className="text-[11px] font-medium text-ink-700 whitespace-nowrap">{p.label}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded tabular-nums bg-slate-100 text-ink-600 whitespace-nowrap shrink-0">
                    {p.seat}
                  </span>
                  {p.preOrder && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-matcha-50 text-matcha-700 whitespace-nowrap shrink-0">
                      <Check className="w-2.5 h-2.5" />
                      {p.preOrder}
                    </span>
                  )}
                </div>
                {p.meal && (
                  <div className="text-[11px] leading-relaxed text-ink-600 break-words">
                    {p.meal}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-fuji-900" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(96,165,250,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.25) 0%, transparent 50%)'
      }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-fuji-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sakura-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇯🇵</span>
            <span className="text-xs font-medium tracking-widest text-fuji-200 uppercase">Tokyo Autumn 2026</span>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm hover:bg-white/20 transition-colors whitespace-nowrap"
          >
            🖨️ 下載/備份行程
          </button>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-2">
          2026 東京秋季親子6日遊
        </h1>
        <p className="text-base sm:text-lg text-fuji-100 font-light tracking-wide">
          6 天 5 夜親子自由行 · 行程規劃
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-5">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-fuji-200" />
            2026/09/19 — 09/24
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm whitespace-nowrap">
            <Plane className="w-3.5 h-3.5 text-fuji-200" />
            長榮航空 (TPE ⇄ NRT)
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-matcha-300" />
            6 天 5 夜親子自由行
          </span>
        </div>
      </div>
    </header>
  );
}
