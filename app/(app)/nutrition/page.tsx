export const dynamic = 'force-dynamic'

import { getAll } from '@/lib/storage'
import type { Session, WeightEntry } from '@/lib/types'
import { sessionTypeLabel } from '@/lib/training-zones'

function tdee(weight: number, sessionType?: string, duration?: number): number {
  const bmr = 1700 // ~BMR for 80kg male
  const activityBase = 1.55 // moderately active
  const base = Math.round(bmr * activityBase)

  if (!sessionType || sessionType === 'strength') return base
  const durationH = (duration ?? 0) / 3600
  if (sessionType === 'long' || durationH > 1.2) return base + 600
  if (['threshold', 'interval'].includes(sessionType)) return base + 400
  return base + 250
}

function computeMacros(weight: number, leanMass: number, sessionType?: string) {
  const isHard = sessionType && ['threshold', 'interval', 'long', 'race'].includes(sessionType)
  const protein = Math.round(leanMass * 1.9)
  const carbs = isHard ? Math.round(weight * 5.5) : Math.round(weight * 3)
  const fat = Math.round(weight * 1.0)
  return { protein, carbs, fat, total: protein * 4 + carbs * 4 + fat * 9 }
}

const MEAL_IDEAS: Record<string, { label: string; emoji: string; items: string[] }[]> = {
  breakfast: [
    { label: 'Petit-déj énergie', emoji: '🥣', items: ['60g flocons d\'avoine + lait d\'avoine', '1 banane', '1 c.s beurre de cacahuète', 'Café'] },
    { label: 'Petit-déj protéiné', emoji: '🍳', items: ['3 œufs brouillés', '2 tranches pain complet', 'Avocat 1/2', 'Jus d\'orange'] },
  ],
  prerun: [
    { label: 'Avant sortie courte', emoji: '🍌', items: ['1 banane', '1-2 biscuits riz soufflé', 'Eau 500ml'] },
    { label: 'Avant sortie longue (>1h)', emoji: '🍚', items: ['80g riz ou pâtes cuites', 'Poulet 100g', 'Eau 500ml — 2h avant'] },
  ],
  postrun: [
    { label: 'Récup 30 min post-séance', emoji: '🥤', items: ['Smoothie : lait d\'avoine + banane + 2 c.s beurre cacahuète', 'OU : eau de coco + 2 dattes + œuf dur'] },
    { label: 'Repas 1-2h après', emoji: '🍗', items: ['150g poulet / poisson / œufs', '100g riz ou patate douce', 'Légumes verts à volonté', 'Huile d\'olive'] },
  ],
  snacks: [
    { label: 'Collations SCI-safe', emoji: '🥜', items: ['Noix + fruits secs (pas excès)', 'Pain riz + beurre cacahuète', 'Banane', 'Œufs durs', 'Flocons d\'avoine + miel'] },
  ],
}

export default async function NutritionPage() {
  const [sessions, weightLog] = await Promise.all([
    getAll<Session>('sessions'),
    getAll<WeightEntry & { id: string }>('weight_log'),
  ])

  const todayStr = new Date().toISOString().split('T')[0]
  const lastWeight = [...weightLog].sort((a, b) => b.date.localeCompare(a.date))[0]
  const weight = lastWeight?.weight ?? 80
  const leanMass = lastWeight?.leanMassKg ?? Math.round(weight * 0.84)

  const todaySession = sessions.find((s) => s.date === todayStr)
  const tomorrowSession = sessions.find((s) => s.date === new Date(Date.now() + 86400000).toISOString().split('T')[0])
  const nextSession = todaySession ?? tomorrowSession

  const calories = tdee(weight, nextSession?.type, nextSession?.duration)
  const macros = computeMacros(weight, leanMass, nextSession?.type)

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Nutrition & récupération</h1>
        <p className="text-sm text-gray-500">Recommandations adaptées à ton profil SCI et tes objectifs</p>
      </div>

      {/* SCI warning */}
      <div className="bg-red-50 rounded-xl border border-red-100 p-3 mb-5 flex gap-2">
        <span className="text-base">⚠️</span>
        <div className="text-sm text-red-800">
          <strong>SCI — À éviter systématiquement :</strong> lait de vache, lait de soja, lait d'amande, lactose, graisses saturées en excès avant les sorties
        </div>
      </div>

      {/* Today's targets */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="text-sm font-semibold text-gray-700 mb-3">
          Objectifs du jour
          {nextSession && <span className="ml-2 text-xs font-normal text-gray-400">({sessionTypeLabel(nextSession.type)})</span>}
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xl font-bold text-indigo-700">{calories}</div>
            <div className="text-xs text-gray-400">kcal</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-600">{macros.protein}g</div>
            <div className="text-xs text-gray-400">protéines</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-600">{macros.carbs}g</div>
            <div className="text-xs text-gray-400">glucides</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">{macros.fat}g</div>
            <div className="text-xs text-gray-400">lipides</div>
          </div>
        </div>
        {nextSession && (
          <div className="mt-3 text-xs text-gray-400 text-center">
            Basé sur une séance {sessionTypeLabel(nextSession.type)} planifiée
          </div>
        )}
      </div>

      {/* Weight objective reminder */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 mb-5">
        <div className="font-semibold text-indigo-900 text-sm mb-2">🎯 Stratégie poids → marathon</div>
        <div className="grid grid-cols-2 gap-3 text-sm text-indigo-800 mb-2">
          <div>Poids actuel : <strong>{weight} kg</strong></div>
          <div>Objectif : <strong>73 kg</strong></div>
          <div>À perdre : <strong>{Math.max(0, weight - 73).toFixed(1)} kg</strong></div>
          <div>Rythme : <strong>≤ 0.5 kg/mois</strong></div>
        </div>
        <ul className="text-xs text-indigo-700 space-y-0.5">
          <li>• Jours de repos : déficit ~250 kcal (manger ~{calories - 250} kcal)</li>
          <li>• Jours d'entraînement : maintenance ({calories} kcal)</li>
          <li>• Sorties longues : recharge glucidique avant ET après</li>
          <li>• Semaines de compétition : 0 restriction</li>
        </ul>
      </div>

      {/* Meal ideas */}
      {Object.entries(MEAL_IDEAS).map(([category, meals]) => {
        const labels: Record<string, string> = {
          breakfast: '🌅 Petit-déjeuner',
          prerun: '⚡ Avant la séance',
          postrun: '🔋 Récupération',
          snacks: '🍎 Collations',
        }
        return (
          <div key={category} className="mb-5">
            <div className="text-sm font-semibold text-gray-700 mb-2">{labels[category]}</div>
            <div className="grid md:grid-cols-2 gap-3">
              {meals.map((meal, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{meal.emoji}</span>
                    <span className="text-sm font-medium text-gray-800">{meal.label}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {meal.items.map((item, j) => (
                      <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                        <span className="shrink-0">·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Sources protéines SCI */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
        <div className="font-semibold text-emerald-900 text-sm mb-2">🥩 Sources de protéines SCI-compatibles</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-emerald-800">
          {[
            '🥚 Œufs (6 par jour max)',
            '🍗 Poulet, dinde',
            '🐟 Poisson blanc, saumon',
            '🥜 Beurre de cacahuète',
            '🌾 Flocons d\'avoine',
            '🫘 Lentilles (bien cuites)',
            '🥛 Lait d\'avoine',
            '🧀 Fromage en petite quantité si toléré',
            '🐚 Thon en boîte',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">{item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
