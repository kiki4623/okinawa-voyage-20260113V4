
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { TravelEvent, EVENT_TYPES, EventType } from '../types';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: TravelEvent) => void;
  onDelete?: (id: string) => void;
  initialEvent?: TravelEvent | null;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({ 
  isOpen, onClose, onSave, onDelete, initialEvent 
}) => {
  const [formData, setFormData] = useState<Partial<TravelEvent>>({
    time: '',
    title: '',
    location: '',
    type: 'Location',
    note: ''
  });

  useEffect(() => {
    if (initialEvent) {
      setFormData(initialEvent);
    } else {
      setFormData({
        time: '',
        title: '',
        location: '',
        type: 'Location',
        note: ''
      });
    }
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as TravelEvent,
      id: initialEvent?.id || Date.now().toString()
    });
    onClose();
  };

  const handleDelete = () => {
    if (initialEvent && onDelete) {
      if (confirm('確定要刪除這項行程嗎？')) {
        onDelete(initialEvent.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#2D2D2D]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#FDFCF9] border border-[#F0EFEA] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-7 border-b border-[#F0EFEA] flex justify-between items-center bg-[#F5F4F0]/50">
          <h3 className="text-lg font-serif font-bold text-[#2D2D2D]">
            {initialEvent ? '編輯行程' : '新增計畫'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-[#A09E97]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A09E97] uppercase mb-1.5 tracking-widest">時間</label>
              <input 
                type="text" 
                placeholder="09:00"
                required
                className="w-full bg-[#F5F4F0] border border-[#F0EFEA] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#8B1D3D]"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#A09E97] uppercase mb-1.5 tracking-widest">類型</label>
              <select 
                className="w-full bg-[#F5F4F0] border border-[#F0EFEA] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as EventType})}
              >
                {EVENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A09E97] uppercase mb-1.5 tracking-widest">標題</label>
            <input 
              type="text" 
              required
              className="w-full bg-[#F5F4F0] border border-[#F0EFEA] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#8B1D3D]"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A09E97] uppercase mb-1.5 tracking-widest">地點</label>
            <input 
              type="text" 
              required
              className="w-full bg-[#F5F4F0] border border-[#F0EFEA] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#8B1D3D]"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A09E97] uppercase mb-1.5 tracking-widest">備註</label>
            <textarea 
              rows={2}
              className="w-full bg-[#F5F4F0] border border-[#F0EFEA] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#8B1D3D] resize-none"
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            {initialEvent && (
              <button 
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 p-4 bg-[#F5F4F0] hover:bg-red-50 text-[#A09E97] hover:text-red-500 rounded-xl font-bold flex-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 p-4 bg-[#8B1D3D] text-white rounded-xl font-bold flex-[3] shadow-lg shadow-red-900/10 active:scale-95"
            >
              儲存行程
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
