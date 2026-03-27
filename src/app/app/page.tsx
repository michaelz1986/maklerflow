'use client';

import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Percent } from 'lucide-react';
import { useStore } from '@/store';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function DashboardPage() {
  const { listings, leads } = useStore();

  const activeListings = listings.filter((l) => l.status === 'active');
  const newLeads = leads.filter((l) => l.status === 'new');
  const totalPortfolio = activeListings.reduce((sum, l) => sum + l.price, 0);

  const stats = [
    { label: 'Aktive Objekte', value: String(activeListings.length), icon: Building2 },
    { label: 'Neue Leads', value: String(newLeads.length), icon: Users },
    { label: 'Gesamtwert Portfolio', value: formatPrice(totalPortfolio), icon: TrendingUp },
    { label: 'Conversion Rate', value: '23%', icon: Percent },
  ];

  const recentLeads = leads.slice(0, 3);
  const recentListings = listings.slice(0, 3);

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <h1 className="text-3xl font-bold text-foreground">Willkommen zurück</h1>
        <p className="mt-1 text-muted">Hier ist dein Überblick für heute.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="glass rounded-xl p-5 transition-shadow duration-300 hover:glow-accent"
              initial="hidden"
              animate="visible"
              custom={i + 1}
              variants={fadeUp}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          className="glass rounded-xl p-6"
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Neueste Leads</h2>
            <Link
              href="/app/contacts"
              className="text-sm text-accent transition-colors hover:text-accent-glow"
            >
              Alle ansehen
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-4 transition-colors hover:border-border-accent"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {lead.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}
                  >
                    {getStatusLabel(lead.status)}
                  </span>
                  <span className="text-xs text-muted">{formatDate(lead.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass rounded-xl p-6"
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeUp}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Neueste Objekte</h2>
            <Link
              href="/app/listings"
              className="text-sm text-accent transition-colors hover:text-accent-glow"
            >
              Alle ansehen
            </Link>
          </div>
          <div className="space-y-3">
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-4 transition-colors hover:border-border-accent"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{listing.title}</p>
                  <p className="text-xs text-muted">
                    {listing.city} &middot; {listing.rooms > 0 ? `${listing.rooms} Zi.` : 'Grundstück'} &middot;{' '}
                    {listing.area} m²
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(listing.status)}`}
                  >
                    {getStatusLabel(listing.status)}
                  </span>
                  <span className="text-sm font-semibold text-accent">{formatPrice(listing.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
