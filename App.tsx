
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  ClipboardList, 
  Bookmark,
  ShieldAlert,
  Languages,
  Key,
  Settings,
  Ticket,
  Luggage
} from 'lucide-react';
import { DEFAULT_ITINERARY } from './constants';
import { EventCard } from './components/EventCard';
import { WeatherOutlook } from './components/WeatherOutlook';
import { CurrencyConverter } from './components/CurrencyConverter';
import { EventFormModal } from './components/EventFormModal';
import { DepartureChecklist } from './components/DepartureChecklist';
import { BookingManager } from './components/BookingManager';
import { EmergencyContacts } from './components/EmergencyContacts';
import { DailyRouteMap } from './components/DailyRouteMap';
import { EventDetailsDrawer } from './components/EventDetailsDrawer';
import { Translator } from './components/Translator';
import { CouponManager } from './components/CouponManager';
import { TravelEvent, DayData } from './types';

type MainView = 'Schedule' | 'Booking' | 'Preparation' | 'Translation' | 'Emergency';
type PrepSubView = 'Checklist' | 'Coupons';

const STORAGE_KEY = 'okinawa_itinerary_2026_premium_v3';

export default function App() {
  const [activeView, setActiveView] = useState<MainView>('Schedule');
  const [prepSubView, setPrepSubView] = useState<PrepSubView>('Checklist');
  const [activeDay, setActiveDay] = useState(1);
  const [itinerary, setItinerary] = useState<DayData[]>(DEFAULT_ITINERARY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TravelEvent | null>(null);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<TravelEvent | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItinerary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved itinerary", e);
      }
    }

    const checkKey = async () => {
      if ((window as any).aistudio) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (itinerary.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
    }
  }, [itinerary]);

  const handleOpenKeySelector = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setHasKey(true);
    } else {
      alert("請確保在支援的 AI 環境中運行以設定 API 金鑰。");
    }
  };

  const handleSaveEvent = (event: TravelEvent) => {
    const updatedItinerary = itinerary.map(day => {
      if (day.day === activeDay) {
        const eventExists = day.events.find(e => e.id === event.id);
        const newEvents = eventExists 
          ? day.events.map(e => e.id === event.id ? event : e)
          : [...day.events, event].sort((a, b) => a.time.localeCompare(b.time));
        
        return { ...day, events: newEvents };
      }
      return day;
    });
    setItinerary(updatedItinerary);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedItinerary = itinerary.map(day => {
      if (day.day === activeDay) {
        return { ...day, events: day.events.filter(e => e.id !== id) };
      }
      return day;
    });
    setItinerary(updatedItinerary);
  };

  const currentData = itinerary.find(d => d.day === activeDay) || itinerary[0];
  const hotelEvent = currentData?.events?.find(e => e.type === 'Hotel') || currentData?.events?.find(e => e.type === 'Home');
  const weatherLoc = hotelEvent?.location?.split(' ')[0] || "那霸";
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="min-h-screen pb-48 text-[#2D2D2D] bg-[#FDFCF9]">
      <div 
        className="fixed z-[999] right-6 pointer-events-none flex justify-end"
        style={{ top: 'max(24px, calc(env(safe-area-inset-top, 0px) + 16px))' }}
      >
        <button 
          onClick={handleOpenKeySelector}
          className={`pointer-events-auto w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 border backdrop-blur-md shadow-sm ${
            hasKey 
              ? 'bg-white/30 border-white/50 text-[#AECFC6]' 
              : 'bg-[#8B1D3D] border-transparent text-white animate-pulse'
          }`}
          title={hasKey ? "AI 功能已就緒" : "點擊選取 API 金鑰"}
        >
          {hasKey ? <Key className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>
      </div>

      <header className="pt-16 pb-8 px-6 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-serif font-bold tracking-tight mb-10">2026 沖繩旅行</h1>
        
        {activeView === 'Schedule' && (
          <div className="flex justify-between items-end border-b border-[#F0EFEA] pb-6 px-2 overflow-x-auto no-scrollbar">
            {itinerary.map((day) => {
              const isActive = activeDay === day.day;
              const weekDayIndex = (day.day - 1) % 7; 
              const weekDay = daysOfWeek[weekDayIndex];

              return (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`flex flex-col items-center transition-all duration-300 min-w-[60px] ${isActive ? 'scale-110' : 'opacity-30'}`}
                >
                  <span className={`text-[9px] font-bold mb-1 ${isActive ? 'text-[#8B1D3D]' : 'text-[#A09E97]'}`}>{weekDay}</span>
                  <span className="text-xl font-serif font-black">{day.date}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="px-6 max-w-2xl mx-auto relative z-10">
        {activeView === 'Schedule' && (
          <div className="animate-in fade-in duration-700">
            <CurrencyConverter />
            <WeatherOutlook location={weatherLoc} />
            
            <div className="mb-12 flex justify-between items-end pl-4 border-l-2 border-[#8B1D3D] py-1 relative">
              <div>
                <p className="text-[10px] font-bold text-[#A09E97] mb-1">當日下榻</p>
                <h2 className="text-xl font-serif font-bold tracking-tight">{hotelEvent?.title || '尚未設定'}</h2>
              </div>
            </div>

            <DailyRouteMap events={currentData?.events || []} />
            
            <div className="mb-14 flex justify-center px-2">
              <button 
                onClick={() => { setEditingEvent(null); setIsModalOpen(true); }}
                className="w-full max-w-lg flex items-center gap-4 py-5 bg-[#F5F4F0]/40 hover:bg-[#F5F4F0]/80 text-[#A09E97] rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all active:scale-[0.98] border border-[#F0EFEA] group shadow-sm"
              >
                <div className="h-[1px] bg-[#E5E0D5] flex-1 ml-6 sm:ml-10" />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>新增行程</span>
                </div>
                <div className="h-[1px] bg-[#E5E0D5] flex-1 mr-6 sm:mr-10" />
              </button>
            </div>

            <div className="space-y-0">
              {currentData?.events?.map((event, idx) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  isLast={idx === currentData.events.length - 1} 
                  onEdit={(ev) => { setEditingEvent(ev); setIsModalOpen(true); }}
                  onViewDetails={(ev) => { setSelectedDetailEvent(ev); setIsDetailOpen(true); }}
                />
              ))}
            </div>
          </div>
        )}
        
        {activeView === 'Booking' && <BookingManager />}
        
        {activeView === 'Preparation' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex bg-[#F5F4F0] p-1.5 rounded-[2rem] border border-[#F0EFEA] mb-8 max-w-md mx-auto">
              <button 
                onClick={() => setPrepSubView('Checklist')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-3xl text-[11px] font-bold transition-all ${prepSubView === 'Checklist' ? 'bg-[#8B1D3D] text-white shadow-md' : 'text-[#A09E97] hover:text-[#8B1D3D]'}`}
              >
                <Luggage className="w-4 h-4" /> 行李清單
              </button>
              <button 
                onClick={() => setPrepSubView('Coupons')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-3xl text-[11px] font-bold transition-all ${prepSubView === 'Coupons' ? 'bg-[#8B1D3D] text-white shadow-md' : 'text-[#A09E97] hover:text-[#8B1D3D]'}`}
              >
                <Ticket className="w-4 h-4" /> 優惠券
              </button>
            </div>
            {prepSubView === 'Checklist' ? <DepartureChecklist isDark={false} /> : <CouponManager />}
          </div>
        )}

        {activeView === 'Translation' && <Translator />}
        {activeView === 'Emergency' && <EmergencyContacts />}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-[#FDFCF9]/90 glass-blur border border-[#F0EFEA] rounded-[2.5rem] py-4 px-4 flex justify-around items-center z-[70] shadow-2xl">
        <button onClick={() => setActiveView('Schedule')} className={`flex flex-col items-center gap-1 flex-1 ${activeView === 'Schedule' ? 'text-[#8B1D3D]' : 'text-[#A09E97]'}`}>
          <Calendar className="w-5 h-5" /><span className="text-[10px] font-bold">行程</span>
        </button>
        <button onClick={() => setActiveView('Booking')} className={`flex flex-col items-center gap-1 flex-1 ${activeView === 'Booking' ? 'text-[#8B1D3D]' : 'text-[#A09E97]'}`}>
          <Bookmark className="w-5 h-5" /><span className="text-[10px] font-bold">預訂</span>
        </button>
        <button onClick={() => setActiveView('Translation')} className={`flex flex-col items-center gap-1 flex-1 ${activeView === 'Translation' ? 'text-[#8B1D3D]' : 'text-[#A09E97]'}`}>
          <Languages className="w-5 h-5" /><span className="text-[10px] font-bold">翻譯</span>
        </button>
        <button onClick={() => setActiveView('Preparation')} className={`flex flex-col items-center gap-1 flex-1 ${activeView === 'Preparation' ? 'text-[#8B1D3D]' : 'text-[#A09E97]'}`}>
          <ClipboardList className="w-5 h-5" /><span className="text-[10px] font-bold">準備</span>
        </button>
        <button onClick={() => setActiveView('Emergency')} className={`flex flex-col items-center gap-1 flex-1 ${activeView === 'Emergency' ? 'text-[#8B1D3D]' : 'text-[#A09E97]'}`}>
          <ShieldAlert className="w-5 h-5" /><span className="text-[10px] font-bold">緊急</span>
        </button>
      </nav>

      <EventFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={editingEvent} 
      />
      <EventDetailsDrawer 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        event={selectedDetailEvent} 
      />
    </div>
  );
}
