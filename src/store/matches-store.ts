'use client';

import { create } from 'zustand';
import {
  MatchProperty,
  MatchBuyer,
  Match,
  MatchNote,
  MatchAction,
  MatchScoreBreakdown,
  MatchFilters,
  MatchesStats,
} from '@/lib/matches-types';
import { generateProperties, generateBuyers } from '@/data/matches-mock';

// --- Matching Engine ---

const WEIGHTS = { price: 0.30, location: 0.25, size: 0.20, rooms: 0.15, type: 0.05, features: 0.05 };

function scorePrice(property: MatchProperty, buyer: MatchBuyer): number {
  const price = property.price;
  const mid = (buyer.budgetMin + buyer.budgetMax) / 2;
  const range = (buyer.budgetMax - buyer.budgetMin) / 2;
  const tolerance = range * 1.2;
  if (price >= buyer.budgetMin && price <= buyer.budgetMax) return 100;
  const dist = price < buyer.budgetMin ? buyer.budgetMin - price : price - buyer.budgetMax;
  const ratio = dist / tolerance;
  if (ratio > 1) return 0;
  return Math.round(100 * (1 - ratio));
}

function scoreLocation(property: MatchProperty, buyer: MatchBuyer): number {
  for (const pref of buyer.locationPreferences) {
    const parts = pref.split(',').map((s) => s.trim().toLowerCase());
    const city = parts[0];
    const district = parts[1];
    if (property.city.toLowerCase() === city) {
      if (!district) return 100;
      if (property.district.toLowerCase() === district) return 100;
      return 70;
    }
  }
  return 0;
}

function scoreSize(property: MatchProperty, buyer: MatchBuyer): number {
  const { area } = property;
  if (area >= buyer.sizeMin && area <= buyer.sizeMax) return 100;
  const tolerance = (buyer.sizeMax - buyer.sizeMin) * 0.15;
  if (area < buyer.sizeMin) {
    const diff = buyer.sizeMin - area;
    return diff > tolerance ? Math.max(0, Math.round(100 - (diff / tolerance) * 100)) : Math.round(100 - (diff / tolerance) * 50);
  }
  const diff = area - buyer.sizeMax;
  return diff > tolerance ? Math.max(0, Math.round(100 - (diff / tolerance) * 100)) : Math.round(100 - (diff / tolerance) * 50);
}

function scoreRooms(property: MatchProperty, buyer: MatchBuyer): number {
  const { rooms } = property;
  if (rooms >= buyer.roomsMin && rooms <= buyer.roomsMax) return 100;
  const diff = rooms < buyer.roomsMin ? buyer.roomsMin - rooms : rooms - buyer.roomsMax;
  if (diff === 1) return 60;
  if (diff === 2) return 20;
  return 0;
}

function scoreType(property: MatchProperty, buyer: MatchBuyer): number {
  return buyer.typePreferences.includes(property.type) ? 100 : 0;
}

function scoreFeatures(property: MatchProperty, buyer: MatchBuyer): number {
  if (buyer.features.length === 0) return 80;
  const matched = buyer.features.filter((f) =>
    property.features.some((pf) => pf.toLowerCase().includes(f.toLowerCase()))
  );
  return Math.round((matched.length / buyer.features.length) * 100);
}

function computeMatch(property: MatchProperty, buyer: MatchBuyer): { score: MatchScoreBreakdown; reasons: string[] } {
  const priceScore = scorePrice(property, buyer);
  const locationScore = scoreLocation(property, buyer);
  const sizeScore = scoreSize(property, buyer);
  const roomsScore = scoreRooms(property, buyer);
  const typeScore = scoreType(property, buyer);
  const featuresScore = scoreFeatures(property, buyer);

  const total = Math.round(
    priceScore * WEIGHTS.price +
    locationScore * WEIGHTS.location +
    sizeScore * WEIGHTS.size +
    roomsScore * WEIGHTS.rooms +
    typeScore * WEIGHTS.type +
    featuresScore * WEIGHTS.features
  );

  const reasons: string[] = [];
  if (priceScore >= 80) reasons.push('Budget passt');
  else if (priceScore >= 50) reasons.push('Budget fast passend');
  if (locationScore >= 80) reasons.push('Lage passt');
  else if (locationScore >= 50) reasons.push('Lage in der Nähe');
  if (sizeScore >= 80) reasons.push('Größe passt');
  if (roomsScore >= 80) reasons.push('Zimmer passen');
  if (typeScore >= 80) reasons.push('Objekttyp passt');
  if (featuresScore >= 60) {
    const matched = buyer.features.filter((f) =>
      property.features.some((pf) => pf.toLowerCase().includes(f.toLowerCase()))
    );
    if (matched.length > 0) reasons.push(`${matched.join(', ')} vorhanden`);
  }

  return {
    score: { price: priceScore, location: locationScore, size: sizeScore, rooms: roomsScore, type: typeScore, features: featuresScore, total },
    reasons,
  };
}

function findTopMatches(property: MatchProperty, buyers: MatchBuyer[], topN: number = 10): Match[] {
  const scored = buyers.map((buyer) => {
    const { score, reasons } = computeMatch(property, buyer);
    return { buyer, score, reasons };
  });

  return scored
    .filter((s) => s.score.total >= 30)
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, topN)
    .map((s, i) => ({
      id: `match-${property.id}-${s.buyer.id}`,
      propertyId: property.id,
      buyerId: s.buyer.id,
      score: s.score,
      reasons: s.reasons,
      status: 'new' as const,
      isFavorite: false,
      notes: [],
      actions: [],
      createdAt: new Date().toISOString(),
    }));
}

// --- Store ---

interface MatchesStore {
  properties: MatchProperty[];
  buyers: MatchBuyer[];
  matches: Match[];
  selectedPropertyIndex: number;
  filters: MatchFilters;

  isPropertyScraping: boolean;
  isBuyerScraping: boolean;
  propertyScrapeComplete: boolean;
  buyerScrapeComplete: boolean;
  lastPropertyScrape: string | null;
  lastBuyerScrape: string | null;

  setSelectedProperty: (index: number) => void;
  setFilters: (filters: Partial<MatchFilters>) => void;

  startPropertyScraper: () => void;
  startBuyerScraper: () => void;
  startBothScrapers: () => void;

  toggleFavorite: (matchId: string) => void;
  addNote: (matchId: string, text: string) => void;
  logAction: (matchId: string, action: MatchAction['type'], description: string) => void;
  updateMatchStatus: (matchId: string, status: Match['status']) => void;

  getMatchesForProperty: (propertyId: string) => Match[];
  getFilteredProperties: () => MatchProperty[];
  getStats: () => MatchesStats;
  getBuyerById: (id: string) => MatchBuyer | undefined;
  getPropertyById: (id: string) => MatchProperty | undefined;
}

const initialProperties = generateProperties(100);
const initialBuyers = generateBuyers(100);

function computeAllMatches(properties: MatchProperty[], buyers: MatchBuyer[]): Match[] {
  const allMatches: Match[] = [];
  for (const property of properties) {
    allMatches.push(...findTopMatches(property, buyers, 10));
  }
  return allMatches;
}

const initialMatches = computeAllMatches(initialProperties, initialBuyers);

let noteCounter = 0;

export const useMatchesStore = create<MatchesStore>((set, get) => ({
  properties: initialProperties,
  buyers: initialBuyers,
  matches: initialMatches,
  selectedPropertyIndex: 0,
  filters: { sortBy: 'score' },

  isPropertyScraping: false,
  isBuyerScraping: false,
  propertyScrapeComplete: false,
  buyerScrapeComplete: false,
  lastPropertyScrape: null,
  lastBuyerScrape: null,

  setSelectedProperty: (index) => set({ selectedPropertyIndex: index }),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  startPropertyScraper: () => {
    set({ isPropertyScraping: true, propertyScrapeComplete: false });
    setTimeout(() => {
      const newProps = generateProperties(50).map((p, i) => ({ ...p, id: `mp-new-${Date.now()}-${i}`, scrapedAt: new Date().toISOString() }));
      const { buyers } = get();
      const newMatches = computeAllMatches(newProps, buyers);
      set((state) => ({
        properties: [...newProps, ...state.properties],
        matches: [...newMatches, ...state.matches],
        isPropertyScraping: false,
        propertyScrapeComplete: true,
        lastPropertyScrape: new Date().toISOString(),
      }));
    }, 4000);
  },

  startBuyerScraper: () => {
    set({ isBuyerScraping: true, buyerScrapeComplete: false });
    setTimeout(() => {
      const newBuyers = generateBuyers(50).map((b, i) => ({ ...b, id: `mb-new-${Date.now()}-${i}`, registeredAt: new Date().toISOString() }));
      const { properties } = get();
      const newMatches = computeAllMatches(properties, newBuyers);
      set((state) => ({
        buyers: [...newBuyers, ...state.buyers],
        matches: [...state.matches, ...newMatches],
        isBuyerScraping: false,
        buyerScrapeComplete: true,
        lastBuyerScrape: new Date().toISOString(),
      }));
    }, 3500);
  },

  startBothScrapers: () => {
    get().startPropertyScraper();
    get().startBuyerScraper();
  },

  toggleFavorite: (matchId) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, isFavorite: !m.isFavorite } : m
      ),
    })),

  addNote: (matchId, text) => {
    const note: MatchNote = {
      id: `note-${++noteCounter}`,
      text,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, notes: [note, ...m.notes] } : m
      ),
    }));
  },

  logAction: (matchId, type, description) => {
    const action: MatchAction = {
      id: `action-${Date.now()}`,
      type,
      description,
      createdAt: new Date().toISOString(),
    };
    const statusMap: Record<string, Match['status']> = {
      contacted_seller: 'contacted_seller',
      contacted_buyer: 'contacted_buyer',
      contacted_both: 'contacted_both',
      appointment_set: 'appointment',
      deal_closed: 'deal',
      lost: 'lost',
    };
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId
          ? { ...m, actions: [action, ...m.actions], status: statusMap[type] || m.status }
          : m
      ),
    }));
  },

  updateMatchStatus: (matchId, status) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, status } : m
      ),
    })),

  getMatchesForProperty: (propertyId) => {
    const { matches, filters } = get();
    let result = matches.filter((m) => m.propertyId === propertyId);
    if (filters.minScore) result = result.filter((m) => m.score.total >= (filters.minScore ?? 0));
    result.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return b.score.total - a.score.total;
    });
    return result;
  },

  getFilteredProperties: () => {
    const { properties, filters } = get();
    let result = [...properties];
    if (filters.priceMin) result = result.filter((p) => p.price >= (filters.priceMin ?? 0));
    if (filters.priceMax) result = result.filter((p) => p.price <= (filters.priceMax ?? Infinity));
    if (filters.city) result = result.filter((p) => p.city.toLowerCase().includes((filters.city ?? '').toLowerCase()));
    if (filters.sizeMin) result = result.filter((p) => p.area >= (filters.sizeMin ?? 0));
    if (filters.sizeMax) result = result.filter((p) => p.area <= (filters.sizeMax ?? Infinity));
    if (filters.rooms) result = result.filter((p) => p.rooms === filters.rooms);
    if (filters.type) result = result.filter((p) => p.type === filters.type);
    if (filters.source) result = result.filter((p) => p.source === filters.source);

    switch (filters.sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'date': result.sort((a, b) => new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()); break;
      case 'city': result.sort((a, b) => a.city.localeCompare(b.city)); break;
      case 'score':
      default: {
        const { matches } = get();
        const avgScores = new Map<string, number>();
        for (const p of result) {
          const pMatches = matches.filter((m) => m.propertyId === p.id);
          avgScores.set(p.id, pMatches.length ? pMatches.reduce((s, m) => s + m.score.total, 0) / pMatches.length : 0);
        }
        result.sort((a, b) => (avgScores.get(b.id) ?? 0) - (avgScores.get(a.id) ?? 0));
        break;
      }
    }
    return result;
  },

  getStats: () => {
    const { properties, buyers, matches } = get();
    const contacted = matches.filter((m) => m.status !== 'new');
    const deals = matches.filter((m) => m.status === 'deal');
    const scores = matches.map((m) => m.score.total);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const sourceMap = new Map<string, number>();
    for (const p of properties) sourceMap.set(p.source, (sourceMap.get(p.source) ?? 0) + 1);
    const topSources = [...sourceMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));

    const cityMap = new Map<string, number>();
    for (const p of properties) cityMap.set(p.city, (cityMap.get(p.city) ?? 0) + 1);
    const topCities = [...cityMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));

    return {
      totalProperties: properties.length,
      totalBuyers: buyers.length,
      totalMatches: matches.length,
      avgMatchScore: avg,
      contactedCount: contacted.length,
      dealCount: deals.length,
      topSources,
      topCities,
    };
  },

  getBuyerById: (id) => get().buyers.find((b) => b.id === id),
  getPropertyById: (id) => get().properties.find((p) => p.id === id),
}));
