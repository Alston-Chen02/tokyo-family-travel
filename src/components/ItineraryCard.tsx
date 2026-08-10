import { Footprints, Train, FastForward, CarTaxiFront, Plane, Bus, Ship, Clock, CheckCircle2, Circle, Navigation, Sparkles, ListChecks, ChevronDown, Globe, Baby, Heart, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ItineraryStop, TransportType, ParentingTip } from '@/data/itinerary';

const TRANSPORT_ICONS: Record<TransportType, LucideIcon> = {
  walk: Footprints,
  train: Train,
  shinkansen: FastForward,
  taxi: CarTaxiFront,
  flight: Plane,
  bus: Bus,
  boat: Ship,
};

const TRANSPORT_COLORS: Record<TransportType, string> = {
  walk: 'bg-emerald-50 text-emerald-700',
  train: 'bg-blue-50 text-blue-700',
  shinkansen: 'bg-blue-50 text-blue-700',
  taxi: 'bg-blue-50 text-blue-700',
  flight: 'bg-blue-50 text-blue-700',
  bus: 'bg-blue-50 text-blue-700',
  boat: 'bg-blue-50 text-blue-700',
};

const TIP_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  phone: Phone,
  baby: Baby,
  socks: Footprints,
};

const TRANSIT_PATTERN = /前往|退房|轉乘|辦理入住|入住|抵達|入境|啟航/;

interface ItineraryCardProps {
  stop: ItineraryStop;
  index: number;
  isLast: boolean;
  onShowOnMap: (stop: ItineraryStop) => void;
  checked: boolean;
  onToggle: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export default function ItineraryCard({ stop, index, isLast, onShowOnMap, checked, onToggle, expanded, onToggleExpanded }: ItineraryCardProps) {
  const TransIcon = TRANSPORT_ICONS[stop.transport.type];
  const transColor = TRANSPORT_COLORS[stop.transport.type];
  const navUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(stop.mapQuery);
  const isTransit = stop.transport.type === 'flight' || TRANSIT_PATTERN.test(stop.title);
  const highlightLabel = isTransit ? '必辦事項' : '必吃/必買';
  const HighlightIcon = isTransit ? ListChecks : Sparkles;

  const hasMeal = stop.meal && stop.meal !== '—';
  const hasCost = stop.cost && stop.cost !== '—';

  return (
    <div
      className={'relative w-full min-w-0 overflow-hidden pl-10 sm:pl-14 animate-fade-up' + (checked ? ' opacity-60' : '')}
      style={{ animationDelay: String(index * 60) + 'ms' }}
    >
      <div className="absolute left-3.5 sm:left-5.5 top-0 bottom-0 w-px bg-slate-200" style={{ display: isLast ? 'none' : 'block' }} />
      <div className="absolute left-0 sm:left-2 top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-[10px] sm:text-xs font-bold text-blue-600 shadow-sm z-10">
        {index + 1}
      </div>

      <div
        className={
          'w-full min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100/80 p-4 sm:p-5 mb-3.5 transition-all duration-200 hover:shadow-md ' +
          (checked ? 'border-l-4 border-emerald-400' : 'hover:border-l-4 hover:border-blue-300')
        }
      >
        {/* Layer 1: Clean Header Row — time only, checkbox + chevron on right */}
        <div
          className="flex items-center justify-between gap-3 cursor-pointer rounded-xl -m-1 p-1 sm:p-2 hover:bg-slate-50 transition-colors"
          onClick={onToggleExpanded}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onToggleExpanded();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-700 tabular-nums whitespace-nowrap">{stop.time}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onToggle();
              }}
              className="p-2 rounded-lg hover:bg-emerald-50 transition-colors"
              aria-label={checked ? '標記為未完成' : '標記為已完成'}
            >
              {checked ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-400" />}
            </button>
            <ChevronDown className={'w-5 h-5 text-slate-400 transition-transform duration-200 ' + (expanded ? 'rotate-180' : '')} aria-hidden="true" />
          </div>
        </div>

        {/* Layer 2: Title & Location */}
        <div className="mt-1 px-1 sm:px-2">
          <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">{stop.title}</h4>
          {stop.subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{stop.subtitle}</p>}
        </div>

        {/* Layer 3 & 4: Meal & Expense lightweight pill badges */}
        {(hasMeal || hasCost) && (
          <div className="flex flex-wrap gap-2 my-2 px-1 sm:px-2">
            {hasMeal && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-md bg-amber-50 text-amber-700">
                🍽️ {stop.meal}
              </span>
            )}
            {hasCost && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700">
                💴 {stop.cost}
              </span>
            )}
          </div>
        )}

        {/* Layer 5: Expandable Details & Dynamic Buttons */}
        <div className={'grid transition-all duration-200 ' + (expanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0')}>
          <div className="overflow-hidden px-1 sm:px-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className={'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ' + transColor}>
                <TransIcon className="w-3 h-3" /> {stop.transport.label}
              </span>
              <span className="text-[11px] text-slate-400 break-all">{stop.transport.route}</span>
              {stop.transport.duration !== '—' && (
                <span className="text-[11px] text-slate-400 shrink-0">· {stop.transport.duration}</span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mt-3">{stop.description}</p>

            {stop.parentingTips && stop.parentingTips.length > 0 && (
              <div className="mt-3 rounded-xl bg-amber-50/60 border border-amber-100 px-3 py-2.5 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Baby className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800">親子實戰提示 Parenting Tips</span>
                </div>
                {stop.parentingTips.map((tip: ParentingTip, i: number) => {
                  const TipIcon = TIP_ICONS[tip.icon] ?? Baby;
                  return (
                    <div key={i} className="flex items-start gap-1.5">
                      <TipIcon className="w-3.5 h-3.5 text-amber-600 mt-px shrink-0" />
                      <p className="text-xs text-slate-700 leading-relaxed">{tip.text}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3">
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <HighlightIcon className="w-3.5 h-3.5" /> {highlightLabel}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {stop.highlights.map((h, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100 sm:flex-row sm:items-center sm:gap-2">
              {stop.websiteUrl ? (
                <>
                  <a
                    href={stop.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg py-2 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" /> 🌐 官方網站 / 預約
                  </a>
                  <a
                    href={navUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg py-2 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> 📍 Google Maps 路線導航
                  </a>
                </>
              ) : (
                <a
                  href={navUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> 📍 Google Maps 路線導航
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
