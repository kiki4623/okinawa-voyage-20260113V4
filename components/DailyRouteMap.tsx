
import React from 'react';
import { Map, ExternalLink, MapPin } from 'lucide-react';
import { TravelEvent } from '../types';

interface DailyRouteMapProps {
  events: TravelEvent[];
}

export const DailyRouteMap: React.FC<DailyRouteMapProps> = ({ events }) => {
  // 1. 嚴格過濾：排除飛行、返家以及非沖繩的地點
  const initialFilter = events.filter(e => 
    e.type !== 'Flight' && 
    e.type !== 'Home' && 
    e.location !== '高雄' &&
    e.location !== '高雄國際機場'
  );

  // 2. 地點去重：防止因為在同一個地點的多個行程（如最後一天的國際通）導致路徑繪製失敗
  const landEvents: TravelEvent[] = [];
  const seenLocations = new Set();
  
  initialFilter.forEach(event => {
    const locKey = event.location.trim();
    if (!seenLocations.has(locKey)) {
      landEvents.push(event);
      seenLocations.add(locKey);
    }
  });

  const openFullRoute = () => {
    if (!landEvents.length) return;
    const destinations = landEvents
      .map(e => encodeURIComponent(e.location + " 沖繩"))
      .filter(l => l.length > 0);
    
    if (destinations.length === 0) return;
    
    let url = "";
    if (destinations.length === 1) {
      url = `https://www.google.com/maps/search/?api=1&query=${destinations[0]}`;
    } else {
      const origin = destinations[0];
      const destination = destinations[destinations.length - 1];
      const waypoints = destinations.slice(1, -1).join('|');
      url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}`;
    }
    window.open(url, '_blank');
  };

  if (!landEvents.length) return null;

  // 決定顯示的地圖標題區域
  const firstLoc = landEvents[0].location;
  const locationArea = firstLoc.includes('那霸') ? '那霸市' : 
                     firstLoc.includes('讀谷') ? '讀谷村' : 
                     firstLoc.includes('名護') ? '名護市' : 
                     firstLoc.includes('美國村') ? '北谷町' : 
                     firstLoc.includes('恩納') ? '恩納村' : '沖繩區域';

  // 構建嵌入式地圖 URL
  let embedUrl = "";
  if (landEvents.length === 1) {
    // 單一地點模式
    embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(landEvents[0].location + " 沖繩")}&output=embed&z=15`;
  } else {
    // 多地點路徑模式 (saddr = 起點, daddr = 終點)
    const start = encodeURIComponent(landEvents[0].location + " 沖繩");
    const end = encodeURIComponent(landEvents[landEvents.length - 1].location + " 沖繩");
    embedUrl = `https://maps.google.com/maps?saddr=${start}&daddr=${end}&output=embed&z=12`;
  }

  return (
    <div className="mb-12 overflow-hidden rounded-[2rem] bg-white border border-[#F0EFEA] shadow-lg shadow-slate-200/50 transition-all animate-in fade-in slide-in-from-bottom-4">
      {/* 頂部標題與標籤 */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#F0EFEA]/50 bg-[#FDFCF9]/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#E8F0FE] rounded-lg">
            <Map className="w-4 h-4 text-[#1A73E8]" />
          </div>
          <h3 className="text-sm font-bold text-[#2D2D2D] tracking-tight">{locationArea}路徑</h3>
        </div>
        <div className="px-3 py-1 bg-[#F1F3F4] rounded-full">
          <span className="text-[10px] font-bold text-[#70757A]">{landEvents.length} 個停留區域</span>
        </div>
      </div>

      {/* 地圖區塊 */}
      <div className="w-full aspect-[4/3] relative bg-[#F8F9FA]">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={embedUrl}
          title="Daily Route Map"
          className="grayscale-[0.1] contrast-[1.05]"
        />
        
        {/* 底部浮動地點提示 */}
        <div className="absolute top-4 left-4 right-4 pointer-events-none flex gap-2 overflow-x-auto no-scrollbar">
           {landEvents.map((event, idx) => (
             <div key={idx} className="bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 flex-shrink-0 animate-in fade-in slide-in-from-top-2" style={{ animationDelay: `${idx * 0.1}s` }}>
               <span className="w-4 h-4 bg-[#8B1D3D] text-white text-[9px] flex items-center justify-center rounded-full font-black">{idx + 1}</span>
               <span className="text-[10px] font-bold text-[#2D2D2D] truncate max-w-[100px]">{event.title}</span>
             </div>
           ))}
        </div>
      </div>

      {/* 底部導航按鈕 */}
      <button 
        onClick={openFullRoute}
        className="w-full py-5 flex items-center justify-center gap-2.5 text-[#1A73E8] hover:bg-[#F8FBFF] active:bg-[#F0F6FF] transition-all font-bold text-sm"
      >
        <ExternalLink className="w-4 h-4" />
        在 Google Maps 中開啟完整路線
      </button>
    </div>
  );
};
