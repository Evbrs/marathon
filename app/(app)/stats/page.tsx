export const dynamic = 'force-dynamic'

import { getAll } from '@/lib/storage'
import type { GarminStats } from '@/lib/types'
import { formatPace, formatRacePred } from '@/lib/training-zones'
import { VO2maxChart, RacePredChart } from '@/components/charts/VO2maxChart'
import { GarminStatsForm } from '@/components/GarminStatsForm'

export default async function StatsPage() {
  const stats = await getAll<GarminStats>('garmin_stats')
  const sorted = stats.sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]

  // Baseline (April 2026)
  const baseline = { vo2max: 50, km5: 25 * 60 + 19, km10: 52 * 60, semi: 113 * 60, marathon: 235 * 60 }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Stats Garmin</h1>
        <p className="text-sm text-gray-500">VO2max et prédicteur de course Garmin Connect</p>
      </div>

      {/* Latest stats */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'VO2max', value: `${latest.vo2max}`, unit: 'ml/kg/min', delta: latest.vo2max - baseline.vo2max, good: true },
            { label: '5 km', value: formatRacePred(latest.predictions.km5), delta: baseline.km5 - latest.predictions.km5, good: true },
            { label: '10 km', value: formatRacePred(latest.predictions.km10), delta: baseline.km10 - latest.predictions.km10, good: true },
            { label: 'Semi', value: formatRacePred(latest.predictions.semi), delta: null, good: true },
            { label: 'Marathon', value: formatRacePred(latest.predictions.marathon), delta: null, good: true },
            { label: 'Seuil lactique', value: formatPace(latest.lactatePace), unit: `${latest.lactateHR} bpm`, delta: null, good: true },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className="text-xl font-bold text-gray-900">{item.value}</div>
              {item.unit && <div className="text-xs text-gray-400">{item.unit}</div>}
              {item.delta !== null && (
                <div className={`text-xs font-medium mt-1 ${item.delta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.delta > 0 ? '+' : ''}{item.label === 'VO2max' ? item.delta.toFixed(1) : formatRacePred(Math.abs(item.delta))} vs baseline
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="space-y-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">VO2max</div>
          <VO2maxChart stats={stats} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Prédictions de course (minutes)</div>
          <RacePredChart stats={stats} />
        </div>
      </div>

      {/* Add new entry */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="text-sm font-semibold text-gray-700 mb-4">Ajouter une mesure</div>
        <GarminStatsForm />
      </div>

      {/* History */}
      {sorted.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Historique</div>
          <div className="space-y-2">
            {sorted.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-4 text-sm">
                <span className="text-gray-400 shrink-0 w-20">{s.date}</span>
                <span className="font-medium">VO2max {s.vo2max}</span>
                <span className="text-gray-500">5km {formatRacePred(s.predictions.km5)}</span>
                <span className="text-gray-500">Marathon {formatRacePred(s.predictions.marathon)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
