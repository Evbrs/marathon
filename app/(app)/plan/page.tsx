export const dynamic = 'force-dynamic'

import { getAll } from '@/lib/storage'
import type { PlanProgress } from '@/lib/types'
import { TRAINING_PLAN, PHASE_COLORS, PHASE_LABELS } from '@/data/training-plan'
import { sessionTypeLabel, sessionTypeBadgeColor } from '@/lib/training-zones'
import { PlanWeekCheckbox } from '@/components/PlanWeekCheckbox'

export default async function PlanPage() {
  const progress = await getAll<PlanProgress & { id: string }>('plan_progress')
  const progressMap = Object.fromEntries(progress.map((p) => [`${p.weekId}-${p.sessionIndex}`, p]))

  const today = new Date().toISOString().split('T')[0]
  const currentPhase = TRAINING_PLAN.find((w) => {
    const end = new Date(w.startDate)
    end.setDate(end.getDate() + 6)
    return w.startDate <= today && today <= end.toISOString().split('T')[0]
  })?.phase ?? 1

  // Group by phase
  const phases = [1, 2, 3, 4, 5]

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Programme Marathon</h1>
        <p className="text-sm text-gray-500">Paris avril 2027 — sub-3h30 · 39 semaines</p>
      </div>

      {/* Phase progress */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {phases.map((phase) => {
          const weeks = TRAINING_PLAN.filter((w) => w.phase === phase)
          const total = weeks.reduce((s, w) => s + w.sessions.length, 0)
          const done = weeks.reduce((s, w) => {
            return s + w.sessions.filter((_, i) => progressMap[`${w.id}-${i}`]?.completed).length
          }, 0)
          const isCurrent = phase === currentPhase
          return (
            <div key={phase} className={`shrink-0 rounded-xl border p-3 min-w-[140px] ${isCurrent ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 bg-white'}`}>
              <div className={`text-xs font-semibold mb-1 ${isCurrent ? 'text-indigo-700' : 'text-gray-500'}`}>
                Phase {phase}
              </div>
              <div className="text-sm font-medium text-gray-700">{done}/{total} séances</div>
              <div className="mt-1.5 bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${isCurrent ? 'bg-indigo-500' : 'bg-gray-400'}`} style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Weeks by phase */}
      {phases.map((phase) => {
        const weeks = TRAINING_PLAN.filter((w) => w.phase === phase)
        return (
          <div key={phase} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${PHASE_COLORS[phase]}`}>
                {PHASE_LABELS[phase]}
              </span>
            </div>
            <div className="space-y-3">
              {weeks.map((week) => {
                const isPast = week.startDate < today
                const _isCurrent = week.phase === currentPhase
                const weekEnd = new Date(week.startDate)
                weekEnd.setDate(weekEnd.getDate() + 6)
                const isActiveWeek = week.startDate <= today && today <= weekEnd.toISOString().split('T')[0]
                const weekDone = week.sessions.filter((_, i) => progressMap[`${week.id}-${i}`]?.completed).length

                return (
                  <div
                    key={week.id}
                    className={`bg-white rounded-xl border p-4 ${isActiveWeek ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-gray-100'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-sm text-gray-900">S{week.weekNumber}</span>
                        <span className="text-xs text-gray-400 ml-2">{week.startDate}</span>
                        {isActiveWeek && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Cette semaine</span>}
                      </div>
                      <div className="text-xs text-gray-500">{weekDone}/{week.sessions.length} · {week.targetVolume}</div>
                    </div>
                    {week.notes && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mb-2">{week.notes}</p>
                    )}
                    <div className="space-y-1.5">
                      {week.sessions.map((session, i) => {
                        const key = `${week.id}-${i}`
                        const done = progressMap[key]?.completed ?? false
                        return (
                          <PlanWeekCheckbox
                            key={key}
                            weekId={week.id}
                            sessionIndex={i}
                            session={session}
                            done={done}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
