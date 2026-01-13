
export type EventType = 
  | 'Flight' 
  | 'Arrival' 
  | 'Food' 
  | 'Shopping' 
  | 'Hotel' 
  | 'Ticket' 
  | 'Sightseeing' 
  | 'Location' 
  | 'Camera' 
  | 'Nature' 
  | 'Waves' 
  | 'Home' 
  | 'Arrow';

export const EVENT_TYPES: EventType[] = [
  'Flight', 'Arrival', 'Food', 'Shopping', 'Hotel', 'Ticket', 
  'Sightseeing', 'Location', 'Camera', 'Nature', 'Waves', 'Home', 'Arrow'
];

export interface MenuItem {
  original: string;
  translated: string;
}

export interface VenueDetails {
  phone?: string;
  menuItems?: MenuItem[];
  about?: string[];
  pointAndSpeak?: string[];
}

export interface TravelEvent {
  id: string;
  time: string;
  type: EventType;
  title: string;
  location: string;
  note: string;
  details?: VenueDetails; // Rich details populated by AI
}

export interface DayData {
  day: number;
  date: string;
  title: string;
  tip: string;
  events: TravelEvent[];
}

export interface WeatherDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Windy';
  description: string;
}

export interface WeatherForecastResponse {
  locationName: string;
  forecast: WeatherDay[];
  overallTip: string;
  sources?: { uri: string; title: string }[];
}

export interface AIInsight {
  weather: string;
  suggestion: string;
  localPhrase: string;
  funFact: string;
}
