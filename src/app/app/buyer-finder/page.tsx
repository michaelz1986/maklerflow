'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  User,
  MapPin,
  Maximize2,
  DoorOpen,
  Clock,
  BadgeCheck,
  Sparkles,
  Building2,
  Home,
  Trees,
  Link2,
} from 'lucide-react';
import { useStore } from '@/store';
import {
  formatPrice,
  getScoreBg,
  getPropertyTypeLabel,
  cn,
} from '@/lib/utils';

const scanSources = [
  'ImmoScout24 Suchprofile',
  'Immowelt Suchabos',
  'Ebay Kleinanzeigen Gesuche',
  'WG-Gesucht Anfragen',
  'Privates Netzwerk',
  'Social Media Signale',
];

const urgencyConfig = {
  high: { label: 'Hoch', class: 'bg-accent/20 text-accent' },
  medium: { label: 'Mittel', class: 'bg-warning/20 text-warning' },
  low: { label: 'Niedrig', class: 'bg-muted/20 text-muted' },
};

const typeIcons = {
  house: Home,
  apartment: Building2,
  land: Trees,
};

export default function BuyerFinderPage() {
  const {
    listings,
    buyerMatches,
    isBuyerScanning,
    buyerScanComplete,
    startBuyerScan,
    convertBuyerToLead,
  } = useStore();

  const [sourceIndex, setSourceIndex] = useState(0);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const activeListings = listings.filter((l) => l.status === 'active');

  useEffect(() => {
    if (!isBuyerScanning) return;
    const interval = setInterval(() => {
      setSourceIndex((prev) => (prev + 1) % scanSources.length);
    }, 700);
    return () => clearInterval(interval);
  }, [isBuyerScanning]);

  const filteredMatches = selectedListing
    ? buyerMatches.filter((m) => m.listingId === selectedListing)
    : buyerMatches;

  const getListingById = (id: string) => listings.find((l) => l.id === id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Käufer-Finder</h1>
        <p className="mt-1 text-muted">
          Finde passende Interessenten für deine Objekte
        </p>
      </div>

      {/* Active Listings Overview */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Deine aktiven Objekte ({activeListings.length})
          </h2>
          {buyerScanComplete && (
            <button
              onClick={() => setSelectedListing(null)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                !selectedListing
                  ? 'bg-accent/20 text-accent'
                  : 'text-muted hover:text-foreground'
              )}
            >
              Alle Matches
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeListings.map((listing) => {
            const matchCount = buyerMatches.filter(
              (m) => m.listingId === listing.id
            ).length;
            const isSelected = selectedListing === listing.id;
            return (
              <button
                key={listing.id}
                onClick={() =>
                  setSelectedListing(isSelected ? null : listing.id)
                }
                className={cn(
                  'group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-300',
                  isSelected
                    ? 'border-accent/50 bg-accent/5 glow-accent'
                    : 'border-border bg-surface/50 hover:border-border-accent hover:bg-surface'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                    isSelected ? 'bg-accent/20' : 'bg-surface-light'
                  )}
                >
                  {(() => {
                    const Icon = typeIcons[listing.type];
                    return (
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isSelected ? 'text-accent' : 'text-muted'
                        )}
                      />
                    );
                  })()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {listing.title}
                  </p>
                  <p className="text-xs text-muted">
                    {formatPrice(listing.price)} · {listing.city}
                  </p>
                </div>
                {matchCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-background">
                    {matchCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scan Control */}
      <div className="glass rounded-2xl p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div
              className={cn(
                'flex h-24 w-24 items-center justify-center rounded-full border-2 bg-surface transition-all duration-500',
                isBuyerScanning
                  ? 'border-accent animate-pulse-glow'
                  : buyerScanComplete
                    ? 'border-accent/50'
                    : 'border-border'
              )}
            >
              {isBuyerScanning && (
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-0 animate-radar rounded-full border-t-2 border-accent/60" />
                </div>
              )}
              <SearchCheck
                className={cn(
                  'h-10 w-10 transition-colors duration-300',
                  isBuyerScanning ? 'text-accent text-glow' : 'text-muted'
                )}
              />
            </div>
          </div>

          {!isBuyerScanning && !buyerScanComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="mb-6 max-w-lg text-sm text-muted">
                Der Käufer-Finder durchsucht Suchprofile, Gesuche und
                Suchabonnements auf allen relevanten Portalen und matcht sie
                automatisch mit deinen aktiven Objekten.
              </p>
              <button
                onClick={startBuyerScan}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-accent-glow glow-accent-strong hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                Käufer für meine Objekte finden
              </button>
            </motion.div>
          )}

          {isBuyerScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg"
            >
              <p className="mb-1 text-sm font-medium text-accent text-glow">
                Durchsuche Käufer-Profile...
              </p>
              <p className="mb-2 text-sm text-muted">
                {scanSources[sourceIndex]}
              </p>
              <p className="mb-6 text-xs text-muted/60">
                Matche mit {activeListings.length} aktiven Objekten
              </p>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-surface-light/50" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 rounded bg-surface-light/50" />
                      <div className="h-2 w-1/2 rounded bg-surface-light/30" />
                    </div>
                    <div className="h-6 w-14 rounded-full bg-surface-light/40" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {buyerScanComplete && !isBuyerScanning && buyerMatches.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 text-muted">
                <p className="text-sm">
                  Keine passenden Käufer gefunden. Versuche es später erneut.
                </p>
              </div>
              <button
                onClick={startBuyerScan}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Erneut scannen
              </button>
            </motion.div>
          )}

          {buyerScanComplete && !isBuyerScanning && buyerMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <p className="text-sm font-medium text-accent">
                {buyerMatches.length} passende Käufer gefunden!
              </p>
              <button
                onClick={startBuyerScan}
                className="ml-2 rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Erneut scannen
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {buyerScanComplete && filteredMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedListing
                  ? `Matches für "${getListingById(selectedListing)?.title}"`
                  : `Alle Matches (${filteredMatches.length})`}
              </h2>
              <span className="text-xs text-muted">
                Sortiert nach Match-Score
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredMatches.map((match, i) => {
                  const listing = getListingById(match.listingId);
                  const urg = urgencyConfig[match.buyer.urgency];
                  const TypeIcon = typeIcons[match.buyer.searchCriteria.propertyType];

                  return (
                    <motion.div
                      key={match.buyer.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="glass group rounded-xl p-5 transition-all duration-300 hover:border-border-accent"
                    >
                      {/* Match Header */}
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 ring-2 ring-accent/20">
                            <User className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {match.buyer.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted">
                              <span>{match.buyer.source}</span>
                              <span className="text-border">·</span>
                              <Clock className="h-3 w-3" />
                              <span>{match.buyer.lastActive}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-xs font-medium',
                              urg.class
                            )}
                          >
                            Dringlichkeit: {urg.label}
                          </span>
                          <div
                            className={cn(
                              'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold',
                              getScoreBg(match.matchScore)
                            )}
                          >
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {match.matchScore}%
                          </div>
                        </div>
                      </div>

                      {/* Match Details Grid */}
                      <div className="mb-4 grid gap-4 sm:grid-cols-2">
                        {/* Buyer Criteria */}
                        <div className="rounded-lg border border-border/50 bg-surface/50 p-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted/60">
                            Suchkriterien
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <TypeIcon className="h-4 w-4 text-muted" />
                              <span>
                                {getPropertyTypeLabel(
                                  match.buyer.searchCriteria.propertyType
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <MapPin className="h-4 w-4 text-muted" />
                              <span>
                                {match.buyer.searchCriteria.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <span className="text-xs text-muted">Budget:</span>
                              <span className="font-medium">
                                bis{' '}
                                {formatPrice(
                                  match.buyer.searchCriteria.maxPrice
                                )}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {match.buyer.searchCriteria.minArea && (
                                <span className="inline-flex items-center gap-1 rounded bg-surface-light px-2 py-0.5 text-muted">
                                  <Maximize2 className="h-3 w-3" />
                                  {match.buyer.searchCriteria.minArea}–
                                  {match.buyer.searchCriteria.maxArea} m²
                                </span>
                              )}
                              {match.buyer.searchCriteria.minRooms && (
                                <span className="inline-flex items-center gap-1 rounded bg-surface-light px-2 py-0.5 text-muted">
                                  <DoorOpen className="h-3 w-3" />
                                  {match.buyer.searchCriteria.minRooms}–
                                  {match.buyer.searchCriteria.maxRooms} Zi.
                                </span>
                              )}
                              {match.buyer.searchCriteria.features?.map((f) => (
                                <span
                                  key={f}
                                  className="rounded bg-surface-light px-2 py-0.5 text-muted"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Matched Listing */}
                        {listing && (
                          <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent/60">
                              Passendes Objekt
                            </p>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-foreground">
                                {listing.title}
                              </p>
                              <p className="text-sm font-semibold text-accent">
                                {formatPrice(listing.price)}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="rounded bg-accent/10 px-2 py-0.5 text-accent/80">
                                  {listing.area} m²
                                </span>
                                {listing.rooms > 0 && (
                                  <span className="rounded bg-accent/10 px-2 py-0.5 text-accent/80">
                                    {listing.rooms} Zi.
                                  </span>
                                )}
                                <span className="rounded bg-accent/10 px-2 py-0.5 text-accent/80">
                                  {listing.city}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Match Reasons */}
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {match.matchReasons.map((reason) => (
                          <span
                            key={reason}
                            className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {reason}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between border-t border-border/50 pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Link2 className="h-3.5 w-3.5" />
                          Match basierend auf{' '}
                          {match.matchReasons.length} Kriterien
                        </div>
                        <button
                          onClick={() =>
                            convertBuyerToLead(match.buyer.id, match.listingId)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-5 py-2 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent hover:text-background hover:glow-accent-strong"
                        >
                          Als Lead übernehmen
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
