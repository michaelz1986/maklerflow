'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import {
  formatPrice,
  getScoreBg,
  getPropertyTypeLabel,
} from '@/lib/utils';

const portals = [
  'Ebay Kleinanzeigen',
  'ImmoScout24',
  'Immowelt',
  'WG-Gesucht',
  'Privates Netzwerk',
  'Öffentliche Register',
];

export default function ScraperPage() {
  const { scrapedLeads, isScanning, scanComplete, startScan, convertScrapedLead } =
    useStore();
  const [portalIndex, setPortalIndex] = useState(0);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setPortalIndex((prev) => (prev + 1) % portals.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lead-Scraper</h1>
        <p className="mt-1 text-muted">KI-gestützter Marktscanner</p>
      </div>

      <div className="glass rounded-2xl p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${
                isScanning
                  ? 'border-accent animate-pulse-glow'
                  : scanComplete
                    ? 'border-accent/50'
                    : 'border-border'
              } bg-surface transition-all duration-500`}
            >
              {isScanning && (
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-0 animate-radar rounded-full border-t-2 border-accent/60" />
                </div>
              )}
              <Radar
                className={`h-10 w-10 transition-colors duration-300 ${
                  isScanning ? 'text-accent text-glow' : 'text-muted'
                }`}
              />
            </div>
          </div>

          {!isScanning && !scanComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="mb-6 max-w-md text-sm text-muted">
                Der KI-Scanner durchsucht automatisch alle relevanten Immobilienportale und identifiziert
                potenzielle Verkäufer in deinem Gebiet.
              </p>
              <button
                onClick={startScan}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-accent-glow glow-accent-strong hover:scale-[1.02]"
              >
                <Zap className="h-4 w-4" />
                Markt scannen
              </button>
            </motion.div>
          )}

          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg"
            >
              <p className="mb-2 text-sm font-medium text-accent text-glow">
                Durchsuche Portale...
              </p>
              <p className="mb-6 text-sm text-muted">
                {portals[portalIndex]}
              </p>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-16 rounded-lg bg-surface-light/50"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {scanComplete && !isScanning && scrapedLeads.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Alle Leads wurden qualifiziert!
                </p>
              </div>
              <button
                onClick={startScan}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Erneut scannen
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {scanComplete && scrapedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Ergebnisse ({scrapedLeads.length})
              </h2>
              <span className="text-xs text-muted">
                Klicke &quot;Lead qualifizieren&quot; um den Kontakt ins CRM zu übernehmen
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {scrapedLeads.map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="glass group flex flex-col gap-4 rounded-xl p-5 transition-all duration-300 hover:border-border-accent sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm text-foreground">
                          {lead.address}
                        </span>
                        <span className="rounded-full bg-surface-light px-2 py-0.5 text-xs text-muted">
                          {lead.source}
                        </span>
                        <span className="rounded-full bg-surface-light px-2 py-0.5 text-xs text-muted">
                          {getPropertyTypeLabel(lead.propertyType)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                        <span>
                          Wert:{' '}
                          <span className="font-semibold text-foreground">
                            {formatPrice(lead.estimatedValue)}
                          </span>
                        </span>
                        {lead.rooms && <span>{lead.rooms} Zimmer</span>}
                        {lead.area && <span>{lead.area} m²</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getScoreBg(lead.sellProbability)}`}
                      >
                        {lead.sellProbability}%
                      </span>
                      <button
                        onClick={() => convertScrapedLead(lead.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent hover:text-background"
                      >
                        Lead qualifizieren
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
