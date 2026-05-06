export const dynamic = 'force-dynamic'

import { getAll } from '@/lib/storage'
import type { Session, GarminStats, WeightEntry, PlanProgress } from '@/lib/types'
import { formatPace, formatRacePred } from '@/lib/training-zones'
import { TRAINING_PLAN } from '@/data/training-plan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaceProgressChart } from '@/components/charts/PaceProgressChart'
import { VolumeChart } from '@/components/charts/VolumeChart'
import { VO2maxChart } from '@/components/charts/VO2maxChart'
import { SessionCard } from '@/components/SessionCard'
import { DashboardAI } from '@/components/DashboardAI'

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000))
}

function getCurrentWeek(): typeof TRAINING_PLAN[0] | null {
  const today = new Date().toISOString().split('T')[0]
  for (const week of TRAINING_PLAN) {
    const end = new Date(week.startDate)
    end.setDate(end.getDate() + 6)
    const endStr = end.toISOString().split('T')[0]
    if (week.startDate <= today && today <= endStr) return week
  }
  return null
}

function getNextRace(): { name: string; date: string; days: number } | null {
  const today = new Date().toISOString().split('T')[0]
  const races = [
    { name: 'Paris-Versailles', date: '2026-09-13' },
    { name: 'Semi-marathon test', date: '2026-11-15' },
    { name: 'Marathon de Paris', date: '2027-04-06' },
  ]
  return races.find((r) => r.date > today)
    ? { ...races.find((r) => r.date > today)!, days: daysUntil(races.find((r) => r.date > today)!.date) }
    : null
}

export default async function DashboardPage() {
  const [sessions, garminStats, weightLog, planProgress] = await Promise.all([
    getAll<Session>('sessions'),
    getAll<GarminStats>('garmin_stats'),
    getAll<WeightEntry & { id: string }>('weight_log'),
    getAll<PlanProgress & { id: string }>('plan_progress'),
  ])

  const latestStats = garminStats.sort((a, b) => b.date.localeCompare(a.date))[0]
  const latestWeight = [...weightLog].sort((a, b) => b.date.localeCompare(a.date))[0]
  const recentSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  const currentWeek = getCurrentWeek()
  const completedThisWeek = planProgress.filter((p) => p.weekId === currentWeek?.id && p.completed).length
  const totalThisWeek = currentWeek?.sessions.length ?? 0

  const thisWeekSessions = sessions.filter((s) => {
    if (!currentWeek) return false
    const end = new Date(currentWeek.startDate)
    end.setDate(end.getDate() + 6)
    return s.date >= currentWeek.startDate && s.date <= end.toISOString().split('T')[0]
  })
  const weeklyKm = thisWeekSessions.reduce((s, session) => s + session.distance, 0)

  const nextRace = getNextRace()

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* 4 Key cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* VO2max */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">VO2max Garmin</div>
            <div className="text-2xl font-bold text-gray-900">
              {latestStats ? latestStats.vo2max : '—'}
              <span className="text-xs font-normal text-gray-400 ml-1">ml/kg/min</span>
            </div>
            {latestStats && (
              <div className="text-xs text-gray-400 mt-1">{latestStats.date}</div>
            )}
          </CardContent>
        </Card>

        {/* Marathon pred */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">Prédiction Marathon</div>
            <div className="text-2xl font-bold text-gray-900">
              {latestStats ? formatRacePred(latestStats.predictions.marathon) : '—'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Objectif : 3:29:59</div>
          </CardContent>
        </Card>

        {/* Poids */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">Poids actuel</div>
            <div className="text-2xl font-bold text-gray-900">
              {latestWeight ? `${latestWeight.weight} kg` : '—'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Objectif : 73 kg</div>
          </CardContent>
        </Card>

        {/* Prochain objectif */}
        {nextRace && (
          <Card className="border-0 shadow-sm bg-indigo-50 border-indigo-100">
            <CardContent className="p-4">
              <div className="text-xs text-indigo-600 font-medium mb-1">Prochain objectif</div>
              <div className="text-2xl font-bold text-indigo-900">{nextRace.days}j</div>
              <div className="text-xs text-indigo-600 mt-1">{nextRace.name}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Semaine en cours */}
      {currentWeek && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Semaine en cours — {currentWeek.phaseName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{weeklyKm.toFixed(1)} km</div>
                <div className="text-xs text-gray-400">/ {currentWeek.targetVolume} planifiés</div>
              </div>
              <div className="h-10 w-px bg-gray-100" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedThisWeek}/{totalThisWeek}</div>
                <div className="text-xs text-gray-400">séances du plan</div>
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2 ml-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${totalThisWeek > 0 ? (completedThisWeek / totalThisWeek) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {currentWeek.sessions.map((s, i) => {
                const done = planProgress.some((p) => p.weekId === currentWeek.id && p.sessionIndex === i && p.completed)
                return (
                  <div key={i} className={`flex items-center gap-2 text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    <span>{done ? '✅' : '○'}</span>
                    <span className="font-medium">{s.label}</span>
                    {s.targetPace && <span className="text-xs text-gray-400">· {s.targetPace}</span>}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Évolution allure (course)</CardTitle>
          </CardHeader>
          <CardContent>
            <PaceProgressChart sessions={sessions} />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Volume hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <VolumeChart sessions={sessions} />
          </CardContent>
        </Card>
      </div>

      {/* VO2max chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">VO2max & prédicteur Garmin</CardTitle>
        </CardHeader>
        <CardContent>
          <VO2maxChart stats={garminStats} />
        </CardContent>
      </Card>

      {/* AI Overview */}
      <DashboardAI sessions={sessions} garminStats={garminStats} weightLog={weightLog} />

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Dernières séances</h2>
          <a href="/sessions" className="text-xs text-indigo-600 hover:underline">Voir tout →</a>
        </div>
        <div className="space-y-2">
          {recentSessions.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-8">
              Aucune séance — <a href="/sessions/import" className="text-indigo-600 hover:underline">importer un fichier TCX</a>
            </div>
          ) : (
            recentSessions.map((s) => <SessionCard key={s.id} session={s} />)
          )}
        </div>
      </div>
    </div>
  )
}
