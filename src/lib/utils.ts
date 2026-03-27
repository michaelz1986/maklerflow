export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-accent';
  if (score >= 50) return 'text-warning';
  return 'text-danger';
}

export function getScoreBg(score: number): string {
  if (score >= 75) return 'bg-accent/20 text-accent';
  if (score >= 50) return 'bg-warning/20 text-warning';
  return 'bg-danger/20 text-danger';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Aktiv',
    draft: 'Entwurf',
    sold: 'Verkauft',
    new: 'Neu',
    contacted: 'Kontaktiert',
    qualified: 'Qualifiziert',
    lost: 'Verloren',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-accent/20 text-accent',
    draft: 'bg-muted/20 text-muted',
    sold: 'bg-blue-500/20 text-blue-400',
    new: 'bg-accent/20 text-accent',
    contacted: 'bg-warning/20 text-warning',
    qualified: 'bg-blue-500/20 text-blue-400',
    lost: 'bg-danger/20 text-danger',
  };
  return colors[status] || 'bg-muted/20 text-muted';
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    house: 'Haus',
    apartment: 'Wohnung',
    land: 'Grundstück',
  };
  return labels[type] || type;
}
