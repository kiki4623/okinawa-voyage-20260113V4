
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, CloudSun, Map, RefreshCcw } from 'lucide-react';
import { DayData, AIInsight } from '../types';
import { getTravelInsights } from '../geminiService';

interface TravelAssistantProps {
  dayData: DayData;
}

export const TravelAssistant: React.FC<TravelAssistantProps> = ({ dayData }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  // 當日期切換時，先嘗試從快取讀取該日期的資料
  useEffect(() => {
    const cacheKey = `ai_insight_day_${dayData.day}`;
    const savedInsight = localStorage.getItem(cacheKey);
    
    if (savedInsight) {
      try {
        setInsight(JSON.parse(savedInsight));
      } catch (e) {
        console.error("Cache parsing error:", e);
        setInsight(null);
      }
    } else {
      setInsight(null); // 如果換到沒紀錄的一天，清空舊的等待使用者觸發
    }
  }, [dayData.day]); 

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await getTravelInsights(dayData);
      setInsight(data);
      
      // 存入 localStorage 快取
      localStorage.setItem(`ai_insight_day_${dayData.day}`, JSON.stringify(data));
      
    } catch (error) {
      console.error("Gemini API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 overflow-hidden rounded-[2.5rem] bg-[#F5F4F0] border border-[#F0EFEA] transition-all">
      <div className="px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#8B1D3D]" />
          <h3 className="font-serif font-bold text-[#2D2D2D] text-sm tracking-tight">AI 行程建議</h3>
        </div>
        {!insight && !loading && (
          <button 
            onClick={fetchInsights}
            className="text-[10px] px-5 py-2 bg-[#8B1D3D] text-white rounded-full font-bold transition-all active:scale-95 shadow-sm shadow-red-900/10"
          >
            獲取行程建議
          </button>
        )}
      </div>

      <div className="px-8 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <Loader2 className="w-6 h-6 text-[#A09E97] animate-spin" />
            <p className="text-[10px] text-[#A09E97] font-bold tracking-widest uppercase">分析本日計畫中...</p>
          </div>
        ) : insight ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  <CloudSun className="w-4 h-4 text-[#8B1D3D]" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#2D2D2D] font-bold leading-relaxed">{insight.weather}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  <Map className="w-4 h-4 text-[#8B1D3D]" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#2D2D2D] font-bold leading-relaxed">{insight.suggestion}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchInsights}
              className="w-full mt-2 text-[9px] text-[#A09E97] uppercase font-bold tracking-[0.2em] py-3 flex items-center justify-center gap-2 border-t border-[#F0EFEA] hover:text-[#8B1D3D] transition-colors"
            >
              <RefreshCcw className="w-3 h-3" /> 重新獲取 (更新快取)
            </button>
          </div>
        ) : (
          <div className="py-4 text-center border-t border-[#F0EFEA]/50">
            <p className="text-[10px] text-[#A09E97] font-medium italic">點擊按鈕獲取由 Gemini AI 提供的在地分析與穿著建議</p>
          </div>
        )}
      </div>
    </div>
  );
};
