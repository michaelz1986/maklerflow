'use client';

import { create } from 'zustand';
import { Listing, Lead, ScrapedLead, ScrapedBuyer, BuyerMatch } from '@/lib/types';
import { mockListings, mockLeads, mockScrapedLeads, mockScrapedBuyers } from '@/data/mock';

interface AppStore {
  listings: Listing[];
  leads: Lead[];
  scrapedLeads: ScrapedLead[];
  isScanning: boolean;
  scanComplete: boolean;

  // Buyer Scanner State
  scrapedBuyers: ScrapedBuyer[];
  buyerMatches: BuyerMatch[];
  isBuyerScanning: boolean;
  buyerScanComplete: boolean;

  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;

  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;

  startScan: () => void;
  convertScrapedLead: (scrapedId: string) => void;

  startBuyerScan: () => void;
  convertBuyerToLead: (buyerId: string, listingId: string) => void;
}

function computeMatchScore(listing: Listing, buyer: ScrapedBuyer): { score: number; reasons: string[] } {
  const c = buyer.searchCriteria;
  let score = 0;
  const reasons: string[] = [];

  if (c.propertyType === listing.type) {
    score += 30;
    reasons.push('Immobilientyp passt');
  } else {
    return { score: 0, reasons: [] };
  }

  if (listing.price <= c.maxPrice) {
    const priceRatio = listing.price / c.maxPrice;
    if (priceRatio <= 0.9) {
      score += 25;
      reasons.push('Deutlich unter Budget');
    } else {
      score += 15;
      reasons.push('Im Budgetrahmen');
    }
  } else {
    const over = (listing.price - c.maxPrice) / c.maxPrice;
    if (over <= 0.1) {
      score += 5;
      reasons.push('Leicht über Budget (+' + Math.round(over * 100) + '%)');
    } else {
      return { score: 0, reasons: [] };
    }
  }

  if (c.minArea && c.maxArea) {
    if (listing.area >= c.minArea && listing.area <= c.maxArea) {
      score += 20;
      reasons.push('Fläche im Suchbereich');
    } else if (listing.area >= (c.minArea * 0.85) && listing.area <= (c.maxArea * 1.15)) {
      score += 10;
      reasons.push('Fläche nahe am Suchbereich');
    }
  }

  if (c.minRooms && c.maxRooms && listing.rooms > 0) {
    if (listing.rooms >= c.minRooms && listing.rooms <= c.maxRooms) {
      score += 15;
      reasons.push('Zimmeranzahl passt');
    } else if (listing.rooms >= (c.minRooms - 1) && listing.rooms <= (c.maxRooms + 1)) {
      score += 7;
      reasons.push('Zimmeranzahl fast passend');
    }
  }

  if (c.features && c.features.length > 0) {
    const matched = c.features.filter((f) =>
      listing.features.some((lf) => lf.toLowerCase().includes(f.toLowerCase()))
    );
    if (matched.length > 0) {
      score += Math.min(10, matched.length * 5);
      reasons.push(matched.length + ' gewünschte Features vorhanden');
    }
  }

  return { score: Math.min(100, score), reasons };
}

let leadCounter = 100;
let listingCounter = 100;

export const useStore = create<AppStore>((set, get) => ({
  listings: mockListings,
  leads: mockLeads,
  scrapedLeads: [],
  isScanning: false,
  scanComplete: false,

  scrapedBuyers: [],
  buyerMatches: [],
  isBuyerScanning: false,
  buyerScanComplete: false,

  addListing: (listing) => {
    const newListing: Listing = {
      ...listing,
      id: String(++listingCounter),
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ listings: [newListing, ...state.listings] }));
  },

  updateListing: (id, updates) => {
    set((state) => ({
      listings: state.listings.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    }));
  },

  deleteListing: (id) => {
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== id),
    }));
  },

  addLead: (lead) => {
    const newLead: Lead = {
      ...lead,
      id: `l${++leadCounter}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ leads: [newLead, ...state.leads] }));
  },

  updateLead: (id, updates) => {
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    }));
  },

  startScan: () => {
    set({ isScanning: true, scanComplete: false, scrapedLeads: [] });
    setTimeout(() => {
      set({
        isScanning: false,
        scanComplete: true,
        scrapedLeads: mockScrapedLeads,
      });
    }, 3500);
  },

  convertScrapedLead: (scrapedId) => {
    const scraped = get().scrapedLeads.find((s) => s.id === scrapedId);
    if (!scraped) return;

    const newLead: Lead = {
      id: `l${++leadCounter}`,
      name: 'Eigentümer (ermittelt)',
      email: '',
      phone: '',
      source: 'scraper',
      status: 'new',
      propertyType: scraped.propertyType,
      location: scraped.address,
      area: scraped.area,
      score: scraped.sellProbability,
      estimatedValue: scraped.estimatedValue,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      leads: [newLead, ...state.leads],
      scrapedLeads: state.scrapedLeads.filter((s) => s.id !== scrapedId),
    }));
  },

  startBuyerScan: () => {
    set({ isBuyerScanning: true, buyerScanComplete: false, buyerMatches: [] });
    setTimeout(() => {
      const activeListings = get().listings.filter((l) => l.status === 'active');
      const matches: BuyerMatch[] = [];

      for (const buyer of mockScrapedBuyers) {
        let bestMatch: BuyerMatch | null = null;
        for (const listing of activeListings) {
          const { score, reasons } = computeMatchScore(listing, buyer);
          if (score >= 40 && (!bestMatch || score > bestMatch.matchScore)) {
            bestMatch = { buyer, listingId: listing.id, matchScore: score, matchReasons: reasons };
          }
        }
        if (bestMatch) {
          matches.push(bestMatch);
        }
      }

      matches.sort((a, b) => b.matchScore - a.matchScore);

      set({
        isBuyerScanning: false,
        buyerScanComplete: true,
        scrapedBuyers: mockScrapedBuyers,
        buyerMatches: matches,
      });
    }, 4000);
  },

  convertBuyerToLead: (buyerId, listingId) => {
    const match = get().buyerMatches.find((m) => m.buyer.id === buyerId);
    if (!match) return;

    const listing = get().listings.find((l) => l.id === listingId);

    const newLead: Lead = {
      id: `l${++leadCounter}`,
      name: `Interessent: ${match.buyer.name}`,
      email: '',
      phone: '',
      source: 'scraper',
      status: 'new',
      propertyType: match.buyer.searchCriteria.propertyType,
      location: match.buyer.searchCriteria.location,
      area: match.buyer.searchCriteria.maxArea,
      score: match.matchScore,
      estimatedValue: listing?.price,
      createdAt: new Date().toISOString().split('T')[0],
      notes: `Gematcht mit: ${listing?.title || 'Unbekannt'} – Match-Score: ${match.matchScore}%\nSuchkriterien: ${match.matchReasons.join(', ')}`,
    };

    set((state) => ({
      leads: [newLead, ...state.leads],
      buyerMatches: state.buyerMatches.filter((m) => m.buyer.id !== buyerId),
    }));
  },
}));
