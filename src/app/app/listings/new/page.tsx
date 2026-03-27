'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Building2,
  TreePine,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Upload,
  Check,
  Globe,
  X,
} from 'lucide-react';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';

const STEPS = [
  'Basisinformationen',
  'Details',
  'Beschreibung',
  'Bilder',
  'Veröffentlichung',
];

const propertyTypes = [
  { value: 'house' as const, label: 'Haus', icon: Home },
  { value: 'apartment' as const, label: 'Wohnung', icon: Building2 },
  { value: 'land' as const, label: 'Grundstück', icon: TreePine },
];

const sampleDescription = `Dieses einzigartige Objekt besticht durch seine hervorragende Lage und hochwertige Ausstattung. Große, lichtdurchflutete Räume, moderne Materialien und durchdachte Grundrisse sorgen für höchsten Wohnkomfort.

Die Immobilie verfügt über eine zeitgemäße Energieeffizienz und bietet zahlreiche Extras wie Fußbodenheizung, elektrische Rollläden und eine Einbauküche der Premiumklasse.

Überzeugen Sie sich selbst von dieser attraktiven Immobilie – Besichtigungstermine nach Vereinbarung.`;

const placeholderImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
];

export default function NewListingPage() {
  const router = useRouter();
  const { addListing } = useStore();
  const [step, setStep] = useState(0);
  const [[direction], setDirection] = useState([0]);

  const [form, setForm] = useState({
    title: '',
    type: 'apartment' as 'house' | 'apartment' | 'land',
    price: '',
    rooms: '',
    area: '',
    address: '',
    city: '',
    zip: '',
    features: [] as string[],
    featureInput: '',
    description: '',
    images: placeholderImages,
    publishWebsite: true,
    publishImmoScout: false,
    publishImmowelt: false,
  });

  const updateForm = useCallback(
    (updates: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...updates })),
    []
  );

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setDirection([1]);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection([-1]);
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    addListing({
      title: form.title || 'Neues Objekt',
      type: form.type,
      price: Number(form.price) || 0,
      rooms: Number(form.rooms) || 0,
      area: Number(form.area) || 0,
      address: form.address,
      city: form.city,
      zip: form.zip,
      description: form.description,
      images: form.images,
      features: form.features,
      status: 'draft',
      publishWebsite: form.publishWebsite,
      publishImmoScout: form.publishImmoScout,
      publishImmowelt: form.publishImmowelt,
    });
    router.push('/app/listings');
  };

  const addFeature = () => {
    const tag = form.featureInput.trim();
    if (tag && !form.features.includes(tag)) {
      updateForm({
        features: [...form.features, tag],
        featureInput: '',
      });
    }
  };

  const removeFeature = (f: string) => {
    updateForm({ features: form.features.filter((x) => x !== f) });
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Neues Objekt</h1>
        <p className="mt-1 text-muted">Erstelle ein neues Immobilienangebot</p>
      </div>

      {/* Progress bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
                  i < step
                    ? 'bg-accent text-background'
                    : i === step
                      ? 'bg-accent/20 text-accent ring-2 ring-accent/40'
                      : 'bg-surface-light text-muted'
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:inline',
                  i === step ? 'text-accent' : 'text-muted'
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 hidden h-px w-8 sm:block lg:w-12',
                    i < step ? 'bg-accent' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="glass relative min-h-[360px] overflow-hidden rounded-2xl p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    placeholder="z.B. Moderne Stadtvilla mit Parkblick"
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Objekttyp
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {propertyTypes.map((pt) => {
                      const Icon = pt.icon;
                      return (
                        <button
                          key={pt.value}
                          onClick={() => updateForm({ type: pt.value })}
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-200',
                            form.type === pt.value
                              ? 'border-accent bg-accent/10 text-accent glow-accent'
                              : 'border-border bg-surface text-muted hover:border-border-accent hover:text-foreground'
                          )}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{pt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Preis (€)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateForm({ price: e.target.value })}
                    placeholder="z.B. 450000"
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Zimmer
                    </label>
                    <input
                      type="number"
                      value={form.rooms}
                      onChange={(e) => updateForm({ rooms: e.target.value })}
                      placeholder="z.B. 4"
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Fläche (m²)
                    </label>
                    <input
                      type="number"
                      value={form.area}
                      onChange={(e) => updateForm({ area: e.target.value })}
                      placeholder="z.B. 120"
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Straße & Nr.
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateForm({ address: e.target.value })}
                    placeholder="z.B. Musterstraße 12"
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Stadt
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateForm({ city: e.target.value })}
                      placeholder="z.B. München"
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      PLZ
                    </label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={(e) => updateForm({ zip: e.target.value })}
                      placeholder="z.B. 80331"
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Ausstattung
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.featureInput}
                      onChange={(e) => updateForm({ featureInput: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Feature eingeben & Enter drücken"
                      className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent"
                    />
                    <button
                      onClick={addFeature}
                      className="rounded-lg border border-border px-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      +
                    </button>
                  </div>
                  {form.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.features.map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                        >
                          {f}
                          <button onClick={() => removeFeature(f)} className="ml-0.5 hover:text-danger">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Beschreibung
                  </label>
                  <button
                    onClick={() => updateForm({ description: sampleDescription })}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    KI-Text generieren
                  </button>
                </div>
                <textarea
                  rows={10}
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Beschreiben Sie das Objekt..."
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent resize-none"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">Bilder</label>
                <div className="grid grid-cols-3 gap-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                      <img src={img} alt={`Bild ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/50 p-10 transition-colors hover:border-accent/40">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted/50" />
                    <p className="mt-2 text-sm text-muted">
                      Bilder hierher ziehen oder klicken zum Hochladen
                    </p>
                    <p className="mt-1 text-xs text-muted/50">
                      JPG, PNG bis 10 MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <p className="text-sm text-muted">
                  Wähle, wo das Objekt veröffentlicht werden soll.
                </p>
                {[
                  { key: 'publishWebsite' as const, label: 'Auf Website veröffentlichen', desc: 'maklerflow.de', icon: Globe },
                  { key: 'publishImmoScout' as const, label: 'ImmoScout24', desc: 'immobilienscout24.de', icon: Building2 },
                  { key: 'publishImmowelt' as const, label: 'Immowelt', desc: 'immowelt.de', icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  const checked = form[item.key];
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-xl border border-border bg-surface/50 p-5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateForm({ [item.key]: !checked } as Partial<typeof form>)}
                        className={cn(
                          'relative h-6 w-11 rounded-full transition-colors duration-200',
                          checked ? 'bg-accent' : 'bg-surface-light'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200',
                            checked && 'translate-x-5'
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={step === 0}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200',
            step === 0
              ? 'cursor-not-allowed text-muted/30'
              : 'text-muted hover:bg-surface-light hover:text-foreground'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Zurück
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-all duration-200 hover:bg-accent-glow hover:scale-[1.02]"
          >
            Weiter
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-all duration-200 glow-accent-strong hover:bg-accent-glow hover:scale-[1.02]"
          >
            <Check className="h-4 w-4" />
            Objekt erstellen
          </button>
        )}
      </div>
    </div>
  );
}
