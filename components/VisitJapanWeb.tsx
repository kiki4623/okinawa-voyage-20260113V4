
import React, { useState, useEffect } from 'react';
import { QrCode, Plus, ExternalLink, Image as ImageIcon, Trash2, Info } from 'lucide-react';

type Member = 'YT' | '小呆';

export const VisitJapanWeb: React.FC = () => {
  const [activeMember, setActiveMember] = useState<Member>('YT');
  const [images, setImages] = useState<Record<Member, string | null>>({
    YT: null,
    小呆: null
  });

  useEffect(() => {
    const savedYT = localStorage.getItem('vjw_qr_yt');
    const savedXiaodai = localStorage.getItem('vjw_qr_xiaodai');
    setImages({
      YT: savedYT,
      小呆: savedXiaodai
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newImages = { ...images, [activeMember]: base64String };
      setImages(newImages);
      localStorage.setItem(activeMember === 'YT' ? 'vjw_qr_yt' : 'vjw_qr_xiaodai', base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newImages = { ...images, [activeMember]: null };
    setImages(newImages);
    localStorage.removeItem(activeMember === 'YT' ? 'vjw_qr_yt' : 'vjw_qr_xiaodai');
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-white rounded-[2.5rem] p-8 border border-[#F0EFEA] shadow-sm relative overflow-hidden">
        {/* 裝飾線 */}
        <div className="absolute left-0 top-10 bottom-10 w-1.5 bg-[#8B1D3D] rounded-r-full opacity-20" />

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#F5F4F0] rounded-2xl">
              <QrCode className="w-7 h-7 text-[#8B1D3D]" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[#2D2D2D] tracking-tight mb-0.5">Visit Japan Web</h3>
              <p className="text-[9px] font-black text-[#A09E97] uppercase tracking-[0.2em]">Entry Documents</p>
            </div>
          </div>

          <div className="flex bg-[#F5F4F0] p-1.5 rounded-2xl border border-[#F0EFEA]">
            {(['YT', '小呆'] as Member[]).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMember(m)}
                className={`px-8 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeMember === m
                    ? 'bg-white text-[#8B1D3D] shadow-sm'
                    : 'text-[#A09E97] hover:text-[#2D2D2D]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 上傳顯示區 */}
        <div 
          className="relative aspect-[4/5] w-full bg-[#F5F4F0] rounded-[2rem] border-2 border-dashed border-[#E5E0D5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FDFCF9] hover:border-[#8B1D3D]/30 transition-all group overflow-hidden"
          onClick={() => document.getElementById('vjw-upload')?.click()}
        >
          {images[activeMember] ? (
            <>
              <img 
                src={images[activeMember]!} 
                alt="VJW QR Code" 
                className="w-full h-full object-contain p-6"
              />
              <button 
                onClick={removeImage}
                className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-xl rounded-full text-[#A09E97] hover:text-[#8B1D3D] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity border border-[#F0EFEA]"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 px-8">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#8B1D3D] shadow-md group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#2D2D2D]">點擊上傳 QR 截圖</p>
                <p className="text-[10px] font-bold text-[#A09E97] mt-2">僅會儲存於您的手機瀏覽器中</p>
              </div>
            </div>
          )}
          <input 
            id="vjw-upload"
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </div>

        <div className="mt-10 space-y-6 flex flex-col items-center">
          <div className="p-5 bg-[#F5F4F0]/50 rounded-[1.5rem] border border-[#F0EFEA] flex items-start gap-3 w-full">
            <Info className="w-4 h-4 text-[#8B1D3D] mt-0.5 flex-shrink-0" />
            <p className="text-[11px] font-medium text-[#A09E97] leading-relaxed">
              建議在抵達那霸機場前，先行完成檢疫與入境審查填寫，並將產出的 QR Code 截圖上傳至此處。
            </p>
          </div>
          
          <a 
            href="https://vjw-lp.digital.go.jp/zh-hant/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-[240px] bg-[#8B1D3D] text-white py-3 px-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] items-center justify-center gap-2 shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all"
          >
            前往 VJW 官方網站
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
