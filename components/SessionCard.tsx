import Link from 'next/link'
import type { Session } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  formatPace, formatDuration, sessionTypeLabel, sessionTypeBadgeColor, feelingEmoji
} from '@/lib/training-zones'

interface Props {
  session: Session
}

export function SessionCard({ session }: Props) {
  return (
    <Link href={`/sessions/${session.id}`}>
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 hover:border-gray-200 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${sessionTypeBadgeColor(session.type)}`}>
                {sessionTypeLabel(session.type)}
              </span>
              {session.customLabel && (
                <span className="text-xs text-gray-500">{session.customLabel}</span>
              )}
              <span className="text-xs text-gray-400">{session.date}</span>
              <span className="text-base ml-auto">{feelingEmoji(session.feeling)}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
              {session.distance > 0 && (
                <span className="font-semibold">{session.distance} km</span>
              )}
              {session.duration > 0 && (
                <span className="text-gray-500">{formatDuration(session.duration)}</span>
              )}
              {session.avgPace > 0 && (
                <span className="text-gray-500">{formatPace(session.avgPace)}</span>
              )}
              {session.avgHR > 0 && (
                <span className="text-gray-400 text-xs">{session.avgHR} bpm</span>
              )}
              {session.avgCadence > 0 && (
                <span className="text-gray-400 text-xs">{session.avgCadence} spm</span>
              )}
            </div>
            {session.notes && (
              <p className="mt-1.5 text-xs text-gray-400 truncate">{session.notes}</p>
            )}
          </div>
          {session.aiReview && (
            <span className="shrink-0 text-xs bg-violet-50 text-violet-600 px-2 py-1 rounded-md font-medium">IA ✓</span>
          )}
        </div>
      </div>
    </Link>
  )
}
