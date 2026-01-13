
import React from 'react';
import { Phone, ShieldAlert, HeartPulse, Building, Flag, ExternalLink, Info } from 'lucide-react';

const CONTACTS = [
  { unit: '警察局 (Police)', tel: '110', desc: '交通事故、遺失物、犯罪報案', icon: ShieldAlert },
  { unit: '消防 / 救護 (Ambulance)', tel: '119', desc: '火災、緊急受傷、急病送醫', icon: HeartPulse },
  { unit: '海上保安廳 (Coast Guard)', tel: '118', desc: '海難、海上事故意外報案', icon: Flag },
  { unit: '台北駐日代表處', tel: '03-3280-7811', desc: '護照遺失、緊急救援、海外急難', icon: Building },
];

export const EmergencyContacts: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 pb-20">
      <div className="bg-[#FDFCF9] border border-[#8B1D3D]/20 rounded-[2.5rem] p-8 flex items-start gap-5">
        <div className="p-3 bg-[#8B1D3D]/5 rounded-2xl">
          <Info className="w-6 h-6 text-[#8B1D3D]" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[#8B1D3D] uppercase tracking-widest mb-2">緊急撥號須知</h3>
          <p className="text-[11px] text-[#A09E97] font-medium leading-relaxed">
            日本公共電話皆可免費撥打 110/119。拿起聽筒後按下紅色緊急按鈕即可撥號，不需投幣或插卡。國際電話請記得加國碼。
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {CONTACTS.map((c, i) => (
          <a 
            key={i}
            href={`tel:${c.tel}`}
            className="group flex items-center gap-6 bg-white p-7 rounded-[2.5rem] border border-[#F0EFEA] shadow-sm hover:border-[#8B1D3D]/20 transition-all active:scale-[0.98]"
          >
            <div className="w-16 h-16 bg-[#F5F4F0] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#8B1D3D]/5 transition-colors">
              <c.icon className="w-7 h-7 text-[#8B1D3D]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-bold text-[#2D2D2D] truncate">{c.unit}</h4>
                <span className="text-2xl font-serif font-black text-[#8B1D3D]">{c.tel}</span>
              </div>
              <p className="text-[10px] text-[#A09E97] mt-1 font-bold">{c.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-[#F0EFEA] shadow-sm">
        <h4 className="text-[10px] font-black text-[#A09E97] uppercase tracking-[0.2em] mb-8">實用醫療與諮詢 (MEDICAL & INFO)</h4>
        <div className="space-y-4">
          <a 
            href="https://www.jnto.go.jp/emergency/chc/mi_guide.html" 
            target="_blank" 
            className="flex items-center justify-between p-5 rounded-2xl bg-[#F5F4F0]/50 hover:bg-[#F5F4F0] transition-colors"
          >
            <span className="text-sm font-bold text-[#2D2D2D]">外語服務醫療機構查詢</span>
            <ExternalLink className="w-4 h-4 text-[#A09E97]" />
          </a>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#F5F4F0]/50 gap-4">
            <span className="text-sm font-bold text-[#2D2D2D]">日本旅遊諮詢熱線 (JNTO)</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-serif font-black text-[#8B1D3D]">050-3816-2787</span>
              <a href="tel:05038162787" className="p-2 bg-white rounded-full shadow-sm">
                <Phone className="w-3.5 h-3.5 text-[#8B1D3D]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
