export type PropertyType = 'apartment' | 'house' | 'commercial';

export interface MatchProperty {
  id: string;
  title: string;
  price: number;
  city: string;
  district: string;
  street: string;
  zip: string;
  area: number;
  rooms: number;
  type: PropertyType;
  features: string[];
  images: string[];
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  source: string;
  scrapedAt: string;
  sourceUrl?: string;
  yearBuilt?: number;
  condition?: string;
  energyRating?: string;
}

export interface MatchBuyer {
  id: string;
  name: string;
  phone: string;
  email: string;
  budgetMin: number;
  budgetMax: number;
  locationPreferences: string[];
  sizeMin: number;
  sizeMax: number;
  roomsMin: number;
  roomsMax: number;
  typePreferences: PropertyType[];
  features: string[];
  source: string;
  registeredAt: string;
  lifestyle?: string[];
}

export interface MatchScoreBreakdown {
  price: number;
  location: number;
  size: number;
  rooms: number;
  type: number;
  features: number;
  total: number;
}

export interface Match {
  id: string;
  propertyId: string;
  buyerId: string;
  score: MatchScoreBreakdown;
  reasons: string[];
  status: 'new' | 'contacted_seller' | 'contacted_buyer' | 'contacted_both' | 'appointment' | 'deal' | 'lost';
  isFavorite: boolean;
  notes: MatchNote[];
  actions: MatchAction[];
  createdAt: string;
}

export interface MatchNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface MatchAction {
  id: string;
  type: 'contacted_seller' | 'contacted_buyer' | 'contacted_both' | 'appointment_set' | 'viewing_done' | 'offer_made' | 'deal_closed' | 'lost';
  description: string;
  createdAt: string;
}

export interface MatchesStats {
  totalProperties: number;
  totalBuyers: number;
  totalMatches: number;
  avgMatchScore: number;
  contactedCount: number;
  dealCount: number;
  topSources: { name: string; count: number }[];
  topCities: { name: string; count: number }[];
}

export interface MatchFilters {
  priceMin?: number;
  priceMax?: number;
  city?: string;
  sizeMin?: number;
  sizeMax?: number;
  rooms?: number;
  type?: PropertyType;
  minScore?: number;
  source?: string;
  sortBy: 'score' | 'price_asc' | 'price_desc' | 'date' | 'city';
}
