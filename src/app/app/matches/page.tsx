'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Building2,
  Users,
  Zap,
  TrendingUp,
  Phone,
  Mail,
  Star,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Loader2,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Maximize,
  Bed,
  Calendar,
  Shield,
  Bolt,
  X,
  Send,
  StickyNote,
  Activity,
  Heart,
  Handshake,
  Eye,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';
import { useMatchesStore } from '@/store/matches-store';
import type { Match, MatchBuyer, MatchAction, PropertyType } from '@/lib/matches-types';
import {
  formatPrice,
  formatDate,
  cn,
  getPropertyTypeLabel,
  getScoreBg,
  getScoreColor,
} from '@/lib/utils';

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tagen`;
}

function typeLabel(type: string): string {
  if (type === 'commercial') return 'Gewerbe';
  return getPropertyTypeLabel(type);
}

const SCORE_LABELS: Record<string, string> = {
  price: 'Preis',
  location: 'Lage',
  size: 'Größe',
  rooms: 'Zimmer',
  type: 'Typ',
  features: 'Extras',
};

const SORT_OPTIONS = [
  { value: 'score' as const, label: 'Score' },
  { value: 'price_asc' as const, label: 'Preis ↑' },
  { value: 'price_desc' as const, label: 'Preis ↓' },
  { value: 'date' as const, label: 'Datum' },
  { value: 'city' as const, label: 'Stadt' },
];

const TYPE_OPTIONS: { value: PropertyType | ''; label: string }[] = [
  { value: '', label: 'Alle' },
  { value: 'apartment', label: 'Wohnung' },
  { value: 'house', label: 'Haus' },
  { value: 'commercial', label: 'Gewerbe' },
];

const ACTION_TYPES = [
  { value: 'contacted_seller', label: 'Verkäufer kontaktiert' },
  { value: 'contacted_buyer', label: 'Käufer kontaktiert' },
  { value: 'contacted_both', label: 'Beide kontaktiert' },
  { value: 'appointment_set', label: 'Besichtigung vereinbart' },
  { value: 'viewing_done', label: 'Besichtigung durchgeführt' },
  { value: 'offer_made', label: 'Angebot gemacht' },
  { value: 'deal_closed', label: 'Deal abgeschlossen' },
  { value: 'lost', label: 'Verloren' },
] as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ScoreBar({ value, label }: { value: number; label: string }) {
  const color =
    value >= 75 ? 'bg-accent' : value >= 50 ? 'bg-warning' : 'bg-danger';
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-12 shrink-0 text-muted">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-surface-light/60">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="w-7 text-right font-mono text-muted">{value}</span>
    </div>
  );
}

function ContactModal({
  mode,
  property,
  buyer,
  onClose,
  onSend,
}: {
  mode: 'seller' | 'buyer';
  property: { contactName: string; contactPhone: string; contactEmail: string; title: string };
  buyer: MatchBuyer | undefined;
  onClose: () => void;
  onSend: (msg: string) => void;
}) {
  const isSeller = mode === 'seller';
  const name = isSeller ? property.contactName : buyer?.name ?? '';
  const phone = isSeller ? property.contactPhone : buyer?.phone ?? '';
  const email = isSeller ? property.contactEmail : buyer?.email ?? '';

  const templateSeller = `Sehr geehrte/r ${name},\n\nich bin Immobilienmakler und habe einen potenziellen Käufer für Ihr Objekt "${property.title}". Ich würde gerne einen Besichtigungstermin vereinbaren.\n\nMit freundlichen Grüßen`;
  const templateBuyer = `Sehr geehrte/r ${name},\n\nich habe ein passendes Objekt für Sie gefunden: "${property.title}". Es entspricht Ihren Suchkriterien. Möchten Sie einen Besichtigungstermin vereinbaren?\n\nMit freundlichen Grüßen`;

  const [message, setMessage] = useState(isSeller ? templateSeller : templateBuyer);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass glow-accent w-full max-w-lg rounded-2xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            {isSeller ? 'Verkäufer kontaktieren' : 'Käufer kontaktieren'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface-light hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-3 rounded-lg bg-surface/60 px-3 py-2">
            <Users className="h-4 w-4 text-accent" />
            <span className="text-sm text-foreground">{name}</span>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${phone}`}
              className="flex flex-1 items-center gap-2 rounded-lg bg-surface/60 px-3 py-2 text-sm text-foreground hover:bg-surface-light transition-colors"
            >
              <Phone className="h-4 w-4 text-accent" />
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="flex flex-1 items-center gap-2 rounded-lg bg-surface/60 px-3 py-2 text-sm text-foreground hover:bg-surface-light transition-colors"
            >
              <Mail className="h-4 w-4 text-accent" />
              {email}
            </a>
          </div>
        </div>

        <textarea
          className="mb-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none resize-none"
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={() => onSend(message)}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-background transition-all hover:bg-accent-glow glow-accent"
          >
            <Send className="h-4 w-4" />
            Nachricht senden (simuliert)
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function MatchesPage() {
  const store = useMatchesStore();
  const {
    selectedPropertyIndex,
    filters,
    isPropertyScraping,
    isBuyerScraping,
    lastPropertyScrape,
    lastBuyerScrape,
    setSelectedProperty,
    setFilters,
    startPropertyScraper,
    startBuyerScraper,
    startBothScrapers,
    toggleFavorite,
    addNote,
    logAction,
    getMatchesForProperty,
    getFilteredProperties,
    getStats,
    getBuyerById,
  } = store;

  const stats = getStats();
  const filteredProperties = getFilteredProperties();
  const property = filteredProperties[selectedPropertyIndex];
  const propertyMatches = property ? getMatchesForProperty(property.id) : [];

  // Image carousel
  const [imgIdx, setImgIdx] = useState(0);
  const images = property?.images ?? [];
  const safeImgIdx = imgIdx >= images.length ? 0 : imgIdx;

  // UI state
  const [cityFilter, setCityFilter] = useState(filters.city ?? '');
  const [noteOpen, setNoteOpen] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [actionOpen, setActionOpen] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const [contactModal, setContactModal] = useState<{ matchId: string; mode: 'seller' | 'buyer' } | null>(null);

  const toggleExpanded = useCallback(
    (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
      setFn((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    },
    []
  );

  const handlePropertyNav = useCallback(
    (dir: -1 | 1) => {
      const next = selectedPropertyIndex + dir;
      if (next >= 0 && next < filteredProperties.length) {
        setSelectedProperty(next);
        setImgIdx(0);
      }
    },
    [selectedPropertyIndex, filteredProperties.length, setSelectedProperty]
  );

  const handleNoteSubmit = useCallback(
    (matchId: string) => {
      if (noteText.trim()) {
        addNote(matchId, noteText.trim());
        setNoteText('');
        setNoteOpen(null);
      }
    },
    [noteText, addNote]
  );

  const handleContactSend = useCallback(
    (matchId: string, mode: 'seller' | 'buyer', msg: string) => {
      const actionType = mode === 'seller' ? 'contacted_seller' : 'contacted_buyer';
      logAction(matchId, actionType, msg.slice(0, 120) + '…');
      setContactModal(null);
    },
    [logAction]
  );

  const contactModalMatch = contactModal
    ? propertyMatches.find((m) => m.id === contactModal.matchId)
    : null;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-5">
      {/* ====== STATS BAR ====== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Objekte', value: stats.totalProperties, icon: Building2 },
          { label: 'Käufer', value: stats.totalBuyers, icon: Users },
          { label: 'Matches', value: stats.totalMatches, icon: Zap },
          { label: 'Ø Score', value: stats.avgMatchScore, icon: TrendingUp },
          { label: 'Kontaktiert', value: stats.contactedCount, icon: Phone },
          { label: 'Deals', value: stats.dealCount, icon: Handshake },
        ].map((s) => (
          <motion.div
            key={s.label}
            className="glass rounded-xl px-4 py-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-xs text-muted">
              <s.icon className="h-3.5 w-3.5 text-accent" />
              {s.label}
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{s.value.toLocaleString('de-DE')}</p>
          </motion.div>
        ))}
      </div>

      {/* ====== SCRAPER CONTROL ====== */}
      <motion.div
        className="glass glow-accent rounded-2xl p-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto flex items-center gap-2">
            <RefreshCw className={cn('h-5 w-5 text-accent', (isPropertyScraping || isBuyerScraping) && 'animate-spin')} />
            <span className="text-sm font-semibold text-foreground">Scraper</span>
          </div>

          <ScraperButton
            label="Property-Scraper starten"
            loading={isPropertyScraping}
            lastRun={lastPropertyScrape}
            onClick={startPropertyScraper}
          />
          <ScraperButton
            label="Buyer-Scraper starten"
            loading={isBuyerScraping}
            lastRun={lastBuyerScrape}
            onClick={startBuyerScraper}
          />
          <button
            onClick={startBothScrapers}
            disabled={isPropertyScraping || isBuyerScraping}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
              isPropertyScraping || isBuyerScraping
                ? 'bg-surface-light/40 text-muted cursor-not-allowed'
                : 'bg-accent text-background hover:bg-accent-glow glow-accent'
            )}
          >
            {(isPropertyScraping || isBuyerScraping) && <Loader2 className="h-4 w-4 animate-spin" />}
            Beide starten
          </button>
        </div>

        <AnimatePresence>
          {(isPropertyScraping || isBuyerScraping) && (
            <motion.div
              className="mt-3 h-1 overflow-hidden rounded-full bg-surface-light/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-full rounded-full bg-accent/70"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                style={{ width: '40%' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ====== FILTER BAR ====== */}
      <motion.div
        className="glass flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SlidersHorizontal className="h-4 w-4 text-accent" />

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted" />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as typeof filters.sortBy })}
            className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-accent/50 focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Stadt..."
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setFilters({ city: e.target.value || undefined });
            }}
            className="w-32 rounded-lg border border-border bg-surface py-1.5 pl-8 pr-2 text-xs text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none"
          />
        </div>

        {/* Min Score */}
        <select
          value={filters.minScore ?? ''}
          onChange={(e) => setFilters({ minScore: e.target.value ? Number(e.target.value) : undefined })}
          className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-accent/50 focus:outline-none"
        >
          <option value="">Min Score</option>
          <option value="30">≥ 30</option>
          <option value="50">≥ 50</option>
          <option value="70">≥ 70</option>
          <option value="85">≥ 85</option>
        </select>

        {/* Type */}
        <div className="flex gap-1">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilters({ type: (t.value || undefined) as PropertyType | undefined })}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                (filters.type ?? '') === t.value
                  ? 'bg-accent/15 text-accent'
                  : 'text-muted hover:bg-surface-light/50 hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-muted">
          {filteredProperties.length} Objekte
        </span>
      </motion.div>

      {/* ====== MAIN TWO-COLUMN ====== */}
      {property ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[55fr_45fr]">
          {/* ---- LEFT: Property Detail ---- */}
          <motion.div
            key={property.id}
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Image Carousel */}
            <div className="glass relative overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] w-full">
                {images.length > 0 ? (
                  <Image
                    src={images[safeImgIdx]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface">
                    <Building2 className="h-16 w-16 text-muted/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Price overlay */}
                <div className="absolute bottom-4 left-4">
                  <p className="text-3xl font-extrabold text-white text-glow">{formatPrice(property.price)}</p>
                  <p className="mt-0.5 text-sm text-white/80">
                    <MapPin className="mr-1 inline h-3.5 w-3.5" />
                    {property.street}, {property.zip} {property.city}
                    {property.district ? ` – ${property.district}` : ''}
                  </p>
                </div>

                {/* Image nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((safeImgIdx - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 backdrop-blur-sm hover:bg-black/60 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx((safeImgIdx + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 backdrop-blur-sm hover:bg-black/60 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Source badge */}
                <div className="absolute right-3 top-3 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {property.source}
                </div>
              </div>

              {/* Image dots */}
              {images.length > 1 && (
                <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === safeImgIdx ? 'w-6 bg-accent' : 'w-1.5 bg-white/40'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Title & Key Facts */}
            <div className="glass rounded-2xl p-5">
              <h2 className="text-xl font-bold text-foreground">{property.title}</h2>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                <Fact icon={Maximize} label="Fläche" value={`${property.area} m²`} />
                <Fact icon={Bed} label="Zimmer" value={String(property.rooms)} />
                <Fact icon={Building2} label="Typ" value={typeLabel(property.type)} />
                {property.condition && <Fact icon={Shield} label="Zustand" value={property.condition} />}
                {property.energyRating && <Fact icon={Bolt} label="Energie" value={property.energyRating} />}
                {property.yearBuilt && <Fact icon={Calendar} label="Baujahr" value={String(property.yearBuilt)} />}
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {property.features.map((f) => (
                    <span key={f} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-muted">{property.description}</p>
            </div>

            {/* Contact */}
            <div className="glass rounded-2xl p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Kontakt / Eigentümer</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">{property.contactName}</span>
                <a href={`tel:${property.contactPhone}`} className="flex items-center gap-1.5 text-accent hover:text-accent-glow transition-colors">
                  <Phone className="h-3.5 w-3.5" />{property.contactPhone}
                </a>
                <a href={`mailto:${property.contactEmail}`} className="flex items-center gap-1.5 text-accent hover:text-accent-glow transition-colors">
                  <Mail className="h-3.5 w-3.5" />{property.contactEmail}
                </a>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                <Clock className="h-3 w-3" />
                Gescraped {timeAgo(property.scrapedAt)} · {property.source}
              </div>
            </div>

            {/* Property Navigation */}
            <div className="glass flex items-center justify-between rounded-xl px-4 py-2.5">
              <button
                onClick={() => handlePropertyNav(-1)}
                disabled={selectedPropertyIndex === 0}
                className="flex items-center gap-1 text-sm text-muted transition-colors enabled:hover:text-accent disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Vorherige
              </button>
              <span className="text-xs font-medium text-muted">
                {selectedPropertyIndex + 1} von {filteredProperties.length}
              </span>
              <button
                onClick={() => handlePropertyNav(1)}
                disabled={selectedPropertyIndex >= filteredProperties.length - 1}
                className="flex items-center gap-1 text-sm text-muted transition-colors enabled:hover:text-accent disabled:opacity-30"
              >
                Nächste <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick-jump thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filteredProperties.slice(0, 8).map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProperty(i); setImgIdx(0); }}
                  className={cn(
                    'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                    i === selectedPropertyIndex
                      ? 'border-accent glow-accent'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={p.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface"><Building2 className="h-5 w-5 text-muted/30" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-white">{formatPrice(p.price)}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ---- RIGHT: Buyer Matches ---- */}
          <div className="space-y-3">
            <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Zap className="h-5 w-5 text-accent" />
                Top Matches
              </h2>
              <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
                {propertyMatches.length} Treffer
              </span>
            </div>

            <div className="max-h-[calc(100vh-16rem)] space-y-3 overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {propertyMatches.map((match, idx) => {
                  const buyer = getBuyerById(match.buyerId);
                  if (!buyer) return null;
                  return (
                    <MatchCard
                      key={match.id}
                      match={match}
                      buyer={buyer}
                      index={idx}
                      noteOpen={noteOpen === match.id}
                      noteText={noteOpen === match.id ? noteText : ''}
                      onNoteTextChange={setNoteText}
                      onToggleNote={() => { setNoteOpen(noteOpen === match.id ? null : match.id); setNoteText(''); }}
                      onSubmitNote={() => handleNoteSubmit(match.id)}
                      actionOpen={actionOpen === match.id}
                      onToggleAction={() => setActionOpen(actionOpen === match.id ? null : match.id)}
                      onLogAction={(type, desc) => { logAction(match.id, type, desc); setActionOpen(null); }}
                      notesExpanded={expandedNotes.has(match.id)}
                      onToggleNotesExpanded={() => toggleExpanded(expandedNotes, setExpandedNotes, match.id)}
                      actionsExpanded={expandedActions.has(match.id)}
                      onToggleActionsExpanded={() => toggleExpanded(expandedActions, setExpandedActions, match.id)}
                      onToggleFavorite={() => toggleFavorite(match.id)}
                      onContactSeller={() => setContactModal({ matchId: match.id, mode: 'seller' })}
                      onContactBuyer={() => setContactModal({ matchId: match.id, mode: 'buyer' })}
                    />
                  );
                })}
              </AnimatePresence>

              {propertyMatches.length === 0 && (
                <div className="glass flex flex-col items-center gap-3 rounded-xl py-12 text-center">
                  <Search className="h-10 w-10 text-muted/30" />
                  <p className="text-sm text-muted">Keine Matches für dieses Objekt gefunden.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
          <Building2 className="h-12 w-12 text-muted/30" />
          <p className="text-muted">Keine Objekte vorhanden. Starten Sie den Scraper.</p>
        </div>
      )}

      {/* ====== CONTACT MODAL ====== */}
      <AnimatePresence>
        {contactModal && property && (
          <ContactModal
            mode={contactModal.mode}
            property={property}
            buyer={contactModalMatch ? getBuyerById(contactModalMatch.buyerId) : undefined}
            onClose={() => setContactModal(null)}
            onSend={(msg) => handleContactSend(contactModal.matchId, contactModal.mode, msg)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Smaller helper components (kept in same file for single-file requirement)
// ---------------------------------------------------------------------------

function Fact({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-light/30 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] text-muted">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ScraperButton({
  label,
  loading,
  lastRun,
  onClick,
}: {
  label: string;
  loading: boolean;
  lastRun: string | null;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
          loading
            ? 'bg-surface-light/40 text-muted cursor-not-allowed animate-pulse-glow'
            : 'border border-border bg-surface text-foreground hover:border-accent/40 hover:text-accent'
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? 'Scraping…' : label}
      </button>
      {lastRun && <span className="text-[10px] text-muted">{timeAgo(lastRun)}</span>}
    </div>
  );
}

function MatchCard({
  match,
  buyer,
  index,
  noteOpen,
  noteText,
  onNoteTextChange,
  onToggleNote,
  onSubmitNote,
  actionOpen,
  onToggleAction,
  onLogAction,
  notesExpanded,
  onToggleNotesExpanded,
  actionsExpanded,
  onToggleActionsExpanded,
  onToggleFavorite,
  onContactSeller,
  onContactBuyer,
}: {
  match: Match;
  buyer: MatchBuyer;
  index: number;
  noteOpen: boolean;
  noteText: string;
  onNoteTextChange: (v: string) => void;
  onToggleNote: () => void;
  onSubmitNote: () => void;
  actionOpen: boolean;
  onToggleAction: () => void;
  onLogAction: (type: MatchAction['type'], desc: string) => void;
  notesExpanded: boolean;
  onToggleNotesExpanded: () => void;
  actionsExpanded: boolean;
  onToggleActionsExpanded: () => void;
  onToggleFavorite: () => void;
  onContactSeller: () => void;
  onContactBuyer: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="glass rounded-2xl p-4"
    >
      {/* Header: Score + Buyer name + Favorite */}
      <div className="mb-3 flex items-start gap-3">
        <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-black', getScoreBg(match.score.total))}>
          {match.score.total}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-foreground">{buyer.name}</h3>
            {match.status !== 'new' && (
              <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                {match.status.replace(/_/g, ' ')}
              </span>
            )}
          </div>
          <p className="text-xs text-muted">
            {formatPrice(buyer.budgetMin)} – {formatPrice(buyer.budgetMax)}
          </p>
          <div className="mt-0.5 flex flex-wrap gap-1 text-[10px] text-muted">
            <span>{buyer.sizeMin}–{buyer.sizeMax} m²</span>
            <span>·</span>
            <span>{buyer.roomsMin}–{buyer.roomsMax} Zi.</span>
            <span>·</span>
            <span>{buyer.typePreferences.map(typeLabel).join(', ')}</span>
          </div>
        </div>
        <button
          onClick={onToggleFavorite}
          className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-surface-light"
        >
          <Star className={cn('h-5 w-5', match.isFavorite ? 'fill-accent text-accent' : 'text-muted/40')} />
        </button>
      </div>

      {/* Score breakdown */}
      <div className="mb-3 space-y-1">
        {(Object.keys(SCORE_LABELS) as (keyof typeof SCORE_LABELS)[]).map((key) => (
          <ScoreBar key={key} label={SCORE_LABELS[key]} value={match.score[key as keyof typeof match.score] as number} />
        ))}
      </div>

      {/* Location prefs + Features */}
      <div className="mb-3 flex flex-wrap gap-1">
        {buyer.locationPreferences.slice(0, 3).map((loc) => (
          <span key={loc} className="flex items-center gap-1 rounded-full bg-surface-light/50 px-2 py-0.5 text-[10px] text-muted">
            <MapPin className="h-2.5 w-2.5" />{loc}
          </span>
        ))}
        {buyer.features.slice(0, 4).map((f) => (
          <span key={f} className="rounded-full bg-accent/8 px-2 py-0.5 text-[10px] text-accent/80">{f}</span>
        ))}
      </div>

      {/* Match reasons */}
      {match.reasons.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {match.reasons.map((r) => (
            <span key={r} className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
              <CheckCircle2 className="h-3 w-3" />
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Contact */}
      <div className="mb-3 flex items-center gap-3 text-xs">
        <a href={`tel:${buyer.phone}`} className="flex items-center gap-1 text-accent hover:text-accent-glow transition-colors">
          <Phone className="h-3 w-3" />{buyer.phone}
        </a>
        <a href={`mailto:${buyer.email}`} className="flex items-center gap-1 text-accent hover:text-accent-glow transition-colors">
          <Mail className="h-3 w-3" />{buyer.email}
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={onContactSeller} className="flex items-center gap-1 rounded-lg bg-surface-light/40 px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent/15 hover:text-accent">
          <Phone className="h-3 w-3" /> Verkäufer
        </button>
        <button onClick={onContactBuyer} className="flex items-center gap-1 rounded-lg bg-surface-light/40 px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent/15 hover:text-accent">
          <Users className="h-3 w-3" /> Käufer
        </button>
        <button onClick={onToggleNote} className={cn(
          'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors',
          noteOpen ? 'bg-accent/15 text-accent' : 'bg-surface-light/40 text-foreground hover:bg-accent/15 hover:text-accent'
        )}>
          <StickyNote className="h-3 w-3" /> Notiz
        </button>
        <div className="relative">
          <button onClick={onToggleAction} className={cn(
            'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors',
            actionOpen ? 'bg-accent/15 text-accent' : 'bg-surface-light/40 text-foreground hover:bg-accent/15 hover:text-accent'
          )}>
            <Activity className="h-3 w-3" /> Aktion
          </button>
          <AnimatePresence>
            {actionOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full z-10 mt-1 w-52 rounded-xl border border-border bg-surface p-1 shadow-xl"
              >
                {ACTION_TYPES.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => onLogAction(a.value, a.label)}
                    className="w-full rounded-lg px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                  >
                    {a.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Inline note form */}
      <AnimatePresence>
        {noteOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Notiz eingeben…"
                value={noteText}
                onChange={(e) => onNoteTextChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmitNote()}
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none"
                autoFocus
              />
              <button
                onClick={onSubmitNote}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-background transition-all hover:bg-accent-glow"
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes list */}
      {match.notes.length > 0 && (
        <div className="mt-3 border-t border-border/50 pt-2">
          <button
            onClick={onToggleNotesExpanded}
            className="flex w-full items-center gap-1 text-[11px] font-medium text-muted hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-3 w-3" />
            {match.notes.length} Notiz{match.notes.length > 1 ? 'en' : ''}
            {notesExpanded ? <ChevronUp className="ml-auto h-3 w-3" /> : <ChevronDown className="ml-auto h-3 w-3" />}
          </button>
          <AnimatePresence>
            {notesExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-1.5 space-y-1">
                  {match.notes.map((n) => (
                    <div key={n.id} className="rounded-lg bg-surface-light/30 px-2.5 py-1.5">
                      <p className="text-xs text-foreground">{n.text}</p>
                      <p className="mt-0.5 text-[10px] text-muted">{timeAgo(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions timeline */}
      {match.actions.length > 0 && (
        <div className={cn('border-t border-border/50 pt-2', match.notes.length === 0 && 'mt-3')}>
          <button
            onClick={onToggleActionsExpanded}
            className="flex w-full items-center gap-1 text-[11px] font-medium text-muted hover:text-foreground transition-colors"
          >
            <Activity className="h-3 w-3" />
            {match.actions.length} Aktion{match.actions.length > 1 ? 'en' : ''}
            {actionsExpanded ? <ChevronUp className="ml-auto h-3 w-3" /> : <ChevronDown className="ml-auto h-3 w-3" />}
          </button>
          <AnimatePresence>
            {actionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-1.5 space-y-0.5">
                  {match.actions.map((a, ai) => (
                    <div key={a.id} className="flex items-start gap-2 py-1">
                      <div className="mt-1 flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        {ai < match.actions.length - 1 && <div className="h-full w-px bg-border" />}
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-foreground">{a.description}</p>
                        <p className="text-[10px] text-muted">{timeAgo(a.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
