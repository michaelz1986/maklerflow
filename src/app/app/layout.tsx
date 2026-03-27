'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radar,
  SearchCheck,
  Building2,
  Users,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/scraper', label: 'Lead-Scraper', icon: Radar },
  { href: '/app/buyer-finder', label: 'Käufer-Finder', icon: SearchCheck },
  { href: '/app/listings', label: 'Meine Objekte', icon: Building2 },
  { href: '/app/contacts', label: 'Kontakte', icon: Users },
  { href: '/app/settings', label: 'Einstellungen', icon: Settings },
];

const quickLinks = [
  { href: '/', label: 'Website ansehen' },
  { href: '/sell', label: 'Landingpage ansehen' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed top-0 left-0 z-40 flex h-screen w-[280px] flex-col border-r border-border bg-surface/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
            <Building2 className="h-4 w-4 text-accent" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-accent text-glow">Makler</span>
            <span className="text-foreground">Flow</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-accent/10 text-accent glow-accent'
                    : 'text-muted hover:bg-surface-light/50 hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors duration-200',
                    active ? 'text-accent' : 'text-muted group-hover:text-foreground'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted/60">
            Quick-Links
          </p>
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors duration-200 hover:bg-surface-light/50 hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4 shrink-0 text-muted/60 transition-colors group-hover:text-accent" />
              {link.label}
            </Link>
          ))}
        </div>
      </aside>

      <div className="ml-[280px] flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-xl">
          <div />
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Demo-Modus
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Max Mustermann</p>
                <p className="text-xs text-muted">Immobilienmakler</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent ring-2 ring-accent/30">
                MM
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
