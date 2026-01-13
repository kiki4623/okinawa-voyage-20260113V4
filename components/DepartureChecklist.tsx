
import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Luggage, 
  Trash2, 
  Plus,
  CheckCircle2,
  Circle,
  Edit2,
  X,
  Check,
  FileText
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
  subNote?: string;
}

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', text: '護照', checked: false, category: '隨身手提' },
  { id: '2', text: '手機', checked: false, category: '隨身手提' },
  { id: '3', text: '信用卡', checked: false, category: '隨身手提' },
  { id: '4', text: '外幣現金', checked: false, category: '隨身手提' },
  { id: '12', text: '行動電源', checked: false, category: '隨身手提', subNote: '*只能隨身' },
  { id: '21', text: '上衣/下身/內衣褲*4', checked: false, category: '行李箱-衣物' },
  { id: '26', text: '外套', checked: false, category: '行李箱-衣物' },
  { id: '31', text: '盥洗備品/保養品', checked: false, category: '行李箱-個人' },
  { id: '33', text: '個人常備藥品', checked: false, category: '行李箱-個人' },
  { id: '51', text: '充電頭/線組', checked: false, category: '行李箱-3C' },
  { id: '61', text: '日文駕照譯本', checked: false, category: '其他' },
  { id: '62', text: '雨傘/遮陽帽', checked: false, category: '其他' },
];

const STORAGE_KEY = 'okinawa_checklist_v3';

export const DepartureChecklist: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newValue, setNewValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(INITIAL_ITEMS);
      }
    } else {
      setItems(INITIAL_ITEMS);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const startEdit = (item: ChecklistItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditValue(item.text);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    if (!editValue.trim()) return setEditingId(null);
    setItems(prev => prev.map(item => item.id === editingId ? { ...item, text: editValue.trim() } : item));
    setEditingId(null);
  };

  const addNewItem = (category: string) => {
    if (!newValue.trim()) return setAddingToCategory(null);
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newValue.trim(),
      checked: false,
      category
    };
    setItems(prev => [...prev, newItem]);
    setNewValue('');
    setAddingToCategory(null);
  };

  const renderItem = (item: ChecklistItem) => {
    const isEditing = editingId === item.id;

    return (
      <div 
        key={item.id}
        className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${
          item.checked ? 'bg-[#F5F4F0]/40 border-transparent opacity-60' : 'bg-white border-[#F0EFEA] shadow-sm'
        }`}
        onClick={() => !isEditing && toggleItem(item.id)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {item.checked ? (
              <CheckCircle2 className="w-5 h-5 text-[#8B1D3D]" />
            ) : (
              <Circle className="w-5 h-5 text-[#E5E0D5]" />
            )}
          </div>
          
          {isEditing ? (
            <input 
              ref={editInputRef}
              className="w-full bg-transparent border-b border-[#8B1D3D] focus:outline-none text-sm font-bold text-[#2D2D2D]"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-bold transition-all truncate ${item.checked ? 'text-[#A09E97] line-through' : 'text-[#2D2D2D]'}`}>
                {item.text}
              </span>
              {item.subNote && <span className="text-[9px] font-black text-[#8B1D3D] mt-0.5">{item.subNote}</span>}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => startEdit(item, e)} className="p-1.5 text-[#A09E97] hover:text-[#8B1D3D]">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={(e) => deleteItem(item.id, e)} className="p-1.5 text-[#A09E97] hover:text-red-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAddSection = (category: string) => {
    const isAdding = addingToCategory === category;
    
    return (
      <div className="mt-2">
        {isAdding ? (
          <div className="p-4 rounded-2xl border border-dashed border-[#8B1D3D]/30 bg-[#FDFCF9] flex items-center gap-3">
            <input 
              autoFocus
              placeholder="新增..."
              className="flex-1 bg-transparent focus:outline-none text-sm font-bold text-[#2D2D2D]"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNewItem(category)}
            />
            <button onClick={() => addNewItem(category)} className="p-1.5 bg-[#8B1D3D] text-white rounded-lg">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setAddingToCategory(null)} className="p-1.5 text-[#A09E97]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setAddingToCategory(category)}
            className="w-full py-4 rounded-2xl border border-dashed border-[#E5E0D5] flex items-center justify-center gap-2 text-[10px] font-black text-[#A09E97] hover:text-[#8B1D3D] hover:border-[#8B1D3D]/30 transition-all uppercase tracking-widest"
          >
            <Plus className="w-3.5 h-3.5" /> 新增項目
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 space-y-8 mt-4">
      <section className="bg-white rounded-[2.5rem] p-8 border border-[#F0EFEA] shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 bg-[#F5F4F0] rounded-2xl">
            <Briefcase className="w-7 h-7 text-[#8B1D3D]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2D2D2D]">隨身手提</h3>
            <p className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest">Carry-on Essentials</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {items.filter(i => i.category === '隨身手提').map(renderItem)}
          {renderAddSection('隨身手提')}
        </div>
      </section>

      <section className="bg-white rounded-[2.5rem] p-8 border border-[#F0EFEA] shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 bg-[#F5F4F0] rounded-2xl">
            <Luggage className="w-7 h-7 text-[#8B1D3D]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2D2D2D]">行李清單</h3>
            <p className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest">Checked Baggage</p>
          </div>
        </div>

        <div className="space-y-10">
          {['衣物', '個人', '3C'].map(sub => (
            <div key={sub}>
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className="text-[11px] font-black text-[#8B1D3D] uppercase tracking-widest">{sub}</span>
                <div className="flex-1 h-[1px] bg-[#F5F4F0]" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {items.filter(i => i.category === `行李箱-${sub}`).map(renderItem)}
                {renderAddSection(`行李箱-${sub}`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[2.5rem] p-8 border border-[#F0EFEA] shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 bg-[#F5F4F0] rounded-2xl">
            <FileText className="w-7 h-7 text-[#8B1D3D]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2D2D2D]">其他備註</h3>
            <p className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest">Miscellaneous</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {items.filter(i => i.category === '其他').map(renderItem)}
          {renderAddSection('其他')}
        </div>
      </section>

      <div className="text-center pt-4">
        <button 
          onClick={() => confirm('確定要恢復為初始推薦清單嗎？') && setItems(INITIAL_ITEMS)} 
          className="text-[10px] text-[#A09E97] font-black uppercase tracking-[0.2em] py-3 px-8 hover:text-[#8B1D3D] transition-colors border border-transparent hover:border-[#F0EFEA] rounded-full"
        >
          恢復預設清單
        </button>
      </div>
    </div>
  );
};
