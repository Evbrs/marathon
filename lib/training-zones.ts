// HR zones based on Evan's FC max = 206 bpm
export const HR_ZONES = {
  z1: { min: 0, max: 129, label: 'Z1 Récup', color: '#94a3b8' },
  z2: { min: 130, max: 152, label: 'Z2 Aérobie', color: '#34d399' },
  z3: { min: 153, max: 170, label: 'Z3 Tempo', color: '#fbbf24' },
  z4: { min: 171, max: 185, label: 'Z4 Seuil', color: '#f97316' },
  z5: { min: 186, max: 999, label: 'Z5 VO2max', color: '#ef4444' },
}

export function getZone(hr: number): keyof typeof HR_ZONES {
  if (hr <= 129) return 'z1'
  if (hr <= 152) return 'z2'
  if (hr <= 170) return 'z3'
  if (hr <= 185) return 'z4'
  return 'z5'
}

export function formatPace(secPerKm: number): string {
  if (!secPerKm || secPerKm <= 0) return '--'
  const min = Math.floor(secPerKm / 60)
  const sec = Math.round(secPerKm % 60)
  return `${min}:${sec.toString().padStart(2, '0')}/km`
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}m${s.toString().padStart(2, '0')}s`
  return `${m}m${s.toString().padStart(2, '0')}s`
}

export function formatRacePred(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function paceToSeconds(pace: string): number {
  // "4:53" → 293
  const [min, sec] = pace.split(':').map(Number)
  return min * 60 + sec
}

export function sessionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    easy: 'Endurance fondamentale',
    threshold: 'Seuil lactique',
    interval: 'Fractionné',
    long: 'Sortie longue',
    race: 'Compétition',
    strength: 'Renforcement',
    tennis: 'Tennis',
    basketball: 'Basketball',
    cycling: 'Vélo',
    swimming: 'Natation',
    hiking: 'Randonnée',
    other: 'Autre',
  }
  return labels[type] ?? type
}

export function sessionTypeBadgeColor(type: string): string {
  const colors: Record<string, string> = {
    easy: 'bg-emerald-100 text-emerald-800',
    threshold: 'bg-orange-100 text-orange-800',
    interval: 'bg-red-100 text-red-800',
    long: 'bg-blue-100 text-blue-800',
    race: 'bg-purple-100 text-purple-800',
    strength: 'bg-yellow-100 text-yellow-800',
    tennis: 'bg-lime-100 text-lime-800',
    basketball: 'bg-amber-100 text-amber-800',
    cycling: 'bg-sky-100 text-sky-800',
    swimming: 'bg-cyan-100 text-cyan-800',
    hiking: 'bg-teal-100 text-teal-800',
    other: 'bg-gray-100 text-gray-800',
  }
  return colors[type] ?? 'bg-gray-100 text-gray-800'
}

export const SESSION_TYPES: { value: string; label: string }[] = [
  { value: 'easy', label: 'Endurance fondamentale' },
  { value: 'threshold', label: 'Seuil lactique' },
  { value: 'interval', label: 'Fractionné' },
  { value: 'long', label: 'Sortie longue' },
  { value: 'race', label: 'Compétition' },
  { value: 'strength', label: 'Renforcement' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'cycling', label: 'Vélo' },
  { value: 'swimming', label: 'Natation' },
  { value: 'hiking', label: 'Randonnée' },
  { value: 'other', label: 'Autre' },
]

export const RUNNING_SESSION_TYPES = ['easy', 'threshold', 'interval', 'long', 'race']

export function feelingEmoji(feeling: number): string {
  return ['😫', '😕', '😐', '😊', '🔥'][feeling - 1] ?? '😐'
}
