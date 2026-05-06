import type { PlanWeek, PlannedSession } from '@/lib/types'

// Helper — get the Monday of the week containing a given date
function mondayOf(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDay() // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

// Helper — add N days
function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// Generate week IDs starting from the week of 12 May 2026 (first full week post B&R)
const START = '2026-05-11' // Monday 11 May 2026

function week(n: number): string {
  return addDays(START, (n - 1) * 7)
}

export const TRAINING_PLAN: PlanWeek[] = [
  // ═══════════════════════════════════════════
  // PHASE 1 — BASE AÉROBIE (May–Jun 2026, 8 semaines)
  // ═══════════════════════════════════════════
  {
    id: 'w01', weekNumber: 1, startDate: week(1),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '28 km',
    notes: 'Récupération post B&R. Priorité Z2 strict, cadence ≥160 spm.',
    sessions: [
      { type: 'easy', label: 'EF + ABC', targetPace: '7:00-7:20/km', targetHR: 'Z2 (130-152)', duration: '40 min', description: 'Échauffement 10 min + 30 min EF allure tranquille. Exercices ABC en fin.' },
      { type: 'strength', label: 'Renfo spécifique', description: 'Isométrie : chaise 3×45s, pont fessier 3×15, mollets unilatéraux 3×15 chaque. Gainage 2×1 min.' },
      { type: 'easy', label: 'EF longue', targetPace: '7:20-7:40/km', targetHR: 'Z2 (130-152)', duration: '70 min', description: 'Sortie longue conversationnelle. Si FC > 155 bpm, ralentir.' },
    ],
  },
  {
    id: 'w02', weekNumber: 2, startDate: week(2),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '30 km',
    sessions: [
      { type: 'easy', label: 'EF + strides', targetPace: '7:00-7:15/km', targetHR: 'Z2', duration: '45 min', description: '40 min EF + 4×100m accélérations progressives (pas sprint). Cadence cible 165-168 spm.' },
      { type: 'threshold', label: 'Tempo court', targetPace: '5:30-5:50/km', targetHR: 'Z3-Z4 (160-175)', duration: '35 min', description: 'Éch 15 min + 2×8 min allure tempo récup 3 min + retour calme 10 min.' },
      { type: 'strength', label: 'Renfo spécifique', description: 'Squat unilatéral 3×10, fentes 3×12, pont fessier 3×20, gainage latéral 3×30s.' },
      { type: 'easy', label: 'Sortie longue', targetPace: '7:20-7:40/km', targetHR: 'Z2', duration: '80 min', description: 'Maintenir Z2 toute la sortie. Gel ou banane à 60 min si durée dépasse 1h.' },
    ],
  },
  {
    id: 'w03', weekNumber: 3, startDate: week(3),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '32 km',
    sessions: [
      { type: 'easy', label: 'EF récup', targetPace: '7:20-7:40/km', targetHR: 'Z1-Z2', duration: '40 min', description: 'Allure très tranquille, focus respiration nasale. Récupération active.' },
      { type: 'interval', label: 'Fractionné court 6×400m', targetPace: '4:40-4:55/km', targetHR: 'Z4-Z5', duration: '50 min', description: 'Éch 15 min + 6×400m (récup 2 min marche/trot) + retour 10 min. Cadence > 170 spm sur les répètes.' },
      { type: 'strength', label: 'Renfo + mobilité', description: 'Renfo + 10 min étirements dynamiques hanches, ischio, mollets.' },
      { type: 'easy', label: 'Sortie longue', targetPace: '7:15-7:30/km', targetHR: 'Z2', duration: '85 min', description: 'Augmentation progressive du volume. Les 15 dernières minutes peuvent être légèrement plus vives.' },
    ],
  },
  {
    id: 'w04', weekNumber: 4, startDate: week(4),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '24 km',
    notes: '⚠️ Semaine de récupération — baisser le volume de 25%.',
    sessions: [
      { type: 'easy', label: 'EF récup', targetPace: '7:20-7:40/km', targetHR: 'Z1-Z2', duration: '35 min', description: 'Sortie légère, pas de travail d\'intensité.' },
      { type: 'strength', label: 'Renfo léger', description: 'Circuit léger : pont fessier, gainage, mollets. 2 séries seulement.' },
      { type: 'easy', label: 'EF + strides', targetPace: '7:00-7:15/km', targetHR: 'Z2', duration: '50 min', description: '40 min EF + 4 strides pour garder les jambes vives.' },
    ],
  },
  {
    id: 'w05', weekNumber: 5, startDate: week(5),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '34 km',
    sessions: [
      { type: 'easy', label: 'EF + ABC', targetPace: '7:00-7:15/km', targetHR: 'Z2', duration: '45 min', description: 'ABC course + drills cadence.' },
      { type: 'threshold', label: 'Tempo progressif', targetPace: '5:20-5:40/km', targetHR: 'Z3-Z4', duration: '40 min', description: 'Éch 15 min + 3×7 min tempo récup 2 min + retour 10 min.' },
      { type: 'strength', label: 'Renfo spécifique', description: 'Squat sauté 3×10, fentes dynamiques 3×12, gainage 3×1 min, chaise 3×45s.' },
      { type: 'easy', label: 'Sortie longue', targetPace: '7:10-7:25/km', targetHR: 'Z2', duration: '90 min', description: 'Sortie longue principale de la semaine. Apporter eau + banane.' },
    ],
  },
  {
    id: 'w06', weekNumber: 6, startDate: week(6),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '36 km',
    sessions: [
      { type: 'easy', label: 'EF récup', targetPace: '7:20/km', targetHR: 'Z1-Z2', duration: '40 min', description: 'Récupération active.' },
      { type: 'interval', label: 'Fractionné 5×1000m', targetPace: '4:40-4:55/km', targetHR: 'Z4-Z5', duration: '55 min', description: 'Éch 15 min + 5×1000m récup 2:30 + retour 10 min. Cibler cadence 170+ spm.' },
      { type: 'strength', label: 'Renfo', description: 'Circuit complet 3 tours : squat 15, fente 12, pont 20, gainage 1 min, mollets 20.' },
      { type: 'easy', label: 'Sortie longue', targetPace: '7:05-7:20/km', targetHR: 'Z2', duration: '95 min', description: 'Plus longue sortie jusqu\'ici. Ravitaillement à 60 et 80 min.' },
    ],
  },
  {
    id: 'w07', weekNumber: 7, startDate: week(7),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '38 km',
    sessions: [
      { type: 'easy', label: 'EF + strides', targetPace: '6:55-7:10/km', targetHR: 'Z2', duration: '45 min', description: '4 strides de 100m en fin de séance.' },
      { type: 'threshold', label: 'Tempo 20 min', targetPace: '5:10-5:25/km', targetHR: 'Z4 (175-181)', duration: '45 min', description: 'Éch 15 min + 20 min tempo continu + retour 10 min. Allure seuil.' },
      { type: 'strength', label: 'Renfo + pliométrie', description: 'Sauts en hauteur 3×10, squat unilatéral 3×10, gainage 3×1:30.' },
      { type: 'easy', label: 'Sortie longue', targetPace: '7:00-7:15/km', targetHR: 'Z2', duration: '100 min', description: 'Sortie 15-16 km environ. Début lent, finish légèrement plus vif sur les 15 dernières min.' },
    ],
  },
  {
    id: 'w08', weekNumber: 8, startDate: week(8),
    phase: 1, phaseName: 'Base aérobie',
    targetVolume: '26 km',
    notes: '⚠️ Semaine de récupération bloc 2.',
    sessions: [
      { type: 'easy', label: 'EF récup', targetPace: '7:20/km', targetHR: 'Z1', duration: '35 min', description: 'Allure très tranquille.' },
      { type: 'easy', label: 'EF + test cadence', targetPace: '6:55-7:10/km', targetHR: 'Z2', duration: '45 min', description: 'Mesurer cadence sur 2 km à allure normale. Objectif ≥ 165 spm.' },
      { type: 'strength', label: 'Renfo léger', description: '2 tours circuit léger.' },
    ],
  },

  // ═══════════════════════════════════════════
  // PHASE 2 — DÉVELOPPEMENT (Jul–Aug 2026, 8 semaines)
  // ═══════════════════════════════════════════
  {
    id: 'w09', weekNumber: 9, startDate: week(9),
    phase: 2, phaseName: 'Développement',
    targetVolume: '40 km',
    notes: 'Augmentation seuil. Intensité accrue. Sortie longue 18-20 km.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:50-7:05/km', targetHR: 'Z2', duration: '45 min', description: 'Base aérobie, pas d\'intensité.' },
      { type: 'interval', label: 'Fartlek structuré', targetPace: 'Variable', targetHR: 'Z3-Z4', duration: '55 min', description: 'Éch 15 min + 8×(2 min vif Z4 / 2 min Z2) + retour 15 min.' },
      { type: 'strength', label: 'Renfo + pliométrie', description: 'Sauts, squats, fentes. Ajouter step-ups avec poids de corps.' },
      { type: 'long', label: 'Sortie longue 18 km', targetPace: '6:55-7:10/km', targetHR: 'Z2', distance: '18 km', description: 'Première sortie vraiment longue. Ravitaillement toutes les 50-60 min.' },
    ],
  },
  {
    id: 'w10', weekNumber: 10, startDate: week(10),
    phase: 2, phaseName: 'Développement',
    targetVolume: '42 km',
    sessions: [
      { type: 'easy', label: 'EF récup', targetPace: '7:10/km', targetHR: 'Z1-Z2', duration: '40 min', description: 'Récupération post-longue.' },
      { type: 'threshold', label: 'Seuil 2×12 min', targetPace: '5:00-5:15/km', targetHR: 'Z4 (175-182)', duration: '50 min', description: 'Éch 15 min + 2×12 min seuil (récup 4 min) + retour 15 min.' },
      { type: 'strength', label: 'Renfo', description: 'Circuit force, focus ischio et fessiers.' },
      { type: 'long', label: 'Sortie longue 19 km', targetPace: '6:55-7:05/km', targetHR: 'Z2', distance: '19 km', description: 'Dernier 5 km légèrement plus vif (~6:40/km).' },
    ],
  },
  {
    id: 'w11', weekNumber: 11, startDate: week(11),
    phase: 2, phaseName: 'Développement',
    targetVolume: '44 km',
    sessions: [
      { type: 'easy', label: 'EF + strides', targetPace: '6:50/km', targetHR: 'Z2', duration: '45 min', description: '6 strides de 100m, récup complète entre chaque.' },
      { type: 'interval', label: 'Fractionné 4×1500m', targetPace: '4:35-4:50/km', targetHR: 'Z4-Z5', duration: '60 min', description: 'Éch 20 min + 4×1500m (récup 3 min) + retour 15 min.' },
      { type: 'strength', label: 'Renfo spécifique', description: 'Travail excentrique ischio + cheville. Prévention blessure.' },
      { type: 'long', label: 'Sortie longue 20 km', targetPace: '6:50-7:00/km', targetHR: 'Z2', distance: '20 km', description: 'Sortie longue 20 km. Simulation de ravitaillement marathon.' },
    ],
  },
  {
    id: 'w12', weekNumber: 12, startDate: week(12),
    phase: 2, phaseName: 'Développement',
    targetVolume: '30 km',
    notes: '⚠️ Semaine de récupération.',
    sessions: [
      { type: 'easy', label: 'EF léger', targetPace: '7:15/km', targetHR: 'Z1-Z2', duration: '35 min', description: '' },
      { type: 'easy', label: 'EF + ABC', targetPace: '7:00/km', targetHR: 'Z2', duration: '45 min', description: 'Exercices de technique de course.' },
      { type: 'strength', label: 'Renfo léger', description: 'Circuit léger, focus mobilité.' },
    ],
  },
  {
    id: 'w13', weekNumber: 13, startDate: week(13),
    phase: 2, phaseName: 'Développement',
    targetVolume: '45 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:50/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'threshold', label: 'Seuil continu 25 min', targetPace: '4:58-5:10/km', targetHR: 'Z4', duration: '55 min', description: 'Éch 15 min + 25 min seuil continu + retour 15 min. Allure seuil lactique.' },
      { type: 'strength', label: 'Renfo', description: 'Force maximale : squat, fentes lestées.' },
      { type: 'long', label: 'Sortie longue 21 km', targetPace: '6:45-7:00/km', targetHR: 'Z2', distance: '21 km', description: 'Semi-marathon distance. Terminer les 3 derniers km à 6:30/km.' },
    ],
  },
  {
    id: 'w14', weekNumber: 14, startDate: week(14),
    phase: 2, phaseName: 'Développement',
    targetVolume: '46 km',
    sessions: [
      { type: 'easy', label: 'EF récup', targetPace: '7:10/km', targetHR: 'Z1-Z2', duration: '40 min', description: '' },
      { type: 'interval', label: 'VO2max 6×800m', targetPace: '4:25-4:40/km', targetHR: 'Z5', duration: '55 min', description: 'Éch 20 min + 6×800m (récup 2:30) + retour 15 min. Cadence > 172 spm.' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 22 km', targetPace: '6:45-6:55/km', targetHR: 'Z2', distance: '22 km', description: '' },
    ],
  },
  {
    id: 'w15', weekNumber: 15, startDate: week(15),
    phase: 2, phaseName: 'Développement',
    targetVolume: '47 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:50/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'threshold', label: 'Progression finale', targetPace: '5:00→4:50/km', targetHR: 'Z4', duration: '55 min', description: 'Éch 10 min + 30 min progression (début 5:10/km → fin 4:50/km).' },
      { type: 'strength', label: 'Renfo + pliométrie', description: '' },
      { type: 'long', label: 'Sortie longue 23 km', targetPace: '6:40-6:50/km', targetHR: 'Z2', distance: '23 km', description: 'Derniers 5 km à allure marathon cible (~5:00/km si forme).' },
    ],
  },
  {
    id: 'w16', weekNumber: 16, startDate: week(16),
    phase: 2, phaseName: 'Développement',
    targetVolume: '32 km',
    notes: '⚠️ Récupération pré-compétition Paris-Versailles.',
    sessions: [
      { type: 'easy', label: 'EF récup', targetPace: '7:15/km', targetHR: 'Z1', duration: '35 min', description: '' },
      { type: 'easy', label: 'EF + strides', targetPace: '6:55/km', targetHR: 'Z2', duration: '40 min', description: '4 strides légers pour garder les jambes vives.' },
      { type: 'easy', label: 'Sortie de veille', targetPace: '7:30/km', targetHR: 'Z1', duration: '20 min', description: 'Très léger, juste pour activer les jambes avant Paris-Versailles.' },
    ],
  },

  // ═══════════════════════════════════════════
  // PHASE 3 — COMPÉTITION 1 (Sep 2026)
  // ═══════════════════════════════════════════
  {
    id: 'w17', weekNumber: 17, startDate: week(17),
    phase: 3, phaseName: 'Compétition — Paris-Versailles',
    targetVolume: '25 km',
    notes: '🏁 PARIS-VERSAILLES 16.3 km — objectif : sub-1h20. Semaine de course.',
    sessions: [
      { type: 'race', label: '🏁 Paris-Versailles 16.3 km', targetPace: '4:50-5:00/km', distance: '16.3 km', description: 'Objectif : sub-1h20. Départ conservateur sur le Pont de Sèvres, gestion des côtes. Ravitaillement à 8 km.' },
      { type: 'easy', label: 'EF récup post-course', targetPace: '7:30/km', targetHR: 'Z1', duration: '30 min', description: 'Récupération active 48-72h après la course.' },
    ],
  },
  {
    id: 'w18', weekNumber: 18, startDate: week(18),
    phase: 3, phaseName: 'Compétition — Paris-Versailles',
    targetVolume: '30 km',
    notes: 'Récupération complète post Paris-Versailles. Évaluation et ajustement du plan.',
    sessions: [
      { type: 'easy', label: 'EF léger', targetPace: '7:20/km', targetHR: 'Z1-Z2', duration: '35 min', description: '' },
      { type: 'strength', label: 'Renfo léger', description: 'Réactivation musculaire douce.' },
      { type: 'easy', label: 'EF avec strides', targetPace: '7:00/km', targetHR: 'Z2', duration: '45 min', description: '' },
    ],
  },

  // ═══════════════════════════════════════════
  // PHASE 4 — SPÉCIFIQUE MARATHON (Oct 2026–Feb 2027)
  // ═══════════════════════════════════════════
  {
    id: 'w19', weekNumber: 19, startDate: week(19),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '45 km',
    notes: 'Début préparation marathon spécifique. Sorties longues progressives.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:45-7:00/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'threshold', label: 'Seuil marathon 2×15 min', targetPace: '4:55-5:05/km', targetHR: 'Z4', duration: '55 min', description: 'Allure proche du seuil lactique.' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 24 km', targetPace: '6:40-6:50/km', targetHR: 'Z2', distance: '24 km', description: 'Intégrer 5 km finaux à allure marathon (5:00/km).' },
    ],
  },
  {
    id: 'w20', weekNumber: 20, startDate: week(20),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '48 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:45/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'interval', label: 'Fractionné 4×2000m', targetPace: '4:30-4:45/km', targetHR: 'Z4-Z5', duration: '65 min', description: 'Allure 10km. Récup 4 min entre répètes.' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 25 km', targetPace: '6:35-6:50/km', targetHR: 'Z2', distance: '25 km', description: 'Simulation allure marathon sur les 10 derniers km.' },
    ],
  },
  {
    id: 'w21', weekNumber: 21, startDate: week(21),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '50 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:45/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'threshold', label: 'Allure marathon 30 min', targetPace: '4:58/km', targetHR: 'Z4', duration: '55 min', description: 'Éch 15 min + 30 min exactement à allure marathon sub-3h30.' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 26 km', targetPace: '6:35-6:45/km', targetHR: 'Z2', distance: '26 km', description: '' },
    ],
  },
  {
    id: 'w22', weekNumber: 22, startDate: week(22),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '36 km',
    notes: '⚠️ Semaine récup.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '7:10/km', targetHR: 'Z1-Z2', duration: '40 min', description: '' },
      { type: 'easy', label: 'EF strides', targetPace: '6:50/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'strength', label: 'Renfo léger', description: '' },
    ],
  },
  {
    id: 'w23', weekNumber: 23, startDate: week(23),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '52 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:40/km', targetHR: 'Z2', duration: '50 min', description: '' },
      { type: 'interval', label: 'Fractionné VO2max 5×1000m', targetPace: '4:25-4:40/km', targetHR: 'Z5', duration: '60 min', description: '' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 28 km', targetPace: '6:35-6:45/km', targetHR: 'Z2', distance: '28 km', description: '10 derniers km à 5:00/km.' },
    ],
  },
  {
    id: 'w24', weekNumber: 24, startDate: week(24),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '54 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:40/km', targetHR: 'Z2', duration: '50 min', description: '' },
      { type: 'threshold', label: 'Seuil 2×20 min', targetPace: '4:55/km', targetHR: 'Z4', duration: '65 min', description: '' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 30 km', targetPace: '6:30-6:45/km', targetHR: 'Z2', distance: '30 km', description: '🎯 Première sortie de 30 km ! Gel toutes les 40 min.' },
    ],
  },
  {
    id: 'w25', weekNumber: 25, startDate: week(25),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '55 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:40/km', targetHR: 'Z2', duration: '50 min', description: '' },
      { type: 'interval', label: 'Fractionné 3×3000m', targetPace: '4:35-4:50/km', targetHR: 'Z4-Z5', duration: '65 min', description: '' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 32 km', targetPace: '6:30-6:40/km', targetHR: 'Z2', distance: '32 km', description: '15 derniers km à allure marathon (4:58/km).' },
    ],
  },
  {
    id: 'w26', weekNumber: 26, startDate: week(26),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '40 km',
    notes: '⚠️ Récup — bilan mi-préparation.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '7:10/km', targetHR: 'Z1-Z2', duration: '40 min', description: '' },
      { type: 'easy', label: 'EF + strides', targetPace: '6:50/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'strength', label: 'Renfo léger', description: '' },
    ],
  },
  // Semaines 27-38 : montée en charge, sorties longues 32-35 km, semi-marathon de test (nov/fév)
  {
    id: 'w27', weekNumber: 27, startDate: week(27),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '55 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:35/km', targetHR: 'Z2', duration: '50 min', description: '' },
      { type: 'threshold', label: 'Allure marathon 40 min', targetPace: '4:58/km', targetHR: 'Z4', duration: '65 min', description: '' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 33 km', targetPace: '6:25-6:35/km', targetHR: 'Z2', distance: '33 km', description: '' },
    ],
  },
  {
    id: 'w28', weekNumber: 28, startDate: week(28),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '56 km',
    notes: '🏁 Semi-marathon de test recommandé (novembre 2026)',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:35/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'race', label: '🏁 Semi-marathon test', targetPace: '4:55-5:05/km', distance: '21.1 km', description: 'Objectif : sub-1h46. Course test pour ajuster le plan marathon.' },
      { type: 'easy', label: 'EF récup', targetPace: '7:30/km', targetHR: 'Z1', duration: '30 min', description: '' },
    ],
  },
  {
    id: 'w29', weekNumber: 29, startDate: week(29),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '35 km',
    notes: '⚠️ Récup post-semi.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '7:15/km', targetHR: 'Z1-Z2', duration: '40 min', description: '' },
      { type: 'easy', label: 'EF strides', targetPace: '6:55/km', targetHR: 'Z2', duration: '45 min', description: '' },
    ],
  },
  {
    id: 'w30', weekNumber: 30, startDate: week(30),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '57 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:35/km', targetHR: 'Z2', duration: '50 min', description: '' },
      { type: 'threshold', label: 'Seuil long 2×20 min', targetPace: '4:52/km', targetHR: 'Z4', duration: '65 min', description: '' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 34 km', targetPace: '6:25-6:35/km', targetHR: 'Z2', distance: '34 km', description: '' },
    ],
  },
  {
    id: 'w31', weekNumber: 31, startDate: week(31),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '58 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:30/km', targetHR: 'Z2', duration: '50 min', description: '' },
      { type: 'interval', label: 'Fractionné qualité 5×1200m', targetPace: '4:28-4:40/km', targetHR: 'Z4-Z5', duration: '65 min', description: '' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 35 km', targetPace: '6:20-6:30/km', targetHR: 'Z2', distance: '35 km', description: '🎯 Sortie la plus longue de la prépa. Stratégie de ravitaillement marathon simulée.' },
    ],
  },
  {
    id: 'w32', weekNumber: 32, startDate: week(32),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '42 km',
    notes: '⚠️ Récup — début affûtage dans 6 semaines.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '7:00/km', targetHR: 'Z1-Z2', duration: '40 min', description: '' },
      { type: 'easy', label: 'EF + strides', targetPace: '6:45/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'strength', label: 'Renfo léger', description: '' },
    ],
  },
  {
    id: 'w33', weekNumber: 33, startDate: week(33),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '55 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:30/km', targetHR: 'Z2', duration: '50 min', description: '' },
      { type: 'threshold', label: 'Allure marathon 45 min', targetPace: '4:58/km', targetHR: 'Z4', duration: '70 min', description: '' },
      { type: 'strength', label: 'Renfo', description: '' },
      { type: 'long', label: 'Sortie longue 32 km', targetPace: '6:25/km', targetHR: 'Z2', distance: '32 km', description: '' },
    ],
  },
  {
    id: 'w34', weekNumber: 34, startDate: week(34),
    phase: 4, phaseName: 'Spécifique marathon',
    targetVolume: '52 km',
    notes: '🏁 Semi-marathon test #2 (février 2027) — objectif sub-1h43',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:35/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'race', label: '🏁 Semi-marathon test #2', targetPace: '4:50/km', distance: '21.1 km', description: 'Objectif sub-1h43. Validation de la préparation marathon.' },
      { type: 'easy', label: 'EF récup', targetPace: '7:30/km', targetHR: 'Z1', duration: '30 min', description: '' },
    ],
  },

  // ═══════════════════════════════════════════
  // PHASE 5 — AFFÛTAGE (Mar–Apr 2027)
  // ═══════════════════════════════════════════
  {
    id: 'w35', weekNumber: 35, startDate: week(35),
    phase: 5, phaseName: 'Affûtage',
    targetVolume: '35 km',
    notes: '⚠️ Récup post-semi + début affûtage. Réduire volume, garder intensité.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:50/km', targetHR: 'Z2', duration: '40 min', description: '' },
      { type: 'threshold', label: 'Allure marathon 20 min', targetPace: '4:58/km', targetHR: 'Z4', duration: '45 min', description: '' },
      { type: 'easy', label: 'EF + strides', targetPace: '6:45/km', targetHR: 'Z2', duration: '40 min', description: '6 strides 100m à allure 10km.' },
    ],
  },
  {
    id: 'w36', weekNumber: 36, startDate: week(36),
    phase: 5, phaseName: 'Affûtage',
    targetVolume: '40 km',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:45/km', targetHR: 'Z2', duration: '45 min', description: '' },
      { type: 'interval', label: 'Fractionné maintien 4×800m', targetPace: '4:25-4:35/km', targetHR: 'Z4-Z5', duration: '50 min', description: 'Maintenir la vitesse. Récup complète 3 min.' },
      { type: 'strength', label: 'Renfo léger', description: '' },
      { type: 'long', label: 'Sortie longue 22 km', targetPace: '6:30/km', targetHR: 'Z2', distance: '22 km', description: '' },
    ],
  },
  {
    id: 'w37', weekNumber: 37, startDate: week(37),
    phase: 5, phaseName: 'Affûtage',
    targetVolume: '32 km',
    notes: '⚠️ -3 semaines marathon. Volume réduit à 60%.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:45/km', targetHR: 'Z2', duration: '40 min', description: '' },
      { type: 'threshold', label: 'Allure marathon 15 min', targetPace: '4:55/km', targetHR: 'Z4', duration: '40 min', description: '' },
      { type: 'easy', label: 'EF strides', targetPace: '6:50/km', targetHR: 'Z2', duration: '35 min', description: '' },
    ],
  },
  {
    id: 'w38', weekNumber: 38, startDate: week(38),
    phase: 5, phaseName: 'Affûtage',
    targetVolume: '25 km',
    notes: '⚠️ -2 semaines marathon. Préserver les sensations, aucune fatigue.',
    sessions: [
      { type: 'easy', label: 'EF', targetPace: '6:50/km', targetHR: 'Z2', duration: '35 min', description: '' },
      { type: 'interval', label: 'Fractionné 3×600m', targetPace: '4:25/km', targetHR: 'Z4-Z5', duration: '40 min', description: 'Juste pour garder la vitesse. Pas de fatigue.' },
      { type: 'easy', label: 'EF', targetPace: '7:00/km', targetHR: 'Z1-Z2', duration: '30 min', description: '' },
    ],
  },
  {
    id: 'w39', weekNumber: 39, startDate: week(39),
    phase: 5, phaseName: 'Affûtage',
    targetVolume: '15 km',
    notes: '🏁 SEMAINE DU MARATHON. Repos, activation, confiance.',
    sessions: [
      { type: 'easy', label: 'EF très léger', targetPace: '7:00/km', targetHR: 'Z1', duration: '25 min', description: 'Lundi ou mardi, très léger.' },
      { type: 'easy', label: 'Activation pré-marathon', targetPace: '6:45/km', targetHR: 'Z2', duration: '20 min', description: '4×100m strides. Jeudi ou vendredi maximum.' },
      { type: 'race', label: '🏆 MARATHON DE PARIS', targetPace: '4:58/km', distance: '42.195 km', description: 'Objectif : sub-3h30 (3h29:59). Découpage : 5km 24:50 / 10km 49:40 / Semi 1h44:30 / 30km 2h29:00. Négatif split conseillé.' },
    ],
  },
]

export const PHASE_COLORS: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-violet-100 text-violet-800',
  3: 'bg-amber-100 text-amber-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800',
}

export const PHASE_LABELS: Record<number, string> = {
  1: 'Phase 1 — Base aérobie',
  2: 'Phase 2 — Développement',
  3: 'Phase 3 — Compétition',
  4: 'Phase 4 — Spécifique marathon',
  5: 'Phase 5 — Affûtage',
}
