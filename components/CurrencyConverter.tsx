
import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Edit2, Check } from 'lucide-react';

const RATE_STORAGE_KEY = 'okinawa_exchange_rate_v3';
const DEFAULT_RATE = 0.202;

export const CurrencyConverter: React.FC = () => {
  const [jpyInput, setJpyInput] = useState<string>('0');
  const [totalJpy, setTotalJpy] = useState<number>(0);
  const [twd, setTwd] = useState<number>(0);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState<string>(DEFAULT_RATE.toString());

  const TAX_FREE_LIMIT = 5500;

  // 初始化匯率
  useEffect(() => {
    const savedRate = localStorage.getItem(RATE_STORAGE_KEY);
    if (savedRate) {
      const parsed = parseFloat(savedRate);
      if (!isNaN(parsed)) {
        setRate(parsed);
        setRateInput(savedRate);
      }
    }
  }, []);

  // 計算邏輯
  useEffect(() => {
    const sum = jpyInput
      .split('+')
      .map(part => parseFloat(part.trim()))
      .filter(num => !isNaN(num))
      .reduce((acc, curr) => acc + curr, 0);
    
    setTotalJpy(sum);
    setTwd(Math.round(sum * rate));
  }, [jpyInput, rate]);

  const handleSaveRate = () => {
    const newRate = parseFloat(rateInput);
    if (!isNaN(newRate) && newRate > 0) {
      setRate(newRate);
      localStorage.setItem(RATE_STORAGE_KEY, newRate.toString());
    }
    setIsEditingRate(false);
  };

  const diff = TAX_FREE_LIMIT - totalJpy;

  return (
    <div className="mb-6 relative">
      <div className="bg-white rounded-[2.5rem] p-8 border border-[#F0EFEA] shadow-sm relative overflow-hidden animate-in fade-in duration-500 fill-mode-both">
        {/* 背景裝飾圓點 */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F5F4F0] rounded-full opacity-50" />
        
        {/* 標題與更新 */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-4 h-4 text-[#C29D81]" strokeWidth={1.5} />
            <h2 className="text-lg font-serif font-bold text-[#2D2D2D] opacity-70">匯率試算</h2>
          </div>
          <button 
            onClick={() => setJpyInput('0')}
            className="p-2 text-[#A09E97] hover:rotate-180 transition-transform duration-500"
            title="清空"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* 換算區塊 */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="flex-[1.2]">
            <label className="block text-[10px] font-serif text-[#A09E97] mb-2 px-1">JPY 日幣</label>
            <input 
              type="text"
              inputMode="text"
              className="w-full bg-transparent border-b border-[#F5F4F0] text-3xl font-kai font-bold text-[#2D2D2D] focus:outline-none focus:border-[#C29D81] transition-colors pb-1"
              value={jpyInput}
              onChange={(e) => setJpyInput(e.target.value)}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              placeholder="0"
            />
          </div>
          
          <div className="pb-3 text-[#C29D81] font-serif text-xl">=</div>

          <div className="flex-1 text-right">
            <label className="block text-[10px] font-serif text-[#A09E97] mb-2 px-1">TWD 台幣</label>
            <div className="text-4xl font-kai font-bold text-[#2D2D2D] pb-1 border-b border-transparent">
              {twd}
            </div>
          </div>
        </div>

        {/* 底部資訊 */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 group">
              {isEditingRate ? (
                <div className="flex items-center gap-1 bg-[#F5F4F0] rounded-lg px-2 py-1">
                  <input 
                    autoFocus
                    type="number"
                    step="0.001"
                    className="w-16 bg-transparent text-[10px] font-bold text-[#8B1D3D] outline-none"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRate()}
                    onBlur={handleSaveRate}
                  />
                  <Check className="w-3 h-3 text-[#AECFC6] cursor-pointer" onClick={handleSaveRate} />
                </div>
              ) : (
                <div 
                  className="flex items-center gap-1.5 cursor-pointer hover:bg-[#F5F4F0] px-2 py-1 rounded-lg transition-colors"
                  onClick={() => setIsEditingRate(true)}
                >
                  <span className="text-[10px] font-serif text-[#A09E97] opacity-60">
                    匯率: {rate}
                  </span>
                  <Edit2 className="w-2.5 h-2.5 text-[#A09E97] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
            
            {jpyInput.includes('+') && (
              <span className="text-[9px] font-kai text-[#C29D81] mt-1 px-2">
                總計: ¥{totalJpy}
              </span>
            )}
          </div>
          
          <div className="px-5 py-2 bg-[#F5F4F0]/80 rounded-full">
            <span className="text-[10px] font-kai text-[#A09E97] font-bold">
              {diff > 0 ? `差 ¥${diff} 免稅` : '已達免稅門檻'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
