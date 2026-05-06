import type { Session, GarminStats, WeightEntry } from './types'
import { formatPace, formatDuration, formatRacePred, sessionTypeLabel, HR_ZONES } from './training-zones'

const PROFILE = `
Profil athlète :
- Evan, 23 ans, 1m79, objectif actuel ~80kg → ~73kg
- FC max : 206 bpm | FC repos : 56 bpm
- VO2max Garmin : 51 ml/kg/min (mai 2026)
- Seuil lactique : 181 bpm / 4:53/km
- Allure Z2 réelle : 7:00-7:20/km pour FC 150-160 bpm
- RP 5km : 25:19 | Prédicteur Garmin : 5km 24:17 / 10km 51:37 / Semi ~1:53 / Marathon ~3:55
- Objectif A : Marathon de Paris sub-3h30 (avril 2027)
- Objectif B : Paris-Versailles 16.3km (septembre 2026)
- Volume actuel : ~25-30 km/semaine
- SCI (côlon irritable) : pas de lait, soja, amande
`.trim()

function hrZoneSummary(zones: Session['hrZones']): string {
  const total = zones.z1 + zones.z2 + zones.z3 + zones.z4 + zones.z5
  if (total === 0) return 'Données FC non disponibles'
  const pct = (s: number) => ((s / total) * 100).toFixed(0) + '%'
  return `Z1:${pct(zones.z1)} Z2:${pct(zones.z2)} Z3:${pct(zones.z3)} Z4:${pct(zones.z4)} Z5:${pct(zones.z5)}`
}

export function generateSessionReviewPrompt(
  session: Session,
  recentSessions: Session[]
): string {
  const lapDetails = session.laps.length > 0
    ? session.laps.map(l =>
        `  Lap ${l.index}: ${l.distance.toFixed(2)}km | ${formatPace(l.avgPace)} | FC moy ${l.avgHR} bpm | Cadence ${l.cadence} spm`
      ).join('\n')
    : '  (Pas de données de lap)'

  const recentContext = recentSessions.slice(0, 5).map(s =>
    `  - ${s.date} | ${sessionTypeLabel(s.type)} | ${s.distance}km | ${formatPace(s.avgPace)} | FC ${s.avgHR} bpm | Ressenti ${s.feeling}/5`
  ).join('\n')

  return `Tu es un entraîneur de course à pied expert. Analyse cette séance d'entraînement et fournis une review détaillée et personnalisée.

${PROFILE}

---

SÉANCE À ANALYSER :
- Date : ${session.date}
- Type : ${sessionTypeLabel(session.type)}${session.customLabel ? ` (${session.customLabel})` : ''}
- Distance : ${session.distance} km
- Durée : ${formatDuration(session.duration)}
- Allure moyenne : ${formatPace(session.avgPace)}
- FC moyenne : ${session.avgHR} bpm | FC max : ${session.maxHR} bpm
- Cadence moyenne : ${session.avgCadence} spm
- Ressenti : ${session.feeling}/5
- Notes : ${session.notes || '(aucune)'}

Répartition zones FC :
${hrZoneSummary(session.hrZones)}

Détail des laps :
${lapDetails}

---

SÉANCES RÉCENTES (contexte) :
${recentContext || '  (Première séance enregistrée)'}

---

Fournis une analyse structurée avec :
1. **Évaluation globale** : qualité de la séance par rapport aux objectifs
2. **Analyse technique** : allure, FC, cadence — points forts et axes d'amélioration
3. **Répartition FC** : la polarisation est-elle respectée ? (cible : 80% Z1-Z2, 20% intensité)
4. **Récupération** : intensité cumulée, fatigue estimée, repos recommandé avant prochaine séance
5. **Recommandations** : 2-3 actions concrètes pour progresser
6. **Conseil nutrition/récup post-séance** (rappel : pas de lait, soja, amande)`
}

export function generateOverviewPrompt(
  sessions: Session[],
  garminStats: GarminStats[],
  weightLog: WeightEntry[]
): string {
  const last6Weeks = sessions
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 25)

  const weeklyVolume = computeWeeklyVolumes(last6Weeks)

  const sessionsSummary = last6Weeks.map(s =>
    `  ${s.date} | ${sessionTypeLabel(s.type)} | ${s.distance}km | ${formatPace(s.avgPace)} | FC ${s.avgHR} bpm | Ressenti ${s.feeling}/5`
  ).join('\n')

  const latestStats = garminStats.sort((a, b) => b.date.localeCompare(a.date))[0]
  const statsStr = latestStats
    ? `VO2max : ${latestStats.vo2max} | 5km : ${formatRacePred(latestStats.predictions.km5)} | 10km : ${formatRacePred(latestStats.predictions.km10)} | Semi : ${formatRacePred(latestStats.predictions.semi)} | Marathon : ${formatRacePred(latestStats.predictions.marathon)}`
    : 'Non renseigné'

  const latestWeight = weightLog.sort((a, b) => b.date.localeCompare(a.date))[0]
  const weightStr = latestWeight
    ? `${latestWeight.weight} kg${latestWeight.bodyFatPct ? ` / ${latestWeight.bodyFatPct}% MG` : ''}`
    : 'Non renseigné'

  const volumeStr = weeklyVolume.map(w => `  Semaine ${w.week} : ${w.km.toFixed(1)} km`).join('\n')

  return `Tu es un entraîneur de marathon expert. Fournis un bilan de forme complet basé sur les données d'entraînement récentes.

${PROFILE}

---

DERNIÈRES STATS GARMIN :
${statsStr}

POIDS ACTUEL :
${weightStr} (objectif : ~73 kg pour avril 2027)

VOLUME PAR SEMAINE (6 dernières semaines) :
${volumeStr || '  (Données insuffisantes)'}

SÉANCES RÉCENTES (25 dernières) :
${sessionsSummary || '  (Aucune séance enregistrée)'}

---

Fournis un bilan structuré avec :
1. **Forme actuelle** : évaluation globale de la condition physique (1-10)
2. **Tendances** : progression, stagnation ou régression par rapport aux objectifs
3. **Polarisation** : respect du 80/20 sur les 6 dernières semaines ?
4. **Volume** : tendance, cohérence, risque de sur/sous-entraînement
5. **Poids & composition** : trajectoire vers l'objectif marathon, recommandations
6. **Prochaines semaines** : 3 priorités d'entraînement pour progresser
7. **Projection** : avec ce niveau actuel, quelle perf réaliste pour Paris-Versailles (sept 2026) et le Marathon de Paris (avril 2027) ?`
}

function computeWeeklyVolumes(sessions: Session[]): { week: string; km: number }[] {
  const map: Record<string, number> = {}
  for (const s of sessions) {
    const d = new Date(s.date)
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const key = monday.toISOString().split('T')[0]
    map[key] = (map[key] ?? 0) + (s.distance ?? 0)
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6)
    .map(([week, km]) => ({ week, km }))
}
