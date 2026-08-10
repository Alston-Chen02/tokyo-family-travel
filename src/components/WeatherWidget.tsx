import { useCallback, useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, CloudFog, Sun, RefreshCw, CloudSun } from 'lucide-react';
import { CITIES, type CityKey } from '@/data/itinerary';

interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  dailyMax: number;
  dailyMin: number;
}

interface WeatherWidgetProps {
  cityKey: CityKey;
}

const WMO_CODES: Record<number, { label: string; icon: typeof Sun }> = {
  0: { label: '晴朗', icon: Sun },
  1: { label: '晴', icon: Sun },
  2: { label: '多雲', icon: Cloud },
  3: { label: '陰', icon: Cloud },
  45: { label: '霧', icon: CloudFog },
  48: { label: '霧凇', icon: CloudFog },
  51: { label: '毛毛雨', icon: CloudRain },
  53: { label: '毛毛雨', icon: CloudRain },
  55: { label: '毛毛雨', icon: CloudRain },
  56: { label: '凍雨', icon: CloudRain },
  57: { label: '凍雨', icon: CloudRain },
  61: { label: '小雨', icon: CloudRain },
  63: { label: '中雨', icon: CloudRain },
  65: { label: '大雨', icon: CloudRain },
  66: { label: '凍雨', icon: CloudRain },
  67: { label: '凍雨', icon: CloudRain },
  71: { label: '小雪', icon: CloudSnow },
  73: { label: '中雪', icon: CloudSnow },
  75: { label: '大雪', icon: CloudSnow },
  77: { label: '冰粒', icon: CloudSnow },
  80: { label: '陣雨', icon: CloudRain },
  81: { label: '陣雨', icon: CloudRain },
  82: { label: '強陣雨', icon: CloudRain },
  85: { label: '陣雪', icon: CloudSnow },
  86: { label: '強陣雪', icon: CloudSnow },
  95: { label: '雷雨', icon: CloudRain },
  96: { label: '雷雨冰雹', icon: CloudRain },
  99: { label: '雷雨冰雹', icon: CloudRain },
};

export default function WeatherWidget({ cityKey }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const city = CITIES[cityKey];

  const fetchWeather = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      setError(null);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&forecast_days=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        apparentTemperature: Math.round(data.current.apparent_temperature),
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        dailyMax: Math.round(data.daily.temperature_2m_max[0]),
        dailyMin: Math.round(data.daily.temperature_2m_min[0]),
      });
    } catch {
      setError('目前無法取得天氣資訊');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [city]);

  useEffect(() => {
    setLoading(true);
    fetchWeather();
  }, [fetchWeather]);

  const wmo = weather ? WMO_CODES[weather.weatherCode] ?? { label: '—', icon: Cloud } : null;
  const Icon = wmo?.icon ?? Cloud;

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-100/80 shadow-sm p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CloudSun size={22} strokeWidth={1.5} className="text-sky-600" />
          <h3 className="text-sm font-semibold text-slate-700">{city.name} 即時天氣</h3>
        </div>
        <button
          onClick={() => fetchWeather(true)}
          disabled={refreshing}
          className="text-slate-400 hover:text-sky-600 transition-colors disabled:opacity-50"
          aria-label="重新整理"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-16 shimmer rounded-xl" />
          <div className="h-6 w-2/3 shimmer rounded" />
        </div>
      ) : error ? (
        <div className="text-sm text-slate-400 py-6 text-center">{error}</div>
      ) : weather && wmo ? (
        <div className="animate-fade-up">
          <div className="flex items-center gap-3">
            <Icon size={32} strokeWidth={1.5} className="text-slate-500 shrink-0" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{weather.temperature}</span>
                <span className="text-lg text-slate-400">°C</span>
              </div>
              <div className="text-sm text-slate-500">{wmo.label} · 體感 {weather.apparentTemperature}°</div>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-100 mt-4">
            <div className="text-center px-2">
              <div className="text-[11px] text-slate-400 mb-0.5">高/低</div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">{weather.dailyMax}° / {weather.dailyMin}°</div>
            </div>
            <div className="text-center px-2">
              <div className="text-[11px] text-slate-400 mb-0.5">濕度</div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">{weather.humidity}%</div>
            </div>
            <div className="text-center px-2">
              <div className="text-[11px] text-slate-400 mb-0.5">風速</div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">{weather.windSpeed} km/h</div>
            </div>
          </div>
        </div>
      ) : null}
      <p className="text-[10px] text-slate-300 mt-3 text-right">資料來源:Open-Meteo</p>
    </div>
  );
}
