import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CalendarDays, MapPin, CheckCircle2, ChevronDown, Maximize2, Minimize2, Smartphone, X } from 'lucide-react';
import Header, { FlightCard } from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import InfoAccordionCard from '@/components/HotelLuggageCard';
import ItineraryCard from '@/components/ItineraryCard';
import MapPanel from '@/components/MapPanel';
import { DAYS, CITIES, FLIGHTS, type ItineraryStop } from '@/data/itinerary';

const STORAGE_KEY = 'tokyo-trip-progress-v1';

export default function App() {
  const [activeDayId, setActiveDayId] = useState(DAYS[0].id);
  const [activeMap, setActiveMap] = useState<{ query: string; title: string } | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showPwaHint, setShowPwaHint] = useState(() => {
    try { return !localStorage.getItem('pwa-hint-dismissed'); } catch { return true; }
  });
  const dismissPwaHint = () => {
    setShowPwaHint(false);
    try { localStorage.setItem('pwa-hint-dismissed', '1'); } catch { /* ignore */ }
  };
  const tabScrollerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const centerActiveTab = useCallback(() => {
    const scroller = tabScrollerRef.current;
    const tab = activeTabRef.current;
    if (!scroller || !tab) return;
    const target = tab.offsetLeft - (scroller.clientWidth - tab.clientWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch { /* ignore */ }
  }, [completed]);

  const activeDay = useMemo(() => DAYS.find(d => d.id === activeDayId) ?? DAYS[0], [activeDayId]);

  useEffect(() => {
    const city = CITIES[activeDay.cityKey];
    setActiveMap({ query: `${city.nameJp},Japan`, title: `${city.name} (今日區域)` });
  }, [activeDay, activeDayId]);

  useEffect(() => {
    if (activeDay.stops.length <= 1) {
      setCollapsed(new Set());
      return;
    }
    setCollapsed(new Set(activeDay.stops.slice(1).map(s => s.id)));
  }, [activeDayId, activeDay]);

  useEffect(() => {
    const id = requestAnimationFrame(centerActiveTab);
    return () => cancelAnimationFrame(id);
  }, [activeDayId, centerActiveTab]);

  const allExpanded = activeDay.stops.length > 0 && activeDay.stops.every(s => !collapsed.has(s.id));

  const expandAll = () => setCollapsed(new Set());
  const collapseAll = () => setCollapsed(new Set(activeDay.stops.map(s => s.id)));

  const toggleStopExpanded = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleShowOnMap = (stop: ItineraryStop) => {
    setActiveMap({ query: stop.mapQuery, title: stop.title });
    if (window.innerWidth < 1024) setMobileMapOpen(true);
  };

  const toggleCompleted = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const dayProgress = useMemo(() => {
    const total = activeDay.stops.length;
    const done = activeDay.stops.filter(s => completed.has(s.id)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [activeDay, completed]);

  const totalProgress = useMemo(() => {
    const total = DAYS.reduce((s, d) => s + d.stops.length, 0);
    const done = DAYS.reduce((s, d) => s + d.stops.filter(st => completed.has(st.id)).length, 0);
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [completed]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {showPwaHint && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-sky-50 border border-sky-100 px-4 py-2.5 animate-fade-up">
            <Smartphone className="w-4 h-4 text-sky-600 shrink-0" />
            <p className="text-xs sm:text-sm text-sky-800 leading-relaxed flex-1">
              建議點選瀏覽器選單「加入主畫面」，即可像 App 一樣離線秒開查看行程！
            </p>
            <button onClick={dismissPwaHint} className="shrink-0 text-sky-400 hover:text-sky-600 transition-colors" aria-label="關閉提示">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:py-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: main content */}
          <section className="col-span-12 lg:col-span-8 space-y-4 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FlightCard flight={FLIGHTS.outbound} direction="outbound" />
              <FlightCard flight={FLIGHTS.return} direction="return" />
            </div>

            <div className="lg:hidden">
              <WeatherWidget cityKey={activeDay.cityKey} />
            </div>

            <InfoAccordionCard />

            <div className="relative w-full rounded-2xl bg-white border border-slate-100/80 shadow-sm p-3">
              <div
                ref={tabScrollerRef}
                className="flex flex-row gap-2 w-full max-w-full snap-x snap-mandatory overflow-x-auto scrollbar-none whitespace-nowrap scroll-smooth px-1"
              >
                {DAYS.map((d) => {
                  const isActive = d.id === activeDayId;
                  const dayDone = d.stops.filter(s => completed.has(s.id)).length;
                  const dayTotal = d.stops.length;
                  const allDone = dayDone === dayTotal && dayTotal > 0;
                  return (
                    <button
                      key={d.id}
                      ref={isActive ? activeTabRef : null}
                      onClick={() => setActiveDayId(d.id)}
                      className={`snap-center inline-flex flex-shrink-0 items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        {allDone && <CheckCircle2 className="w-3.5 h-3.5 text-matcha-400" />}
                        {d.title}
                        <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{d.dateLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full overflow-hidden rounded-2xl bg-white border border-slate-100/80 shadow-sm p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {activeDay.dateLabel} ({activeDay.weekday})
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2.5 py-1 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeDay.cityLabel}
                    </span>
                  </div>
                  <h2 className="font-sans text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-keep line-clamp-2">{activeDay.theme}</h2>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 whitespace-nowrap">
                  {dayProgress.done}/{dayProgress.total} 已完成
                </span>
                {activeDay.stops.length > 1 && (
                  <button
                    onClick={allExpanded ? collapseAll : expandAll}
                    className="text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {allExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    {allExpanded ? '全部收闔' : '全部展開'}
                  </button>
                )}
              </div>
            </div>

            <div className="w-full overflow-hidden rounded-2xl bg-white border border-slate-100/80 shadow-sm p-4 sm:p-5 mt-4">
              <div className="space-y-0">
              {activeDay.stops.map((stop, i) => (
                <ItineraryCard
                  key={stop.id}
                  stop={stop}
                  index={i}
                  isLast={i === activeDay.stops.length - 1}
                  onShowOnMap={handleShowOnMap}
                  checked={completed.has(stop.id)}
                  onToggle={() => toggleCompleted(stop.id)}
                  expanded={!collapsed.has(stop.id)}
                  onToggleExpanded={() => toggleStopExpanded(stop.id)}
                />
              ))}
              </div>
            </div>
          </section>

          {/* Right: sticky map + progress (desktop) */}
          <aside className="hidden lg:block col-span-12 lg:col-span-4 space-y-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto scrollbar-thin pr-1">
            <WeatherWidget cityKey={activeDay.cityKey} />
            <div className="h-[55vh] min-h-[380px]">
              <MapPanel mapQuery={activeMap?.query ?? null} title={activeMap?.title ?? null} />
            </div>
            <div className="w-full overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-slate-800">完成進度</h3>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-500">今日 ({activeDay.title})</span>
                  <span className="text-ink-700 font-semibold tabular-nums">{dayProgress.done}/{dayProgress.total}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-fuji-400 to-fuji-500 transition-all duration-500" style={{ width: `${dayProgress.pct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-500">全部行程</span>
                  <span className="text-ink-700 font-semibold tabular-nums">{totalProgress.done}/{totalProgress.total}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-matcha-400 to-matcha-500 transition-all duration-500" style={{ width: `${totalProgress.pct}%` }} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="lg:hidden w-full overflow-hidden mt-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <button
            onClick={() => setMobileMapOpen(open => !open)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
            aria-expanded={mobileMapOpen}
          >
            <span className="text-sm font-semibold text-ink-700">互動地圖</span>
            <span className="inline-flex items-center gap-1 text-xs text-fuji-600">
              {mobileMapOpen ? '收起地圖' : '展開地圖'}
              <ChevronDown className={'w-4 h-4 transition-transform ' + (mobileMapOpen ? 'rotate-180' : '')} />
            </span>
          </button>
          {mobileMapOpen && (
            <div className="h-[55vh] min-h-[360px] border-t border-ink-100 p-2">
              <MapPanel mapQuery={activeMap?.query ?? null} title={activeMap?.title ?? null} />
            </div>
          )}
        </section>
      </main>

      <footer className="bg-ink-900 text-ink-300 py-6 text-center text-xs">
        <p className="font-sans-jp tracking-wider">2026 東京秋季親子6天5夜自由行</p>
        <p className="mt-1 text-ink-500">資料來源:Open-Meteo · Google Maps · 行程僅供參考</p>
      </footer>
    </div>
  );
}
