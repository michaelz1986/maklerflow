import { MatchProperty, MatchBuyer } from '@/lib/matches-types';

const cities = [
  { city: 'Berlin', districts: ['Mitte', 'Prenzlauer Berg', 'Kreuzberg', 'Charlottenburg', 'Schöneberg', 'Friedrichshain', 'Neukölln', 'Steglitz', 'Tempelhof', 'Wilmersdorf'], zip: '10' },
  { city: 'München', districts: ['Schwabing', 'Bogenhausen', 'Maxvorstadt', 'Haidhausen', 'Sendling', 'Laim', 'Pasing', 'Nymphenburg', 'Au', 'Lehel'], zip: '80' },
  { city: 'Hamburg', districts: ['Altona', 'Eimsbüttel', 'Eppendorf', 'Winterhude', 'Ottensen', 'St. Pauli', 'Blankenese', 'Harvestehude', 'Rotherbaum', 'Barmbek'], zip: '20' },
  { city: 'Köln', districts: ['Ehrenfeld', 'Nippes', 'Lindenthal', 'Sülz', 'Deutz', 'Innenstadt', 'Rodenkirchen', 'Porz', 'Mülheim', 'Kalk'], zip: '50' },
  { city: 'Frankfurt', districts: ['Sachsenhausen', 'Nordend', 'Bornheim', 'Westend', 'Bockenheim', 'Gallus', 'Ostend', 'Niederrad', 'Höchst', 'Rödelheim'], zip: '60' },
  { city: 'Stuttgart', districts: ['Mitte', 'West', 'Ost', 'Süd', 'Nord', 'Degerloch', 'Vaihingen', 'Bad Cannstatt', 'Feuerbach', 'Killesberg'], zip: '70' },
  { city: 'Düsseldorf', districts: ['Altstadt', 'Oberkassel', 'Pempelfort', 'Flingern', 'Bilk', 'Unterbilk', 'Derendorf', 'Kaiserswerth', 'Benrath', 'Carlstadt'], zip: '40' },
  { city: 'Leipzig', districts: ['Zentrum', 'Südvorstadt', 'Connewitz', 'Plagwitz', 'Lindenau', 'Schleußig', 'Gohlis', 'Eutritzsch', 'Reudnitz', 'Stötteritz'], zip: '04' },
  { city: 'Dresden', districts: ['Altstadt', 'Neustadt', 'Blasewitz', 'Striesen', 'Löbtau', 'Cotta', 'Pieschen', 'Plauen', 'Laubegast', 'Loschwitz'], zip: '01' },
  { city: 'Hannover', districts: ['Mitte', 'Linden', 'Südstadt', 'Nordstadt', 'List', 'Oststadt', 'Zoo', 'Herrenhausen', 'Bothfeld', 'Döhren'], zip: '30' },
];

const streets = ['Hauptstraße', 'Bahnhofstraße', 'Goethestraße', 'Schillerstraße', 'Mozartstraße', 'Beethovenstraße', 'Lindenstraße', 'Gartenstraße', 'Waldstraße', 'Bergstraße', 'Kirchstraße', 'Rosenstraße', 'Friedrichstraße', 'Bismarckstraße', 'Königstraße', 'Lessingstraße', 'Herderstraße', 'Kantstraße', 'Uhlandstraße', 'Körnerstraße'];

const firstNames = ['Hans', 'Maria', 'Peter', 'Anna', 'Klaus', 'Petra', 'Thomas', 'Sabine', 'Michael', 'Christine', 'Stefan', 'Monika', 'Andreas', 'Susanne', 'Markus', 'Barbara', 'Jürgen', 'Karin', 'Wolfgang', 'Helga', 'Frank', 'Ingrid', 'Bernd', 'Heike', 'Uwe', 'Renate', 'Dieter', 'Gisela', 'Rainer', 'Ursula', 'Max', 'Lena', 'Paul', 'Sophie', 'Felix', 'Emma', 'Jonas', 'Mia', 'Leon', 'Hannah'];
const lastNames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Richter', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Braun', 'Zimmermann', 'Krüger', 'Hartmann', 'Lange', 'Werner', 'Lehmann', 'Köhler', 'Maier', 'Hermann', 'König', 'Mayer', 'Walter', 'Peters'];

const sources = ['Facebook', 'ImmoScout24', 'Immowelt', 'eBay Kleinanzeigen', 'Instagram', 'LinkedIn', 'Private Website', 'WG-Gesucht'];
const buyerSources = ['ImmoScout24', 'Immowelt', 'Facebook', 'LinkedIn', 'Makler-Forum', 'Instagram', 'Private Anfrage', 'Empfehlung'];

const allFeatures = ['Balkon', 'Terrasse', 'Garten', 'Garage', 'Stellplatz', 'Keller', 'Aufzug', 'Einbauküche', 'Fußbodenheizung', 'Parkett', 'Dielenboden', 'Stuck', 'Dachterrasse', 'Smart Home', 'Klimaanlage', 'Kamin', 'Pool', 'Sauna', 'Waschküche', 'Abstellraum'];

const conditions = ['Erstbezug', 'Neuwertig', 'Renoviert', 'Gepflegt', 'Sanierungsbedürftig'];
const energyRatings = ['A+', 'A', 'B', 'C', 'D', 'E'];

const propertyImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

function generatePhone(rng: () => number, prefix: string): string {
  const n = () => Math.floor(rng() * 10);
  return `${prefix}-${n()}${n()}${n()}${n()}${n()}${n()}`;
}

function hoursAgo(h: number): string {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}

const apartmentDescriptions = [
  'Wunderschöne, modern renovierte Wohnung in bester Lage. Helle Räume mit viel Tageslicht, hochwertige Ausstattung und ein durchdachter Grundriss machen diese Wohnung zu einem echten Highlight.',
  'Stilvolle Wohnung mit Charme und Charakter. Die großzügige Raumaufteilung, die hohe Decke und die edlen Materialien schaffen eine einzigartige Wohnatmosphäre.',
  'Charmante Altbauwohnung mit hohen Decken, Stuck und Dielenboden. Die Wohnung besticht durch ihren besonderen Charakter und die zentrale Lage.',
  'Moderne Neubauwohnung mit gehobener Ausstattung. Bodentiefe Fenster, offene Küche und ein sonniger Balkon laden zum Wohlfühlen ein.',
  'Lichtdurchflutete Wohnung in ruhiger Lage. Der offene Wohn-Essbereich, die moderne Küche und das elegante Badezimmer überzeugen auf ganzer Linie.',
];

const houseDescriptions = [
  'Großzügiges Einfamilienhaus mit wunderschönem Garten in begehrter Wohnlage. Das Haus wurde aufwändig saniert und bietet modernsten Wohnkomfort.',
  'Charmantes Haus mit viel Platz für die ganze Familie. Der gepflegte Garten, die hellen Räume und die ruhige Lage machen dieses Haus zu einem Traumobjekt.',
  'Repräsentatives Stadthaus mit exklusiver Ausstattung. Hochwertige Materialien, durchdachte Grundrisse und eine Top-Lage zeichnen dieses Objekt aus.',
  'Freistehendes Einfamilienhaus mit Pool und großem Grundstück. Ideal für Familien, die Platz und Privatsphäre schätzen.',
  'Modernes Architektenhaus mit offener Raumgestaltung. Große Fensterfronten, eine Designer-Küche und ein Smart-Home-System auf dem neuesten Stand.',
];

const commercialDescriptions = [
  'Repräsentative Gewerbefläche in zentraler Lage. Ideal für Büro, Praxis oder Einzelhandel. Moderne Ausstattung und gute Verkehrsanbindung.',
  'Vielseitig nutzbare Gewerbefläche mit Schaufenster. Perfekt für Gastronomie, Einzelhandel oder kreative Nutzung.',
  'Modernes Büro in erstklassiger Lage. Open-Space-Konzept mit Meeting-Räumen, Teeküche und Tiefgaragen-Stellplätzen.',
];

export function generateProperties(count: number): MatchProperty[] {
  const rng = seededRandom(42);
  const properties: MatchProperty[] = [];

  for (let i = 0; i < count; i++) {
    const cityData = pick(cities, rng);
    const district = pick(cityData.districts, rng);
    const street = pick(streets, rng);
    const houseNum = Math.floor(rng() * 120) + 1;
    const zipSuffix = String(Math.floor(rng() * 900) + 100);

    const typeRoll = rng();
    const type = typeRoll < 0.5 ? 'apartment' as const : typeRoll < 0.85 ? 'house' as const : 'commercial' as const;

    let price: number, area: number, rooms: number;
    if (type === 'apartment') {
      area = Math.floor(rng() * 130) + 40;
      rooms = Math.max(1, Math.min(5, Math.floor(area / 30) + (rng() > 0.5 ? 1 : 0)));
      price = Math.floor((area * (rng() * 4000 + 2000)) / 1000) * 1000;
    } else if (type === 'house') {
      area = Math.floor(rng() * 200) + 100;
      rooms = Math.max(3, Math.min(7, Math.floor(area / 40) + 1));
      price = Math.floor((area * (rng() * 5000 + 3000)) / 1000) * 1000;
    } else {
      area = Math.floor(rng() * 300) + 50;
      rooms = Math.max(1, Math.floor(area / 50));
      price = Math.floor((area * (rng() * 3000 + 1500)) / 1000) * 1000;
    }

    const featureCount = Math.floor(rng() * 5) + 1;
    const features = pickN(allFeatures, featureCount, rng);
    const imageCount = Math.floor(rng() * 4) + 2;
    const images = pickN(propertyImages, imageCount, rng);

    const fn = pick(firstNames, rng);
    const ln = pick(lastNames, rng);
    const phonePrefix = cityData.zip === '10' ? '030' : cityData.zip === '80' ? '089' : cityData.zip === '20' ? '040' : `0${cityData.zip}1`;

    const descList = type === 'apartment' ? apartmentDescriptions : type === 'house' ? houseDescriptions : commercialDescriptions;

    const typeLabel = type === 'apartment' ? 'Wohnung' : type === 'house' ? 'Haus' : 'Gewerbe';
    const title = type === 'apartment'
      ? `${rooms}-Zimmer-${typeLabel} in ${cityData.city}-${district}`
      : type === 'house'
        ? `${typeLabel} mit ${features[0] || 'Garten'} in ${district}`
        : `Gewerbefläche in ${cityData.city}-${district}`;

    properties.push({
      id: `mp-${i + 1}`,
      title,
      price,
      city: cityData.city,
      district,
      street: `${street} ${houseNum}`,
      zip: `${cityData.zip}${zipSuffix}`,
      area,
      rooms,
      type,
      features,
      images,
      description: pick(descList, rng),
      contactName: `${fn} ${ln}`,
      contactPhone: generatePhone(rng, phonePrefix),
      contactEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.de`,
      source: pick(sources, rng),
      scrapedAt: hoursAgo(Math.floor(rng() * 72)),
      yearBuilt: Math.floor(rng() * 80) + 1940,
      condition: pick(conditions, rng),
      energyRating: pick(energyRatings, rng),
    });
  }

  return properties;
}

export function generateBuyers(count: number): MatchBuyer[] {
  const rng = seededRandom(137);
  const buyers: MatchBuyer[] = [];

  for (let i = 0; i < count; i++) {
    const fn = pick(firstNames, rng);
    const ln = pick(lastNames, rng);

    const typeRoll = rng();
    const types: MatchBuyer['typePreferences'] = typeRoll < 0.4
      ? ['apartment']
      : typeRoll < 0.7
        ? ['house']
        : typeRoll < 0.85
          ? ['apartment', 'house']
          : ['commercial'];

    const base = types.includes('house') ? 300000 : types.includes('commercial') ? 200000 : 150000;
    const budgetMin = Math.floor((base + rng() * 400000) / 10000) * 10000;
    const budgetMax = Math.floor((budgetMin * (1.2 + rng() * 0.3)) / 10000) * 10000;

    const sizeMin = types.includes('house') ? Math.floor(rng() * 80 + 100) : Math.floor(rng() * 60 + 40);
    const sizeMax = Math.floor(sizeMin * (1.3 + rng() * 0.3));

    const roomsMin = types.includes('house') ? Math.floor(rng() * 2 + 3) : Math.floor(rng() * 2 + 1);
    const roomsMax = roomsMin + Math.floor(rng() * 2 + 1);

    const locationCount = Math.floor(rng() * 3) + 1;
    const locationPrefs: string[] = [];
    for (let l = 0; l < locationCount; l++) {
      const c = pick(cities, rng);
      const pref = rng() > 0.5 ? c.city : `${c.city}, ${pick(c.districts, rng)}`;
      if (!locationPrefs.includes(pref)) locationPrefs.push(pref);
    }

    const featureCount = Math.floor(rng() * 4);
    const features = pickN(allFeatures, featureCount, rng);

    const lifestyleOptions = ['Nähe zu Restaurants', 'Ruhige Lage', 'Nähe zu Schulen', 'Gute ÖPNV-Anbindung', 'Nähe zu Universität', 'Nähe zu Arbeitsplatz', 'Zentral', 'Grüne Umgebung', 'Familienfreundlich', 'Urbanes Leben'];
    const lifestyle = pickN(lifestyleOptions, Math.floor(rng() * 3) + 1, rng);

    buyers.push({
      id: `mb-${i + 1}`,
      name: `${fn} ${ln}`,
      phone: `+49 ${Math.floor(rng() * 900 + 100)} ${Math.floor(rng() * 9000000 + 1000000)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.de`,
      budgetMin,
      budgetMax,
      locationPreferences: locationPrefs,
      sizeMin,
      sizeMax,
      roomsMin,
      roomsMax,
      typePreferences: types,
      features,
      source: pick(buyerSources, rng),
      registeredAt: hoursAgo(Math.floor(rng() * 336)),
      lifestyle,
    });
  }

  return buyers;
}
