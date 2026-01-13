
import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Wind, Loader2, CloudSun } from 'lucide-react';
import { WeatherDay } from '../types';

interface WeatherOutlookProps {
  location?: string;
}

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "那霸": { lat: 26.2124, lng: 127.6809 },
  "讀谷": { lat: 26.4017, lng: 127.7500 },
  "名護": { lat: 26.5915, lng: 127.9775 },
  "本部": { lat: 26.6617, lng: 127.8894 },
  "北谷": { lat: 26.3155, lng: 127.7651 },
  "豐見城": { lat: 26.1736, lng: 127.6744 },
  "浦添": { lat: 26.2467, lng: 127.7214 }
};

const mapWmoToCondition = (code: number): WeatherDay['condition'] => {
  if (code === 0) return 'Sunny';
  if (code >= 1 && code <= 3) return 'Cloudy';
  if (code >= 45 && code <= 67) return 'Rainy';
  if (code >= 80 && code <= 99) return 'Rainy';
  return 'Cloudy';
};

export const WeatherOutlook: React.FC<WeatherOutlookProps> = ({ location = "那霸" }) => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    const coords = LOCATION_COORDS[location] || LOCATION_COORDS["那霸"];
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`;
    
    fetch(omUrl)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const formatted = data.daily.time.map((date: string, i: number) => {
            const d = new Date(date);
            return {
              date: `${d.getMonth() + 1}/${d.getDate()}`,
              tempHigh: Math.round(data.daily.temperature_2m_max[i]),
              tempLow: Math.round(data.daily.temperature_2m_min[i]),
              condition: mapWmoToCondition(data.daily.weather_code[i]),
              description: "Open-Meteo"
            };
          });
          setForecast(formatted);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [location]);

  const WeatherIcon = ({ condition, className }: { condition: WeatherDay['condition']; className?: string }) => {
    switch (condition) {
      case 'Sunny': return <Sun className={`${className} text-[#F59E0B]`} strokeWidth={2} />;
      case 'Cloudy': return <Cloud className={`${className} text-[#94A3B8]`} strokeWidth={2} />;
      case 'Rainy': return <CloudRain className={`${className} text-[#3B82F6]`} strokeWidth={2} />;
      case 'Windy': return <Wind className={`${className} text-[#14B8A6]`} strokeWidth={2} />;
      default: return <Sun className={`${className} text-[#F59E0B]`} strokeWidth={2} />;
    }
  };

  const getDayName = (dateStr: string) => {
    try {
      const [month, day] = dateStr.split('/').map(Number);
      // 假設行程是 2026 年，1/18 是週日
      const date = new Date(2026, month - 1, day);
      return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    } catch {
      return "DAY";
    }
  };

  return (
    <div className="mb-6 relative">
      <div className="bg-white rounded-[2rem] border border-[#F0EFEA] shadow-sm relative overflow-hidden min-h-[180px] flex flex-col justify-center">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-[#A09E97] animate-spin" />
          </div>
        ) : (
          <div className="p-3 sm:p-6 animate-in fade-in duration-500 fill-mode-both">
            {/* 標題區域 */}
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-[#C29D81]" strokeWidth={1.5} />
                <h2 className="text-sm font-serif font-bold text-[#2D2D2D] opacity-70">天氣預報</h2>
              </div>
              <span className="text-[9px] font-serif font-bold text-[#A09E97] tracking-wider uppercase">
                {location}
              </span>
            </div>
            
            {/* 調整為 6 格 Grid 佈局（日-五） */}
            <div className="grid grid-cols-6 gap-0.5 text-center">
              {forecast.slice(0, 6).map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 min-w-0">
                  <span className="text-[7px] sm:text-[9px] font-black text-[#A09E97] tracking-tighter sm:tracking-widest truncate w-full">
                    {getDayName(day.date)}
                  </span>
                  
                  <div className="h-8 flex items-center justify-center">
                    <WeatherIcon 
                      condition={day.condition} 
                      className="w-4 h-4 sm:w-6 h-6" 
                    />
                  </div>
                  
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-[10px] sm:text-sm font-serif font-black text-[#8B1D3D]">
                      {day.tempHigh}°
                    </span>
                    {/* 使用深灰色 #334155 (Slate-700) 確保低溫讀數清晰 */}
                    <span className="text-[9px] sm:text-xs font-serif font-bold text-[#334155] mt-0.5">
                      {day.tempLow}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
