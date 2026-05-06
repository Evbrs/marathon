export const dynamic = 'force-dynamic'

import { getById, getAll, upsert } from '@/lib/storage'
import type { Session } from '@/lib/types'
import { notFound } from 'next/navigation'
import { formatPace, formatDuration, formatTime, sessionTypeLabel, sessionTypeBadgeColor, feelingEmoji, HR_ZONES } from '@/lib/training-zones'
import { HRZoneBarChart } from '@/components/charts/HRZoneBarChart'
import { RecoveryCard } from '@/components/RecoveryCard'
import { SessionAIReview } from '@/components/SessionAIReview'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getById<Session>('sessions', id)
  if (!session) notFound()

  const allSessions = await getAll<Session>('sessions')
  const recentSessions = allSessions
    .filter((s) => s.id !== id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const isRunning = ['easy', 'threshold', 'interval', 'long', 'race'].includes(session.type)

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <Link href="/sessions" className="text-gray-400 hover:text-gray-600 mt-1">←</Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${sessionTypeBadgeColor(session.type)}`}>
              {sessionTypeLabel(session.type)}
            </span>
            {session.customLabel && <span className="text-sm text-gray-600">{session.customLabel}</span>}
            <span className="text-sm text-gray-400">{session.date}</span>
            <span className="ml-auto text-2xl">{feelingEmoji(session.feeling)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {session.source === 'tcx' ? '📡 Import TCX' : '✏️ Saisie manuelle'}
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {session.distance > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{session.distance} km</div>
            <div className="text-xs text-gray-400">Distance</div>
          </div>
        )}
        {session.duration > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{formatDuration(session.duration)}</div>
            <div className="text-xs text-gray-400">Durée</div>
          </div>
        )}
        {session.avgPace > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{formatPace(session.avgPace)}</div>
            <div className="text-xs text-gray-400">Allure moy.</div>
          </div>
        )}
        {session.avgHR > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{session.avgHR}</div>
            <div className="text-xs text-gray-400">FC moy. (bpm)</div>
          </div>
        )}
        {session.maxHR > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{session.maxHR}</div>
            <div className="text-xs text-gray-400">FC max (bpm)</div>
          </div>
        )}
        {session.avgCadence > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{session.avgCadence}</div>
            <div className="text-xs text-gray-400">Cadence (spm)</div>
          </div>
        )}
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</div>
          <p className="text-sm text-gray-700">{session.notes}</p>
        </div>
      )}

      {/* HR Zones */}
      {isRunning && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Zones FC</div>
          <HRZoneBarChart hrZones={session.hrZones} />
        </div>
      )}

      {/* Laps */}
      {session.laps.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Laps ({session.laps.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left py-2 pr-4">Lap</th>
                  <th className="text-right pr-4">Dist.</th>
                  <th className="text-right pr-4">Allure</th>
                  <th className="text-right pr-4">FC moy</th>
                  <th className="text-right pr-4">FC max</th>
                  <th className="text-right">Cadence</th>
                </tr>
              </thead>
              <tbody>
                {session.laps.map((lap) => (
                  <tr key={lap.index} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium text-gray-700">{lap.index}</td>
                    <td className="text-right pr-4 text-gray-600">{lap.distance.toFixed(2)} km</td>
                    <td className="text-right pr-4 font-medium">{formatPace(lap.avgPace)}</td>
                    <td className="text-right pr-4 text-gray-600">{lap.avgHR > 0 ? `${lap.avgHR} bpm` : '—'}</td>
                    <td className="text-right pr-4 text-gray-600">{lap.maxHR > 0 ? `${lap.maxHR} bpm` : '—'}</td>
                    <td className="text-right text-gray-600">{lap.cadence > 0 ? `${lap.cadence} spm` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recovery */}
      <div className="mb-4">
        <RecoveryCard type={session.type} duration={session.duration} />
      </div>

      {/* AI Review */}
      <SessionAIReview session={session} recentSessions={recentSessions} />
    </div>
  )
}
