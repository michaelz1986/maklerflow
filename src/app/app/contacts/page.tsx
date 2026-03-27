'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { useStore } from '@/store';
import {
  formatDate,
  getStatusLabel,
  getStatusColor,
  getPropertyTypeLabel,
  cn,
} from '@/lib/utils';
import type { Lead } from '@/lib/types';

type SourceFilter = 'all' | 'landing_page' | 'scraper' | 'manual';
type StatusFilter = 'all' | 'new' | 'contacted' | 'qualified';

const sourceFilters: { value: SourceFilter; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'landing_page', label: 'Landingpage' },
  { value: 'scraper', label: 'Scraper' },
  { value: 'manual', label: 'Manuell' },
];

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'new', label: 'Neu' },
  { value: 'contacted', label: 'Kontaktiert' },
  { value: 'qualified', label: 'Qualifiziert' },
];

const sourceLabels: Record<string, string> = {
  landing_page: 'Landingpage',
  scraper: 'Scraper',
  manual: 'Manuell',
};

const statusOptions: Lead['status'][] = ['new', 'contacted', 'qualified', 'lost'];

export default function ContactsPage() {
  const { leads, updateLead } = useStore();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = leads.filter((lead) => {
    if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kontakte &amp; Leads</h1>
        <p className="mt-1 text-muted">{leads.length} Kontakte gesamt</p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted/60">
            Quelle
          </span>
          <div className="flex gap-1">
            {sourceFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setSourceFilter(f.value)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  sourceFilter === f.value
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:bg-surface-light/50 hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted/60">
            Status
          </span>
          <div className="flex gap-1">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  statusFilter === f.value
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:bg-surface-light/50 hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-xl">
        <div className="hidden items-center gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60 md:grid md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.5fr]">
          <span>Name</span>
          <span>Kontakt</span>
          <span>Quelle</span>
          <span>Status</span>
          <span>Objekttyp</span>
          <span>Datum</span>
        </div>

        <div className="divide-y divide-border">
          {filtered.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <div
                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                className="group cursor-pointer px-6 py-4 transition-colors hover:bg-surface-light/30"
              >
                <div className="grid items-center gap-4 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.5fr]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {lead.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted md:hidden">{lead.email}</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm text-foreground">{lead.email}</p>
                    <p className="text-xs text-muted">{lead.phone}</p>
                  </div>
                  <span className="hidden rounded-full bg-surface-light px-2.5 py-0.5 text-center text-xs text-muted md:inline-block">
                    {sourceLabels[lead.source] || lead.source}
                  </span>
                  <div className="hidden md:block">
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateLead(lead.id, { status: e.target.value as Lead['status'] });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium outline-none cursor-pointer ${getStatusColor(lead.status)}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-surface text-foreground">
                          {getStatusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="hidden text-sm text-muted md:block">
                    {lead.propertyType ? getPropertyTypeLabel(lead.propertyType) : '–'}
                  </span>
                  <div className="hidden items-center gap-2 md:flex">
                    <span className="text-xs text-muted">{formatDate(lead.createdAt)}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-muted transition-transform duration-200',
                        expandedId === lead.id && 'rotate-180'
                      )}
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === lead.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/50 bg-surface/30 px-6 py-5">
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted/60">
                            Kontaktdaten
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Mail className="h-3.5 w-3.5 text-muted" />
                              {lead.email || '–'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Phone className="h-3.5 w-3.5 text-muted" />
                              {lead.phone || '–'}
                            </div>
                            {lead.location && (
                              <div className="flex items-center gap-2 text-sm text-foreground">
                                <MapPin className="h-3.5 w-3.5 text-muted" />
                                {lead.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted/60">
                            Details
                          </h4>
                          <div className="space-y-1 text-sm text-muted">
                            {lead.propertyType && (
                              <p>
                                Typ: <span className="text-foreground">{getPropertyTypeLabel(lead.propertyType)}</span>
                              </p>
                            )}
                            {lead.area && (
                              <p>
                                Fläche: <span className="text-foreground">{lead.area} m²</span>
                              </p>
                            )}
                            {lead.estimatedValue && (
                              <p>
                                Geschätzter Wert:{' '}
                                <span className="text-foreground">
                                  {new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    maximumFractionDigits: 0,
                                  }).format(lead.estimatedValue)}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted/60">
                            Notizen
                          </h4>
                          <p className="text-sm text-muted">
                            {lead.notes || 'Keine Notizen vorhanden.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-muted">
              Keine Kontakte mit diesen Filtern gefunden.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
