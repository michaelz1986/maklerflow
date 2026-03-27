'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  TrendingUp,
  Volume2,
  Shield,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Home,
  Building2,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  BedDouble,
  Maximize,
} from 'lucide-react';
import { useStore } from '@/store';
import { formatPrice, getPropertyTypeLabel } from '@/lib/utils';

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-16 text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
      {subtitle && (
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{subtitle}</p>
      )}
    </div>
  );
}

/* ─── Navigation ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Objekte', id: 'objekte' },
    { label: 'Über uns', id: 'leistungen' },
    { label: 'Kontakt', id: 'kontakt' },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-accent text-glow">Makler</span>
          <span className="text-white">Flow</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleAnchor(e, link.id)}
              className="text-sm font-medium text-muted transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-accent/90 hover:shadow-[0_0_24px_rgba(16,185,129,0.3)]"
          >
            Immobilie verkaufen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white md:hidden"
          aria-label="Menü"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-t border-border px-6 pb-6 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleAnchor(e, link.id)}
              className="block py-3 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/sell"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background"
          >
            Immobilie verkaufen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  const handleScrollToListings = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('objekte')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { value: '150+', label: 'Verkaufte Objekte' },
    { value: '98%', label: 'Kundenzufriedenheit' },
    { value: 'Ø 12%', label: 'über Marktwert' },
  ];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          background: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="gradient-mesh absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-6 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Premium Immobilienvermittlung
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl"
        >
          Premium Immobilien
          <wbr />
          vermittlung{' '}
          <span className="text-accent text-glow">der neuen Generation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Wir verbinden lokale Expertise mit modernster Technologie, um Ihre Immobilie
          zum Bestpreis zu verkaufen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-background transition-all hover:bg-accent/90 hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]"
          >
            Immobilie verkaufen
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#objekte"
            onClick={handleScrollToListings}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-semibold text-white transition-all hover:border-accent/40 hover:bg-white/5"
          >
            Aktuelle Objekte
            <ChevronRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-border bg-background/60 backdrop-blur-md"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-8 py-6 text-center">
              <p className="text-3xl font-bold text-accent">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Listings ─── */
function ListingsSection() {
  const { listings } = useStore();
  const published = listings.filter(
    (l) => l.status === 'active' && l.publishWebsite === true,
  );

  return (
    <section id="objekte" className="relative py-24 lg:py-32">
      <div className="gradient-mesh absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Aktuelle Premium-Objekte"
            subtitle="Entdecken Sie unsere exklusiven Immobilienangebote in Top-Lagen."
          />
        </AnimatedSection>

        {published.length === 0 ? (
          <AnimatedSection delay={0.2}>
            <div className="glass rounded-2xl border border-border p-16 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted/50" />
              <p className="mt-4 text-lg text-muted">
                Aktuell keine Objekte verfügbar
              </p>
              <p className="mt-2 text-sm text-muted/70">
                Schauen Sie bald wieder vorbei – wir aktualisieren regelmäßig unser
                Portfolio.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((listing, i) => (
              <AnimatedSection key={listing.id} delay={i * 0.1}>
                <ListingCard listing={listing} />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ListingCard({ listing }: { listing: ReturnType<typeof useStore.getState>['listings'][number] }) {
  const imageUrl =
    listing.images[0] ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';

  return (
    <div className="group glass overflow-hidden rounded-2xl border border-border transition-all duration-500 hover:border-accent/40 hover:glow-accent">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 rounded-lg bg-accent/90 px-3 py-1 text-xs font-semibold text-background">
          {getPropertyTypeLabel(listing.type)}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold leading-snug text-white group-hover:text-accent transition-colors">
          {listing.title}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {listing.city}
        </div>

        <p className="mt-4 text-2xl font-bold text-accent">
          {formatPrice(listing.price)}
        </p>

        <div className="mt-4 flex items-center gap-6 border-t border-border pt-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            {listing.rooms} Zimmer
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4" />
            {listing.area} m²
          </span>
        </div>

        {listing.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {listing.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="rounded-md bg-surface-light/50 px-2.5 py-1 text-xs text-muted"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Services ─── */
function ServicesSection() {
  const services = [
    {
      icon: TrendingUp,
      title: 'Marktanalyse & Bewertung',
      description:
        'Präzise Wertermittlung durch KI-gestützte Marktanalyse und lokale Expertise.',
    },
    {
      icon: Volume2,
      title: 'Premium Vermarktung',
      description:
        'Professionelle Fotos, virtuelle Rundgänge und zielgerichtetes Marketing.',
    },
    {
      icon: Shield,
      title: 'Rundum-Service',
      description:
        'Von der Bewertung bis zum Notartermin – alles aus einer Hand.',
    },
  ];

  return (
    <section id="leistungen" className="relative border-t border-border py-24 lg:py-32">
      <div className="gradient-mesh absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Unsere Leistungen"
            subtitle="Wir bieten Ihnen einen ganzheitlichen Service rund um Ihre Immobilie."
          />
        </AnimatedSection>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.12}>
              <div className="glass group h-full rounded-2xl border border-border p-8 transition-all duration-500 hover:border-accent/30 hover:glow-accent">
                <div className="mb-6 inline-flex rounded-xl bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent/20">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Social Proof ─── */
function SocialProofSection() {
  const testimonials = [
    {
      quote:
        'MaklerFlow hat unsere Wohnung innerhalb von 3 Wochen über dem Angebotspreis verkauft. Die digitale Abwicklung war erstklassig!',
      name: 'Familie Schneider',
      location: 'München',
    },
    {
      quote:
        'Professioneller Service von Anfang bis Ende. Die Marktanalyse war beeindruckend genau und hat uns bei der Preisfindung sehr geholfen.',
      name: 'Thomas Richter',
      location: 'Hamburg',
    },
    {
      quote:
        'Endlich ein Makler, der modern arbeitet. Schnelle Kommunikation, transparenter Prozess und ein hervorragendes Ergebnis.',
      name: 'Anna & Jan Keller',
      location: 'Frankfurt',
    },
  ];

  const partners = ['Deutsche Bank', 'Commerzbank', 'Sparkasse', 'Notariat Dr. Meier'];

  return (
    <section className="relative border-t border-border py-24 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Was unsere Kunden sagen"
            subtitle="Vertrauen basiert auf Ergebnissen. Lesen Sie, was unsere Kunden über die Zusammenarbeit berichten."
          />
        </AnimatedSection>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.12}>
              <div className="glass flex h-full flex-col rounded-2xl border border-border p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className="h-5 w-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <blockquote className="flex-1 leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {t.location}
                    <span className="mx-1 text-border">·</span>
                    <span className="inline-flex items-center gap-1 text-accent/80">
                      <ExternalLink className="h-3 w-3" />
                      Verifiziert über Google
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="mt-24 text-center">
            <p className="mb-8 text-sm font-medium uppercase tracking-widest text-muted">
              Unsere Partner
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {partners.map((name) => (
                <span
                  key={name}
                  className="rounded-lg border border-border bg-surface/50 px-6 py-3 text-sm font-medium text-muted/80 transition-colors hover:border-border-accent hover:text-muted"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  return (
    <section className="relative border-t border-border py-24 lg:py-32">
      <div className="gradient-mesh absolute inset-0" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Bereit, Ihre Immobilie{' '}
            <span className="text-accent text-glow">bestmöglich zu verkaufen?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Starten Sie jetzt mit einer kostenlosen Marktanalyse und erfahren Sie, was
            Ihre Immobilie wert ist.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-background transition-all hover:bg-accent/90 hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]"
            >
              Kostenlose Bewertung erhalten
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="tel:+4989123456"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-semibold text-white transition-all hover:border-accent/40 hover:bg-white/5"
            >
              <Phone className="h-5 w-5" />
              +49 89 123 456
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer id="kontakt" className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-accent">Makler</span>
              <span className="text-white">Flow</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Ihr Partner für moderne Immobilienvermittlung. Wir kombinieren
              Technologie mit persönlicher Beratung für bestmögliche Ergebnisse.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Aktuelle Objekte', href: '#objekte' },
                { label: 'Unsere Leistungen', href: '#leistungen' },
                { label: 'Immobilie verkaufen', href: '/sell' },
                { label: 'Kontakt', href: '#kontakt' },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Leopoldstraße 42, 80802 München
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+4989123456" className="hover:text-accent transition-colors">
                  +49 89 123 456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:info@maklerflow.de" className="hover:text-accent transition-colors">
                  info@maklerflow.de
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
              Rechtliches
            </h4>
            <ul className="space-y-3">
              {['Impressum', 'Datenschutz', 'AGB'].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              {['LinkedIn', 'Instagram', 'X'].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-xs font-medium text-muted transition-all hover:border-accent/40 hover:text-accent"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © 2026 MaklerFlow. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-muted/50">
            Crafted with precision in Munich
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ListingsSection />
        <ServicesSection />
        <SocialProofSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
