'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Plug, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const integrations = [
  { name: 'ImmoScout24', connected: true, logo: 'IS24' },
  { name: 'Immowelt', connected: false, logo: 'IW' },
  { name: 'Ebay Kleinanzeigen', connected: true, logo: 'eBK' },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newLead: true,
    scanComplete: true,
    listingViews: false,
    weeklyReport: true,
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Einstellungen</h1>
        <p className="mt-1 text-muted">Verwalte dein Profil und Integrationen</p>
      </div>

      <motion.div
        className="glass rounded-xl p-6"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <User className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Profil</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">Name</label>
            <input
              type="text"
              defaultValue="Max Mustermann"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">E-Mail</label>
            <input
              type="email"
              defaultValue="max@maklerflow.de"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-muted">Unternehmen</label>
            <input
              type="text"
              defaultValue="MaklerFlow Immobilien GmbH"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="rounded-lg bg-accent/10 px-5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20">
            Speichern
          </button>
        </div>
      </motion.div>

      <motion.div
        className="glass rounded-xl p-6"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Benachrichtigungen</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'newLead' as const, label: 'Neuer Lead eingegangen', desc: 'Benachrichtigung bei neuen Kontaktanfragen' },
            { key: 'scanComplete' as const, label: 'Scan abgeschlossen', desc: 'Wenn der Marktscanner neue Ergebnisse hat' },
            { key: 'listingViews' as const, label: 'Objekt-Aufrufe', desc: 'Tägliche Zusammenfassung der Seitenaufrufe' },
            { key: 'weeklyReport' as const, label: 'Wochenbericht', desc: 'Wöchentlicher Performance-Report per E-Mail' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(item.key)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors duration-200',
                  notifications[item.key] ? 'bg-accent' : 'bg-surface-light'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200',
                    notifications[item.key] && 'translate-x-5'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="glass rounded-xl p-6"
        initial="hidden"
        animate="visible"
        custom={2}
        variants={fadeUp}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <Plug className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Integrationen</h2>
        </div>
        <div className="space-y-3">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-light text-xs font-bold text-muted">
                  {item.logo}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <div className="flex items-center gap-1.5">
                    {item.connected ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs text-accent">Verbunden</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-muted" />
                        <span className="text-xs text-muted">Nicht verbunden</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                className={cn(
                  'rounded-lg px-4 py-2 text-xs font-medium transition-colors',
                  item.connected
                    ? 'border border-border text-muted hover:border-danger hover:text-danger'
                    : 'bg-accent/10 text-accent hover:bg-accent/20'
                )}
              >
                {item.connected ? 'Trennen' : 'Verbinden'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
