# MaklerFlow – Vollständige Technische Dokumentation

**Version:** 0.1.0 (MVP / Prototyp)  
**Stand:** März 2026  
**Repository:** https://github.com/michaelz1986/maklerflow  
**Zweck:** Übergabe-Dokumentation für die Finalisierung des Produkts

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Tech-Stack & Setup](#2-tech-stack--setup)
3. [Projektstruktur](#3-projektstruktur)
4. [Architektur & Datenfluss](#4-architektur--datenfluss)
5. [Design System](#5-design-system)
6. [Modul 1: Dashboard / CRM (`/app`)](#6-modul-1-dashboard--crm-app)
7. [Modul 2: Öffentliche Website (`/`)](#7-modul-2-öffentliche-website-)
8. [Modul 3: Landingpage (`/sell`)](#8-modul-3-landingpage-sell)
9. [Modul 4: Smart Matches (`/app/matches`)](#9-modul-4-smart-matches-appmatches)
10. [Datenmodelle & Types](#10-datenmodelle--types)
11. [State Management (Stores)](#11-state-management-stores)
12. [Demo-Daten im Detail](#12-demo-daten-im-detail)
13. [Was fertig ist (MVP)](#13-was-fertig-ist-mvp)
14. [Was noch gebaut werden muss (Finalisierung)](#14-was-noch-gebaut-werden-muss-finalisierung)
15. [User Flows](#15-user-flows)
16. [Deployment](#16-deployment)

---

## 1. Projektübersicht

MaklerFlow ist ein All-in-One Makler-Management-System, bestehend aus:

- **Dashboard/CRM** – Das Cockpit des Maklers mit Lead-Scraper, Käufer-Finder, Listing-Management, Kontaktverwaltung
- **Öffentliche Website** – Premium-Präsentation des Maklers mit dynamischen Immobilien-Listings
- **Landingpage** – Conversion-optimierter Multi-Step-Funnel zur Lead-Generierung
- **Smart Matches** – Dual-Scraper-System mit intelligenter Matching-Engine (Verkäufer ↔ Käufer)

### Kernidee
Ein Makler loggt sich ein, sieht automatisch gescrapte Immobilien von Privatverkäufern, dazu automatisch die 10 besten passenden Käufer. Er kann sofort handeln: Verkäufer kontaktieren, Käufer kontaktieren, Deal machen.

### Aktueller Status
**MVP/Prototyp** – Alle UI-Module sind voll funktionsfähig mit simulierten Daten. Die echten Scraper, die Authentifizierung und die Datenbank müssen noch implementiert werden.

---

## 2. Tech-Stack & Setup

### Technologien

| Technologie | Version | Zweck |
|---|---|---|
| **Next.js** | 16.2.1 | React Framework mit App Router |
| **React** | 19.2.4 | UI Library |
| **TypeScript** | ^5 | Typsicherheit |
| **Tailwind CSS** | v4 | Styling (kein tailwind.config.ts!) |
| **Framer Motion** | ^12.38.0 | Animationen |
| **Zustand** | ^5.0.12 | State Management |
| **Lucide React** | ^1.7.0 | Icons |

### Lokales Setup

```bash
# Repository klonen
git clone https://github.com/michaelz1986/maklerflow.git
cd maklerflow

# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
# → http://localhost:3000

# Production-Build
npm run build
npm start
```

### Wichtiger Hinweis: Tailwind CSS v4
Es gibt **keine** `tailwind.config.ts` Datei! Tailwind v4 nutzt CSS-native Konfiguration. Alle Custom-Werte sind in `src/app/globals.css` unter `@theme inline { }` definiert.

---

## 3. Projektstruktur

```
maklerflow/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root Layout (35 Zeilen)
│   │   ├── globals.css               # Globale Styles + Theme (87 Zeilen)
│   │   ├── page.tsx                  # Öffentliche Website / (672 Zeilen)
│   │   ├── sell/
│   │   │   └── page.tsx              # Landingpage /sell (692 Zeilen)
│   │   └── app/
│   │       ├── layout.tsx            # Dashboard Layout + Sidebar (120 Zeilen)
│   │       ├── page.tsx              # Dashboard Overview /app (158 Zeilen)
│   │       ├── matches/
│   │       │   └── page.tsx          # Smart Matches /app/matches (1041 Zeilen)
│   │       ├── scraper/
│   │       │   └── page.tsx          # Lead-Scraper /app/scraper (206 Zeilen)
│   │       ├── buyer-finder/
│   │       │   └── page.tsx          # Käufer-Finder /app/buyer-finder (491 Zeilen)
│   │       ├── listings/
│   │       │   ├── page.tsx          # Listing-Übersicht /app/listings (254 Zeilen)
│   │       │   └── new/
│   │       │       └── page.tsx      # Neues Listing /app/listings/new (479 Zeilen)
│   │       ├── contacts/
│   │       │   └── page.tsx          # Kontakte /app/contacts (265 Zeilen)
│   │       └── settings/
│   │           └── page.tsx          # Einstellungen /app/settings (191 Zeilen)
│   ├── store/
│   │   ├── index.ts                  # Haupt-Store: Listings, Leads, Scraper (246 Zeilen)
│   │   └── matches-store.ts          # Matches-Store: Properties, Buyers, Matching (370 Zeilen)
│   ├── lib/
│   │   ├── types.ts                  # Basis-Types: Listing, Lead, ScrapedLead, etc. (71 Zeilen)
│   │   ├── matches-types.ts          # Matches-Types: MatchProperty, MatchBuyer, etc. (105 Zeilen)
│   │   └── utils.ts                  # Hilfsfunktionen: formatPrice, formatDate, etc. (66 Zeilen)
│   └── data/
│       ├── mock.ts                   # Basis-Demo-Daten: 4 Listings, 3 Leads, 6 ScrapedLeads (328 Zeilen)
│       └── matches-mock.ts           # Generator: 100 Properties, 100 Buyers (231 Zeilen)
├── next.config.ts                    # Next.js Config (Unsplash Bilder)
├── package.json
└── docs/
    └── DOKUMENTATION.md              # Diese Datei
```

**Gesamt: 6.108 Zeilen Code** (ohne node_modules, config-Dateien)

---

## 4. Architektur & Datenfluss

### Routing-Konzept (Next.js App Router)

```
/                → Öffentliche Website (für Immobilieninteressenten)
/sell            → Landingpage (Lead-Generierung, kein Menü!)
/app             → Dashboard Home (geschützter Bereich)
/app/matches     → Smart Matches (Dual-Scraper + Matching)
/app/scraper     → Lead-Scraper (Verkäufer finden)
/app/buyer-finder → Käufer-Finder (Käufer für eigene Objekte matchen)
/app/listings    → Listing-Verwaltung
/app/listings/new → Neues Listing anlegen (Multi-Step Wizard)
/app/contacts    → Kontakte & Leads
/app/settings    → Einstellungen
```

### Datenfluss zwischen Modulen

```
┌─────────────────────────────────────────────────────────┐
│                    ZUSTAND STORES                        │
│                                                         │
│  ┌─────────────┐         ┌──────────────────┐          │
│  │ index.ts     │         │ matches-store.ts  │          │
│  │ (Haupt-Store)│         │ (Matches-Store)   │          │
│  │              │         │                   │          │
│  │ • listings[] │         │ • properties[]    │          │
│  │ • leads[]    │         │ • buyers[]        │          │
│  │ • scraped[]  │         │ • matches[]       │          │
│  └──────┬───────┘         └────────┬──────────┘          │
│         │                          │                     │
└─────────┼──────────────────────────┼─────────────────────┘
          │                          │
    ┌─────┴──────────┐        ┌──────┴────────┐
    │                │        │               │
    ▼                ▼        ▼               ▼
┌────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐
│Website │  │Landingpage│  │Dashboard│  │Smart     │
│   /    │  │  /sell    │  │  /app   │  │Matches   │
│        │  │           │  │         │  │/app/match│
│Zeigt   │  │Lead wird  │  │Zeigt    │  │          │
│aktive  │  │zum Store  │  │Listings │  │100 Props │
│Listings│  │hinzugefügt│  │& Leads  │  │100 Buyers│
│an      │  │→ erscheint│  │aus Store│  │978 Match.│
│        │  │im Dashb.  │  │         │  │          │
└────────┘  └──────────┘  └─────────┘  └──────────┘
```

**Wichtig:** Daten sind aktuell nur im Browser-Speicher (Zustand). Bei Page Refresh werden die Stores neu initialisiert mit den Mock-Daten. Für die Finalisierung muss eine echte Datenbank angebunden werden.

### Echtzeit-Verbindungen (funktionieren im MVP)

1. **Listing anlegen in `/app/listings/new`** → Erscheint sofort auf der Website `/` (wenn `publishWebsite: true`)
2. **Lead-Formular auf `/sell` absenden** → Lead erscheint sofort im Dashboard unter `/app/contacts`
3. **Lead-Scraper scannen** → Gescrapte Leads können ins CRM übernommen werden
4. **Käufer-Finder scannen** → Käufer werden mit eigenen Listings gematcht
5. **Smart Matches Scraper** → Neue Properties/Buyers werden gematcht

---

## 5. Design System

### Farbpalette ("Modern Alien Tech")

| Variable | Wert | Verwendung |
|---|---|---|
| `--color-background` | `#0F172A` | Haupt-Hintergrund (fast schwarz) |
| `--color-foreground` | `#F1F5F9` | Haupttext (helles Grau) |
| `--color-accent` | `#10B981` | Primärfarbe (Neon-Grün) |
| `--color-accent-glow` | `#00FF66` | Hover/Glow-Effekte |
| `--color-surface` | `#1E293B` | Karten-Hintergrund |
| `--color-surface-light` | `#334155` | Sekundäre Oberflächen |
| `--color-border` | `rgba(148, 163, 184, 0.15)` | Feine Borders |
| `--color-border-accent` | `rgba(16, 185, 129, 0.3)` | Aktive/Hover Borders |
| `--color-muted` | `#94A3B8` | Sekundärtext |
| `--color-danger` | `#EF4444` | Fehler/Warnung |
| `--color-warning` | `#F59E0B` | Warnung/Mittel-Score |

### CSS Utility-Klassen

| Klasse | Effekt |
|---|---|
| `glass` | Glassmorphism (verschwommener Hintergrund, feine Border) |
| `glow-accent` | Subtiler grüner Glow-Schatten |
| `glow-accent-strong` | Starker grüner Glow |
| `text-glow` | Text mit grünem Glow |
| `animate-pulse-glow` | Pulsierender Glow (für Buttons) |
| `animate-radar` | Rotierende Radar-Animation |
| `animate-scan` | Scan-Linien-Animation |
| `gradient-mesh` | Subtiler Hintergrund-Gradient |

### Typografie
- **Font:** Geist Sans (variable, von Next.js automatisch geladen)
- **Mono-Font:** Geist Mono (für technische Daten)

### Design-Prinzipien
- Dunkler Hintergrund + heller Text
- Neon-Grün als einzige Akzentfarbe
- Extrem feine 1px Borders mit Transparenz
- Glassmorphism für Karten und Modals
- Viel Whitespace
- Framer Motion für alle Übergänge

---

## 6. Modul 1: Dashboard / CRM (`/app`)

### 6.1 Layout & Sidebar (`src/app/app/layout.tsx`)

**Sidebar (280px, links fixiert):**
- MaklerFlow Logo
- Navigation:
  - Dashboard (`/app`)
  - Smart Matches (`/app/matches`)
  - Lead-Scraper (`/app/scraper`)
  - Käufer-Finder (`/app/buyer-finder`)
  - Meine Objekte (`/app/listings`)
  - Kontakte (`/app/contacts`)
  - Einstellungen (`/app/settings`)
- Quick-Links: "Website ansehen", "Landingpage ansehen"

**Top-Bar:**
- "Demo-Modus" Badge
- Fake User "Max Mustermann, Immobilienmakler"

### 6.2 Dashboard Home (`/app`, `src/app/app/page.tsx`)

**Funktionen:**
- 4 Stats-Karten: Aktive Objekte (Zahl), Neue Leads (Zahl), Gesamtwert Portfolio (Summe), Conversion Rate (fake 23%)
- Neueste Leads (letzte 3 aus Store)
- Neueste Objekte (letzte 3 aus Store)
- Framer Motion Fade-In Animationen

**Datenquelle:** `useStore()` → `listings`, `leads`

### 6.3 Lead-Scraper (`/app/scraper`, `src/app/app/scraper/page.tsx`)

**Funktionen:**
- Radar-Icon mit Animations-Kreis
- "Markt scannen" Button → Startet simulierten Scan (3.5 Sek.)
- Während Scan: Skeleton-Loader, wechselnde Portal-Namen ("Ebay Kleinanzeigen...", "ImmoScout24...", etc.)
- Nach Scan: 6 gescrapte Leads mit:
  - Teilweise maskierte Adresse
  - Geschätzter Wert
  - Quell-Badge
  - Verkaufswahrscheinlichkeit (Score in %)
- "Lead qualifizieren" Button → Verschiebt Lead ins CRM

**Datenquelle:** `useStore()` → `scrapedLeads`, `startScan()`, `convertScrapedLead()`

**DEMO-DATEN (6 ScrapedLeads):**
| ID | Adresse | Wert | Quelle | Score |
|---|---|---|---|---|
| s1 | Rosenheimer Str. 1**, 81*** | 485.000€ | Ebay Kleinanzeigen | 87% |
| s2 | Gärtnerplatz *, 80*** | 1.120.000€ | Privates Netzwerk | 72% |
| s3 | Schwanthalerstr. 4*, 80*** | 320.000€ | ImmoScout (Privat) | 93% |
| s4 | Nymphenburger Str. 8*, 80*** | 890.000€ | Ebay Kleinanzeigen | 65% |
| s5 | Karolinenplatz *, 80*** | 1.850.000€ | WG-Gesucht (Hint) | 45% |
| s6 | Theresienstr. 12*, 80*** | 410.000€ | Privates Netzwerk | 78% |

### 6.4 Käufer-Finder (`/app/buyer-finder`, `src/app/app/buyer-finder/page.tsx`)

**Funktionen:**
- Zeigt aktive Listings des Maklers als klickbare Karten
- "Käufer für meine Objekte finden" Button → Startet Scan (4 Sek.)
- Nach Scan: Buyer-Matches sortiert nach Score
- Jeder Match zeigt:
  - Käufer-Name (maskiert), Quelle, Dringlichkeit
  - Suchkriterien vs. Passendes Objekt (Side-by-Side)
  - Match-Score mit Breakdown-Gründen
  - "Als Lead übernehmen" Button → Ins CRM

**Matching-Algorithmus (einfach):**
- Immobilientyp: 30 Punkte
- Budget-Passung: bis 25 Punkte
- Fläche: 20 Punkte
- Zimmer: 15 Punkte
- Feature-Match: 10 Punkte

**DEMO-DATEN (8 ScrapedBuyers):**
| ID | Name | Typ | Location | Budget | Dringlichkeit |
|---|---|---|---|---|---|
| b1 | Fam. K****r | Haus | München-Zentrum | 1.400.000€ | Hoch |
| b2 | M. Sch****t | Wohnung | München | 950.000€ | Hoch |
| b3 | Dr. A. W****n | Grundstück | Starnberg | 900.000€ | Mittel |
| b4 | J. & P. B****r | Wohnung | München-Schwabing | 600.000€ | Hoch |
| b5 | S. R****i | Haus | München | 1.300.000€ | Mittel |
| b6 | C. L****e | Wohnung | München-Innenstadt | 1.000.000€ | Niedrig |
| b7 | Fam. M****r | Haus | Starnberg | 1.100.000€ | Niedrig |
| b8 | T. F****r | Grundstück | Starnberg | 800.000€ | Hoch |

### 6.5 Listing-Management (`/app/listings`, `src/app/app/listings/page.tsx`)

**Funktionen:**
- Filter-Tabs: Alle, Aktiv, Entwurf, Verkauft
- 3-Spalten Grid mit Listing-Cards
- Jede Card: Bild, Titel, Stadt, Zimmer/Fläche, Preis, Status-Badge
- Klick öffnet Inline-Detail-Modal mit:
  - Vollständige Beschreibung
  - Veröffentlichungs-Toggles (Website, ImmoScout24, Immowelt)
  - Status ändern

**DEMO-DATEN (4 Listings):**
| ID | Titel | Preis | Stadt | Typ | Status | Auf Website |
|---|---|---|---|---|---|---|
| 1 | Moderne Stadtvilla mit Parkblick | 1.250.000€ | München | Haus | Aktiv | Ja |
| 2 | Penthouse-Wohnung mit Dachterrasse | 890.000€ | München | Wohnung | Aktiv | Ja |
| 3 | Charmante Altbauwohnung Schwabing | 520.000€ | München | Wohnung | Entwurf | Nein |
| 4 | Baugrundstück in Toplage | 750.000€ | Starnberg | Grundstück | Aktiv | Ja |

### 6.6 Neues Listing (`/app/listings/new`, `src/app/app/listings/new/page.tsx`)

**5-Schritt Multi-Step Wizard:**
1. **Basisinfos:** Titel, Objekttyp (klickbare Kacheln), Preis
2. **Details:** Zimmer, Fläche, Adresse, Stadt, PLZ, Features (Tag-Input)
3. **Beschreibung:** Textarea + "KI-Text generieren" Button (füllt Beispieltext)
4. **Bilder:** Drag & Drop Zone (simuliert, zeigt Platzhalter)
5. **Veröffentlichung:** Toggle-Switches + Submit

**Datenfluss:** Submit → `store.addListing()` → Redirect zu `/app/listings`  
Wenn `publishWebsite: true` → Listing erscheint sofort auf `/`

### 6.7 Kontakte (`/app/contacts`, `src/app/app/contacts/page.tsx`)

**Funktionen:**
- Filter nach Quelle: Alle, Landingpage, Scraper, Manuell
- Filter nach Status: Alle, Neu, Kontaktiert, Qualifiziert
- Tabelle mit: Name, Email, Telefon, Quelle-Badge, Status-Badge, Datum
- Klick klappt Details/Notizen auf
- Status per Dropdown änderbar

**DEMO-DATEN (3 Leads):**
| ID | Name | Quelle | Status | Typ |
|---|---|---|---|---|
| l1 | Maria Schmidt | Landingpage | Neu | Haus |
| l2 | Thomas Weber | Scraper | Kontaktiert | Wohnung |
| l3 | Sandra Müller | Landingpage | Qualifiziert | Wohnung |

### 6.8 Einstellungen (`/app/settings`, `src/app/app/settings/page.tsx`)

**Funktionen (Platzhalter):**
- Profil-Sektion (Name, Email, Firma)
- Benachrichtigungs-Toggles (Neuer Lead, Neues Match, etc.)
- Integrationen: ImmoScout24 (verbunden), Immowelt (nicht verbunden), Ebay (verbunden)

---

## 7. Modul 2: Öffentliche Website (`/`)

**Datei:** `src/app/page.tsx` (672 Zeilen)

### Sektionen

1. **Navigation** – Fixed Header mit Glassmorphism, Logo, Anchor-Links, "Immobilie verkaufen" CTA
2. **Hero** – Vollbild mit Hintergrundbild, Headline, Subtext, 2 CTA-Buttons, Stats-Bar (150+ Verkaufte Objekte, 98% Zufriedenheit, Ø 12% über Marktwert)
3. **Immobilien-Sektion** – Zeigt dynamisch Listings aus dem Store (nur `status === 'active' && publishWebsite === true`), responsive Grid mit Hover-Effekten
4. **Leistungen** – 3 Service-Cards (Marktanalyse, Premium Vermarktung, Rundum-Service)
5. **Social Proof** – 3 Testimonials mit 5-Sterne-Bewertungen, Partner-Logos
6. **CTA-Sektion** – Bewertungs-Button, Telefon-Link
7. **Footer** – 4-Spalten mit Logo, Quick Links, Kontakt, Rechtliches

**Wichtig:** Die Immobilien werden LIVE aus dem Zustand-Store geladen. Wenn man im Dashboard ein Listing mit `publishWebsite: true` anlegt, erscheint es sofort hier.

---

## 8. Modul 3: Landingpage (`/sell`)

**Datei:** `src/app/sell/page.tsx` (692 Zeilen)

### Design-Prinzipien
- **KEINE Navigation** (kein Escape außer Konversion)
- Nur MaklerFlow-Logo oben
- Fokus auf das Formular
- Trust-Elemente verstreut

### Multi-Step Funnel (4 Schritte)

**Step 1: Immobilientyp**
- 3 große klickbare Kacheln: Haus, Wohnung, Grundstück
- Auto-Advance bei Klick

**Step 2: Standort**
- PLZ/Ort Eingabefeld
- "Weiter" Button

**Step 3: Wohnfläche**
- Zahleneingabe mit m²-Suffix
- Quick-Select Buttons: 50m², 80m², 120m², 180m², 250m²+

**Step 4: Kontaktdaten**
- Name, E-Mail, Telefon
- Datenschutz-Hinweis
- Großer grüner CTA: "Kostenlose Bewertung anfordern"

**Erfolgs-Screen:**
- Animiertes Häkchen
- Personalisierte Danksagung
- "Zurück zur Website" Link

**Datenfluss:** Submit → `store.addLead({ source: 'landing_page', ... })` → Lead erscheint sofort im Dashboard unter `/app/contacts`

---

## 9. Modul 4: Smart Matches (`/app/matches`)

**Datei:** `src/app/app/matches/page.tsx` (1.041 Zeilen) – **Größtes und wichtigstes Modul**

### 9.1 Stats-Bar
6 KPI-Cards in einer Reihe:
- Objekte (100)
- Käufer (100)
- Matches (978)
- Ø Score (63)
- Kontaktiert (0 am Anfang)
- Deals (0 am Anfang)

### 9.2 Scraper-Panel
3 Buttons:
- **"Property-Scraper starten"** → Simuliert 4 Sek., fügt 50 neue Properties hinzu
- **"Buyer-Scraper starten"** → Simuliert 3.5 Sek., fügt 50 neue Käufer hinzu
- **"Beide starten"** → Startet beide gleichzeitig
- Zeigt letzte Scrape-Zeit an

### 9.3 Filter-Bar
- Sortierung: Score, Preis ↑, Preis ↓, Datum, Stadt
- Stadt-Suchfeld (Freitext)
- Mindest-Score Dropdown (≥30, ≥50, ≥70, ≥85)
- Objekttyp-Buttons: Alle, Wohnung, Haus, Gewerbe

### 9.4 Two-Column-Layout (Kernstück)

**Linke Spalte (Property Detail):**
- Bild-Karussell mit Navigations-Pfeilen und Punkt-Indikatoren
- Preis groß mit Gradient-Overlay
- Adresse: Straße, PLZ, Stadt – Stadtteil
- Key-Facts Grid: Fläche m², Zimmer, Typ, Zustand, Energieeffizienz, Baujahr
- Feature-Tags
- Beschreibungstext
- Kontakt-Card: Name, Telefon (klickbar), Email (klickbar)
- Quell-Badge + Scrape-Zeit
- Vorherige/Nächste Buttons + Counter ("1 von 100")
- Quick-Jump Thumbnails (8 Properties)

**Rechte Spalte (Top 10 Buyer-Matches):**
Für jeden Match:
- **Score-Badge** (groß, farbcodiert: grün ≥70, gelb ≥50, rot <50)
- **Score-Breakdown Bars** – 6 Balken für Preis, Lage, Größe, Zimmer, Typ, Extras (jeweils 0-100)
- **Käufer-Info:** Name, Budget-Range, Größen-Range, Zimmer-Range, Typ-Präferenz
- **Standort-Tags** der Käufer-Präferenzen
- **Feature-Tags** die der Käufer sucht
- **Match-Gründe** als grüne Badges ("Budget passt ✓", "Lage passt ✓", etc.)
- **Kontaktdaten:** Telefon + Email
- **Action-Buttons:**
  - "Verkäufer" → Öffnet Kontakt-Modal
  - "Käufer" → Öffnet Kontakt-Modal
  - "Notiz" → Öffnet Inline-Notiz-Formular
  - "Aktion" → Dropdown mit: Verkäufer kontaktiert, Käufer kontaktiert, Beide kontaktiert, Besichtigung vereinbart, Besichtigung durchgeführt, Angebot gemacht, Deal abgeschlossen, Verloren
- **Favoriten-Stern** (Toggle, Favoriten werden oben sortiert)
- **Notizen** (aufklappbar)
- **Actions-Timeline** (aufklappbar)

### 9.5 Kontakt-Modal
- Vorausgefüllte Kontaktdaten
- Template-Nachricht (z.B. "Sehr geehrte/r [Name], als erfahrener Immobilienmakler...")
- "Nachricht senden (simuliert)" Button → Loggt Aktion

### 9.6 Matching-Engine (Detail)

**Gewichtetes Scoring-System:**

| Kriterium | Gewichtung | Logik |
|---|---|---|
| **Preis** | 30% | Budget des Käufers vs. Verkaufspreis, ±20% Toleranz |
| **Lage** | 25% | Stadt-Match = 100, Stadt ohne Stadtteil = 70, kein Match = 0 |
| **Größe** | 20% | Im Bereich = 100, ±15% Toleranz = teilweise, darüber = 0 |
| **Zimmer** | 15% | Im Bereich = 100, ±1 Zimmer = 60, ±2 = 20, darüber = 0 |
| **Typ** | 5% | Exakter Match = 100, kein Match = 0 |
| **Features** | 5% | Anteil der gewünschten Features die vorhanden sind |

**Formel:** `Gesamt = Preis×0.30 + Lage×0.25 + Größe×0.20 + Zimmer×0.15 + Typ×0.05 + Features×0.05`

**Schwellenwert:** Nur Matches mit Score ≥ 30 werden angezeigt.
**Top-N:** Pro Property werden max. 10 beste Matches gespeichert.

---

## 10. Datenmodelle & Types

### Basis-Types (`src/lib/types.ts`)

```typescript
// Immobilien-Listing (für eigene Objekte des Maklers)
interface Listing {
  id: string;
  title: string;
  price: number;
  rooms: number;
  area: number;
  description: string;
  images: string[];
  address: string;
  city: string;
  zip: string;
  type: 'house' | 'apartment' | 'land';
  status: 'active' | 'draft' | 'sold';
  publishWebsite: boolean;      // Auf Website anzeigen?
  publishImmoScout: boolean;    // Auf ImmoScout24?
  publishImmowelt: boolean;     // Auf Immowelt?
  createdAt: string;
  features: string[];
}

// Lead/Kontakt
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'landing_page' | 'scraper' | 'manual';
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  propertyType?: 'house' | 'apartment' | 'land';
  location?: string;
  area?: number;
  score?: number;
  estimatedValue?: number;
  createdAt: string;
  notes?: string;
}

// Gescrapter Lead (Verkäufer-Seite, Lead-Scraper)
interface ScrapedLead {
  id: string;
  address: string;           // Teilweise maskiert
  estimatedValue: number;
  source: string;            // Portal-Name
  sellProbability: number;   // 0-100
  propertyType: 'house' | 'apartment' | 'land';
  rooms?: number;
  area?: number;
}

// Gescrapter Käufer (Käufer-Finder)
interface ScrapedBuyer {
  id: string;
  name: string;              // Teilweise maskiert
  source: string;
  lastActive: string;
  urgency: 'high' | 'medium' | 'low';
  searchCriteria: {
    propertyType: 'house' | 'apartment' | 'land';
    minArea?: number;
    maxArea?: number;
    minRooms?: number;
    maxRooms?: number;
    maxPrice: number;
    location: string;
    features?: string[];
  };
}
```

### Matches-Types (`src/lib/matches-types.ts`)

```typescript
type PropertyType = 'apartment' | 'house' | 'commercial';

// Gescrapte Immobilie (für Smart Matches)
interface MatchProperty {
  id: string;
  title: string;
  price: number;
  city: string;
  district: string;
  street: string;
  zip: string;
  area: number;
  rooms: number;
  type: PropertyType;
  features: string[];
  images: string[];
  description: string;
  contactName: string;       // Verkäufer-Name
  contactPhone: string;      // Verkäufer-Telefon
  contactEmail: string;      // Verkäufer-Email
  source: string;            // Scraping-Quelle
  scrapedAt: string;         // ISO-Timestamp
  yearBuilt?: number;
  condition?: string;        // Erstbezug, Renoviert, etc.
  energyRating?: string;     // A+, A, B, C, D, E
}

// Gescraptes Käufer-Profil (für Smart Matches)
interface MatchBuyer {
  id: string;
  name: string;
  phone: string;
  email: string;
  budgetMin: number;
  budgetMax: number;
  locationPreferences: string[];  // z.B. ["Berlin", "München, Schwabing"]
  sizeMin: number;
  sizeMax: number;
  roomsMin: number;
  roomsMax: number;
  typePreferences: PropertyType[];
  features: string[];
  source: string;
  registeredAt: string;
  lifestyle?: string[];      // z.B. ["Nähe zu Schulen", "Ruhige Lage"]
}

// Score-Aufschlüsselung
interface MatchScoreBreakdown {
  price: number;      // 0-100
  location: number;   // 0-100
  size: number;       // 0-100
  rooms: number;      // 0-100
  type: number;       // 0-100
  features: number;   // 0-100
  total: number;      // 0-100 (gewichteter Durchschnitt)
}

// Ein Match zwischen Property und Buyer
interface Match {
  id: string;
  propertyId: string;
  buyerId: string;
  score: MatchScoreBreakdown;
  reasons: string[];
  status: 'new' | 'contacted_seller' | 'contacted_buyer' | 
          'contacted_both' | 'appointment' | 'deal' | 'lost';
  isFavorite: boolean;
  notes: MatchNote[];
  actions: MatchAction[];
  createdAt: string;
}

// Notiz zu einem Match
interface MatchNote {
  id: string;
  text: string;
  createdAt: string;
}

// Protokollierte Aktion
interface MatchAction {
  id: string;
  type: 'contacted_seller' | 'contacted_buyer' | 'contacted_both' | 
        'appointment_set' | 'viewing_done' | 'offer_made' | 
        'deal_closed' | 'lost';
  description: string;
  createdAt: string;
}

// Filter-Optionen
interface MatchFilters {
  priceMin?: number;
  priceMax?: number;
  city?: string;
  sizeMin?: number;
  sizeMax?: number;
  rooms?: number;
  type?: PropertyType;
  minScore?: number;
  source?: string;
  sortBy: 'score' | 'price_asc' | 'price_desc' | 'date' | 'city';
}
```

---

## 11. State Management (Stores)

### Haupt-Store (`src/store/index.ts`)

```typescript
// Importieren
import { useStore } from '@/store';

// State
listings: Listing[]              // Alle Immobilien des Maklers
leads: Lead[]                    // Alle Kontakte/Leads
scrapedLeads: ScrapedLead[]      // Gescrapte Verkäufer (Lead-Scraper)
isScanning: boolean              // Lead-Scraper läuft?
scanComplete: boolean            // Lead-Scraper fertig?
scrapedBuyers: ScrapedBuyer[]    // Gescrapte Käufer (Käufer-Finder)
buyerMatches: BuyerMatch[]       // Matches Käufer ↔ Listings
isBuyerScanning: boolean         // Käufer-Scanner läuft?
buyerScanComplete: boolean       // Käufer-Scanner fertig?

// Aktionen
addListing(listing)              // Neues Listing anlegen
updateListing(id, updates)       // Listing aktualisieren
deleteListing(id)                // Listing löschen
addLead(lead)                    // Neuen Lead hinzufügen
updateLead(id, updates)          // Lead aktualisieren
startScan()                      // Lead-Scraper starten (3.5s Simulation)
convertScrapedLead(scrapedId)    // Gescrapten Lead ins CRM übernehmen
startBuyerScan()                 // Käufer-Scanner starten (4s Simulation)
convertBuyerToLead(buyerId, listingId)  // Käufer-Match als Lead übernehmen
```

### Matches-Store (`src/store/matches-store.ts`)

```typescript
// Importieren
import { useMatchesStore } from '@/store/matches-store';

// State
properties: MatchProperty[]       // 100 gescrapte Properties
buyers: MatchBuyer[]              // 100 gescrapte Käufer-Profile
matches: Match[]                  // ~978 berechnete Matches
selectedPropertyIndex: number     // Aktuell ausgewählte Property
filters: MatchFilters             // Aktive Filter
isPropertyScraping: boolean       // Property-Scraper läuft?
isBuyerScraping: boolean          // Buyer-Scraper läuft?
lastPropertyScrape: string|null   // Letzter Scrape-Zeitpunkt
lastBuyerScrape: string|null

// Aktionen
setSelectedProperty(index)         // Property wechseln
setFilters(filters)                // Filter setzen
startPropertyScraper()             // +50 Properties (4s Simulation)
startBuyerScraper()                // +50 Buyers (3.5s Simulation)
startBothScrapers()                // Beide gleichzeitig
toggleFavorite(matchId)            // Match als Favorit
addNote(matchId, text)             // Notiz hinzufügen
logAction(matchId, type, desc)     // Aktion protokollieren
updateMatchStatus(matchId, status) // Match-Status ändern

// Getters
getMatchesForProperty(propertyId)  // Top 10 Matches für Property
getFilteredProperties()            // Gefilterte Property-Liste
getStats()                         // Statistiken
getBuyerById(id)                   // Käufer nach ID
getPropertyById(id)                // Property nach ID
```

---

## 12. Demo-Daten im Detail

### 12.1 Basis-Demo-Daten (`src/data/mock.ts`)

**Statische Daten, manuell erstellt:**
- 4 Listings (München, Starnberg)
- 3 Leads
- 6 ScrapedLeads
- 8 ScrapedBuyers

### 12.2 Matches-Demo-Daten (`src/data/matches-mock.ts`)

**Generiert via Seed-Funktionen (deterministisch, immer gleiche Daten):**

#### `generateProperties(count)` – Erzeugt `count` Properties
- **Seed:** 42 (immer gleiche Ergebnisse)
- **Städte:** Berlin, München, Hamburg, Köln, Frankfurt, Stuttgart, Düsseldorf, Leipzig, Dresden, Hannover
- **Stadtteile:** Je 10 pro Stadt (z.B. Berlin: Mitte, Prenzlauer Berg, Kreuzberg, ...)
- **Straßen:** 20 deutsche Straßennamen
- **Typen:** 50% Wohnung, 35% Haus, 15% Gewerbe
- **Preise:** Wohnung 80k-780k, Haus 300k-1.6M, Gewerbe 75k-1.35M
- **Flächen:** Wohnung 40-170m², Haus 100-300m², Gewerbe 50-350m²
- **Zimmer:** Abgeleitet aus Fläche
- **Features:** Aus Pool von 20 Features (Balkon, Terrasse, Garten, Garage, etc.)
- **Bilder:** 12 Unsplash-URLs (zufällig 2-5 pro Property)
- **Kontakte:** Deutsche Vor-/Nachnamen, generierte Telefonnummern, Email
- **Quellen:** Facebook, ImmoScout24, Immowelt, Ebay Kleinanzeigen, Instagram, LinkedIn, Private Website, WG-Gesucht
- **Beschreibungen:** 5 Wohnungs-, 5 Haus-, 3 Gewerbe-Vorlagen
- **Zustand:** Erstbezug, Neuwertig, Renoviert, Gepflegt, Sanierungsbedürftig
- **Energie:** A+ bis E
- **Baujahr:** 1940-2020

#### `generateBuyers(count)` – Erzeugt `count` Käufer-Profile
- **Seed:** 137 (immer gleiche Ergebnisse)
- **Typen:** 40% nur Wohnung, 30% nur Haus, 15% beides, 15% Gewerbe
- **Budget:** Abgeleitet aus Typ (Haus ab 300k, Wohnung ab 150k, Gewerbe ab 200k)
- **Budget-Range:** Min + 20-50% Aufschlag als Max
- **Flächen:** Haus 100-180m² min, Wohnung 40-100m² min, +30-60% als Max
- **Zimmer:** Haus 3-4 min, Wohnung 1-2 min, +1-2 als Max
- **Standorte:** 1-3 Präferenzen, Mix aus Stadt und Stadt+Stadtteil
- **Features:** 0-3 gewünschte Features
- **Lifestyle:** 1-3 aus 10 Optionen (Ruhige Lage, Nähe zu Schulen, etc.)
- **Quellen:** ImmoScout24, Immowelt, Facebook, LinkedIn, Makler-Forum, etc.

### 12.3 Was bei der Finalisierung mit den Demo-Daten passieren muss

| Aktueller Zustand | Was gemacht werden muss |
|---|---|
| `generateProperties(100)` wird beim Store-Init aufgerufen | Ersetzen durch echte DB-Abfrage |
| `generateBuyers(100)` wird beim Store-Init aufgerufen | Ersetzen durch echte DB-Abfrage |
| `mockListings` Array in mock.ts | Ersetzen durch DB |
| `mockLeads` Array in mock.ts | Ersetzen durch DB |
| `mockScrapedLeads` Array in mock.ts | Ersetzen durch echte Scraper-Ergebnisse |
| `mockScrapedBuyers` Array in mock.ts | Ersetzen durch echte Scraper-Ergebnisse |
| `setTimeout(3500)` simuliert Scraping | Ersetzen durch echte API-Calls |
| Unsplash-Bilder als Platzhalter | Ersetzen durch echte Property-Bilder |
| Kontaktdaten sind fiktiv | Ersetzen durch echte gescrapte Daten |
| Seed-basierte Generierung | Ersetzen durch echte Datenbank-Reads |

---

## 13. Was fertig ist (MVP)

### Vollständig implementiert und funktionsfähig:

- [x] **Komplettes UI/UX** für alle 11 Routen
- [x] **Design System** "Modern Alien Tech" durchgängig
- [x] **Responsive Layout** (Desktop optimiert)
- [x] **Framer Motion Animationen** überall
- [x] **Datenfluss** zwischen allen Modulen (via Zustand)
- [x] **Landingpage-zu-CRM Pipeline** (Lead-Formular → Dashboard)
- [x] **Website-zu-CRM Pipeline** (Listing anlegen → Website zeigt an)
- [x] **Lead-Scraper UI** mit Scan-Simulation
- [x] **Käufer-Finder UI** mit Matching-Visualisierung
- [x] **Smart Matches** komplett mit Two-Column-Layout
- [x] **Matching-Engine** mit gewichtetem Scoring
- [x] **100 Demo-Properties + 100 Demo-Käufer**
- [x] **Scraper-Simulation** (Property + Buyer, +50 pro Lauf)
- [x] **Filter & Sortierung** im Matches-Modul
- [x] **Kontakt-Modals** mit Nachrichten-Templates
- [x] **Notizen-System** pro Match
- [x] **Action-Logging** (Kontaktiert, Besichtigung, Deal, etc.)
- [x] **Favoriten-System**
- [x] **Stats-Dashboard** mit KPIs
- [x] **Multi-Step Listing-Wizard** (5 Schritte)
- [x] **Multi-Step Lead-Funnel** (4 Schritte)
- [x] **Listing-Veröffentlichung** (Website/ImmoScout/Immowelt Toggles)

---

## 14. Was noch gebaut werden muss (Finalisierung)

### Priorität 1: Backend & Datenbank

| Feature | Beschreibung | Empfohlene Technologie |
|---|---|---|
| **Datenbank** | Persistente Datenspeicherung statt In-Memory | PostgreSQL + Prisma ORM |
| **API-Routes** | Next.js API Routes für CRUD-Operationen | Next.js Route Handlers |
| **Authentifizierung** | Echtes Login-System statt "Demo-Modus" | NextAuth.js oder Clerk |
| **File Upload** | Echte Bilder-Uploads für Listings | Cloudinary oder AWS S3 |

### Priorität 2: Echte Scraper

| Scraper | Quellen | Technologie-Empfehlung |
|---|---|---|
| **Property-Scraper** | Facebook, ImmoScout24, Immowelt, Ebay Kleinanzeigen, Instagram, LinkedIn, private Websites | Puppeteer/Playwright + Cron Jobs |
| **Buyer-Scraper** | ImmoScout24 Suchprofile, Immowelt Suchabos, Facebook Gesuche, Makler-Foren | Puppeteer/Playwright + Cron Jobs |
| **Duplikaterkennung** | Gleiche Immobilie aus verschiedenen Quellen erkennen | Fuzzy-Matching auf Adresse + Preis |
| **Tägliche Automatisierung** | Scraper täglich um 08:00 Uhr ausführen | Node-Cron oder Vercel Cron |

### Priorität 3: Kommunikation

| Feature | Beschreibung |
|---|---|
| **Email-Versand** | Echte Emails an Verkäufer/Käufer senden | 
| **SMS-Versand** | SMS-Benachrichtigungen |
| **Push-Notifications** | Browser-Push bei neuen Matches |
| **WhatsApp-Integration** | WhatsApp Business API |

### Priorität 4: Erweiterte Features

| Feature | Beschreibung |
|---|---|
| **Provisions-Tracking** | Provisionen pro Deal berechnen und tracken |
| **Reporting** | PDF-Reports für Verkäufer/Käufer generieren |
| **Kalender-Integration** | Besichtigungstermine mit Google/Outlook Calendar |
| **Kartenansicht** | Immobilien auf Google Maps anzeigen |
| **KI-Bewertung** | Echte KI-basierte Immobilienbewertung |
| **Multi-Mandanten** | Mehrere Makler/Teams unterstützen |
| **Mobile App** | React Native oder PWA |

### Priorität 5: Rechts & Compliance

| Feature | Beschreibung |
|---|---|
| **DSGVO** | Datenschutz-konforme Datenspeicherung |
| **Impressum/Datenschutz** | Echte rechtliche Texte |
| **Cookie-Banner** | Cookie-Consent |
| **Nutzungsbedingungen** | AGB für die Plattform |

---

## 15. User Flows

### Flow 1: Makler nutzt Smart Matches

```
1. Makler öffnet /app/matches
2. Sieht Stats: 100 Objekte, 100 Käufer, 978 Matches
3. Scrollt durch Properties (Links: Bild, Preis, Details)
4. Sieht rechts die Top 10 Käufer-Matches
5. Match #1: Score 95%, Budget passt, Lage passt
6. Klickt "Verkäufer" → Modal öffnet sich
7. Sieht Kontaktdaten + Nachrichten-Template
8. Klickt "Nachricht senden" → Aktion wird geloggt
9. Klickt "Käufer" → Kontaktiert auch den Käufer
10. Klickt "Aktion" → "Besichtigung vereinbart"
11. Klickt "Notiz" → "Beide sehr interessiert, Termin Freitag"
12. Match-Status wechselt automatisch zu "appointment"
```

### Flow 2: Neues Listing → Erscheint auf Website

```
1. Makler öffnet /app/listings/new
2. Schritt 1: "Penthouse München" als Titel, Wohnung, 750.000€
3. Schritt 2: 4 Zimmer, 140m², Maximilianstr. 5, München, 80539
4. Schritt 3: Beschreibung schreiben (oder KI-Button)
5. Schritt 4: Bilder "hochladen" (simuliert)
6. Schritt 5: Toggle "Auf Website" → AN, Submit
7. Redirect zu /app/listings → Neues Listing sichtbar
8. Öffne / (Website) → Listing erscheint in der Immobilien-Sektion
```

### Flow 3: Landingpage → Lead im CRM

```
1. Besucher öffnet /sell
2. Sieht Headline "Was ist Ihre Immobilie wert?"
3. Klickt Kachel "Haus" → Weiter
4. Gibt PLZ "80331 München" ein → Weiter
5. Schiebt Slider auf "180 m²" → Weiter
6. Gibt Name, Email, Telefon ein
7. Klickt "Kostenlose Bewertung anfordern"
8. Sieht Erfolgs-Screen
9. Makler öffnet /app/contacts → Neuer Lead sichtbar
```

### Flow 4: Scraper → Lead qualifizieren

```
1. Makler öffnet /app/scraper
2. Klickt "Markt scannen" → Scan-Animation
3. Nach 3.5s: 6 Ergebnisse erscheinen
4. Sieht: "Rosenheimer Str., 485.000€, 87% Score"
5. Klickt "Lead qualifizieren"
6. Lead verschwindet aus Liste, erscheint in /app/contacts
```

### Flow 5: Käufer-Finder → Käufer matchen

```
1. Makler öffnet /app/buyer-finder
2. Sieht seine 3 aktiven Objekte
3. Klickt "Käufer für meine Objekte finden"
4. Scan-Animation (4 Sek.)
5. 6 Matches erscheinen, sortiert nach Score
6. Match: "Fam. K****r, 100% Score" für Stadtvilla
7. Klickt auf Stadtvilla-Karte oben → Filtert nur deren Matches
8. Klickt "Als Lead übernehmen" → Match wird zum CRM-Lead
```

---

## 16. Deployment

### Empfohlen: Vercel

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel

# Oder mit GitHub-Integration:
# 1. Repo auf GitHub verbinden
# 2. Vercel importiert automatisch
# 3. Jeder Push zu main → Auto-Deploy
```

### Umgebungsvariablen (für Finalisierung)

```env
# Datenbank
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://app.maklerflow.de

# Email
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...

# File Storage
CLOUDINARY_URL=...

# Scraper
SCRAPER_CRON_SECRET=...
```

### Domain-Struktur (Empfehlung)

```
maklerflow.de          → Öffentliche Website (/)
maklerflow.de/sell     → Landingpage
maklerflow.de/app      → Dashboard (auth-geschützt)
```

---

## Anhang: Datei-Referenz

| Datei | Zeilen | Beschreibung |
|---|---|---|
| `src/app/app/matches/page.tsx` | 1.041 | Smart Matches (Two-Column, Scraper, Filter, Modals) |
| `src/app/sell/page.tsx` | 692 | Landingpage Multi-Step Funnel |
| `src/app/page.tsx` | 672 | Öffentliche Website |
| `src/app/app/buyer-finder/page.tsx` | 491 | Käufer-Finder |
| `src/app/app/listings/new/page.tsx` | 479 | Multi-Step Listing Wizard |
| `src/store/matches-store.ts` | 370 | Matches Store + Matching Engine |
| `src/data/mock.ts` | 328 | Basis-Demo-Daten |
| `src/app/app/contacts/page.tsx` | 265 | Kontaktverwaltung |
| `src/app/app/listings/page.tsx` | 254 | Listing-Übersicht |
| `src/store/index.ts` | 246 | Haupt-Store |
| `src/data/matches-mock.ts` | 231 | Demo-Daten Generator |
| `src/app/app/scraper/page.tsx` | 206 | Lead-Scraper |
| `src/app/app/settings/page.tsx` | 191 | Einstellungen |
| `src/app/app/page.tsx` | 158 | Dashboard Overview |
| `src/app/app/layout.tsx` | 120 | Dashboard Layout + Sidebar |
| `src/lib/matches-types.ts` | 105 | Matches Type-Definitionen |
| `src/app/globals.css` | 87 | Design System + Theme |
| `src/lib/types.ts` | 71 | Basis Type-Definitionen |
| `src/lib/utils.ts` | 66 | Hilfsfunktionen |
| `src/app/layout.tsx` | 35 | Root Layout |

---

*Dokumentation erstellt am 30. März 2026 – MaklerFlow v0.1.0 MVP*
