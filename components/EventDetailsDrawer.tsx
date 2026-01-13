
import React from 'react';
import { X, Send, Info, Languages, ChevronRight, Utensils, MapPin, ShoppingBag, Stars } from 'lucide-react';
import { TravelEvent } from '../types';

interface EventDetailsDrawerProps {
  event: TravelEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailsDrawer: React.FC<EventDetailsDrawerProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  const details = event.details;

  const getFeatureConfig = () => {
    switch (event.type) {
      case 'Food':
        return { label: '推薦美食 / 攻略', icon: Utensils };
      case 'Shopping':
        return { label: '必買清單 / 品牌', icon: ShoppingBag };
      default:
        return { label: '行程亮點', icon: Stars };
    }
  };

  const config = getFeatureConfig();
  const hasAboutInfo = (details?.about && details.about.length > 0) || details?.phone;

  return (
    <div className="fixed inset-0 z-[120] bg-[#FDFCF9] overflow-y-auto animate-in fade-in zoom-in-95 duration-300 no-scrollbar">
      <div className="sticky top-0 z-20 bg-[#FDFCF9]/90 backdrop-blur-xl border-b border-[#F0EFEA] px-6 py-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="px-3 py-1 rounded-md border border-[#8B1D3D] text-[10px] font-black text-[#8B1D3D] tracking-widest uppercase">
             {event.type}
           </div>
           <div className="flex items-center gap-2 text-[#A09E97]">
             <span className="text-sm font-serif font-bold">🕒 {event.time}</span>
           </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-3 bg-[#F5F4F0] hover:bg-[#EAE8E0] rounded-full transition-all text-[#A09E97] active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 sm:px-12 pb-48">
        <div className="mb-16">
          <h2 className="text-4xl font-serif font-black text-[#2D2D2D] leading-tight mb-4">
            {event.title}
          </h2>
          <div className="flex items-center gap-2 text-[#A09E97]">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">{event.location}</span>
          </div>
        </div>

        <div className="space-y-16">
          {(details?.menuItems && details.menuItems.length > 0) && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-8 opacity-40">
                <config.icon className="w-5 h-5" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2D2D2D]">{config.label}</h3>
              </div>
              <div className="grid gap-4">
                {details.menuItems.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 p-7 bg-white border border-[#F0EFEA] rounded-[2.5rem] shadow-sm">
                    <span className="text-xl font-black text-[#2D2D2D]">{item.original}</span>
                    <span className="text-sm font-medium text-[#A09E97] leading-relaxed">{item.translated}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(details?.pointAndSpeak && details.pointAndSpeak.length > 0) && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="flex items-center gap-3 mb-8 opacity-40">
                <Languages className="w-5 h-5" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2D2D2D]">指差し会話</h3>
              </div>
              <div className="space-y-4">
                {details.pointAndSpeak.map((phrase, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 bg-white border border-[#F0EFEA] rounded-[2rem] shadow-sm hover:border-[#8B1D3D]/20 transition-all cursor-pointer">
                    <span className="text-base font-bold text-[#2D2D2D]">{phrase}</span>
                    <ChevronRight className="w-4 h-4 text-[#A09E97] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasAboutInfo && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center gap-3 mb-8 opacity-40">
                <Info className="w-5 h-5" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2D2D2D]">關於此處 (ABOUT)</h3>
              </div>

              {details?.phone && (
                <div 
                  className="group flex items-center gap-6 p-8 bg-white border border-[#F0EFEA] rounded-[3rem] shadow-md mb-12 cursor-pointer active:scale-[0.98] transition-all" 
                  onClick={() => window.open(`tel:${details.phone}`)}
                >
                  <div className="p-4 bg-[#F5F4F0] rounded-[1.5rem] text-[#A09E97] group-hover:text-[#8B1D3D] transition-colors">
                    <Send className="w-5 h-5 rotate-45" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#A09E97] uppercase tracking-[0.2em] mb-1">CAR GPS PHONE</p>
                    <p className="text-3xl font-serif font-black text-[#2D2D2D] tracking-tighter">{details.phone}</p>
                  </div>
                </div>
              )}

              {details?.about && details.about.length > 0 && (
                <div className="space-y-8 relative pl-6">
                  <div className="absolute left-0 top-2 bottom-2 w-[1.5px] bg-[#F0EFEA]" />
                  {details.about.map((para, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[27px] top-2.5 w-3 h-[1.5px] bg-[#AECFC6]" />
                      <p className="text-sm font-medium leading-[2.2] text-[#70757A]">
                        {para}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
