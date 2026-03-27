'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MapPin,
  Bed,
  Maximize,
  X,
  Globe,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store';
import {
  formatPrice,
  getStatusLabel,
  getStatusColor,
  getPropertyTypeLabel,
  cn,
} from '@/lib/utils';
import type { Listing } from '@/lib/types';

type FilterTab = 'all' | 'active' | 'draft' | 'sold';

const tabs: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'active', label: 'Aktiv' },
  { value: 'draft', label: 'Entwurf' },
  { value: 'sold', label: 'Verkauft' },
];

export default function ListingsPage() {
  const { listings, updateListing } = useStore();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const filtered =
    filter === 'all' ? listings : listings.filter((l) => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meine Objekte</h1>
          <p className="mt-1 text-muted">{listings.length} Objekte gesamt</p>
        </div>
        <Link
          href="/app/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-all duration-200 hover:bg-accent-glow hover:scale-[1.02] glow-accent"
        >
          <Plus className="h-4 w-4" />
          Neues Objekt
        </Link>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
              filter === tab.value
                ? 'bg-accent/10 text-accent'
                : 'text-muted hover:bg-surface-light/50 hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((listing, i) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            onClick={() => setSelectedListing(listing)}
            className="glass group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:glow-accent hover:border-border-accent"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={listing.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'}
                alt={listing.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              <span
                className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(listing.status)}`}
              >
                {getStatusLabel(listing.status)}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                {listing.title}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {listing.city}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.rooms > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-surface-light/60 px-2 py-1 text-xs text-muted">
                    <Bed className="h-3 w-3" /> {listing.rooms} Zi.
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-light/60 px-2 py-1 text-xs text-muted">
                  <Maximize className="h-3 w-3" /> {listing.area} m²
                </span>
                <span className="rounded-md bg-surface-light/60 px-2 py-1 text-xs text-muted">
                  {getPropertyTypeLabel(listing.type)}
                </span>
              </div>
              <p className="mt-4 text-lg font-bold text-accent">
                {formatPrice(listing.price)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedListing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6"
            >
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-light hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative mb-6 h-56 overflow-hidden rounded-xl">
                <Image
                  src={selectedListing.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'}
                  alt={selectedListing.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">
                {selectedListing.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {selectedListing.address}, {selectedListing.zip} {selectedListing.city}
              </p>
              <p className="mt-2 text-2xl font-bold text-accent">
                {formatPrice(selectedListing.price)}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {selectedListing.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedListing.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  Veröffentlichung
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      key: 'publishWebsite' as const,
                      label: 'Auf Website',
                      icon: Globe,
                    },
                    {
                      key: 'publishImmoScout' as const,
                      label: 'ImmoScout24',
                      icon: Building2,
                    },
                    {
                      key: 'publishImmowelt' as const,
                      label: 'Immowelt',
                      icon: Building2,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted" />
                          <span className="text-sm text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            updateListing(selectedListing.id, {
                              [item.key]: !selectedListing[item.key],
                            })
                          }
                          className={cn(
                            'relative h-6 w-11 rounded-full transition-colors duration-200',
                            selectedListing[item.key]
                              ? 'bg-accent'
                              : 'bg-surface-light'
                          )}
                        >
                          <span
                            className={cn(
                              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200',
                              selectedListing[item.key] && 'translate-x-5'
                            )}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
