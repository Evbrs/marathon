export const dynamic = 'force-dynamic'

import { getAll } from '@/lib/storage'
import type { WeightEntry } from '@/lib/types'
import { WeightChart } from '@/components/charts/WeightChart'
import { WeightForm } from '@/components/WeightForm'

export default async function WeightPage() {
  const entries = await getAll<WeightEntry & { id: string }>('weight_log')
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]

  const startWeight = 80
  const targetWeight = 73
  const targetDate = '2027-04-06'
  const monthsLeft = Math.max(0, (new Date(targetDate).getTime() - Date.now()) / (30 * 86400000))
  const currentWeight = latest?.weight ?? startWeight
  const remaining = currentWeight - targetWeight
  const monthlyRate = monthsLeft > 0 ? remaining / monthsLeft : 0

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Suivi du poids</h1>
        <p className="text-sm text-gray-500">Objectif : 73 kg pour le Marathon de Paris (avril 2027)</p>
      </div>

      {/* Key cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Actuel</div>
          <div className="text-xl font-bold text-gray-900">{currentWeight} kg</div>
          {latest?.bodyFatPct && <div className="text-xs text-gray-400">{latest.bodyFatPct}% MG</div>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Objectif</div>
          <div className="text-xl font-bold text-indigo-700">73 kg</div>
          <div className="text-xs text-gray-400">~8-10% MG</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">À perdre</div>
          <div className={`text-xl font-bold ${remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {remaining > 0 ? `-${remaining.toFixed(1)} kg` : '✓ Objectif atteint'}
          </div>
          {monthlyRate > 0 && <div className="text-xs text-gray-400">{monthlyRate.toFixed(2)} kg/mois</div>}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Évolution (vs objectif)</div>
        <WeightChart entries={entries} targetWeight={targetWeight} targetDate={targetDate} />
      </div>

      {/* Add entry */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="text-sm font-semibold text-gray-700 mb-4">Peser ce matin</div>
        <WeightForm />
      </div>

      {/* Nutrition tips */}
      <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 mb-6">
        <div className="font-semibold text-amber-900 text-sm mb-2">💡 Stratégie perte de poids + marathon</div>
        <ul className="space-y-1.5 text-sm text-amber-800">
          <li>• Déficit léger de 200-300 kcal/j les jours de repos seulement</li>
          <li>• Maintenance calorique les jours d'entraînement</li>
          <li>• Jamais de restriction en semaine de compétition</li>
          <li>• Rythme cible : 0.5 kg/mois max (préserver la masse musculaire)</li>
        </ul>
      </div>

      {/* History */}
      {sorted.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Historique</div>
          <div className="space-y-1.5">
            {sorted.map((e) => (
              <div key={e.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-4 text-sm">
                <span className="text-gray-400 shrink-0 w-24">{e.date}</span>
                <span className="font-bold text-gray-900">{e.weight} kg</span>
                {e.bodyFatPct && <span className="text-gray-500">{e.bodyFatPct}% MG</span>}
                {e.leanMassKg && <span className="text-gray-400">{e.leanMassKg} kg masse maigre</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
