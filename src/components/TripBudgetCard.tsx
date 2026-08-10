import { Calculator, CheckCircle2 } from 'lucide-react';
import { AIRFARE, LUGGAGE_AGENT, AIRPORTER, AIRPORT_TRANSFER } from '@/data/itinerary';

interface BudgetItem {
  icon: string;
  label: string;
  amount: number;
  currency: 'JPY' | 'TWD';
  color: string;
  detail: string;
  status: 'paid' | 'estimate';
  statusLabel: string;
  statusVerb: string;
}

const BUDGET_ITEMS: BudgetItem[] = [
  { icon: '✈️', label: '機票費用', amount: AIRFARE.total, currency: 'TWD', color: 'bg-slate-700', detail: '皇璽桂冠艙 大人 NT$35,520 × 2 + 兒童 NT$29,985 × 1', status: 'paid', statusLabel: '已付款', statusVerb: '已付' },
  { icon: '🏨', label: '住宿總計', amount: 289492, currency: 'JPY', color: 'bg-blue-500', detail: '希爾頓 2 晚 · 巨蛋 2 晚 · 樂天城市 1 晚', status: 'paid', statusLabel: '已付款', statusVerb: '已付' },
  { icon: '🎟️', label: '樂園門票', amount: 21800, currency: 'JPY', color: 'bg-emerald-500', detail: '迪士尼一日護照 大人 ¥10,900 × 2 · 3 歲免費', status: 'paid', statusLabel: '已付款', statusVerb: '已付' },
  { icon: '🚅', label: '當地交通', amount: 12000, currency: 'JPY', color: 'bg-cyan-500', detail: 'KKday Skyliner + IC卡 (Suica/PASMO) 捷運與電車車資', status: 'estimate', statusLabel: '預估支出', statusVerb: '預估' },
  { icon: '🍣', label: '餐飲與購物', amount: 150000, currency: 'JPY', color: 'bg-teal-500', detail: '六厘舍沾麵 · 晴空塔美食/購物 · 阿卡將與伴手禮預估', status: 'estimate', statusLabel: '預估支出', statusVerb: '預估' },
  { icon: '🧳', label: '行李特工配送', amount: LUGGAGE_AGENT.totalTwd, currency: 'TWD', color: 'bg-violet-500', detail: `LuggAgent 機場交付 3 件 · US$${LUGGAGE_AGENT.totalUsd} 折合 NT$`, status: 'paid', statusLabel: '已付款', statusVerb: '已付' },
  { icon: '🏷️', label: '飯店間行李托運', amount: AIRPORTER.totalJpy, currency: 'JPY', color: 'bg-indigo-500', detail: `Airporter 訂單 ${AIRPORTER.orderId} · 希爾頓 ➔ 巨蛋 · 折合 NT${AIRPORTER.totalTwd}`, status: 'paid', statusLabel: '已付款', statusVerb: '已付' },
  { icon: '🚗', label: '回程機場專車接送', amount: AIRPORT_TRANSFER.totalTwd, currency: 'TWD', color: 'bg-orange-500', detail: 'Klook 錦糸町 ➔ 成田機場 · 含 1 張嬰兒座椅', status: 'estimate', statusLabel: '預估支出', statusVerb: '預估' },
];

const JPY_TO_TWD = 0.215;
const fmt = (n: number) => n.toLocaleString('ja-JP');
const fmtTwd = (n: number) => n.toLocaleString('zh-TW');

const jpyItems = BUDGET_ITEMS.filter(i => i.currency === 'JPY');
const totalJpy = jpyItems.reduce((s, i) => s + i.amount, 0);
const jpyToTwd = Math.round(totalJpy * JPY_TO_TWD);
const luggageTwd = LUGGAGE_AGENT.totalTwd + AIRPORTER.totalTwd;
const totalTwd = AIRFARE.total + jpyToTwd + luggageTwd + AIRPORT_TRANSFER.totalTwd;

export { totalTwd as budgetTotalTwd, fmtTwd as budgetFmtTwd };

export function BudgetExpandPanel() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span>日本當地支出分佈 (JPY)</span>
          <span className="flex items-center gap-1 text-slate-500">
            <Calculator className="w-3 h-3" /> ¥{fmt(totalJpy)}
          </span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          {jpyItems.map((item) => {
            const pct = (item.amount / totalJpy) * 100;
            return (
              <div
                key={item.label}
                className={`${item.color} transition-all duration-500 hover:brightness-110`}
                style={{ width: `${pct}%` }}
                title={`${item.label} ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {jpyItems.map((item) => (
            <span key={item.label} className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BUDGET_ITEMS.map((item) => {
          return (
            <div
              key={item.label}
              className="rounded-xl bg-white border border-slate-200 p-3 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5 min-w-0">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    item.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {item.status === 'paid'
                    ? <CheckCircle2 className="w-3 h-3" />
                    : <Calculator className="w-3 h-3" />}
                  {item.statusLabel}
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 tabular-nums">
                {item.statusVerb} {item.currency === 'TWD' ? 'NT$' : '¥'}{item.currency === 'TWD' ? fmtTwd(item.amount) : fmt(item.amount)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs text-slate-200 font-medium">全旅程折合總預算</div>
            <div className="text-[10px] text-slate-400 mt-0.5 break-words leading-relaxed">
              機票 NT${fmtTwd(AIRFARE.total)} + 當地支出折合 NT${fmtTwd(jpyToTwd)} + 行李配送 NT${fmtTwd(LUGGAGE_AGENT.totalTwd)} + 飯店托運 NT${fmtTwd(AIRPORTER.totalTwd)} + 專車 NT${fmtTwd(AIRPORT_TRANSFER.totalTwd)}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-white tabular-nums">NT${fmtTwd(totalTwd)}</div>
            <div className="text-[10px] text-slate-400">TWD</div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-600/40">
          <span className="text-[11px] text-slate-300">最新匯率 1 JPY ≈ NT${JPY_TO_TWD}</span>
          <span className="text-[11px] text-slate-300 tabular-nums break-words leading-relaxed">¥{fmt(totalJpy)} JPY (折合 NT${fmtTwd(jpyToTwd)}) + NT${fmtTwd(AIRFARE.total)} + NT${fmtTwd(LUGGAGE_AGENT.totalTwd)} + NT${fmtTwd(AIRPORTER.totalTwd)} + NT${fmtTwd(AIRPORT_TRANSFER.totalTwd)} TWD</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-3 text-center">* 當地預算匯率約以 1 JPY ≈ 0.215 TWD 換算估計</p>
    </div>
  );
}
