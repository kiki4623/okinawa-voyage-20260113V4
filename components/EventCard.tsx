
import React from 'react';
import { Send, Edit2 } from 'lucide-react';
import { TravelEvent } from '../types';

interface EventCardProps {
  event: TravelEvent;
  isLast: boolean;
  onEdit: (event: TravelEvent) => void;
  onViewDetails: (event: TravelEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onViewDetails, isLast }) => {
  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    window.open(url, '_blank');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(event);
  };

  return (
    <div 
      onClick={() => onViewDetails(event)}
      className="flex gap-8 mb-0 group cursor-pointer animate-in fade-in slide-in-from-left-4"
    >
      {/* 左側時間列 */}
      <div className="w-16 flex-shrink-0 pt-4">
        <h4 className="text-xl font-serif font-black tracking-tight text-[#2D2D2D]">
          {event.time}
        </h4>
      </div>

      {/* 右側內容區塊 */}
      <div className={`flex-1 pl-6 border-l border-[#F0EFEA] relative py-4 ${isLast ? 'pb-8' : ''}`}>
        <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[#AECFC6] opacity-40 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#A09E97] uppercase tracking-widest">
              {event.type === 'Food' ? 'GASTRONOMY' : 
               event.type === 'Flight' ? 'TRANSPORT' : 
               event.type === 'Sightseeing' ? 'SIGHTSEEING' : 
               event.type === 'Shopping' ? 'SHOPPING' : 'ACTIVITY'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleNavigate}
              className="p-2 text-[#A09E97] hover:text-[#1A73E8] transition-colors rounded-full hover:bg-[#E8F0FE]"
              title="導航"
            >
              <Send className="w-3.5 h-3.5 rotate-45" />
            </button>
            <button 
              onClick={handleEditClick}
              className="p-2 text-[#A09E97] hover:text-[#8B1D3D] transition-colors rounded-full hover:bg-[#F5F4F0]"
              title="編輯"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-serif font-bold tracking-tight mb-2 text-[#2D2D2D] group-hover:text-[#8B1D3D] transition-colors">
          {event.title}
        </h3>

        {event.note && (
          <div className="mt-4 pl-4 border-l border-[#F0EFEA]">
            <p className="text-[11px] leading-relaxed text-[#A09E97] font-medium italic">
              【{event.location}】{event.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
