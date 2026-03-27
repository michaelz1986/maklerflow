export interface Listing {
  id: string;
  title: string;
  price: number;
  rooms: number;
  area: number;
  description: string;
  images: string[];
  address: string;
  city: string;
  zip: string;
  type: 'house' | 'apartment' | 'land';
  status: 'active' | 'draft' | 'sold';
  publishWebsite: boolean;
  publishImmoScout: boolean;
  publishImmowelt: boolean;
  createdAt: string;
  features: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'landing_page' | 'scraper' | 'manual';
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  propertyType?: 'house' | 'apartment' | 'land';
  location?: string;
  area?: number;
  score?: number;
  estimatedValue?: number;
  createdAt: string;
  notes?: string;
}

export interface ScrapedLead {
  id: string;
  address: string;
  estimatedValue: number;
  source: string;
  sellProbability: number;
  propertyType: 'house' | 'apartment' | 'land';
  rooms?: number;
  area?: number;
}

export interface ScrapedBuyer {
  id: string;
  name: string;
  source: string;
  lastActive: string;
  urgency: 'high' | 'medium' | 'low';
  searchCriteria: {
    propertyType: 'house' | 'apartment' | 'land';
    minArea?: number;
    maxArea?: number;
    minRooms?: number;
    maxRooms?: number;
    maxPrice: number;
    location: string;
    features?: string[];
  };
}

export interface BuyerMatch {
  buyer: ScrapedBuyer;
  listingId: string;
  matchScore: number;
  matchReasons: string[];
}
