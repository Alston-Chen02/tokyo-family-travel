import { useState, useEffect } from 'react';
import { Building2, WalletCards, ChevronDown, MapPin, BedDouble, CalendarDays, Wallet, Luggage, Star, Sparkles, Clock, CircleDot, Globe, X, ExternalLink, CheckCircle2, LifeBuoy, ShieldAlert, Phone, Heart, FileText, Copy, Check } from 'lucide-react';
import { HOTELS, LUGGAGE_ROUTE, LUGGAGE_AGENT, EMERGENCY_INFO, type LuggageStatus, type HotelInfo } from '@/data/itinerary';
import { BudgetExpandPanel, budgetTotalTwd, budgetFmtTwd } from '@/components/TripBudgetCard';

const HOTEL_COVERS: Record<string, string> = {
  h1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  h2: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
  h3: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
};

function HotelDetailModal({ hotel, onClose }: { hotel: HotelInfo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const cover = HOTEL_COVERS[hotel.id];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <img
            src={cover}
            alt={hotel.name}
            className="object-cover w-full h-48 sm:h-56"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow">{hotel.name}</h3>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                {hotel.stars}★
              </span>
            </div>
            <p className="text-xs text-white/90 font-jp mt-0.5">{hotel.nameJp}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-2.5">
              <CalendarDays className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-500">入住</div>
              <div className="text-xs font-semibold text-slate-700 tabular-nums">{hotel.checkIn}</div>
              <div className="text-[10px] text-slate-400">{hotel.checkInTime}</div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-2.5">
              <CalendarDays className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-500">退房</div>
              <div className="text-xs font-semibold text-slate-700 tabular-nums">{hotel.checkOut}</div>
              <div className="text-[10px] text-slate-400">{hotel.checkOutTime}</div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-2.5">
              <BedDouble className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-500">房型</div>
              <div className="text-xs font-semibold text-slate-700 leading-tight">{hotel.roomType}</div>
            </div>
          </div>

          {(hotel.confirmationNo || hotel.guestName) && (
            <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 px-4 py-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <h4 className="text-sm font-semibold text-slate-800">訂房憑證</h4>
              </div>
              {hotel.confirmationNo && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">訂房確認號</span>
                  <span className="text-sm font-bold text-indigo-700 tabular-nums tracking-wide">{hotel.confirmationNo}</span>
                </div>
              )}
              {hotel.guestName && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">入住登記姓名</span>
                  <span className="text-sm font-semibold text-slate-700">{hotel.guestName}</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-indigo-100">
                <span className="text-xs text-slate-500">Check-in / Check-out</span>
                <span className="text-sm font-semibold text-slate-700 tabular-nums">{hotel.checkInTime} / {hotel.checkOutTime}</span>
              </div>
            </div>
          )}

          {(hotel.addressJp || hotel.phone) && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <h4 className="text-sm font-semibold text-slate-800">飯店地址 (出示給司機)</h4>
              </div>
              {hotel.addressJp && (
                <p className="text-base font-bold text-slate-900 font-jp leading-snug">{hotel.addressJp}</p>
              )}
              {hotel.phone && (
                <p className="text-sm text-slate-600 tabular-nums">TEL: {hotel.phone}</p>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-slate-800">設施亮點</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {hotel.facilities.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-teal-50/70 border border-teal-100 px-3 py-2.5">
            <div className="flex gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 mt-px shrink-0" />
              <p className="text-xs text-teal-800 leading-relaxed">{hotel.note}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
            <div>
              <div className="text-xs text-indigo-600">每晚房價</div>
              <div className="text-lg font-bold text-indigo-700 tabular-nums">¥{hotel.pricePerNight.toLocaleString('ja-JP')}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-indigo-600">住宿 {hotel.nights} 晚</div>
              <div className="text-lg font-bold text-indigo-700 tabular-nums">¥{(hotel.pricePerNight * hotel.nights).toLocaleString('ja-JP')}</div>
            </div>
          </div>

          <a
            href={hotel.website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3 transition-colors shadow-md shadow-indigo-200"
          >
            <ExternalLink className="w-4 h-4" />
            前往 {hotel.name} 官方網站
          </a>
        </div>
      </div>
    </div>
  );
}

function HotelBookingPanel() {
  const [modalHotel, setModalHotel] = useState<HotelInfo | null>(null);
  const totalCost = HOTELS.reduce((s, h) => s + h.pricePerNight * h.nights, 0);
  const fmt = (n: number) => n.toLocaleString('ja-JP');

  return (
    <>
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOTELS.map((h) => (
            <div key={h.id} className="w-full overflow-hidden rounded-xl border border-slate-200/80 p-3 hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col gap-2 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    {h.name}
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {h.stars}★
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-jp">{h.nameJp}</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-indigo-600 whitespace-nowrap">¥{fmt(h.pricePerNight)}<span className="text-slate-300 font-normal">/晚</span></span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1"><CalendarDays className="w-3 h-3" />{h.nights}晚</span>
              </div>
              <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.area}</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {h.checkIn} → {h.checkOut}</span>
                <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {h.roomType}</span>
              </div>
              <div className="mt-auto flex gap-1.5 items-start rounded-lg bg-teal-50/70 border border-teal-100 px-2.5 py-1.5">
                <Sparkles className="w-3 h-3 text-teal-600 mt-px shrink-0" />
                <p className="text-[11px] text-teal-800 leading-relaxed">{h.note}</p>
              </div>
              <button
                onClick={() => setModalHotel(h)}
                className="mt-1 self-end inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                瀏覽官網與設施
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500 flex items-center gap-1.5"><Wallet className="w-4 h-4" /> 住宿總計</span>
          <span className="text-base font-bold text-slate-800 tabular-nums">¥{fmt(totalCost)}</span>
        </div>
      </div>

      {modalHotel && <HotelDetailModal hotel={modalHotel} onClose={() => setModalHotel(null)} />}
    </>
  );
}

const statusConfig: Record<LuggageStatus, { label: string; badgeClass: string; Icon: typeof Wallet }> = {
  paid: { label: '已確認付款 Paid', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: Wallet },
  pending: { label: '待確認 Pending', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200', Icon: Clock },
  included: { label: '行程包含 Included', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200', Icon: CircleDot },
};

function LuggageDeliveryPanel() {
  return (
    <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3 pt-1">
      {LUGGAGE_ROUTE.map((r, i) => {
        const sc = statusConfig[r.status];
        return (
          <li key={i} className="ml-4 relative">
            <span className="absolute -left-[1.4rem] top-1 w-3 h-3 rounded-full bg-blue-400 ring-4 ring-blue-50" />
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-xs font-semibold text-slate-700">{r.from}</span>
                <span className="text-slate-400">→</span>
                <span className="text-xs font-semibold text-slate-700">{r.to}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">{r.method}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                  <CalendarDays className="w-3 h-3" />
                  {r.date}
                </span>
                <span className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${sc.badgeClass}`}>
                  <sc.Icon className="w-2.5 h-2.5" />
                  {sc.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{r.note}</p>
              <div className="flex items-start gap-1 mt-1 rounded bg-slate-50 border border-slate-100 px-2 py-1">
                <Wallet className="w-3 h-3 text-slate-400 mt-px shrink-0" />
                <p className="text-[11px] text-slate-600 leading-relaxed">{r.cost}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function EmergencyInfoPanel() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <ShieldAlert size={16} strokeWidth={1.5} className="text-rose-500" />
          <h4 className="text-sm font-semibold text-slate-800">日本緊急求助</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {EMERGENCY_INFO.hotlines.map((h) => (
            <button
              key={h.label}
              onClick={() => copy(h.number, h.label)}
              className="flex items-center justify-between gap-2 rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5 hover:bg-rose-50 transition-colors text-left"
            >
              <div className="min-w-0">
                <div className="text-[11px] text-slate-500">{h.label}</div>
                <div className="text-base font-bold text-rose-700 tabular-nums">{h.number}</div>
              </div>
              {copied === h.label
                ? <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                : <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={16} strokeWidth={1.5} className="text-indigo-500" />
          <h4 className="text-sm font-semibold text-slate-800">飯店日文地址 (出示給計程車司機)</h4>
        </div>
        <div className="space-y-2">
          {HOTELS.filter(h => h.addressJp).map((h) => (
            <div key={h.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-xs font-semibold text-slate-700">{h.name}</span>
                {h.phone && <span className="text-xs text-slate-500 tabular-nums">{h.phone}</span>}
              </div>
              <p className="text-base font-bold text-slate-900 font-jp leading-snug">{h.addressJp}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-teal-50/70 border border-teal-100 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <FileText size={16} strokeWidth={1.5} className="text-teal-600" />
          <h4 className="text-sm font-semibold text-slate-800">{EMERGENCY_INFO.insurance.title}</h4>
        </div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs text-slate-500">24H 專線</span>
          <span className="text-sm font-bold text-teal-700 tabular-nums">{EMERGENCY_INFO.insurance.hotline}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-slate-500">保單號碼</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">{EMERGENCY_INFO.insurance.policyNo}</span>
        </div>
        <p className="text-[11px] text-teal-800 leading-relaxed">{EMERGENCY_INFO.insurance.note}</p>
      </div>
    </div>
  );
}

export default function InfoAccordionCard() {
  const [openId, setOpenId] = useState<string | null>(null);
  const totalNights = HOTELS.reduce((s, h) => s + h.nights, 0);

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  const items = [
    { id: 'hotel', Icon: Building2, iconClass: 'text-indigo-600', title: '精選住宿與預訂總覽', summary: `共${totalNights}晚` },
    { id: 'budget', Icon: WalletCards, iconClass: 'text-emerald-600', title: '旅程預算與費用總覽', summary: `NT${budgetFmtTwd(budgetTotalTwd)}` },
    { id: 'luggage', Icon: Luggage, iconClass: 'text-amber-600', title: '行李配送路線', summary: '直寄飯店' },
    { id: 'emergency', Icon: LifeBuoy, iconClass: 'text-rose-600', title: '應急聯絡與實用資訊', summary: '警察/救護/保險' },
  ];

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-100/80 shadow-sm overflow-hidden divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.Icon size={22} strokeWidth={1.5} className={item.iconClass} />
              <span className="text-sm font-semibold text-slate-800">{item.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 whitespace-nowrap">{item.summary}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openId === item.id ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {openId === item.id && (
            <div className="px-5 pb-5 animate-fade-up">
              {item.id === 'hotel' && <HotelBookingPanel />}
              {item.id === 'budget' && <BudgetExpandPanel />}
              {item.id === 'luggage' && <LuggageDeliveryPanel />}
              {item.id === 'emergency' && <EmergencyInfoPanel />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
