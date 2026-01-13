
import React from 'react';
import { 
  Plane, 
  Utensils, 
  ShoppingBag, 
  BedDouble, 
  Camera, 
  MapPin, 
  Ticket, 
  Waves, 
  Home, 
  ArrowRight,
  Sun,
  Camera as CameraIcon
} from 'lucide-react';
import { EventType } from '../types';

interface IconMapProps {
  type: EventType;
  className?: string;
}

export const IconMap: React.FC<IconMapProps> = ({ type, className = "w-5 h-5 text-white" }) => {
  switch (type) {
    case 'Flight': return <Plane className={className} />;
    case 'Arrival': 
    case 'Arrow': return <ArrowRight className={className} />;
    case 'Food': return <Utensils className={className} />;
    case 'Shopping': return <ShoppingBag className={className} />;
    case 'Hotel': return <BedDouble className={className} />;
    case 'Ticket': return <Ticket className={className} />;
    case 'Sightseeing':
    case 'Location': return <MapPin className={className} />;
    case 'Camera': return <CameraIcon className={className} />;
    case 'Nature': return <Sun className={`${className} text-green-400`} />;
    case 'Waves': return <Waves className={`${className} text-blue-400`} />;
    case 'Home': return <Home className={className} />;
    default: return <MapPin className={className} />;
  }
};
