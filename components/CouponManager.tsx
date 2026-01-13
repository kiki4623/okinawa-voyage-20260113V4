
import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Maximize2, 
  X, 
  Info,
  Image as ImageIcon,
  Tag,
  ShoppingBag,
  Zap,
  PlusSquare,
  ExternalLink,
  Edit2
} from 'lucide-react';

interface Coupon {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
  expiry?: string;
  link?: string;
}

const STORAGE_KEY = 'okinawa_coupons_v1';

const PRESET_COUPONS: Coupon[] = [
  // 藥妝店
  {
    id: 'preset-sapporo',
    category: '💊 藥妝店 (Drugstores)',
    title: '札幌藥妝',
    description: '滿 5,000 日圓享 10% 免稅 + 5% 折扣',
    image: null,
    expiry: '2026/09/19'
  },
  {
    id: 'preset-matsumoto',
    category: '💊 藥妝店 (Drugstores)',
    title: '松本清',
    description: '滿 10,000 日圓享 10% 免稅 + 3% 折扣',
    image: null,
    expiry: '2026/03/31'
  },
  {
    id: 'preset-sundrug',
    category: '💊 藥妝店 (Drugstores)',
    title: '尚都樂客 (Sundrug)',
    description: '滿 10,000 日圓享 10% 免稅 + 3% 折扣',
    image: null,
    expiry: '2026/05/30'
  },
  // 家電
  {
    id: 'preset-bic',
    category: '📺 家電用品 (Electronics)',
    title: 'BicCamera (KOJIMA)',
    description: '滿 5,000 日圓享 10% 免稅 + 7% 折扣',
    image: null,
    expiry: '2026/08/31'
  },
  {
    id: 'preset-edion',
    category: '📺 家電用品 (Electronics)',
    title: '愛電王 (EDION)',
    description: '滿 5,000 日圓享 10% 免稅 + 7% 折扣',
    image: null,
    expiry: '2026/10/31'
  },
  // 生活百貨
  {
    id: 'preset-donki',
    category: '👕 生活與百貨 (Lifestyle)',
    title: '唐吉訶德',
    description: '滿 10,000 日圓享 10% 免稅 + 5% 折扣',
    image: null,
    expiry: '2026/12/31',
    link: 'https://www.taxfreeshops.jp/zhtw/tieup/1_'
  },
  {
    id: 'preset-parismiki',
    category: '👕 生活與百貨 (Lifestyle)',
    title: '巴黎三城 (Paris Miki)',
    description: '單筆消費享 10% 免稅 + 10% 折扣',
    image: null,
    expiry: '2026/06/30'
  },
  {
    id: 'preset-aoyama',
    category: '👕 生活與百貨 (Lifestyle)',
    title: '青山洋服 (Aoyama Tailor)',
    description: '滿 5,000 日圓享 10% 免稅 + 10% 折扣',
    image: null,
    expiry: '2026/06/30'
  }
];

export const CouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newCoupon, setNewCoupon] = useState({ 
    title: '', 
    description: '', 
    expiry: '', 
    category: '💊 藥妝店 (Drugstores)', 
    link: '' 
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((c: any) => ({
          ...c,
          category: c.category || '其他'
        }));
        setCoupons(updated);
      } catch (e) {
        setCoupons(PRESET_COUPONS);
      }
    } else {
      setCoupons(PRESET_COUPONS);
    }
  }, []);

  useEffect(() => {
    if (coupons.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    }
  }, [coupons]);

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, image: base64String } : c));
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewCoupon({ title: '', description: '', expiry: '', category: '💊 藥妝店 (Drugstores)', link: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(coupon.id);
    setNewCoupon({
      title: coupon.title,
      description: coupon.description,
      expiry: coupon.expiry || '',
      category: coupon.category,
      link: coupon.link || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newCoupon.title) return;

    if (editingId) {
      // 編輯模式
      setCoupons(prev => prev.map(c => c.id === editingId ? {
        ...c,
        title: newCoupon.title,
        description: newCoupon.description,
        expiry: newCoupon.expiry,
        category: newCoupon.category,
        link: newCoupon.link
      } : c));
    } else {
      // 新增模式
      const coupon: Coupon = {
        id: Date.now().toString(),
        title: newCoupon.title,
        category: newCoupon.category,
        description: newCoupon.description,
        expiry: newCoupon.expiry,
        link: newCoupon.link,
        image: null
      };
      setCoupons([...coupons, coupon]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
  };

  const deleteCoupon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('確定要移除這張優惠券嗎？')) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const categories = Array.from(new Set(coupons.map(c => c.category))) as string[];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 space-y-10 mt-4 px-1">
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2D2D2D]">優惠券存放</h3>
          <p className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest">Digital Coupons & Vouchers</p>
        </div>
        <button 
          onClick={openAddModal}
          className="p-4 bg-[#8B1D3D] text-white rounded-full shadow-lg shadow-red-900/10 active:scale-90 transition-all"
        >
          <PlusSquare className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-12">
        {categories.map(cat => (
          <div key={cat} className="space-y-6">
            <div className="flex items-center gap-3 px-4">
              <div className="h-[1px] flex-1 bg-[#F0EFEA]" />
              <span className="text-[10px] font-black text-[#8B1D3D] uppercase tracking-[0.2em] bg-[#F5F4F0] px-4 py-1.5 rounded-full">{cat}</span>
              <div className="h-[1px] flex-1 bg-[#F0EFEA]" />
            </div>

            <div className="grid gap-6">
              {coupons.filter(c => c.category === cat).map((coupon) => (
                <div 
                  key={coupon.id}
                  className="relative bg-white border border-[#F0EFEA] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col group transition-all"
                >
                  <div className="absolute left-[-10px] top-[45%] -translate-y-1/2 w-5 h-5 bg-[#FDFCF9] border border-[#F0EFEA] rounded-full z-10" />
                  <div className="absolute right-[-10px] top-[45%] -translate-y-1/2 w-5 h-5 bg-[#FDFCF9] border border-[#F0EFEA] rounded-full z-10" />
                  
                  <div className="p-8 flex justify-between items-start border-b border-dashed border-[#F0EFEA] relative">
                    <div className="flex gap-4">
                      <div className="p-4 bg-[#F5F4F0] rounded-2xl h-fit">
                        {cat.includes('藥妝') ? <Zap className="w-6 h-6 text-[#8B1D3D]" /> : cat.includes('家電') ? <Zap className="w-6 h-6 text-[#3B82F6]" /> : <Tag className="w-6 h-6 text-[#8B1D3D]" />}
                      </div>
                      <div className="pt-1 pr-4">
                        <h4 className="text-lg font-bold text-[#2D2D2D] leading-tight">{coupon.title}</h4>
                        <p className="text-sm text-[#A09E97] mt-1.5 font-medium leading-relaxed">{coupon.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {coupon.expiry && (
                            <span className="inline-block text-[9px] font-black text-[#8B1D3D] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-md">
                              EXPIRY: {coupon.expiry}
                            </span>
                          )}
                          {coupon.link && (
                            <a 
                              href={coupon.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-[9px] font-black text-[#3B82F6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              開啟網頁版
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => openEditModal(coupon, e)} 
                        className="p-2 text-[#E5E0D5] hover:text-[#8B1D3D] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => deleteCoupon(coupon.id, e)} 
                        className="p-2 text-[#E5E0D5] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-8 bg-[#FDFCF9]/50">
                    {coupon.image ? (
                      <div className="relative group rounded-3xl overflow-hidden border border-[#F0EFEA] bg-white aspect-[3/1] flex items-center justify-center shadow-inner">
                        <img src={coupon.image} alt="coupon" className="h-full w-full object-contain p-3" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                          <button 
                            onClick={() => setSelectedImage(coupon.image)}
                            className="p-4 bg-white rounded-full text-[#2D2D2D] active:scale-90 transition-all shadow-xl"
                          >
                            <Maximize2 className="w-6 h-6" />
                          </button>
                          <label className="p-4 bg-white rounded-full text-[#2D2D2D] active:scale-90 transition-all cursor-pointer shadow-xl">
                            <ImageIcon className="w-6 h-6" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(coupon.id, e)} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-32 border-2 border-dashed border-[#E5E0D5] rounded-3xl flex flex-col items-center justify-center gap-3 text-[#A09E97] hover:border-[#8B1D3D]/30 hover:bg-white transition-all cursor-pointer group">
                        <div className="p-3 bg-[#F5F4F0] rounded-full group-hover:bg-[#8B1D3D]/5 transition-colors">
                          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">點擊上傳 QR 或 優惠券截圖</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(coupon.id, e)} />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F5F4F0]/50 rounded-[2.5rem] p-8 flex items-start gap-4 border border-[#F0EFEA] mx-2 shadow-inner">
        <Info className="w-5 h-5 text-[#8B1D3D] mt-0.5 flex-shrink-0" />
        <p className="text-[11px] font-medium text-[#A09E97] leading-relaxed">
          提示：結帳時點擊「放大圖示」開啟全螢幕模式，並將手機亮度調至最高，方便店員精確掃描。建議將各類優惠券先行截圖存放於此。
        </p>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-10 right-10 p-5 text-white/60 hover:text-white transition-colors">
            <X className="w-10 h-10" />
          </button>
          <img src={selectedImage} alt="coupon-zoom" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          <p className="absolute bottom-12 text-white/40 text-[10px] font-bold tracking-widest uppercase">點擊背景關閉</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#2D2D2D]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#FDFCF9] rounded-[2.5rem] p-10 animate-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-2xl font-serif font-bold mb-8 text-[#2D2D2D]">
              {editingId ? '編輯優惠券' : '新增電子優惠券'}
            </h3>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#A09E97] uppercase px-1">分類</label>
                <select 
                  className="w-full bg-[#F5F4F0] border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 ring-[#8B1D3D]/20 outline-none appearance-none"
                  value={newCoupon.category}
                  onChange={e => setNewCoupon({...newCoupon, category: e.target.value})}
                >
                  <option value="💊 藥妝店 (Drugstores)">💊 藥妝店</option>
                  <option value="📺 家電用品 (Electronics)">📺 家電用品</option>
                  <option value="👕 生活與百貨 (Lifestyle)">👕 生活與百貨</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#A09E97] uppercase px-1">店舖名稱</label>
                <input 
                  placeholder="例如: 唐吉訶德" 
                  className="w-full bg-[#F5F4F0] border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 ring-[#8B1D3D]/20 outline-none"
                  value={newCoupon.title}
                  onChange={e => setNewCoupon({...newCoupon, title: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#A09E97] uppercase px-1">優惠內容</label>
                <input 
                  placeholder="例如: 10% OFF + 5% 折扣" 
                  className="w-full bg-[#F5F4F0] border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 ring-[#8B1D3D]/20 outline-none"
                  value={newCoupon.description}
                  onChange={e => setNewCoupon({...newCoupon, description: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#A09E97] uppercase px-1">有效期限 (選填)</label>
                <input 
                  placeholder="例如: 2026/12/31" 
                  className="w-full bg-[#F5F4F0] border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 ring-[#8B1D3D]/20 outline-none"
                  value={newCoupon.expiry}
                  onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#A09E97] uppercase px-1">外部連結 (選填)</label>
                <input 
                  placeholder="例如: https://..." 
                  className="w-full bg-[#F5F4F0] border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 ring-[#8B1D3D]/20 outline-none"
                  value={newCoupon.link}
                  onChange={e => setNewCoupon({...newCoupon, link: e.target.value})}
                />
              </div>
              <button 
                onClick={handleSave}
                className="w-full py-5 bg-[#8B1D3D] text-white rounded-2xl font-bold mt-6 active:scale-95 transition-all shadow-xl shadow-red-900/10"
              >
                {editingId ? '儲存修改' : '儲存至本地'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
