'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Building2,
  Trees,
  MapPin,
  ArrowRight,
  Check,
  Shield,
  Star,
  Lock,
} from 'lucide-react';
import { useStore } from '@/store';

type PropertyType = 'house' | 'apartment' | 'land';

interface FormData {
  propertyType: PropertyType | null;
  location: string;
  area: number | null;
  name: string;
  email: string;
  phone: string;
}

const INITIAL_FORM: FormData = {
  propertyType: null,
  location: '',
  area: null,
  name: '',
  email: '',
  phone: '',
};

const STEP_LABELS = ['Immobilientyp', 'Standort', 'Wohnfläche', 'Kontakt'];

const AREA_PRESETS = [50, 80, 120, 180, 250];

const PROPERTY_OPTIONS: { type: PropertyType; label: string; icon: typeof Home }[] = [
  { type: 'house', label: 'Haus', icon: Home },
  { type: 'apartment', label: 'Wohnung', icon: Building2 },
  { type: 'land', label: 'Grundstück', icon: Trees },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const staggerContainer = {
  center: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const staggerItem = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const addLead = useStore((s) => s.addLead);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > step ? 1 : -1);
      setStep(next);
    },
    [step],
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) return;

    addLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'landing_page',
      status: 'new',
      propertyType: formData.propertyType ?? undefined,
      location: formData.location || undefined,
      area: formData.area ?? undefined,
    });

    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background gradient-mesh">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-lg font-bold tracking-tight text-foreground">
            Makler<span className="text-accent">Flow</span>
          </span>
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          {submitted ? (
            <SuccessScreen name={formData.name} />
          ) : (
            <motion.div
              key="form-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-1 flex-col"
            >
              {/* Hero headline (visible on step 0 only, fades out otherwise) */}
              <AnimatePresence>
                {step === 0 && (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                  >
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                      Erfahren Sie in 2 Minuten,{' '}
                      <span className="text-accent text-glow">
                        was Ihre Immobilie heute wert ist.
                      </span>
                    </h1>
                    <p className="mt-4 text-lg text-muted">
                      Kostenlos. Unverbindlich. In nur 4 Schritten.
                    </p>

                    {/* Trust badges */}
                    <div className="mt-6 flex flex-wrap gap-4">
                      <TrustBadge icon={Star} text="Über 150 Bewertungen" delay={0.3} />
                      <TrustBadge icon={Shield} text="100% Kostenlos" delay={0.4} />
                      <TrustBadge icon={Lock} text="Daten geschützt" delay={0.5} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress bar */}
              <ProgressBar currentStep={step} />

              {/* Step content */}
              <div className="relative mt-8 flex-1">
                <AnimatePresence mode="wait" custom={direction}>
                  {step === 0 && (
                    <StepPropertyType
                      key="step-0"
                      direction={direction}
                      selected={formData.propertyType}
                      onSelect={(type) => {
                        setFormData((f) => ({ ...f, propertyType: type }));
                        setTimeout(() => goTo(1), 250);
                      }}
                    />
                  )}
                  {step === 1 && (
                    <StepLocation
                      key="step-1"
                      direction={direction}
                      value={formData.location}
                      onChange={(v) => setFormData((f) => ({ ...f, location: v }))}
                      onNext={() => goTo(2)}
                      onBack={() => goTo(0)}
                    />
                  )}
                  {step === 2 && (
                    <StepArea
                      key="step-2"
                      direction={direction}
                      value={formData.area}
                      onChange={(v) => setFormData((f) => ({ ...f, area: v }))}
                      onNext={() => goTo(3)}
                      onBack={() => goTo(1)}
                    />
                  )}
                  {step === 3 && (
                    <StepContact
                      key="step-3"
                      direction={direction}
                      formData={formData}
                      onChange={(field, value) =>
                        setFormData((f) => ({ ...f, [field]: value }))
                      }
                      onSubmit={handleSubmit}
                      onBack={() => goTo(2)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-muted"
              >
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-accent" />
                  Bereits über 500 Bewertungen
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-accent" />
                  TÜV-geprüfter Datenschutz
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-accent" />
                  4.9 / 5 Sterne
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function TrustBadge({
  icon: Icon,
  text,
  delay,
}: {
  icon: typeof Star;
  text: string;
  delay: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-xs text-muted"
    >
      <Icon className="h-3.5 w-3.5 text-accent" />
      {text}
    </motion.span>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-light/50">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: i <= currentStep ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>
          <span
            className={`hidden text-[10px] sm:block ${
              i <= currentStep ? 'text-accent' : 'text-muted/50'
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Step 1: Property Type ---------- */

function StepPropertyType({
  direction,
  selected,
  onSelect,
}: {
  direction: number;
  selected: PropertyType | null;
  onSelect: (t: PropertyType) => void;
}) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <motion.div variants={staggerContainer} initial="enter" animate="center">
        <motion.p
          variants={staggerItem}
          className="mb-6 text-xl font-semibold text-foreground sm:text-2xl"
        >
          Was möchten Sie bewerten lassen?
        </motion.p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PROPERTY_OPTIONS.map(({ type, label, icon: Icon }) => (
            <motion.button
              key={type}
              variants={staggerItem}
              onClick={() => onSelect(type)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`glass group flex flex-col items-center gap-3 rounded-2xl p-8 transition-shadow ${
                selected === type
                  ? 'glow-accent-strong border-accent/40'
                  : 'hover:glow-accent hover:border-accent/20'
              }`}
            >
              <Icon
                className={`h-10 w-10 transition-colors ${
                  selected === type
                    ? 'text-accent'
                    : 'text-muted group-hover:text-accent'
                }`}
              />
              <span className="text-base font-medium text-foreground">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Step 2: Location ---------- */

function StepLocation({
  direction,
  value,
  onChange,
  onNext,
  onBack,
}: {
  direction: number;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <motion.div variants={staggerContainer} initial="enter" animate="center">
        <motion.p
          variants={staggerItem}
          className="mb-6 text-xl font-semibold text-foreground sm:text-2xl"
        >
          Wo befindet sich Ihre Immobilie?
        </motion.p>

        <motion.div variants={staggerItem} className="relative">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="PLZ oder Ort eingeben…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && value.trim() && onNext()}
            autoFocus
            className="w-full rounded-xl border border-border bg-surface py-4 pl-12 pr-4 text-lg text-foreground placeholder-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
        </motion.div>

        <motion.div variants={staggerItem} className="mt-8 flex gap-3">
          <BackButton onClick={onBack} />
          <NextButton onClick={onNext} disabled={!value.trim()} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Step 3: Area ---------- */

function StepArea({
  direction,
  value,
  onChange,
  onNext,
  onBack,
}: {
  direction: number;
  value: number | null;
  onChange: (v: number | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <motion.div variants={staggerContainer} initial="enter" animate="center">
        <motion.p
          variants={staggerItem}
          className="mb-6 text-xl font-semibold text-foreground sm:text-2xl"
        >
          Wie groß ist die Wohnfläche ca.?
        </motion.p>

        <motion.div variants={staggerItem} className="relative">
          <input
            type="number"
            min={1}
            placeholder="z.B. 120"
            value={value ?? ''}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              onChange(Number.isNaN(n) ? null : n);
            }}
            onKeyDown={(e) => e.key === 'Enter' && value && onNext()}
            autoFocus
            className="w-full rounded-xl border border-border bg-surface py-4 pl-5 pr-16 text-lg text-foreground placeholder-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted">
            m²
          </span>
        </motion.div>

        {/* Quick-select */}
        <motion.div variants={staggerItem} className="mt-4 flex flex-wrap gap-2">
          {AREA_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                value === preset
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface text-muted hover:border-accent/40 hover:text-foreground'
              }`}
            >
              {preset === 250 ? '250+ m²' : `${preset} m²`}
            </button>
          ))}
        </motion.div>

        <motion.div variants={staggerItem} className="mt-8 flex gap-3">
          <BackButton onClick={onBack} />
          <NextButton onClick={onNext} disabled={!value} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Step 4: Contact ---------- */

function StepContact({
  direction,
  formData,
  onChange,
  onSubmit,
  onBack,
}: {
  direction: number;
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const canSubmit = formData.name.trim() && formData.email.trim() && formData.phone.trim();

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <motion.div variants={staggerContainer} initial="enter" animate="center">
        <motion.p
          variants={staggerItem}
          className="mb-6 text-xl font-semibold text-foreground sm:text-2xl"
        >
          Wo sollen wir die kostenlose Bewertung hinschicken?
        </motion.p>

        <div className="space-y-4">
          <motion.div variants={staggerItem}>
            <input
              type="text"
              placeholder="Vor- und Nachname"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-border bg-surface px-5 py-4 text-lg text-foreground placeholder-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <input
              type="email"
              placeholder="E-Mail-Adresse"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-5 py-4 text-lg text-foreground placeholder-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <input
              type="tel"
              placeholder="Telefonnummer"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canSubmit && onSubmit()}
              className="w-full rounded-xl border border-border bg-surface px-5 py-4 text-lg text-foreground placeholder-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
          </motion.div>
        </div>

        <motion.p variants={staggerItem} className="mt-4 flex items-start gap-2 text-xs text-muted">
          <Lock className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
          Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
        </motion.p>

        <motion.div variants={staggerItem} className="mt-8 flex gap-3">
          <BackButton onClick={onBack} />
          <motion.button
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-base font-semibold text-background transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 animate-pulse-glow"
          >
            Kostenlose Bewertung anfordern
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Success Screen ---------- */

function SuccessScreen({ name }: { name: string }) {
  const firstName = name.split(' ')[0];

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col items-center justify-center text-center"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 animate-pulse-glow">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <Check className="h-12 w-12 text-accent" strokeWidth={3} />
          </motion.div>
        </div>
        {/* Glow ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.5, 2] }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute inset-0 rounded-full border-2 border-accent/30"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-3xl font-bold text-foreground sm:text-4xl"
      >
        Vielen Dank, {firstName}!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-4 max-w-md text-lg text-muted"
      >
        Unser System analysiert die Daten Ihrer Immobilie. Ein Experte meldet sich
        innerhalb von 24 Stunden bei Ihnen.
      </motion.p>

      {/* Decorative particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -80 - i * 20],
            x: [(i % 2 === 0 ? -1 : 1) * (20 + i * 15)],
          }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
          className="absolute h-2 w-2 rounded-full bg-accent"
          style={{ top: '40%' }}
        />
      ))}

      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
      >
        Zurück zur Website
      </motion.a>
    </motion.div>
  );
}

/* ---------- Shared Buttons ---------- */

function NextButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-base font-semibold text-background transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Weiter
      <ArrowRight className="h-5 w-5" />
    </motion.button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="rounded-xl border border-border px-5 py-4 text-sm text-muted transition-colors hover:border-accent/30 hover:text-foreground"
    >
      Zurück
    </motion.button>
  );
}
