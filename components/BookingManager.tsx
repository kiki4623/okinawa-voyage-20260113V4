
import React, { useState } from 'react';
import { 
  Plane, 
  Car, 
  MapPin, 
  ExternalLink,
  Clock,
  Navigation,
  CheckCircle2,
  Utensils,
  Briefcase,
  Phone,
  Info,
  CreditCard
} from 'lucide-react';
import { VisitJapanWeb } from './VisitJapanWeb';

type BookingCategory = 'Flight' | 'Hotel' | 'Car' | 'Entry';

const HOTELS = [
  {
    day: 'Day 1',
    name: 'Hotel GrandConsort Naha',
    location: '那霸市中心',
    checkIn: '2026/01/18',
    confirmNo: '6641130206',
    platform: 'Booking.com',
    highlights: '步行 5 分鐘即達國際通。',
    tag: '市區飯店',
  },
  {
    day: 'Day 2',
    name: 'Hotel Nikko Alivila',
    location: '讀谷村',
    checkIn: '2026/01/19',
    confirmNo: '6171476538',
    platform: 'Booking.com',
    highlights: '直通海灘的經典度假村。',
    tag: '海景渡假',
  },
  {
    day: 'Day 3',
    name: 'Ala Mahaina Condo Hotel',
    location: '本部町',
    checkIn: '2026/01/20',
    confirmNo: '5297653966',
    platform: 'Booking.com',
    highlights: '豪華公寓式飯店。',
    tag: '海景公寓',
  },
  {
    day: 'Day 4',
    name: "La'gent Hotel Chatan",
    location: '北谷町',
    checkIn: '2026/01/21',
    confirmNo: '6949018202',
    platform: 'Booking.com',
    highlights: '位於美國村附近。',
    tag: '北谷精品',
  }
];

export const BookingManager: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BookingCategory>('Flight');
  const [activeFlight, setActiveFlight] = useState<'outbound' | 'return'>('outbound');

  const passengers = [
    { name: 'MS LI YI-TING', baggage: '20kg', outMeal: '起司雞肉捲', retMeal: '起司雞肉捲', seat: '12F' },
    { name: 'MR TSENG YEN-MING', baggage: '20kg', outMeal: '起司雞肉捲', retMeal: '三明治', seat: '12E' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 font-noto-serif">
      <div className="flex bg-[#F5F4F0] rounded-[2rem] p-1.5 border border-[#F0EFEA] mb-8 overflow-x-auto no-scrollbar font-sans">
        {(['Flight', 'Hotel', 'Car', 'Entry'] as const).map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)} 
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-3xl font-bold text-[11px] transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#8B1D3D] text-white shadow-md' : 'text-[#A09E97] hover:text-[#8B1D3D]'}`}
          >
            {cat === 'Flight' ? '機票' : cat === 'Hotel' ? '住宿' : cat === 'Car' ? '租車' : '入出境'}
          </button>
        ))}
      </div>

      {activeCategory === 'Flight' && (
        <div className="animate-in zoom-in-95 duration-300">
          <div className="flex gap-3 mb-6 font-sans">
            <button onClick={() => setActiveFlight('outbound')} className={`flex-1 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border ${activeFlight === 'outbound' ? 'bg-[#F5F4F0] border-[#8B1D3D] text-[#8B1D3D]' : 'bg-transparent border-[#F0EFEA] text-[#A09E97]'}`}>
              去程 IT 288
            </button>
            <button onClick={() => setActiveFlight('return')} className={`flex-1 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border ${activeFlight === 'return' ? 'bg-[#F5F4F0] border-[#8B1D3D] text-[#8B1D3D]' : 'bg-transparent border-[#F0EFEA] text-[#A09E97]'}`}>
              回程 IT 289
            </button>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-[#F0EFEA] shadow-sm overflow-hidden mb-8">
            <div className="p-8 border-b border-[#F5F4F0]">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <p className="text-[10px] text-[#A09E97] font-black uppercase tracking-widest font-sans">TigerAir {activeFlight === 'outbound' ? 'IT288' : 'IT289'}</p>
                    <h3 className="text-sm font-bold mt-1">日本{activeFlight === 'outbound' ? '去程' : '回程'}航班</h3>
                 </div>
                 <Plane className="w-5 h-5 text-[#8B1D3D]" />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="text-4xl font-serif font-black">{activeFlight === 'outbound' ? 'KHH' : 'OKA'}</span>
                  <p className="text-xs font-bold mt-2 font-sans">{activeFlight === 'outbound' ? '2026-01-18' : '2026-01-22'}</p>
                  <p className="text-sm font-serif font-black text-[#8B1D3D]">{activeFlight === 'outbound' ? '09:45 AM' : '21:30 PM'}</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-serif font-black">{activeFlight === 'outbound' ? 'OKA' : 'KHH'}</span>
                  <p className="text-xs font-bold mt-2 font-sans">{activeFlight === 'outbound' ? '2026-01-18' : '2026-01-22'}</p>
                  <p className="text-sm font-serif font-black text-[#8B1D3D]">{activeFlight === 'outbound' ? '12:30 PM' : '22:25 PM'}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FDFCF9] p-8 space-y-6">
              {passengers.map((p, i) => (
                <div key={i} className="bg-white border border-[#F0EFEA] rounded-2xl p-5 shadow-sm">
                   <div className="flex justify-between items-center mb-4 border-b border-[#F5F4F0] pb-3">
                      <span className="text-sm font-serif font-black">{p.name}</span>
                      <span className="text-lg font-serif font-black text-[#8B1D3D]">{p.seat}</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4 font-sans">
                      <div className="flex items-center gap-2">
                         <Briefcase className="w-3 h-3 text-[#A09E97]" />
                         <span className="text-[10px] font-bold text-[#A09E97]">行李：{p.baggage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Utensils className="w-3 h-3 text-[#A09E97]" />
                         <span className="text-[10px] font-bold text-[#A09E97]">餐點：{activeFlight === 'outbound' ? p.outMeal : p.retMeal}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'Hotel' && (
        <div className="space-y-6">
          {HOTELS.map((hotel, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] border border-[#F0EFEA] overflow-hidden group">
              <div className="p-6">
                <span className="text-[9px] font-bold text-[#A09E97] mb-2 block font-sans">{hotel.checkIn}</span>
                <h4 className="text-xl font-serif font-bold mb-4">{hotel.name}</h4>
                <div className="flex justify-between items-center p-4 bg-[#F5F4F0] rounded-2xl">
                  <span className="text-[10px] font-bold text-[#A09E97] font-sans">確認編號</span>
                  <span className="text-sm font-serif font-black">{hotel.confirmNo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'Car' && (
        <div className="animate-in fade-in duration-500 space-y-8">
          {/* 主預約資訊卡片 */}
          <div className="bg-white rounded-[2.5rem] border border-[#F0EFEA] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Car className="w-24 h-24 text-[#8B1D3D]" />
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="p-3.5 bg-[#8B1D3D]/5 rounded-2xl">
                <Car className="w-7 h-7 text-[#8B1D3D]" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold tracking-tight text-[#2D2D2D]">ORIX 租車公司</h3>
                <p className="text-[10px] font-bold text-[#A09E97] uppercase tracking-widest font-sans">Tabirai 預約完成</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* 取車店舖 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#8B1D3D]" />
                   <span className="text-[10px] font-black text-[#8B1D3D] uppercase tracking-widest font-sans">取車店舖 (Pick-up)</span>
                </div>
                <div className="bg-[#F5F4F0]/50 p-6 rounded-[1.5rem] border border-[#F0EFEA]">
                  <h4 className="text-base font-bold text-[#2D2D2D] mb-3">美榮橋站前 外語櫃檯</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                       <MapPin className="w-3.5 h-3.5 text-[#A09E97] mt-0.5" />
                       <p className="text-[11px] font-medium text-[#70757A]">沖縄県那覇市牧志2-17-10</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone className="w-3.5 h-3.5 text-[#A09E97]" />
                       <a href="tel:0988690543" className="text-[11px] font-black text-[#8B1D3D]">098-869-0543</a>
                    </div>
                    <div className="flex items-center gap-3">
                       <Clock className="w-3.5 h-3.5 text-[#A09E97]" />
                       <p className="text-[11px] font-bold text-[#2D2D2D]">2026/01/19 (一) 10:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 還車店舖 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#A09E97]" />
                   <span className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest font-sans">還車店舖 (Return)</span>
                </div>
                <div className="bg-white p-6 rounded-[1.5rem] border border-[#F0EFEA]">
                  <h4 className="text-base font-bold text-[#2D2D2D] mb-3">那霸機場 外語櫃檯</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                       <MapPin className="w-3.5 h-3.5 text-[#A09E97] mt-0.5" />
                       <p className="text-[11px] font-medium text-[#70757A]">沖縄県豊見城市豊崎1-1174</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone className="w-3.5 h-3.5 text-[#A09E97]" />
                       <a href="tel:0988510543" className="text-[11px] font-black text-[#8B1D3D]">098-851-0543</a>
                    </div>
                    <div className="flex items-center gap-3">
                       <Clock className="w-3.5 h-3.5 text-[#A09E97]" />
                       <p className="text-[11px] font-bold text-[#2D2D2D]">2026/01/22 (四) 17:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-[#F0EFEA] flex justify-between items-end">
               <div>
                  <p className="text-[10px] font-bold text-[#A09E97] uppercase tracking-widest font-sans mb-1">預約號碼</p>
                  <p className="text-2xl font-serif font-black text-[#2D2D2D]">247157542</p>
               </div>
               <a 
                 href="https://tc.tabirai.net/s/car/search/UserLogin.aspx?YNO=247157542" 
                 target="_blank"
                 className="flex items-center gap-2 px-6 py-3.5 bg-[#8B1D3D] text-white rounded-xl text-[11px] font-bold shadow-lg shadow-red-900/10 active:scale-95 transition-all"
               >
                 管理預約 <ExternalLink className="w-3 h-3" />
               </a>
            </div>
            <p className="text-[9px] text-center mt-4 text-[#A09E97] italic font-sans">※ 密碼請查看 Gmail: memory264@gmail.com</p>
          </div>

          {/* 車型與方案卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-[2rem] border border-[#F0EFEA]">
                <div className="flex items-center gap-3 mb-4">
                   <Info className="w-4 h-4 text-[#8B1D3D]" />
                   <span className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest font-sans">車型與車輛</span>
                </div>
                <p className="text-sm font-bold text-[#2D2D2D]">Fit 同等級 (SA)</p>
                <div className="flex gap-2 mt-3">
                   <span className="px-2 py-1 bg-[#F5F4F0] rounded-md text-[9px] font-bold text-[#A09E97]">禁菸車</span>
                   <span className="px-2 py-1 bg-[#F5F4F0] rounded-md text-[9px] font-bold text-[#A09E97]">ETC 裝置</span>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-[2rem] border border-[#F0EFEA]">
                <div className="flex items-center gap-3 mb-4">
                   <CheckCircle2 className="w-4 h-4 text-[#AECFC6]" />
                   <span className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest font-sans">保險方案</span>
                </div>
                <p className="text-sm font-bold text-[#2D2D2D]">租車安心方案 (RAP)</p>
                <p className="text-[9px] text-[#A09E97] mt-1 italic font-sans">含 NOC 免除、輪胎修理免費</p>
             </div>
          </div>

          {/* 費用結算卡片 */}
          <div className="bg-[#4A4A4A] rounded-[2rem] p-8 text-white shadow-xl shadow-slate-900/10">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <CreditCard className="w-5 h-5 text-[#8B1D3D]" />
                   <h4 className="text-sm font-bold">預估費用合計</h4>
                </div>
                <span className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full font-sans uppercase">現場付款</span>
             </div>
             
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <span className="text-[10px] text-white/50 font-sans uppercase tracking-widest block">Total Amount</span>
                   <p className="text-xl font-serif font-black text-white/90">≈ NT$ 4,977</p>
                </div>
                <div className="text-right">
                   <span className="text-[10px] text-white/50 font-sans uppercase tracking-widest block mb-1">Total JPY</span>
                   <span className="text-4xl font-serif font-black">¥24,640</span>
                   <p className="text-[10px] text-white/30 mt-1 font-sans">基本 ¥22,000 + RAP ¥2,640</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeCategory === 'Entry' && <VisitJapanWeb />}
    </div>
  );
};
